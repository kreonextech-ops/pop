import crypto from "crypto";

export type ShiprocketEnv = "staging" | "production";

export function getShiprocketBaseUrl(env: ShiprocketEnv): string {
  return env === "production"
    ? "https://checkout-api.shiprocket.com"
    : "https://fastrr-api-dev.pickrr.com";
}

export function getShiprocketAssets(env: ShiprocketEnv) {
  if (env === "production") {
    return {
      jsUrl: "https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js",
      cssUrl: "https://checkout-ui.shiprocket.com/assets/styles/shopify.css",
    };
  }
  return {
    jsUrl: "https://customcheckoutfastrr.netlify.app/assets/js/channels/shopify.js",
    cssUrl: "https://customcheckoutfastrr.netlify.app/assets/styles/shopify.css",
  };
}

/**
 * Computes Base64-encoded HMAC-SHA256 signature of the raw JSON body
 * using the Shiprocket API Secret Key, per Shiprocket Checkout specification.
 */
export function computeHmacBase64(rawBody: string, secretKey: string): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(rawBody, "utf8")
    .digest("base64");
}

export function verifyHmacBase64(
  rawBody: string,
  signature: string | null | undefined,
  secretKey: string
): boolean {
  if (!signature || !secretKey) return false;
  try {
    const expected = computeHmacBase64(rawBody, secretKey);
    const sigBuf = Buffer.from(signature, "utf8");
    const expBuf = Buffer.from(expected, "utf8");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export interface ShiprocketCallResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

export async function callShiprocketApi<T = unknown>(params: {
  env: ShiprocketEnv;
  apiKey: string;
  apiSecret: string;
  path: string;
  payload: unknown;
}): Promise<ShiprocketCallResult<T>> {
  const { env, apiKey, apiSecret, path, payload } = params;
  const baseUrl = getShiprocketBaseUrl(env);
  const url = `${baseUrl}${path}`;
  const rawBody = JSON.stringify(payload);
  const hmac = computeHmacBase64(rawBody, apiSecret);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "X-Api-HMAC-SHA256": hmac,
      },
      body: rawBody,
      cache: "no-store",
    });

    const text = await res.text();
    let parsed: T | null = null;
    try {
      parsed = text ? (JSON.parse(text) as T) : null;
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: parsed,
        error: text || `HTTP ${res.status}`,
      };
    }

    return { ok: true, status: res.status, data: parsed };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err instanceof Error ? err.message : "Network error calling Shiprocket",
    };
  }
}
