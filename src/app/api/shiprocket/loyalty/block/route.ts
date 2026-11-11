import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { mobile_number?: string; transactional_points?: number; order_id?: string | number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const mobile = String(body.mobile_number || "").trim();
  const points = Math.max(0, Number(body.transactional_points || 0));
  const orderId = String(body.order_id || "");

  const store = readStore();
  const acct = store.loyalty[mobile];

  if (!acct || acct.available_points < points) {
    return NextResponse.json({
      data: {
        status: false,
        available_points: acct?.available_points || 0,
        message: "Insufficient loyalty points",
        debited_points: 0,
        transaction_id: orderId,
        discount_value: 0,
        additional_properties: { redemptionFactor: 1 },
      },
    });
  }

  acct.available_points -= points;
  acct.blocked[orderId] = (acct.blocked[orderId] || 0) + points;
  writeStore(store);

  return NextResponse.json({
    data: {
      status: true,
      available_points: acct.available_points,
      message: "Valid Customer Id",
      debited_points: points,
      transaction_id: orderId,
      discount_value: points,
      additional_properties: { redemptionFactor: 1 },
    },
  });
}
