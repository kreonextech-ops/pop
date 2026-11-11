import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { order_id?: string | number; transactional_points?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = String(body.order_id || "");
  const store = readStore();

  for (const acct of Object.values(store.loyalty)) {
    const blockedPts = acct.blocked[orderId];
    if (blockedPts) {
      const restore = body.transactional_points
        ? Math.min(blockedPts, Number(body.transactional_points))
        : blockedPts;
      acct.available_points += restore;
      acct.blocked[orderId] = Math.max(0, blockedPts - restore);
      if (acct.blocked[orderId] === 0) delete acct.blocked[orderId];
    }
  }

  writeStore(store);

  return NextResponse.json({
    data: {
      status: "Success",
    },
  });
}
