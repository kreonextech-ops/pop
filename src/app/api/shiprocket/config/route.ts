import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";
import { getShiprocketAssets } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = readStore();
  const { environment, apiKey, apiSecret, sellerDomain } = store.settings;
  const assets = getShiprocketAssets(environment);

  return NextResponse.json({
    environment,
    configured: Boolean(apiKey && apiSecret),
    sellerDomain: sellerDomain || "localhost:3001",
    checkoutScriptUrl: assets.jsUrl,
    checkoutCssUrl: assets.cssUrl,
  });
}
