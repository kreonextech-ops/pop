import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedBrowserClient: SupabaseClient | null = null;
let cachedConfigPromise: Promise<{ url: string; anonKey: string } | null> | null = null;
const inflightSyncs = new Map<string, Promise<unknown>>();

function buildBrowserClient(url: string, anonKey: string): SupabaseClient {
  if (!cachedBrowserClient) {
    cachedBrowserClient = createClient(url, anonKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedBrowserClient;
}

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  if (!url || !anonKey) return null;
  return buildBrowserClient(url, anonKey);
}

/**
 * Resolves the browser Supabase client synchronously from inlined NEXT_PUBLIC_*
 * env vars when available, or falls back to /api/auth/public-config at runtime.
 */
export async function getSupabaseBrowserAsync(): Promise<SupabaseClient | null> {
  const syncClient = getSupabaseBrowser();
  if (syncClient) return syncClient;

  if (typeof window === "undefined") return null;

  if (!cachedConfigPromise) {
    cachedConfigPromise = fetch("/api/auth/public-config", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.url && data?.anonKey) {
          return { url: String(data.url), anonKey: String(data.anonKey) };
        }
        return null;
      })
      .catch(() => null);
  }

  const cfg = await cachedConfigPromise;
  if (!cfg) {
    cachedConfigPromise = null;
    return null;
  }

  return buildBrowserClient(cfg.url, cfg.anonKey);
}

function parseHashAccessToken(): string | null {
  if (typeof window === "undefined" || !window.location.hash) return null;
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return hashParams.get("access_token");
}

function cleanOAuthParamsFromUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const keysToDelete = [
    "code",
    "state",
    "error",
    "error_code",
    "error_description",
    "sb_flow_id",
  ];
  let changed = false;
  for (const k of keysToDelete) {
    if (url.searchParams.has(k)) {
      url.searchParams.delete(k);
      changed = true;
    }
  }
  if (url.hash && url.hash.includes("access_token")) {
    url.hash = "";
    changed = true;
  }
  if (changed) {
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }
}

export async function syncSupabaseAccessToken<T = unknown>(
  accessToken: string
): Promise<T | null> {
  const res = await fetch("/api/auth/oauth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || "Failed creating account session.");
  }
  return (json.user as T) || null;
}

/**
 * Initiates Google OAuth via Supabase and breaks out of preview iframes safely.
 */
export async function startGoogleOAuth(nextUrl = "/account"): Promise<{
  ok: boolean;
  url?: string;
  navigated?: boolean;
  error?: string;
}> {
  const supabase = await getSupabaseBrowserAsync();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Google Sign-In needs NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY configured.",
    };
  }

  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
    nextUrl
  )}`;
  const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: { prompt: "select_account" },
    },
  });

  if (oauthErr) {
    return { ok: false, error: oauthErr.message };
  }

  const targetUrl = data?.url;
  if (!targetUrl) {
    return {
      ok: false,
      error: "Supabase did not return a Google login URL. Check Auth Providers -> Google.",
    };
  }

  const inIframe = window.self !== window.top;
  if (inIframe) {
    try {
      if (window.top) {
        window.top.location.href = targetUrl;
        return { ok: true, url: targetUrl, navigated: true };
      }
    } catch {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      return { ok: true, url: targetUrl, navigated: false };
    }
  }

  window.location.assign(targetUrl);
  return { ok: true, url: targetUrl, navigated: true };
}

/**
 * Completes Google OAuth whether Supabase redirected to /auth/callback OR fell back
 * to the main site URL (/) with ?code=... or #access_token=... or an active Supabase session.
 */
export async function completeOAuthIfNeeded<T = unknown>(options?: {
  explicitCode?: string | null;
  cleanUrl?: boolean;
  throwOnMissingSession?: boolean;
}): Promise<T | null> {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const code = options?.explicitCode !== undefined ? options.explicitCode : urlParams.get("code");
  const hashToken = parseHashAccessToken();
  const hasOAuthParams = Boolean(code || hashToken);
  const key = code || hashToken || "supabase_existing_session";

  const existing = inflightSyncs.get(key);
  if (existing) return existing as Promise<T | null>;

  const task = (async (): Promise<T | null> => {
    const supabase = await getSupabaseBrowserAsync();
    if (!supabase) {
      if (options?.throwOnMissingSession) {
        throw new Error("Supabase browser configuration is missing.");
      }
      return null;
    }

    // 1. Wait for Supabase client initialization (which auto-handles detectSessionInUrl)
    let { data: sessData } = await supabase.auth.getSession();

    // 2. If URL had ?code= and session isn't resolved yet, exchange PKCE code once
    if (!sessData.session && code) {
      const { data: exData, error: exErr } = await supabase.auth.exchangeCodeForSession(code);
      if (exErr) {
        const retry = await supabase.auth.getSession();
        if (retry.data.session) {
          sessData = retry.data;
        } else if (options?.throwOnMissingSession || hasOAuthParams) {
          throw new Error(exErr.message);
        }
      } else {
        sessData = { session: exData.session };
      }
    }

    const accessToken = sessData.session?.access_token || hashToken;
    if (!accessToken) {
      if (options?.throwOnMissingSession) {
        throw new Error("Could not complete Google Sign-In session. Please try again.");
      }
      return null;
    }

    const user = await syncSupabaseAccessToken<T>(accessToken);
    if (options?.cleanUrl !== false) {
      cleanOAuthParamsFromUrl();
    }
    return user;
  })();

  inflightSyncs.set(key, task);
  try {
    return await task;
  } finally {
    setTimeout(() => inflightSyncs.delete(key), 5000);
  }
}

export async function signOutSupabaseBrowser(): Promise<void> {
  try {
    const supabase = await getSupabaseBrowserAsync();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // Non-fatal
  }
}
