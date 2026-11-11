import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { mobile_number?: string; cart_value?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const mobile = String(body.mobile_number || "").trim();
  const cartValue = Number(body.cart_value || 0);
  const store = readStore();

  const acct = store.loyalty[mobile];
  const available = acct ? acct.available_points : 0;
  // Allow redeeming up to 20% of cart value (min 0, max available)
  const maxRedeemable = Math.floor(cartValue * 0.2);
  const applicable = Math.min(available, maxRedeemable > 0 ? maxRedeemable : available);

  return NextResponse.json({
    data: {
      mobile_number: mobile,
      available_points: available,
      applicable_points: applicable,
    },
  });
}
