import { NextRequest, NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; subtotal?: number };
    const code = (body.code || "").trim().toUpperCase();
    const subtotal = Math.max(0, Number(body.subtotal) || 0);

    if (!code) {
      return NextResponse.json({ valid: false, error: "Enter a promo code." }, { status: 400 });
    }

    const store = readStore();
    const coupon = (store.coupons || []).find(
      (c) => c.code.toUpperCase() === code && c.active
    );

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Invalid or inactive coupon code." },
        { status: 404 }
      );
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          error: `Add ₹${coupon.minOrder - subtotal} more to unlock ${coupon.code} (min order ₹${coupon.minOrder}).`,
        },
        { status: 400 }
      );
    }

    let discount =
      coupon.discountType === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;

    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discount,
      message:
        coupon.discountType === "percent"
          ? `${coupon.code} applied — ${coupon.value}% off (₹${discount} saved)`
          : `${coupon.code} applied — ₹${discount} off`,
    });
  } catch (err) {
    return NextResponse.json(
      { valid: false, error: err instanceof Error ? err.message : "Failed validating coupon." },
      { status: 500 }
    );
  }
}
