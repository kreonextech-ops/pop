import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { readStore, writeStore } from "@/lib/store";
import type { ShiprocketEnv } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    environment?: ShiprocketEnv;
    apiKey?: string;
    apiSecret?: string;
    sellerDomain?: string;
    redirectBaseUrl?: string;
    loyaltyEnabled?: boolean;
    gmailUser?: string;
    adminNotifyEmail?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const store = readStore();
  if (body.environment === "staging" || body.environment === "production") {
    store.settings.environment = body.environment;
  }
  if (typeof body.apiKey === "string") {
    store.settings.apiKey = body.apiKey.trim();
  }
  // Only overwrite secret if user explicitly typed a non-empty value (preserves masked secret on save)
  if (typeof body.apiSecret === "string" && body.apiSecret.trim().length > 0) {
    store.settings.apiSecret = body.apiSecret.trim();
  }
  if (typeof body.sellerDomain === "string") {
    store.settings.sellerDomain = body.sellerDomain.trim();
  }
  if (typeof body.redirectBaseUrl === "string") {
    store.settings.redirectBaseUrl = body.redirectBaseUrl.trim();
  }
  if (typeof body.loyaltyEnabled === "boolean") {
    store.settings.loyaltyEnabled = body.loyaltyEnabled;
  }
  if (typeof body.gmailUser === "string") {
    store.settings.gmailUser = body.gmailUser.trim();
  }
  if (typeof body.adminNotifyEmail === "string") {
    store.settings.adminNotifyEmail = body.adminNotifyEmail.trim();
  }
  store.settings.updatedAt = new Date().toISOString();

  writeStore(store);

  return NextResponse.json({
    ok: true,
    settings: {
      environment: store.settings.environment,
      apiKey: store.settings.apiKey,
      hasApiSecret: Boolean(store.settings.apiSecret),
      sellerDomain: store.settings.sellerDomain,
      redirectBaseUrl: store.settings.redirectBaseUrl,
      loyaltyEnabled: store.settings.loyaltyEnabled,
      gmailUser: store.settings.gmailUser || "",
      adminNotifyEmail: store.settings.adminNotifyEmail || "",
      updatedAt: store.settings.updatedAt,
    },
  });
}
