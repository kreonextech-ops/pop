import { NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  appendWebhookLog,
  type StoreOrder,
} from "@/lib/store";
import { verifyHmacBase64 } from "@/lib/shiprocket";
import { sendOrderConfirmationEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const store = readStore();

  // Optional HMAC verification if Shiprocket includes X-Api-HMAC-SHA256 and secret is configured
  const incomingHmac =
    req.headers.get("x-api-hmac-sha256") || req.headers.get("X-Api-HMAC-SHA256");
  if (incomingHmac && store.settings.apiSecret) {
    const valid = verifyHmacBase64(rawBody, incomingHmac, store.settings.apiSecret);
    if (!valid) {
      appendWebhookLog(store, {
        direction: "INBOUND",
        event: "ORDER_WEBHOOK",
        endpoint: "/api/shiprocket/webhook/order",
        httpStatus: 401,
        ok: false,
        summary: "Rejected order webhook due to invalid X-Api-HMAC-SHA256 signature",
      });
      writeStore(store);
      return NextResponse.json({ ok: false, error: "Invalid HMAC signature" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = String(payload.order_id || payload.platform_order_id || "");
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const existingIdx = store.orders.findIndex((o) => o.order_id === orderId);
  const existing = existingIdx >= 0 ? store.orders[existingIdx] : undefined;

  const incomingCartData = (payload.cart_data as StoreOrder["cart_data"]) ||
    existing?.cart_data || { items: [] };

  const nextStatus = String(payload.status || existing?.status || "INITIATED").toUpperCase();

  const wasSuccess = existing?.status === "SUCCESS";

  const merged: StoreOrder = {
    order_id: orderId,
    user_id: existing?.user_id ?? null,
    fastrr_order_id: (payload.fastrr_order_id as string) ?? existing?.fastrr_order_id ?? null,
    platform_order_id: (payload.platform_order_id as string) ?? existing?.platform_order_id ?? null,
    cart_id: (payload.cart_id as string) ?? existing?.cart_id ?? null,
    status: nextStatus,
    source: (payload.source as string) ?? existing?.source ?? null,
    payment_type: (payload.payment_type as string) ?? existing?.payment_type ?? null,
    payment_status: (payload.payment_status as string) ?? existing?.payment_status ?? null,
    phone: (payload.phone as string) ?? existing?.phone ?? null,
    email: (payload.email as string) ?? existing?.email ?? null,
    shipping_plan: (payload.shipping_plan as string) ?? existing?.shipping_plan ?? null,
    shipping_charges:
      typeof payload.shipping_charges === "number"
        ? payload.shipping_charges
        : existing?.shipping_charges ?? 0,
    subtotal_price:
      typeof payload.subtotal_price === "number"
        ? payload.subtotal_price
        : existing?.subtotal_price ?? null,
    coupon_codes: Array.isArray(payload.coupon_codes)
      ? (payload.coupon_codes as string[])
      : existing?.coupon_codes ?? [],
    coupon_discount:
      typeof payload.coupon_discount === "number"
        ? payload.coupon_discount
        : existing?.coupon_discount ?? null,
    loyalty_points_applied: existing?.loyalty_points_applied ?? 0,
    prepaid_discount:
      typeof payload.prepaid_discount === "number"
        ? payload.prepaid_discount
        : existing?.prepaid_discount ?? null,
    total_discount:
      typeof payload.total_discount === "number"
        ? payload.total_discount
        : existing?.total_discount ?? null,
    total_amount_payable:
      typeof payload.total_amount_payable === "number"
        ? payload.total_amount_payable
        : existing?.total_amount_payable ?? null,
    rto_prediction: (payload.rto_prediction as string) ?? existing?.rto_prediction ?? null,
    edd: (payload.edd as string) ?? existing?.edd ?? null,
    shipping_address:
      (payload.shipping_address as Record<string, unknown>) ?? existing?.shipping_address ?? null,
    billing_address:
      (payload.billing_address as Record<string, unknown>) ?? existing?.billing_address ?? null,
    payments: Array.isArray(payload.payments)
      ? (payload.payments as Record<string, unknown>[])
      : existing?.payments ?? [],
    cart_data: incomingCartData,
    redirect_url: (payload.redirect_url as string) ?? existing?.redirect_url,
    isDemo: existing?.isDemo ?? false,
    stockDeducted: existing?.stockDeducted ?? false,
    refunds: existing?.refunds ?? [],
    created_at: existing?.created_at || (payload.order_created_date as string) || now,
    updated_at: now,
  };

  // Deduct stock once when order transitions to SUCCESS
  if (nextStatus === "SUCCESS" && !merged.stockDeducted) {
    for (const item of merged.cart_data.items || []) {
      const vid = Number(item.variant_id);
      for (const prod of store.products) {
        const variant = prod.variants.find((v) => v.id === vid);
        if (variant) {
          variant.quantity = Math.max(0, variant.quantity - (item.quantity || 1));
          variant.updated_at = now;
        }
      }
    }
    merged.stockDeducted = true;
  }

  if (existingIdx >= 0) {
    store.orders[existingIdx] = merged;
  } else {
    store.orders.unshift(merged);
  }

  appendWebhookLog(store, {
    direction: "INBOUND",
    event: "ORDER_WEBHOOK",
    endpoint: "/api/shiprocket/webhook/order",
    httpStatus: 200,
    ok: true,
    summary: `Order ${orderId} updated -> status: ${nextStatus}, payment: ${merged.payment_type || "N/A"}, total: ₹${merged.total_amount_payable ?? 0}`,
  });

  writeStore(store);

  if (nextStatus === "SUCCESS" && !wasSuccess) {
    await sendOrderConfirmationEmails(merged);
  }

  return NextResponse.json({ ok: true, order_id: orderId, status: nextStatus });
}
