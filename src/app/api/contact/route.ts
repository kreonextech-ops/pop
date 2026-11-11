import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, sendMail } from "@/lib/email";
import { readStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const subject = (body.subject || "Website Inquiry").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !email.includes("@") || !message) {
      return NextResponse.json(
        { error: "Name, valid email, and message are required." },
        { status: 400 }
      );
    }

    const store = readStore();
    const cfg = getGmailConfig(store.settings.gmailUser);
    const targetEmail = store.settings.adminNotifyEmail || cfg.adminNotifyEmail || "care@popculture.in";

    const mailRes = await sendMail({
      to: targetEmail,
      replyTo: email,
      eventTag: "CONTACT_FORM",
      subject: `[Pop Culture Contact] ${subject} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#FFF8EE;padding:20px;color:#522C28;">
          <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:16px;padding:24px;border:1px solid #522C2822;">
            <h2 style="margin:0 0 12px;color:#D73B3A;">New Customer Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
            <p style="white-space:pre-line;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      deliveredViaEmail: mailRes.ok,
      message: mailRes.ok
        ? "Message sent! Our team will reply shortly."
        : "Message logged! (Configure Gmail SMTP in Admin Settings to deliver directly to inbox.)",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed sending message." },
      { status: 500 }
    );
  }
}
