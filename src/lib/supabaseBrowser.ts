import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedBrowserClient: SupabaseClient | null = null;
let cachedConfigPromise: Promise<{ url: string; anonKey: string } | null> | null = null;

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
 * env vars when available, or falls back to /api/auth/public-config at runtime
 * so deployments remain resilient even if env vars were added after build.
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
