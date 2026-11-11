import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  readStore,
  writeStore,
  appendWebhookLog,
  formatShiprocketCollection,
  getOriginFromRequest,
  type StoreCollection,
} from "@/lib/store";
import { callShiprocketApi } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; body_html?: string; image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ ok: false, error: "Collection title is required" }, { status: 400 });
  }

  const store = readStore();
  const now = new Date().toISOString();
  const maxId = store.collections.reduce((m, c) => Math.max(m, c.id), 200000);
  const handle = body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const newCol: StoreCollection = {
    id: maxId + 1,
    title: body.title.trim(),
    handle,
    body_html: body.body_html || `<p>${body.title.trim()}</p>`,
    image: body.image || "/packets/peri peri.svg",
    created_at: now,
    updated_at: now,
  };

  store.collections.push(newCol);

  let syncRes: { pushed: boolean; ok?: boolean; status?: number } = { pushed: false };
  if (store.settings.apiKey && store.settings.apiSecret) {
    const origin = getOriginFromRequest(req, store.settings.sellerDomain);
    const res = await callShiprocketApi({
      env: store.settings.environment,
      apiKey: store.settings.apiKey,
      apiSecret: store.settings.apiSecret,
      path: "/wh/v1/custom/collection",
      payload: formatShiprocketCollection(newCol, origin),
    });
    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "COLLECTION_SYNC_WEBHOOK",
      endpoint: "/wh/v1/custom/collection",
      httpStatus: res.status,
      ok: res.ok,
      summary: res.ok
        ? `Synced collection #${newCol.id} (${newCol.title})`
        : `Collection sync failed (${res.status}): ${res.error || "Unknown"}`,
    });
    syncRes = { pushed: true, ok: res.ok, status: res.status };
  }

  writeStore(store);
  return NextResponse.json({ ok: true, collection: newCol, shiprocketSync: syncRes });
}
