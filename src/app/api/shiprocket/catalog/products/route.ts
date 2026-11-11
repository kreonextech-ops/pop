import { NextResponse } from "next/server";
import {
  readStore,
  formatShiprocketProduct,
  getOriginFromRequest,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(250, Math.max(1, parseInt(searchParams.get("limit") || "100", 10) || 100));

  const store = readStore();
  const origin = getOriginFromRequest(req, store.settings.sellerDomain);
  const activeProducts = store.products.filter((p) => p.status === "active");
  const total = activeProducts.length;
  const start = (page - 1) * limit;
  const sliced = activeProducts.slice(start, start + limit);

  return NextResponse.json({
    data: {
      total,
      products: sliced.map((p) => formatShiprocketProduct(p, origin)),
    },
  });
}
