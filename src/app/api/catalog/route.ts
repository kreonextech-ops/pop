import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = readStore();
  const activeProducts = store.products.filter((p) => p.status === "active");
  return NextResponse.json({
    ok: true,
    products: activeProducts,
    collections: store.collections,
  });
}
