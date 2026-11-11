import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/customerAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(USER_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
