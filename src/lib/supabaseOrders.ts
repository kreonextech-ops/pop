import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import { readStore, type StoreCoupon, type StoreGameRun, type StoreOrder } from "./store";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value?: string | null): boolean {
  return Boolean(value && UUID_REGEX.test(value));
}

function normalizePhoneTail(phone?: string | null): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

interface SupabaseOrderRow {
  order_id: string;
  user_id: string | null;
  fastrr_order_id: string | null;
  platform_order_id: string | null;
  cart_id: string | null;
  status: string;
  source: string | null;
  payment_type: string | null;
  payment_status: string | null;
  phone: string | null;
  email: string | null;
  shipping_plan: string | null;
  shipping_charges: number | string | null;
  subtotal_price: number | string | null;
  coupon_codes: string[] | null;
  coupon_discount: number | string | null;
  prepaid_discount: number | string | null;
  total_discount: number | string | null;
  total_amount_payable: number | string | null;
  rto_prediction: string | null;
  edd: string | null;
  shipping_address: Record<string, unknown> | null;
  billing_address: Record<string, unknown> | null;
  payments: Record<string, unknown>[] | null;
  cart_data: StoreOrder["cart_data"] | null;
  redirect_url: string | null;
  is_demo: boolean | null;
  stock_deducted: boolean | null;
  created_at: string;
  updated_at: string;
}

function mapSupabaseRowToOrder(row: SupabaseOrderRow): StoreOrder {
  const customAttrs = row.cart_data?.custom_attributes || {};
  const loyaltyApplied = Number(customAttrs.loyalty_points_applied) || 0;

  return {
    order_id: row.order_id,
    user_id: row.user_id,
    fastrr_order_id: row.fastrr_order_id,
    platform_order_id: row.platform_order_id,
    cart_id: row.cart_id,
    status: row.status || "INITIATED",
    source: row.source,
    payment_type: row.payment_type,
    payment_status: row.payment_status,
    phone: row.phone,
    email: row.email,
    shipping_plan: row.shipping_plan,
    shipping_charges: row.shipping_charges != null ? Number(row.shipping_charges) : 0,
    subtotal_price: row.subtotal_price != null ? Number(row.subtotal_price) : null,
    coupon_codes: Array.isArray(row.coupon_codes) ? row.coupon_codes : [],
    coupon_discount: row.coupon_discount != null ? Number(row.coupon_discount) : null,
    prepaid_discount: row.prepaid_discount != null ? Number(row.prepaid_discount) : null,
    loyalty_points_applied: loyaltyApplied,
    total_discount: row.total_discount != null ? Number(row.total_discount) : null,
    total_amount_payable:
      row.total_amount_payable != null ? Number(row.total_amount_payable) : null,
    rto_prediction: row.rto_prediction,
    edd: row.edd,
    shipping_address: row.shipping_address,
    billing_address: row.billing_address,
    payments: Array.isArray(row.payments) ? row.payments : [],
    cart_data: row.cart_data || { items: [] },
    redirect_url: row.redirect_url || undefined,
    isDemo: Boolean(row.is_demo),
    stockDeducted: Boolean(row.stock_deducted),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function syncOrderToSupabase(order: StoreOrder): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sbAdmin = getSupabaseAdmin();
  if (!sbAdmin) return;

  const customAttributes = {
    ...(order.cart_data?.custom_attributes || {}),
    ...(order.loyalty_points_applied
      ? { loyalty_points_applied: order.loyalty_points_applied }
      : {}),
  };

  try {
    await sbAdmin.from("orders").upsert(
      {
        order_id: order.order_id,
        user_id: isUuid(order.user_id) ? order.user_id : null,
        fastrr_order_id: order.fastrr_order_id ?? null,
        platform_order_id: order.platform_order_id ?? null,
        cart_id: order.cart_id ?? null,
        status: order.status || "INITIATED",
        source: order.source ?? null,
        payment_type: order.payment_type ?? null,
        payment_status: order.payment_status ?? null,
        phone: order.phone ?? null,
        email: order.email ? order.email.toLowerCase() : null,
        shipping_plan: order.shipping_plan ?? null,
        shipping_charges: order.shipping_charges ?? 0,
        subtotal_price: order.subtotal_price ?? null,
        coupon_codes: order.coupon_codes ?? [],
        coupon_discount: order.coupon_discount ?? 0,
        prepaid_discount: order.prepaid_discount ?? 0,
        total_discount: order.total_discount ?? 0,
        total_amount_payable: order.total_amount_payable ?? null,
        rto_prediction: order.rto_prediction ?? null,
        edd: order.edd ?? null,
        shipping_address: order.shipping_address ?? null,
        billing_address: order.billing_address ?? null,
        payments: order.payments ?? [],
        cart_data: {
          items: order.cart_data?.items || [],
          custom_attributes: customAttributes,
        },
        redirect_url: order.redirect_url ?? null,
        is_demo: Boolean(order.isDemo),
        stock_deducted: Boolean(order.stockDeducted),
        created_at: order.created_at || new Date().toISOString(),
        updated_at: order.updated_at || new Date().toISOString(),
      },
      { onConflict: "order_id" }
    );
  } catch {
    // Keep checkout resilient if Supabase write hits transient network error
  }
}

export async function getOrderFromSupabase(orderId: string): Promise<StoreOrder | null> {
  if (!isSupabaseConfigured()) return null;
  const sbAdmin = getSupabaseAdmin();
  if (!sbAdmin) return null;

  try {
    const { data } = await sbAdmin
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    return data ? mapSupabaseRowToOrder(data as SupabaseOrderRow) : null;
  } catch {
    return null;
  }
}

export async function getCustomerOrdersFromSupabase(params: {
  userId: string;
  email: string;
  phone?: string;
}): Promise<StoreOrder[]> {
  const store = readStore();
  const userEmail = params.email.trim().toLowerCase();
  const userPhoneTail = normalizePhoneTail(params.phone);

  const localOrders = (store.orders || []).filter(
    (o) =>
      o.user_id === params.userId ||
      (o.email && o.email.toLowerCase() === userEmail) ||
      (userPhoneTail && o.phone && normalizePhoneTail(o.phone) === userPhoneTail)
  );

  const mergedMap = new Map<string, StoreOrder>();
  for (const o of localOrders) {
    mergedMap.set(o.order_id, o);
  }

  if (isSupabaseConfigured()) {
    const sbAdmin = getSupabaseAdmin();
    if (sbAdmin) {
      try {
        const filters: string[] = [];
        if (isUuid(params.userId)) filters.push(`user_id.eq.${params.userId}`);
        if (userEmail) filters.push(`email.ilike.${userEmail}`);
        if (userPhoneTail) filters.push(`phone.ilike.%${userPhoneTail}`);

        if (filters.length > 0) {
          const { data } = await sbAdmin
            .from("orders")
            .select("*")
            .or(filters.join(","))
            .order("created_at", { ascending: false })
            .limit(50);

          if (Array.isArray(data)) {
            for (const row of data as SupabaseOrderRow[]) {
              const mapped = mapSupabaseRowToOrder(row);
              const existing = mergedMap.get(mapped.order_id);
              if (
                !existing ||
                new Date(mapped.updated_at).getTime() >=
                  new Date(existing.updated_at).getTime()
              ) {
                mergedMap.set(mapped.order_id, mapped);
              }
            }
          }
        }
      } catch {
        // Fallback to localOrders
      }
    }
  }

  return Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getCustomerGameRunsFromSupabase(
  userId: string,
  userName = "Snacker"
): Promise<StoreGameRun[]> {
  const store = readStore();
  const localRuns = (store.gameRuns || []).filter((r) => r.userId === userId);
  const runMap = new Map<string, StoreGameRun>();
  for (const r of localRuns) {
    runMap.set(r.id, r);
  }

  if (isSupabaseConfigured() && isUuid(userId)) {
    const sbAdmin = getSupabaseAdmin();
    if (sbAdmin) {
      try {
        const { data } = await sbAdmin
          .from("game_runs")
          .select("id, user_id, distance, points_earned, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(12);

        if (Array.isArray(data)) {
          for (const row of data) {
            runMap.set(String(row.id), {
              id: String(row.id),
              userId: String(row.user_id),
              userName,
              distance: Number(row.distance) || 0,
              pointsEarned: Number(row.points_earned) || 0,
              createdAt: String(row.created_at),
            });
          }
        }
      } catch {
        // Fallback to localRuns
      }
    }
  }

  return Array.from(runMap.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);
}

export async function getActiveCouponsForCustomer(): Promise<StoreCoupon[]> {
  const store = readStore();
  const couponMap = new Map<string, StoreCoupon>();
  for (const c of store.coupons || []) {
    if (c.active) couponMap.set(c.code.toUpperCase(), c);
  }

  if (isSupabaseConfigured()) {
    const sbAdmin = getSupabaseAdmin();
    if (sbAdmin) {
      try {
        const { data } = await sbAdmin
          .from("coupons")
          .select("code, discount_type, value, min_order, max_discount, active, created_at")
          .eq("active", true);

        if (Array.isArray(data)) {
          for (const row of data) {
            const code = String(row.code).toUpperCase();
            couponMap.set(code, {
              code,
              discountType: row.discount_type === "fixed" ? "fixed" : "percent",
              value: Number(row.value) || 0,
              minOrder: Number(row.min_order) || 0,
              maxDiscount: row.max_discount != null ? Number(row.max_discount) : null,
              active: Boolean(row.active),
              createdAt: String(row.created_at || new Date().toISOString()),
            });
          }
        }
      } catch {
        // Fallback to local coupons
      }
    }
  }

  return Array.from(couponMap.values());
}

export async function syncProfilePointsToSupabase(
  userId: string,
  loyaltyPoints: number
): Promise<void> {
  if (!isSupabaseConfigured() || !isUuid(userId)) return;
  const sbAdmin = getSupabaseAdmin();
  if (!sbAdmin) return;

  try {
    await sbAdmin
      .from("profiles")
      .update({
        loyalty_points: Math.max(0, Math.floor(loyaltyPoints)),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  } catch {
    // Non-fatal
  }
}
