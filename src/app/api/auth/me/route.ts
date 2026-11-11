import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, sanitizeUser } from "@/lib/customerAuth";
import { readStore, writeStore, type StoreUser } from "@/lib/store";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import {
  getActiveCouponsForCustomer,
  getCustomerGameRunsFromSupabase,
  getCustomerOrdersFromSupabase,
  isUuid,
} from "@/lib/supabaseOrders";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null, orders: [], recentRuns: [], coupons: [] });
  }

  const [orders, recentRuns, coupons] = await Promise.all([
    getCustomerOrdersFromSupabase({
      userId: user.id,
      email: user.email,
      phone: user.phone,
    }),
    getCustomerGameRunsFromSupabase(user.id, user.fullName),
    getActiveCouponsForCustomer(),
  ]);

  const completedStatuses = new Set(["SUCCESS", "DELIVERED"]);
  const failedStatuses = new Set(["FAILED", "CANCELLED"]);
  const activeOrders = orders.filter((o) => {
    const st = (o.status || "").toUpperCase();
    return !failedStatuses.has(st) && st !== "DELIVERED";
  }).length;
  const totalSpent = orders.reduce((sum, o) => {
    const st = (o.status || "").toUpperCase();
    if (failedStatuses.has(st)) return sum;
    return sum + (Number(o.total_amount_payable) || 0);
  }, 0);
  const totalSaved = orders.reduce((sum, o) => {
    const st = (o.status || "").toUpperCase();
    if (failedStatuses.has(st)) return sum;
    return sum + (Number(o.total_discount) || 0);
  }, 0);
  const completedOrders = orders.filter((o) =>
    completedStatuses.has((o.status || "").toUpperCase())
  ).length;

  return NextResponse.json({
    user: sanitizeUser(user),
    orders,
    recentRuns,
    coupons,
    stats: {
      totalOrders: orders.length,
      activeOrders,
      completedOrders,
      totalSpent: Math.round(totalSpent),
      totalSaved: Math.round(totalSaved),
    },
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      fullName?: string;
      phone?: string;
      savedAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
      } | null;
    };

    const now = new Date().toISOString();
    const store = readStore();
    const idx = store.users.findIndex((u) => u.id === user.id);
    const baseUser: StoreUser = idx >= 0 ? store.users[idx] : user;

    const updated: StoreUser = {
      ...baseUser,
      fullName: body.fullName !== undefined ? body.fullName.trim() : baseUser.fullName,
      phone: body.phone !== undefined ? body.phone.trim() : baseUser.phone,
      savedAddress:
        body.savedAddress !== undefined ? body.savedAddress : baseUser.savedAddress,
      updatedAt: now,
    };

    if (idx >= 0) {
      store.users[idx] = updated;
    } else {
      store.users.push(updated);
    }

    if (updated.phone) {
      store.loyalty[updated.phone] = {
        mobile_number: updated.phone,
        available_points: updated.loyaltyPoints,
        blocked: store.loyalty[updated.phone]?.blocked || {},
      };
    }
    writeStore(store);

    if (isSupabaseConfigured() && isUuid(updated.id)) {
      const sbAdmin = getSupabaseAdmin();
      if (sbAdmin) {
        await sbAdmin.from("profiles").upsert({
          id: updated.id,
          email: updated.email,
          full_name: updated.fullName,
          phone: updated.phone,
          role: updated.role,
          loyalty_points: updated.loyaltyPoints,
          game_high_score: updated.gameHighScore,
          total_runs: updated.totalRuns,
          total_distance: updated.totalDistance,
          saved_address: updated.savedAddress || null,
          updated_at: updated.updatedAt,
        });
      }
    }

    return NextResponse.json({ ok: true, user: sanitizeUser(updated) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed updating profile." },
      { status: 500 }
    );
  }
}
