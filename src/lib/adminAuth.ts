import crypto from "crypto";
import { cookies } from "next/headers";
import { getCurrentUser } from "./customerAuth";

export const ADMIN_COOKIE_NAME = "pc_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "popculture2026";
}

function getSigningSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || `${getAdminPassword()}_shiprocket_secret_salt`;
}

export function createAdminSessionToken(): string {
  const payload = JSON.stringify({
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expected = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");

  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

    const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      exp?: number;
    };
    if (!decoded.exp || Date.now() > decoded.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function checkAdminPassword(password: string): boolean {
  const target = getAdminPassword();
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(target, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (verifyAdminSessionToken(token)) return true;
  const user = await getCurrentUser();
  return user?.role === "admin";
}
