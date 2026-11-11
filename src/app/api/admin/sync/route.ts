import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  readStore,
  writeStore,
  appendWebhookLog,
  formatShiprocketProduct,
  formatShiprocketCollection,
  getOriginFromRequest,
} from "@/lib/store";
import { callShiprocketApi, computeHmacBase64 } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    action:
      | "push_catalog"
      | "push_product"
      | "sync_order_detail"
      | "pull_order_list"
      | "refund_initiate"
      | "refund_reports"
      | "test_hmac";
    product_id?: number;
    order_id?: string;
    amount?: number;
    startDate?: string;
    endDate?: string;
    sampleJson?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const store = readStore();
  const { environment, apiKey, apiSecret, sellerDomain } = store.settings;
  const origin = getOriginFromRequest(req, sellerDomain);

  if (body.action === "test_hmac") {
    const raw = body.sampleJson || '{"test":"popculture"}';
    const hmac = apiSecret ? computeHmacBase64(raw, apiSecret) : "(No Secret Key set)";
    return NextResponse.json({ ok: true, hmac, rawLength: raw.length });
  }

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Shiprocket API Key and Secret Key must be saved in Settings first.",
      },
      { status: 400 }
    );
  }

  if (body.action === "push_catalog") {
    let successCount = 0;
    let failCount = 0;

    for (const col of store.collections) {
      const r = await callShiprocketApi({
        env: environment,
        apiKey,
        apiSecret,
        path: "/wh/v1/custom/collection",
        payload: formatShiprocketCollection(col, origin),
      });
      if (r.ok) successCount++;
      else failCount++;
    }

    for (const prod of store.products.filter((p) => p.status === "active")) {
      const r = await callShiprocketApi({
        env: environment,
        apiKey,
        apiSecret,
        path: "/wh/v1/custom/product",
        payload: formatShiprocketProduct(prod, origin),
      });
      if (r.ok) successCount++;
      else failCount++;
    }

    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "BULK_CATALOG_SYNC",
      endpoint: "/wh/v1/custom/product + collection",
      httpStatus: failCount === 0 ? 200 : 207,
      ok: failCount === 0,
      summary: `Pushed catalog to Shiprocket (${successCount} succeeded, ${failCount} failed)`,
    });
    writeStore(store);

    return NextResponse.json({ ok: failCount === 0, successCount, failCount });
  }

  if (body.action === "push_product") {
    const prod = store.products.find((p) => p.id === Number(body.product_id));
    if (!prod) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }
    const r = await callShiprocketApi({
      env: environment,
      apiKey,
      apiSecret,
      path: "/wh/v1/custom/product",
      payload: formatShiprocketProduct(prod, origin),
    });
    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "PRODUCT_SYNC_WEBHOOK",
      endpoint: "/wh/v1/custom/product",
      httpStatus: r.status,
      ok: r.ok,
      summary: r.ok
        ? `Manual sync succeeded for #${prod.id} (${prod.title})`
        : `Manual sync failed (${r.status}): ${r.error}`,
    });
    writeStore(store);
    return NextResponse.json({ ok: r.ok, status: r.status, data: r.data, error: r.error });
  }

  if (body.action === "sync_order_detail" && body.order_id) {
    const r = await callShiprocketApi<{ ok?: boolean; result?: Record<string, unknown> }>({
      env: environment,
      apiKey,
      apiSecret,
      path: "/api/v1/custom-platform-order/details",
      payload: {
        order_id: body.order_id,
        timestamp: new Date().toISOString(),
      },
    });

    if (r.ok && r.data?.result) {
      const res = r.data.result;
      const idx = store.orders.findIndex((o) => o.order_id === body.order_id);
      if (idx >= 0) {
        store.orders[idx] = {
          ...store.orders[idx],
          status: String(res.status || store.orders[idx].status),
          fastrr_order_id: (res.fastrr_order_id as string) ?? store.orders[idx].fastrr_order_id,
          payment_type: (res.payment_type as string) ?? store.orders[idx].payment_type,
          payment_status: (res.payment_status as string) ?? store.orders[idx].payment_status,
          phone: (res.phone as string) ?? store.orders[idx].phone,
          email: (res.email as string) ?? store.orders[idx].email,
          shipping_address:
            (res.shipping_address as Record<string, unknown>) ?? store.orders[idx].shipping_address,
          billing_address:
            (res.billing_address as Record<string, unknown>) ?? store.orders[idx].billing_address,
          payments: Array.isArray(res.payments)
            ? (res.payments as Record<string, unknown>[])
            : store.orders[idx].payments,
          total_amount_payable:
            typeof res.total_amount_payable === "number"
              ? res.total_amount_payable
              : store.orders[idx].total_amount_payable,
          rto_prediction: (res.rto_prediction as string) ?? store.orders[idx].rto_prediction,
          edd: (res.edd as string) ?? store.orders[idx].edd,
          updated_at: new Date().toISOString(),
        };
      }
    }

    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "SYNC_ORDER_DETAIL",
      endpoint: "/api/v1/custom-platform-order/details",
      httpStatus: r.status,
      ok: r.ok,
      summary: r.ok
        ? `Synced order detail for ${body.order_id}`
        : `Order detail sync failed (${r.status}): ${r.error}`,
    });
    writeStore(store);

    return NextResponse.json({ ok: r.ok, data: r.data, error: r.error });
  }

  if (body.action === "pull_order_list") {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const r = await callShiprocketApi({
      env: environment,
      apiKey,
      apiSecret,
      path: "/api/v1/custom-platform-order/details/list",
      payload: {
        startDate: body.startDate || weekAgo.toISOString(),
        endDate: body.endDate || now.toISOString(),
        timestamp: now.toISOString(),
        limit: 100,
        page: 0,
      },
    });
    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "PULL_ORDER_LIST",
      endpoint: "/api/v1/custom-platform-order/details/list",
      httpStatus: r.status,
      ok: r.ok,
      summary: r.ok ? `Fetched order list from Shiprocket` : `Order list failed (${r.status}): ${r.error}`,
    });
    writeStore(store);
    return NextResponse.json({ ok: r.ok, data: r.data, error: r.error });
  }

  if (body.action === "refund_initiate" && body.order_id && body.amount) {
    const r = await callShiprocketApi<{
      status?: boolean;
      data?: { data?: { id?: string; status?: string; message?: string } };
    }>({
      env: environment,
      apiKey,
      apiSecret,
      path: "/api/v1/external/refund/initiate",
      payload: {
        order_id: body.order_id,
        amount: Number(body.amount),
      },
    });

    if (r.ok) {
      const idx = store.orders.findIndex(
        (o) => o.order_id === body.order_id || o.fastrr_order_id === body.order_id
      );
      if (idx >= 0) {
        const refData = r.data?.data?.data;
        store.orders[idx].refunds = store.orders[idx].refunds || [];
        store.orders[idx].refunds.push({
          ref_id: refData?.id,
          amount: Number(body.amount),
          status: refData?.status || "INITIATED",
          message: refData?.message || "Refund Initiated",
          created_at: new Date().toISOString(),
        });
      }
    }

    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "REFUND_INITIATE",
      endpoint: "/api/v1/external/refund/initiate",
      httpStatus: r.status,
      ok: r.ok,
      summary: r.ok
        ? `Refund ₹${body.amount} initiated for ${body.order_id}`
        : `Refund failed (${r.status}): ${r.error}`,
    });
    writeStore(store);
    return NextResponse.json({ ok: r.ok, data: r.data, error: r.error });
  }

  if (body.action === "refund_reports") {
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const r = await callShiprocketApi({
      env: environment,
      apiKey,
      apiSecret,
      path: "/api/v1/external/refund/reports",
      payload: {
        page: 0,
        from: body.startDate || monthAgo,
        to: body.endDate || today,
      },
    });
    return NextResponse.json({ ok: r.ok, data: r.data, error: r.error });
  }

  return NextResponse.json({ ok: false, error: "Unsupported action" }, { status: 400 });
}
