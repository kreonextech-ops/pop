import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name.split(".").pop() || "png").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    // 1. Try Supabase Storage first if configured
    if (isSupabaseConfigured()) {
      const sbAdmin = getSupabaseAdmin();
      if (sbAdmin) {
        const { error } = await sbAdmin.storage
          .from("product-images")
          .upload(filename, buffer, {
            contentType: file.type || "image/png",
            upsert: true,
          });
        if (!error) {
          const { data: pub } = sbAdmin.storage
            .from("product-images")
            .getPublicUrl(filename);
          if (pub?.publicUrl) {
            return NextResponse.json({ ok: true, url: pub.publicUrl, storage: "supabase" });
          }
        }
      }
    }

    // 2. Fallback to local public/uploads/ for immediate rendering
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({
      ok: true,
      url: `/uploads/${filename}`,
      storage: "local",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 }
    );
  }
}
