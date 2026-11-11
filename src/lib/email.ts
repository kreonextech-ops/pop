import nodemailer from "nodemailer";
import { readStore, writeStore, appendWebhookLog, type StoreOrder } from "./store";

export function getGmailConfig(overrideGmailUser?: string) {
  const user = overrideGmailUser || process.env.GMAIL_USER || "";
  const pass = process.env.GMAIL_APP_PASSWORD || "";
  const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || user;
  return {
    configured: Boolean(user && pass),
    user,
    pass,
    adminNotifyEmail,
  };
}

export async function sendMail(params: {
  to: string;
  subject: string;
  html: string;
  eventTag: string;
  replyTo?: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const store = readStore();
  const cfg = getGmailConfig(store.settings.gmailUser);

  if (!cfg.configured) {
    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: params.eventTag,
      endpoint: `gmail://${params.to}`,
      httpStatus: 0,
      ok: false,
      summary: `Email skipped (GMAIL_USER / GMAIL_APP_PASSWORD not set): ${params.subject}`,
    });
    writeStore(store);
    return { ok: false, reason: "Gmail SMTP credentials not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
    });

    await transporter.sendMail({
      from: `"Pop Culture Snacks" <${cfg.user}>`,
      to: params.to,
      replyTo: params.replyTo,
      subject: params.subject,
      html: params.html,
    });

    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: params.eventTag,
      endpoint: `gmail://${params.to}`,
      httpStatus: 200,
      ok: true,
      summary: `Sent email to ${params.to}: ${params.subject}`,
    });
    writeStore(store);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed sending Gmail";
    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: params.eventTag,
      endpoint: `gmail://${params.to}`,
      httpStatus: 500,
      ok: false,
      summary: `Email failed (${params.to}): ${msg}`,
    });
    writeStore(store);
    return { ok: false, reason: msg };
  }
}

export async function sendOrderConfirmationEmails(order: StoreOrder): Promise<void> {
  const store = readStore();
  const cfg = getGmailConfig(store.settings.gmailUser);
  const itemsRows = (order.cart_data.items || [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0e4d6;">${i.name || `Variant #${i.variant_id}`}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0e4d6;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0e4d6;text-align:right;font-weight:bold;">${
            i.price ? `₹${i.price * i.quantity}` : "-"
          }</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#FFF8EE;padding:24px;color:#522C28;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px;border:2px solid #FAC537;">
        <h1 style="margin:0;color:#D73B3A;font-size:26px;">Pop Culture — Order Confirmed!</h1>
        <p style="font-size:14px;color:#522C28;">Order <strong>#${order.order_id}</strong> (${order.payment_type || "PREPAID"}) is confirmed and being prepared.</p>
        <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:13px;">
          <thead>
            <tr style="border-bottom:2px solid #522C28;">
              <th style="text-align:left;padding-bottom:6px;">Item</th>
              <th style="text-align:center;padding-bottom:6px;">Qty</th>
              <th style="text-align:right;padding-bottom:6px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div style="font-size:16px;font-weight:bold;text-align:right;color:#25100E;">
          Total Payable: ₹${order.total_amount_payable ?? order.subtotal_price ?? 0}
        </div>
        <p style="font-size:12px;color:#7a4e48;margin-top:20px;">
          The coolest way to snack better — Pop Culture Foxnuts
        </p>
      </div>
    </div>
  `;

  if (order.email) {
    await sendMail({
      to: order.email,
      subject: `Order Confirmed #${order.order_id} — Pop Culture`,
      html,
      eventTag: "GMAIL_ORDER_CONFIRMATION",
    });
  }

  const adminEmail = store.settings.adminNotifyEmail || cfg.adminNotifyEmail;
  if (adminEmail && adminEmail !== order.email) {
    await sendMail({
      to: adminEmail,
      subject: `[New Order] #${order.order_id} — ₹${order.total_amount_payable ?? 0}`,
      html,
      eventTag: "GMAIL_ADMIN_ORDER_ALERT",
    });
  }
}
