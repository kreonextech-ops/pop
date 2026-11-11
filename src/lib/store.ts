import fs from "fs";
import path from "path";
import { PRODUCTS, COMBOS } from "@/data/products";
import type { ShiprocketEnv } from "./shiprocket";

export interface StoreVariant {
  id: number; // Unique long integer for Shiprocket
  title: string;
  price: string; // e.g. "40.00"
  compare_at_price: string;
  sku: string;
  quantity: number;
  grams: number;
  weight: number;
  weight_unit: string;
  taxable: boolean;
  option_values: Record<string, string>;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface StoreProduct {
  id: number; // Unique long integer for Shiprocket
  slug: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  tags: string;
  status: "active" | "draft";
  image: string;
  secondaryImage?: string;
  badge: string;
  emoji: string;
  tagline: string;
  themeColor: string;
  accentBg: string;
  isCombo: boolean;
  includedFlavours?: string[];
  packCountText?: string;
  ingredients?: string;
  allergen?: string;
  collectionIds: number[];
  options: { name: string; values: string[] }[];
  variants: StoreVariant[];
  created_at: string;
  updated_at: string;
}

export interface StoreCollection {
  id: number; // Unique long integer for Shiprocket
  title: string;
  handle: string;
  body_html: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface StoreOrderItem {
  variant_id: string;
  quantity: number;
  name?: string;
  price?: number;
}

export interface StoreOrder {
  order_id: string;
  user_id?: string | null;
  fastrr_order_id?: string | null;
  platform_order_id?: string | null;
  cart_id?: string | null;
  status: string; // INITIATED | CREATED | SUCCESS | FAILED | CANCELLED | REFUNDED
  source?: string | null;
  payment_type?: string | null;
  payment_status?: string | null;
  phone?: string | null;
  email?: string | null;
  shipping_plan?: string | null;
  shipping_charges?: number;
  subtotal_price?: number | null;
  coupon_codes?: string[];
  coupon_discount?: number | null;
  prepaid_discount?: number | null;
  loyalty_points_applied?: number | null;
  total_discount?: number | null;
  total_amount_payable?: number | null;
  rto_prediction?: string | null;
  edd?: string | null;
  shipping_address?: Record<string, unknown> | null;
  billing_address?: Record<string, unknown> | null;
  payments?: Record<string, unknown>[];
  cart_data: {
    items: StoreOrderItem[];
    custom_attributes?: Record<string, unknown>;
  };
  redirect_url?: string;
  isDemo?: boolean;
  stockDeducted?: boolean;
  refunds?: {
    ref_id?: string;
    amount: number;
    status: string;
    created_at: string;
    message?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  direction: "INBOUND" | "OUTBOUND";
  event: string;
  endpoint: string;
  httpStatus: number;
  ok: boolean;
  summary: string;
}

export interface StoreSettings {
  environment: ShiprocketEnv;
  apiKey: string;
  apiSecret: string;
  sellerDomain: string;
  redirectBaseUrl: string;
  loyaltyEnabled: boolean;
  gmailUser?: string;
  adminNotifyEmail?: string;
  updatedAt: string;
}

export interface LoyaltyAccount {
  mobile_number: string;
  available_points: number;
  blocked: Record<string, number>; // order_id -> points
}

export interface StoreUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "customer" | "admin";
  loyaltyPoints: number;
  gameHighScore: number;
  totalRuns: number;
  totalDistance: number;
  savedAddress?: {
    line1?: string;
    city?: string;
    pincode?: string;
  } | null;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCoupon {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  active: boolean;
  createdAt: string;
}

export interface StoreGameRun {
  id: string;
  userId: string;
  userName: string;
  distance: number;
  pointsEarned: number;
  createdAt: string;
}

export interface StoreData {
  products: StoreProduct[];
  collections: StoreCollection[];
  orders: StoreOrder[];
  webhookLogs: WebhookLog[];
  settings: StoreSettings;
  loyalty: Record<string, LoyaltyAccount>;
  users: StoreUser[];
  coupons: StoreCoupon[];
  gameRuns: StoreGameRun[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function nowIso(): string {
  return new Date().toISOString();
}

function buildSeedStore(): StoreData {
  const ts = "2026-01-15T10:00:00.000Z";

  const collections: StoreCollection[] = [
    {
      id: 200001,
      title: "Signature Flavours",
      handle: "signature-flavours",
      body_html: "<p>Slow-roasted jumbo foxnuts tossed in bold signature seasonings.</p>",
      image: "/packets/peri peri.svg",
      created_at: ts,
      updated_at: ts,
    },
    {
      id: 200002,
      title: "Combo Bundles",
      handle: "combo-bundles",
      body_html: "<p>Value-packed Pop Culture makhana variety boxes and party stashes.</p>",
      image: "/packets/cheese.svg",
      created_at: ts,
      updated_at: ts,
    },
  ];

  const signatureProducts: StoreProduct[] = Object.values(PRODUCTS).map((p) => {
    const packOptions = ["1 Pouch (20g)", "Pack of 3 (60g)", "Pack of 6 (120g)"];
    return {
      id: p.numericId,
      slug: p.slug,
      title: p.name,
      body_html: `<p>${p.shortDesc}</p>`,
      vendor: "Pop Culture",
      product_type: "Roasted Foxnuts",
      handle: p.slug,
      tags: `makhana, foxnuts, ${p.slug}, healthy snacks`,
      status: "active",
      image: p.packImage,
      badge: p.badge,
      emoji: p.emoji,
      tagline: p.tagline,
      themeColor: p.themeColor,
      accentBg: p.accentBg,
      isCombo: false,
      collectionIds: [200001],
      options: [{ name: "Pack Size", values: packOptions }],
      variants: [
        {
          id: p.variantIds.single,
          title: "1 Pouch (20g)",
          price: p.pricing.single.price.toFixed(2),
          compare_at_price: p.pricing.single.originalPrice.toFixed(2),
          sku: `PC-${p.id.toUpperCase()}-1PK`,
          quantity: 150,
          grams: 20,
          weight: 20,
          weight_unit: "g",
          taxable: true,
          option_values: { "Pack Size": "1 Pouch (20g)" },
          image: p.packImage,
          created_at: ts,
          updated_at: ts,
        },
        {
          id: p.variantIds.trio,
          title: "Pack of 3 (60g)",
          price: p.pricing.trio.price.toFixed(2),
          compare_at_price: p.pricing.trio.originalPrice.toFixed(2),
          sku: `PC-${p.id.toUpperCase()}-3PK`,
          quantity: 100,
          grams: 60,
          weight: 60,
          weight_unit: "g",
          taxable: true,
          option_values: { "Pack Size": "Pack of 3 (60g)" },
          image: p.packImage,
          created_at: ts,
          updated_at: ts,
        },
        {
          id: p.variantIds.party,
          title: "Pack of 6 (120g)",
          price: p.pricing.party.price.toFixed(2),
          compare_at_price: p.pricing.party.originalPrice.toFixed(2),
          sku: `PC-${p.id.toUpperCase()}-6PK`,
          quantity: 80,
          grams: 120,
          weight: 120,
          weight_unit: "g",
          taxable: true,
          option_values: { "Pack Size": "Pack of 6 (120g)" },
          image: p.packImage,
          created_at: ts,
          updated_at: ts,
        },
      ],
      created_at: ts,
      updated_at: ts,
    };
  });

  const comboProducts: StoreProduct[] = Object.values(COMBOS).map((c) => {
    const grams = c.slug.includes("mega") ? 240 : c.slug.includes("party") ? 120 : 60;
    return {
      id: c.numericId,
      slug: c.slug,
      title: c.name,
      body_html: `<p>${c.shortDesc}</p>`,
      vendor: "Pop Culture",
      product_type: "Combo Box",
      handle: c.slug,
      tags: `combo, variety pack, makhana, ${c.slug}`,
      status: "active",
      image: c.packImage,
      secondaryImage: c.secondaryImage,
      badge: c.badge,
      emoji: c.emoji,
      tagline: c.tagline,
      themeColor: c.themeColor,
      accentBg: c.accentBg,
      isCombo: true,
      includedFlavours: c.includedFlavours,
      packCountText: c.packCountText,
      collectionIds: [200002],
      options: [{ name: "Bundle", values: [c.packCountText] }],
      variants: [
        {
          id: c.variantId,
          title: c.packCountText,
          price: c.price.toFixed(2),
          compare_at_price: c.originalPrice.toFixed(2),
          sku: `PC-${c.id.toUpperCase()}`,
          quantity: 75,
          grams,
          weight: grams,
          weight_unit: "g",
          taxable: true,
          option_values: { Bundle: c.packCountText },
          image: c.packImage,
          created_at: ts,
          updated_at: ts,
        },
      ],
      created_at: ts,
      updated_at: ts,
    };
  });

  return {
    products: [...signatureProducts, ...comboProducts],
    collections,
    orders: [],
    webhookLogs: [],
    settings: {
      environment: (process.env.SHIPROCKET_ENV === "production" ? "production" : "staging") as ShiprocketEnv,
      apiKey: process.env.SHIPROCKET_API_KEY || "",
      apiSecret: process.env.SHIPROCKET_API_SECRET || "",
      sellerDomain: process.env.SHIPROCKET_SELLER_DOMAIN || "localhost:3001",
      redirectBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
      loyaltyEnabled: true,
      gmailUser: process.env.GMAIL_USER || "",
      adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || "",
      updatedAt: ts,
    },
    loyalty: {
      "9999999999": {
        mobile_number: "9999999999",
        available_points: 500,
        blocked: {},
      },
    },
    users: [],
    coupons: [
      {
        code: "POP10",
        discountType: "percent",
        value: 10,
        minOrder: 0,
        maxDiscount: 200,
        active: true,
        createdAt: ts,
      },
      {
        code: "FIRST50",
        discountType: "fixed",
        value: 50,
        minOrder: 200,
        maxDiscount: null,
        active: true,
        createdAt: ts,
      },
    ],
    gameRuns: [],
  };
}

export function readStore(): StoreData {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const seed = buildSeedStore();
      writeStore(seed);
      return seed;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoreData;
    const seed = buildSeedStore();
    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!Array.isArray(parsed.coupons)) parsed.coupons = seed.coupons;
    if (!Array.isArray(parsed.gameRuns)) parsed.gameRuns = [];
    // Overlay env variables if settings fields are blank
    if (!parsed.settings.apiKey && process.env.SHIPROCKET_API_KEY) {
      parsed.settings.apiKey = process.env.SHIPROCKET_API_KEY;
    }
    if (!parsed.settings.apiSecret && process.env.SHIPROCKET_API_SECRET) {
      parsed.settings.apiSecret = process.env.SHIPROCKET_API_SECRET;
    }
    if (!parsed.settings.gmailUser && process.env.GMAIL_USER) {
      parsed.settings.gmailUser = process.env.GMAIL_USER;
    }
    if (!parsed.settings.adminNotifyEmail && process.env.ADMIN_NOTIFY_EMAIL) {
      parsed.settings.adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL;
    }
    return parsed;
  } catch {
    const seed = buildSeedStore();
    return seed;
  }
}

export function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpPath, STORE_PATH);
}

export function appendWebhookLog(
  store: StoreData,
  log: Omit<WebhookLog, "id" | "timestamp">
): void {
  store.webhookLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: nowIso(),
    ...log,
  });
  if (store.webhookLogs.length > 100) {
    store.webhookLogs = store.webhookLogs.slice(0, 100);
  }
}

export function toAbsoluteImageUrl(img: string, origin: string): string {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  const encodedPath = cleanPath
    .split("/")
    .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : ""))
    .join("/");
  return `${origin.replace(/\/$/, "")}${encodedPath}`;
}

/**
 * Formats a StoreProduct into the exact Shiprocket Checkout Catalog API & Webhook schema.
 * Note: All fields are mandatory per Shiprocket specification ("" if blank).
 */
export function formatShiprocketProduct(p: StoreProduct, origin: string) {
  return {
    id: p.id,
    title: p.title || "",
    body_html: p.body_html || "",
    vendor: p.vendor || "Pop Culture",
    product_type: p.product_type || "Roasted Foxnuts",
    created_at: p.created_at || nowIso(),
    handle: p.handle || p.slug || "",
    updated_at: p.updated_at || nowIso(),
    tags: p.tags || "",
    status: p.status || "active",
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      title: v.title || "",
      price: String(v.price || "0.00"),
      compare_at_price: String(v.compare_at_price || v.price || "0.00"),
      sku: v.sku || "",
      quantity: Number.isFinite(v.quantity) ? v.quantity : 0,
      created_at: v.created_at || p.created_at || nowIso(),
      updated_at: v.updated_at || p.updated_at || nowIso(),
      taxable: v.taxable ?? true,
      option_values: v.option_values || {},
      grams: v.grams || 20,
      image: {
        src: toAbsoluteImageUrl(v.image || p.image, origin),
      },
      weight: v.weight || 20,
      weight_unit: v.weight_unit || "g",
    })),
    image: {
      src: toAbsoluteImageUrl(p.image, origin),
    },
    options: p.options && p.options.length > 0 ? p.options : [{ name: "Pack Size", values: [""] }],
  };
}

export function formatShiprocketCollection(c: StoreCollection, origin: string) {
  return {
    id: c.id,
    updated_at: c.updated_at || nowIso(),
    body_html: c.body_html || "",
    handle: c.handle || "",
    image: {
      src: toAbsoluteImageUrl(c.image, origin),
    },
    title: c.title || "",
    created_at: c.created_at || nowIso(),
  };
}

export function getOriginFromRequest(req: Request, sellerDomain?: string): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) return `${proto}://${host}`;
  if (sellerDomain) {
    return sellerDomain.startsWith("http") ? sellerDomain : `https://${sellerDomain}`;
  }
  return "http://localhost:3001";
}
