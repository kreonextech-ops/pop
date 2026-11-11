import { NextRequest, NextResponse } from "next/server";
import {
  registerUser,
  createUserSessionToken,
  sanitizeUser,
  USER_COOKIE_NAME,
} from "@/lib/customerAuth";
import { sendMail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      fullName?: string;
      phone?: string;
    };

    const email = (body.email || "").trim();
    const password = body.password || "";
    const fullName = (body.fullName || "").trim();
    const phone = (body.phone || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const res = await registerUser({ email, password, fullName, phone });
    if (!res.ok || !res.user) {
      return NextResponse.json({ error: res.error || "Unable to register." }, { status: 400 });
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

    // Fire welcome email non-blocking if Gmail is configured
    void sendMail({
      to: res.user.email,
      eventTag: "WELCOME_EMAIL",
      subject: "Welcome to Pop Culture — Here are 50 Crunch Points!",
      html: `
        <div style="font-family:Arial,sans-serif;background:#FFF8EE;padding:24px;color:#522C28;">
          <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:20px;padding:28px;border:2px solid #FAC537;">
            <h1 style="color:#D73B3A;margin:0 0 8px;">Welcome to the Crunch Club, ${res.user.fullName}!</h1>
            <p>Your account is ready. We've credited <strong>50 Welcome Crunch Points</strong> (₹50 value) to your wallet.</p>
            <p>Play the <strong>Pop Culture Fox Runner</strong> game on our homepage to win even more Crunch Points and redeem them right in your cart!</p>
            <p style="margin-top:20px;font-size:12px;color:#522C2899;">— Team Pop Culture</p>
          </div>
        </div>
      `,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Registration failed." },
      { status: 500 }
    );
  }
}
