import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, sanitizeUser } from "@/lib/customerAuth";
import { readStore, writeStore } from "@/lib/store";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null, orders: [] });
  }

  const store = readStore();
  const userEmail = user.email.toLowerCase();
  const orders = store.orders.filter(
    (o) =>
      o.user_id === user.id ||
      (o.email && o.email.toLowerCase() === userEmail) ||
      (user.phone && o.phone && o.phone.replace(/\D/g, "").slice(-10) === user.phone.replace(/\D/g, "").slice(-10))
  );

  const recentRuns = (store.gameRuns || [])
    .filter((r) => r.userId === user.id)
    .slice(0, 10);

  return NextResponse.json({
    user: sanitizeUser(user),
    orders,
    recentRuns,
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

    const store = readStore();
    const idx = store.users.findIndex((u) => u.id === user.id);
    if (idx === -1) {
      return NextResponse.json({ error: "User record not found." }, { status: 404 });
    }

    const updated = {
      ...store.users[idx],
      fullName: body.fullName !== undefined ? body.fullName.trim() : store.users[idx].fullName,
      phone: body.phone !== undefined ? body.phone.trim() : store.users[idx].phone,
      savedAddress:
        body.savedAddress !== undefined ? body.savedAddress : store.users[idx].savedAddress,
      updatedAt: new Date().toISOString(),
    };

    store.users[idx] = updated;
    if (updated.phone) {
      store.loyalty[updated.phone] = {
        mobile_number: updated.phone,
        available_points: updated.loyaltyPoints,
        blocked: store.loyalty[updated.phone]?.blocked || {},
      };
    }
    writeStore(store);

    if (isSupabaseConfigured()) {
      const sbAdmin = getSupabaseAdmin();
      if (sbAdmin) {
        await sbAdmin
          .from("profiles")
          .update({
            full_name: updated.fullName,
            phone: updated.phone,
            saved_address: updated.savedAddress,
            updated_at: updated.updatedAt,
          })
          .eq("id", updated.id);
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
