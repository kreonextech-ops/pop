import crypto from "crypto";
import { cookies } from "next/headers";
import { readStore, writeStore, type StoreUser } from "./store";
import { getSupabaseAdmin, getSupabaseAnon, isSupabaseConfigured } from "./supabase";

export const USER_COOKIE_NAME = "pc_user_session";

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "popculture_customer_session_secret"
  );
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, original] = stored.split(":");
  if (!salt || !original) return false;
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(original, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export interface SessionPayload {
  uid: string;
  email?: string;
  fullName?: string;
  phone?: string;
  role?: "customer" | "admin";
  loyaltyPoints?: number;
  iat: number;
  exp: number;
}

export function createUserSessionToken(
  userOrId:
    | string
    | {
        id: string;
        email?: string;
        fullName?: string;
        phone?: string;
        role?: "customer" | "admin";
        loyaltyPoints?: number;
      }
): string {
  const info = typeof userOrId === "string" ? { id: userOrId } : userOrId;
  const payload: SessionPayload = {
    uid: info.id,
    email: info.email,
    fullName: info.fullName,
    phone: info.phone,
    role: info.role,
    loyaltyPoints: info.loyaltyPoints,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyUserSessionPayload(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encoded)
    .digest("base64url");

  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const decoded = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as Partial<SessionPayload>;
    if (!decoded.uid || !decoded.exp || Date.now() > decoded.exp) return null;
    return decoded as SessionPayload;
  } catch {
    return null;
  }
}

export function verifyUserSessionToken(token: string | undefined): string | null {
  return verifyUserSessionPayload(token)?.uid || null;
}

export type PublicUser = Omit<StoreUser, "passwordHash">;

export function sanitizeUser(u: StoreUser): PublicUser {
  const { passwordHash: _ignored, ...rest } = u;
  return rest;
}

export async function getCurrentUser(): Promise<StoreUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  const session = verifyUserSessionPayload(token);
  if (!session?.uid) return null;
  const uid = session.uid;

  const store = readStore();
  const localIdx = store.users.findIndex((u) => u.id === uid);
  const localUser = localIdx >= 0 ? store.users[localIdx] : undefined;

  // When Supabase is configured, pull authoritative profile stats (handles Google OAuth & Vercel serverless)
  if (isSupabaseConfigured()) {
    const sbAdmin = getSupabaseAdmin();
    if (sbAdmin) {
      const { data: prof } = await sbAdmin
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();
      if (prof) {
        const now = new Date().toISOString();
        const hydrated: StoreUser = {
          id: prof.id,
          email: prof.email || localUser?.email || session.email || "",
          fullName:
            prof.full_name ||
            localUser?.fullName ||
            session.fullName ||
            "Pop Culture Snacker",
          phone: prof.phone || localUser?.phone || session.phone || "",
          role: prof.role === "admin" ? "admin" : "customer",
          loyaltyPoints: Number(prof.loyalty_points) || 0,
          gameHighScore: Number(prof.game_high_score) || 0,
          totalRuns: Number(prof.total_runs) || 0,
          totalDistance: Number(prof.total_distance) || 0,
          savedAddress: prof.saved_address || localUser?.savedAddress || null,
          passwordHash: localUser?.passwordHash || "",
          createdAt: prof.created_at || localUser?.createdAt || now,
          updatedAt: prof.updated_at || now,
        };
        if (localIdx >= 0) {
          store.users[localIdx] = hydrated;
        } else {
          store.users.push(hydrated);
        }
        writeStore(store);
        return hydrated;
      }
    }
  }

  if (localUser) return localUser;

  // Stateless serverless fallback from verified HMAC cookie payload when /tmp or service role isn't populated yet
  if (session.email || session.fullName) {
    const now = new Date().toISOString();
    return {
      id: uid,
      email: session.email || "",
      fullName: session.fullName || "Pop Culture Snacker",
      phone: session.phone || "",
      role: session.role === "admin" ? "admin" : "customer",
      loyaltyPoints: session.loyaltyPoints ?? 50,
      gameHighScore: 0,
      totalRuns: 0,
      totalDistance: 0,
      savedAddress: null,
      passwordHash: "",
      createdAt: now,
      updatedAt: now,
    };
  }

  return null;
}

export async function registerUser(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}): Promise<{ ok: boolean; user?: StoreUser; error?: string }> {
  const email = params.email.trim().toLowerCase();
  const phone = (params.phone || "").trim();
  const fullName = params.fullName.trim() || email.split("@")[0];
  const now = new Date().toISOString();

  const store = readStore();
  if (store.users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  let userId = `usr_${crypto.randomUUID()}`;

  // Optional Supabase Auth SignUp when configured
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAnon();
    if (sb) {
      const { data, error } = await sb.auth.signUp({
        email,
        password: params.password,
        options: {
          data: { full_name: fullName, phone },
        },
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      if (data.user?.id) {
        userId = data.user.id;
      }
    }
  }

  const newUser: StoreUser = {
    id: userId,
    email,
    fullName,
    phone,
    role: "customer",
    loyaltyPoints: 50, // Welcome bonus 50 Crunch Points
    gameHighScore: 0,
    totalRuns: 0,
    totalDistance: 0,
    savedAddress: null,
    passwordHash: hashPassword(params.password),
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(newUser);
  if (phone) {
    store.loyalty[phone] = {
      mobile_number: phone,
      available_points: newUser.loyaltyPoints,
      blocked: {},
    };
  }
  writeStore(store);

  return { ok: true, user: newUser };
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; user?: StoreUser; error?: string }> {
  const email = params.email.trim().toLowerCase();
  const store = readStore();
  const localUser = store.users.find((u) => u.email === email);

  if (localUser && localUser.passwordHash) {
    if (!verifyPassword(params.password, localUser.passwordHash)) {
      return { ok: false, error: "Invalid email or password." };
    }
    return { ok: true, user: localUser };
  }

  if (isSupabaseConfigured()) {
    const sb = getSupabaseAnon();
    const sbAdmin = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb.auth.signInWithPassword({
        email,
        password: params.password,
      });
      if (error || !data.user) {
        return { ok: false, error: error?.message || "Invalid email or password." };
      }
      let user = store.users.find((u) => u.id === data.user!.id || u.email === email);
      if (!user) {
        const now = new Date().toISOString();
        let profRole: "customer" | "admin" = "customer";
        let pts = 50;
        let hs = 0;
        if (sbAdmin) {
          const { data: prof } = await sbAdmin
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          if (prof) {
            profRole = prof.role === "admin" ? "admin" : "customer";
            pts = Number(prof.loyalty_points) || 50;
            hs = Number(prof.game_high_score) || 0;
          }
        }
        user = {
          id: data.user.id,
          email,
          fullName:
            (data.user.user_metadata?.full_name as string) || email.split("@")[0],
          phone: (data.user.user_metadata?.phone as string) || "",
          role: profRole,
          loyaltyPoints: pts,
          gameHighScore: hs,
          totalRuns: 0,
          totalDistance: 0,
          savedAddress: null,
          passwordHash: hashPassword(params.password),
          createdAt: now,
          updatedAt: now,
        };
        store.users.push(user);
        writeStore(store);
      }
      return { ok: true, user };
    }
  }

  return { ok: false, error: "Invalid email or password." };
}
