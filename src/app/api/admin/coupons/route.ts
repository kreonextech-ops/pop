import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { readStore, writeStore, type StoreCoupon } from "@/lib/store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = readStore();
  return NextResponse.json({ coupons: store.coupons || [] });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<StoreCoupon>;
    const code = (body.code || "").trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const store = readStore();
    if ((store.coupons || []).some((c) => c.code.toUpperCase() === code)) {
      return NextResponse.json({ error: `Coupon ${code} already exists.` }, { status: 409 });
    }

    const coupon: StoreCoupon = {
      code,
      discountType: body.discountType === "fixed" ? "fixed" : "percent",
      value: Math.max(1, Number(body.value) || 10),
      minOrder: Math.max(0, Number(body.minOrder) || 0),
      maxDiscount: body.maxDiscount ? Math.max(0, Number(body.maxDiscount)) : null,
      active: body.active !== false,
      createdAt: new Date().toISOString(),
    };

    store.coupons = [coupon, ...(store.coupons || [])];
    writeStore(store);

    return NextResponse.json({ ok: true, coupon, coupons: store.coupons });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed creating coupon." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { code: string; active?: boolean };
    const code = (body.code || "").trim().toUpperCase();
    const store = readStore();
    const idx = (store.coupons || []).findIndex((c) => c.code.toUpperCase() === code);
    if (idx === -1) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }

    store.coupons[idx] = {
      ...store.coupons[idx],
      active: body.active !== undefined ? Boolean(body.active) : !store.coupons[idx].active,
    };
    writeStore(store);
    return NextResponse.json({ ok: true, coupons: store.coupons });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed updating coupon." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const code = (req.nextUrl.searchParams.get("code") || "").trim().toUpperCase();
  const store = readStore();
  store.coupons = (store.coupons || []).filter((c) => c.code.toUpperCase() !== code);
  writeStore(store);
  return NextResponse.json({ ok: true, coupons: store.coupons });
}
