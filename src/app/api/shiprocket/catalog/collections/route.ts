import { NextResponse } from "next/server";
import {
  readStore,
  formatShiprocketCollection,
  getOriginFromRequest,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(250, Math.max(1, parseInt(searchParams.get("limit") || "100", 10) || 100));

  const store = readStore();
  const origin = getOriginFromRequest(req, store.settings.sellerDomain);
  const total = store.collections.length;
  const start = (page - 1) * limit;
  const sliced = store.collections.slice(start, start + limit);

  return NextResponse.json({
    data: {
      total,
      collections: sliced.map((c) => formatShiprocketCollection(c, origin)),
    },
  });
}
