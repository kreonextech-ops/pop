import { NextResponse } from "next/server";
import { readStore, writeStore, appendWebhookLog } from "@/lib/store";
import { callShiprocketApi } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const store = readStore();
  let order = store.orders.find((o) => o.order_id === id);

  // If still INITIATED and Shiprocket keys exist, poll Shiprocket Order Details API as failsafe
  if (
    order &&
    !order.isDemo &&
    order.status === "INITIATED" &&
    store.settings.apiKey &&
    store.settings.apiSecret
  ) {
    const res = await callShiprocketApi<{ ok?: boolean; result?: Record<string, unknown> }>({
      env: store.settings.environment,
      apiKey: store.settings.apiKey,
      apiSecret: store.settings.apiSecret,
      path: "/api/v1/custom-platform-order/details",
      payload: {
        order_id: id,
        timestamp: new Date().toISOString(),
      },
    });

    if (res.ok && res.data?.result) {
      const r = res.data.result;
      order = {
        ...order,
        status: String(r.status || order.status),
        fastrr_order_id: (r.fastrr_order_id as string) ?? order.fastrr_order_id,
        payment_type: (r.payment_type as string) ?? order.payment_type,
        payment_status: (r.payment_status as string) ?? order.payment_status,
        phone: (r.phone as string) ?? order.phone,
        email: (r.email as string) ?? order.email,
        shipping_address: (r.shipping_address as Record<string, unknown>) ?? order.shipping_address,
        billing_address: (r.billing_address as Record<string, unknown>) ?? order.billing_address,
        total_amount_payable:
          typeof r.total_amount_payable === "number"
            ? r.total_amount_payable
            : order.total_amount_payable,
        updated_at: new Date().toISOString(),
      };
      const idx = store.orders.findIndex((o) => o.order_id === id);
      if (idx >= 0) store.orders[idx] = order;
      appendWebhookLog(store, {
        direction: "OUTBOUND",
        event: "ORDER_DETAILS_POLL",
        endpoint: "/api/v1/custom-platform-order/details",
        httpStatus: res.status,
        ok: true,
        summary: `Synced order ${id} -> ${order.status}`,
      });
      writeStore(store);
    }
  }

  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order });
}
