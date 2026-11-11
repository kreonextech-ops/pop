import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  readStore,
  writeStore,
  appendWebhookLog,
  formatShiprocketProduct,
  getOriginFromRequest,
  type StoreProduct,
} from "@/lib/store";
import { callShiprocketApi } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

async function pushProductWebhookIfConfigured(
  req: Request,
  product: StoreProduct
): Promise<{ pushed: boolean; ok?: boolean; status?: number; error?: string }> {
  const store = readStore();
  if (!store.settings.apiKey || !store.settings.apiSecret) {
    return { pushed: false };
  }
  const origin = getOriginFromRequest(req, store.settings.sellerDomain);
  const payload = formatShiprocketProduct(product, origin);
  const res = await callShiprocketApi({
    env: store.settings.environment,
    apiKey: store.settings.apiKey,
    apiSecret: store.settings.apiSecret,
    path: "/wh/v1/custom/product",
    payload,
  });

  appendWebhookLog(store, {
    direction: "OUTBOUND",
    event: "PRODUCT_SYNC_WEBHOOK",
    endpoint: "/wh/v1/custom/product",
    httpStatus: res.status,
    ok: res.ok,
    summary: res.ok
      ? `Synced product #${product.id} (${product.title})`
      : `Product sync failed (${res.status}): ${res.error || "Unknown"}`,
  });
  writeStore(store);

  return { pushed: true, ok: res.ok, status: res.status, error: res.error };
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    slug?: string;
    tagline?: string;
    shortDesc?: string;
    badge?: string;
    emoji?: string;
    themeColor?: string;
    accentBg?: string;
    image?: string;
    isCombo?: boolean;
    includedFlavours?: string[];
    price?: number;
    compareAtPrice?: number;
    sku?: string;
    quantity?: number;
    grams?: number;
    collectionIds?: number[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ ok: false, error: "Product title is required" }, { status: 400 });
  }

  const store = readStore();
  const now = new Date().toISOString();

  const maxProdId = store.products.reduce((max, p) => Math.max(max, p.id), 100000);
  const newProdId = maxProdId + 1;
  const newVariantId = newProdId * 100 + 1;

  const cleanSlug =
    body.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") ||
    body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const priceNum = Math.max(1, Number(body.price) || 40);
  const compareNum = Math.max(priceNum, Number(body.compareAtPrice) || priceNum);
  const grams = Math.max(1, Number(body.grams) || 20);
  const isCombo = Boolean(body.isCombo);
  const variantTitle = isCombo ? `${grams}g Combo Box` : `1 Pouch (${grams}g)`;

  const newProduct: StoreProduct = {
    id: newProdId,
    slug: cleanSlug,
    title: body.title.trim().toUpperCase(),
    body_html: `<p>${body.shortDesc || body.tagline || body.title}</p>`,
    vendor: "Pop Culture",
    product_type: isCombo ? "Combo Box" : "Roasted Foxnuts",
    handle: cleanSlug,
    tags: `makhana, ${cleanSlug}`,
    status: "active",
    image: body.image || "/packets/peri peri.svg",
    badge: body.badge || `${body.emoji || "🍿"} ${body.title.trim().toUpperCase()}`,
    emoji: body.emoji || "🍿",
    tagline: body.tagline || "Slow-Roasted & Boldly Seasoned",
    themeColor: body.themeColor || "#D73B3A",
    accentBg: body.accentBg || "#ED0006",
    isCombo,
    includedFlavours: body.includedFlavours || [],
    packCountText: isCombo ? `${grams}g Box` : undefined,
    collectionIds: body.collectionIds || (isCombo ? [200002] : [200001]),
    options: [{ name: isCombo ? "Bundle" : "Pack Size", values: [variantTitle] }],
    variants: [
      {
        id: newVariantId,
        title: variantTitle,
        price: priceNum.toFixed(2),
        compare_at_price: compareNum.toFixed(2),
        sku: body.sku || `PC-${newProdId}-V1`,
        quantity: Number.isFinite(body.quantity) ? Number(body.quantity) : 100,
        grams,
        weight: grams,
        weight_unit: "g",
        taxable: true,
        option_values: { [isCombo ? "Bundle" : "Pack Size"]: variantTitle },
        image: body.image || "/packets/peri peri.svg",
        created_at: now,
        updated_at: now,
      },
    ],
    created_at: now,
    updated_at: now,
  };

  store.products.push(newProduct);
  writeStore(store);

  const syncRes = await pushProductWebhookIfConfigured(req, newProduct);

  return NextResponse.json({ ok: true, product: newProduct, shiprocketSync: syncRes });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    id: number;
    title?: string;
    status?: "active" | "draft";
    tagline?: string;
    image?: string;
    collectionIds?: number[];
    variants?: {
      id: number;
      title?: string;
      price?: string | number;
      compare_at_price?: string | number;
      sku?: string;
      quantity?: number;
      grams?: number;
    }[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const store = readStore();
  const idx = store.products.findIndex((p) => p.id === Number(body.id));
  if (idx < 0) {
    return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const target = store.products[idx];

  if (body.title !== undefined) target.title = body.title.trim();
  if (body.status !== undefined) target.status = body.status;
  if (body.tagline !== undefined) target.tagline = body.tagline;
  if (body.image !== undefined) target.image = body.image;
  if (body.collectionIds !== undefined) target.collectionIds = body.collectionIds;

  if (Array.isArray(body.variants)) {
    for (const vPatch of body.variants) {
      const existingVar = target.variants.find((v) => v.id === Number(vPatch.id));
      if (existingVar) {
        if (vPatch.title !== undefined) existingVar.title = vPatch.title;
        if (vPatch.price !== undefined) existingVar.price = Number(vPatch.price).toFixed(2);
        if (vPatch.compare_at_price !== undefined) {
          existingVar.compare_at_price = Number(vPatch.compare_at_price).toFixed(2);
        }
        if (vPatch.sku !== undefined) existingVar.sku = vPatch.sku;
        if (vPatch.quantity !== undefined) existingVar.quantity = Math.max(0, Number(vPatch.quantity));
        if (vPatch.grams !== undefined) {
          existingVar.grams = Number(vPatch.grams);
          existingVar.weight = Number(vPatch.grams);
        }
        existingVar.updated_at = now;
      }
    }
  }

  target.updated_at = now;
  store.products[idx] = target;
  writeStore(store);

  const syncRes = await pushProductWebhookIfConfigured(req, target);
  return NextResponse.json({ ok: true, product: target, shiprocketSync: syncRes });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const store = readStore();
  const prevLen = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === prevLen) {
    return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
  }
  writeStore(store);
  return NextResponse.json({ ok: true });
}
