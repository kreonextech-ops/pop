import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase";
import { readStore, writeStore, type StoreUser } from "@/lib/store";
import {
  createUserSessionToken,
  sanitizeUser,
  USER_COOKIE_NAME,
} from "@/lib/customerAuth";
import { sendMail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { access_token?: string };
    const accessToken = (body.access_token || "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token." }, { status: 400 });
    }

    const sbAdmin = getSupabaseAdmin();
    const sbAnon = getSupabaseAnon();
    const sbClient = sbAdmin || sbAnon;

    if (!sbClient) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const { data: userRes, error: userErr } = await sbClient.auth.getUser(accessToken);
    if (userErr || !userRes?.user) {
      return NextResponse.json(
        { error: userErr?.message || "Invalid or expired Google session." },
        { status: 401 }
      );
    }

    const authUser = userRes.user;
    const email = (authUser.email || "").toLowerCase();
    const meta = (authUser.user_metadata || {}) as Record<string, unknown>;
    const fullName =
      (meta.full_name as string) ||
      (meta.name as string) ||
      (email ? email.split("@")[0] : "Crunch Snacker");
    const phone = (meta.phone as string) || authUser.phone || "";
    const now = new Date().toISOString();

    let isBrandNew = false;
    let role: "customer" | "admin" = "customer";
    let loyaltyPoints = 50;
    let gameHighScore = 0;
    let totalRuns = 0;
    let totalDistance = 0;
    let savedAddress: StoreUser["savedAddress"] = null;
    let profileFullName = fullName;
    let profilePhone = phone;

    if (sbAdmin) {
      const { data: existingProf } = await sbAdmin
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (existingProf) {
        role = existingProf.role === "admin" ? "admin" : "customer";
        loyaltyPoints = Number(existingProf.loyalty_points) || 0;
        gameHighScore = Number(existingProf.game_high_score) || 0;
        totalRuns = Number(existingProf.total_runs) || 0;
        totalDistance = Number(existingProf.total_distance) || 0;
        savedAddress = existingProf.saved_address || null;
        profileFullName = existingProf.full_name || fullName;
        profilePhone = existingProf.phone || phone;
      } else {
        isBrandNew = true;
        await sbAdmin.from("profiles").upsert({
          id: authUser.id,
          email,
          full_name: fullName,
          phone,
          role: "customer",
          loyalty_points: 50,
        });
      }
    }

    const store = readStore();
    const existingIdx = store.users.findIndex(
      (u) => u.id === authUser.id || (email && u.email === email)
    );

    const syncedUser: StoreUser = {
      id: authUser.id,
      email,
      fullName: profileFullName,
      phone: profilePhone,
      role,
      loyaltyPoints,
      gameHighScore,
      totalRuns,
      totalDistance,
      savedAddress,
      passwordHash: existingIdx >= 0 ? store.users[existingIdx].passwordHash : "",
      createdAt: existingIdx >= 0 ? store.users[existingIdx].createdAt : now,
      updatedAt: now,
    };

    if (existingIdx >= 0) {
      store.users[existingIdx] = syncedUser;
    } else {
      isBrandNew = true;
      store.users.push(syncedUser);
    }
    writeStore(store);

    const token = createUserSessionToken(syncedUser.id);
    const response = NextResponse.json({
      ok: true,
      user: sanitizeUser(syncedUser),
    });

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    if (isBrandNew && email) {
      void sendMail({
        to: email,
        eventTag: "WELCOME_GOOGLE_SIGNUP",
        subject: "Welcome to Pop Culture — 50 Crunch Points Credited!",
        html: `
          <div style="font-family:Arial,sans-serif;background:#FFF8EE;padding:24px;color:#522C28;">
            <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:20px;padding:28px;border:2px solid #FAC537;">
              <h1 style="color:#D73B3A;margin:0 0 8px;">Welcome to Pop Culture, ${syncedUser.fullName}!</h1>
              <p>You signed in with Google! We've credited <strong>50 Welcome Crunch Points</strong> (₹50 value) to your account.</p>
              <p>Play Fox Runner on our homepage to win more Crunch Points and redeem them in your cart.</p>
              <p style="margin-top:20px;font-size:12px;color:#522C2899;">— Team Pop Culture</p>
            </div>
          </div>
        `,
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "OAuth verification failed." },
      { status: 500 }
    );
  }
}
