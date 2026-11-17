import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";
import { getShiprocketAssets } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const store = readStore();
  const { environment, apiKey, apiSecret, sellerDomain } = store.settings;
  const assets = getShiprocketAssets(environment);

  // Derive dynamic host from incoming request headers (x-forwarded-host or host)
  const reqHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const effectiveSellerDomain =
    sellerDomain && sellerDomain !== "localhost:3001"
      ? sellerDomain
      : (reqHost || "localhost:3001");

  return NextResponse.json({
    environment,
    configured: Boolean(apiKey && apiSecret),
    sellerDomain: effectiveSellerDomain,
    checkoutScriptUrl: assets.jsUrl,
    checkoutCssUrl: assets.cssUrl,
  });
}
