import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { readStore } from "@/lib/store";
import { getGmailConfig } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const store = readStore();
  const totalRevenue = store.orders
    .filter((o) => o.status === "SUCCESS")
    .reduce((sum, o) => sum + (Number(o.total_amount_payable) || 0), 0);

  const successCount = store.orders.filter((o) => o.status === "SUCCESS").length;
  const initiatedCount = store.orders.filter((o) => o.status === "INITIATED").length;

  let lowStockVariants = 0;
  let totalVariants = 0;
  for (const p of store.products) {
    for (const v of p.variants) {
      totalVariants += 1;
      if (v.quantity <= 15) lowStockVariants += 1;
    }
  }

  const maskedSecret = store.settings.apiSecret
    ? `${store.settings.apiSecret.slice(0, 4)}••••••••${store.settings.apiSecret.slice(-3)}`
    : "";

  const gmailCfg = getGmailConfig(store.settings.gmailUser);

  return NextResponse.json({
    ok: true,
    stats: {
      totalRevenue,
      totalOrders: store.orders.length,
      successOrders: successCount,
      initiatedOrders: initiatedCount,
      totalProducts: store.products.length,
      totalVariants,
      lowStockVariants,
      totalUsers: store.users.length,
      totalGameRuns: (store.gameRuns || []).length,
    },
    products: store.products,
    collections: store.collections,
    orders: store.orders,
    coupons: store.coupons || [],
    webhookLogs: store.webhookLogs,
    settings: {
      environment: store.settings.environment,
      apiKey: store.settings.apiKey,
      hasApiSecret: Boolean(store.settings.apiSecret),
      maskedSecret,
      sellerDomain: store.settings.sellerDomain,
      redirectBaseUrl: store.settings.redirectBaseUrl,
      loyaltyEnabled: store.settings.loyaltyEnabled,
      gmailUser: store.settings.gmailUser || "",
      adminNotifyEmail: store.settings.adminNotifyEmail || "",
      gmailConfigured: gmailCfg.configured,
      updatedAt: store.settings.updatedAt,
    },
  });
}
