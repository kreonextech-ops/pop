import { NextRequest, NextResponse } from "next/server";
import {
  loginUser,
  createUserSessionToken,
  sanitizeUser,
  USER_COOKIE_NAME,
} from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const res = await loginUser({ email, password });
    if (!res.ok || !res.user) {
      return NextResponse.json({ error: res.error || "Invalid credentials." }, { status: 401 });
    }

    const token = createUserSessionToken(res.user);
    const response = NextResponse.json({
      ok: true,
      user: sanitizeUser(res.user),
    });

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed." },
      { status: 500 }
    );
  }
}
