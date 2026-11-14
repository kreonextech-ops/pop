import { NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  appendWebhookLog,
  getOriginFromRequest,
  toAbsoluteImageUrl,
  type StoreOrder,
} from "@/lib/store";
import { callShiprocketApi, getShiprocketAssets } from "@/lib/shiprocket";
import { getCurrentUser } from "@/lib/customerAuth";
import { sendOrderConfirmationEmails } from "@/lib/email";
import {
  syncOrderToSupabase,
  syncProfilePointsToSupabase,
} from "@/lib/supabaseOrders";

export const dynamic = "force-dynamic";

interface CheckoutItemInput {
  variant_id: number | string;
  quantity: number;
  name?: string;
  price?: number;
  image_url?: string;
}

export async function POST(req: Request) {
  let body: {
    items?: CheckoutItemInput[];
    coupon_code?: string;
    discount_amount?: number;
    redeem_points?: boolean;
    custom_attributes?: Record<string, string>;
    demo_confirm?: boolean;
    customer?: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      city?: string;
      pincode?: string;
      payment_type?: "PREPAID" | "CASH_ON_DELIVERY";
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request JSON" }, { status: 400 });
  }

  const items = body.items || [];
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
  }

  const store = readStore();
  const origin = getOriginFromRequest(req, store.settings.sellerDomain);
  const redirectBase = store.settings.redirectBaseUrl || origin;
  const redirectUrl = `${redirectBase.replace(/\/$/, "")}/checkout/status`;
  const assets = getShiprocketAssets(store.settings.environment);
  const now = new Date().toISOString();

  // Resolve authoritative prices/titles/images from catalog if variant matches
  let computedSubtotal = 0;
  const normalizedItems = items.map((item) => {
    const vidStr = String(item.variant_id);
    let matchedName = item.name || "Pop Culture Makhana";
    let matchedPrice = typeof item.price === "number" ? item.price : 149;
    let matchedImage = item.image_url || "/packets/peri peri.svg";

    for (const p of store.products) {
      const v = p.variants.find((vr) => String(vr.id) === vidStr);
      if (v) {
        matchedName = `${p.title} — ${v.title}`;
        matchedPrice = parseFloat(v.price) || matchedPrice;
        matchedImage = v.image || p.image || matchedImage;
        break;
      }
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    computedSubtotal += matchedPrice * qty;

    return {
      variant_id: vidStr,
      quantity: qty,
      catalog_data: {
        price: matchedPrice,
        name: matchedName,
        image_url: toAbsoluteImageUrl(matchedImage, origin),
      },
    };
  });

  // Server-side coupon validation & Crunch Points redemption
  const currentUser = await getCurrentUser();
  let couponDiscount = 0;
  let validatedCouponCode = "";
  const requestedCode = (body.coupon_code || "").trim().toUpperCase();
  if (requestedCode) {
    const coupon = (store.coupons || []).find(
      (c) => c.code.toUpperCase() === requestedCode && c.active
    );
    if (coupon && computedSubtotal >= coupon.minOrder) {
      couponDiscount =
        coupon.discountType === "percent"
          ? Math.round((computedSubtotal * coupon.value) / 100)
          : coupon.value;
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      }
      couponDiscount = Math.min(couponDiscount, computedSubtotal);
      validatedCouponCode = coupon.code;
    }
  } else if (typeof body.discount_amount === "number" && body.discount_amount > 0) {
    couponDiscount = Math.min(computedSubtotal, Math.max(0, body.discount_amount));
  }

  let pointsRedeemed = 0;
  const afterCoupon = Math.max(0, computedSubtotal - couponDiscount);
  if (body.redeem_points && currentUser && currentUser.loyaltyPoints > 0 && afterCoupon > 0) {
    // Allow redeeming up to 20% of subtotal with Crunch Points (1 pt = ₹1)
    const maxRedeem = Math.floor(afterCoupon * 0.2);
    pointsRedeemed = Math.min(currentUser.loyaltyPoints, maxRedeem);
  }

  const discountAmt = couponDiscount + pointsRedeemed;
  const payableAmount = Math.max(0, computedSubtotal - discountAmt);

  const { environment, apiKey, apiSecret, sellerDomain } = store.settings;

  // If Shiprocket credentials are configured and caller did not request local demo mode:
  if (apiKey && apiSecret && !body.demo_confirm) {
    const srPayload: Record<string, unknown> = {
      cart_data: {
        items: normalizedItems,
        ...(body.coupon_code && discountAmt > 0
          ? {
              cart_discount: {
                coupon_code: body.coupon_code,
                amount: discountAmt,
              },
            }
          : {}),
        custom_attributes: {
          platform: "pop-culture-nextjs",
          ...(body.custom_attributes || {}),
        },
        mobile_app: false,
      },
      redirect_url: redirectUrl,
      timestamp: now,
    };

    const res = await callShiprocketApi<{
      ok?: boolean;
      result?: {
        token?: string;
        expires_at?: string;
        data?: { order_id?: string };
      };
      error?: unknown;
    }>({
      env: environment,
      apiKey,
      apiSecret,
      path: "/api/v1/access-token/checkout",
      payload: srPayload,
    });

    appendWebhookLog(store, {
      direction: "OUTBOUND",
      event: "CHECKOUT_ACCESS_TOKEN",
      endpoint: "/api/v1/access-token/checkout",
      httpStatus: res.status,
      ok: res.ok && Boolean(res.data?.result?.token),
      summary: res.ok
        ? `Generated Shiprocket checkout token for ₹${payableAmount}`
        : `Token failed (${res.status}): ${res.error || "Unknown error"}`,
    });

    if (!res.ok || !res.data?.result?.token) {
      writeStore(store);
      return NextResponse.json(
        {
          ok: false,
          error:
            res.error ||
            "Shiprocket did not return a checkout token. Verify your API Key, Secret Key, and synced catalog.",
          details: res.data,
        },
        { status: 502 }
      );
    }

    const srOrderId = res.data.result.data?.order_id || `sr_${Date.now()}`;

    const newOrder: StoreOrder = {
      order_id: srOrderId,
      user_id: currentUser?.id || null,
      email: currentUser?.email || body.customer?.email || null,
      phone: currentUser?.phone || body.customer?.phone || null,
      status: "INITIATED",
      subtotal_price: computedSubtotal,
      total_discount: discountAmt,
      loyalty_points_applied: pointsRedeemed,
      total_amount_payable: payableAmount,
      coupon_codes: validatedCouponCode ? [validatedCouponCode] : [],
      cart_data: {
        items: normalizedItems.map((it) => ({
          variant_id: it.variant_id,
          quantity: it.quantity,
          name: it.catalog_data.name,
          price: it.catalog_data.price,
        })),
      },
      redirect_url: redirectUrl,
      isDemo: false,
      created_at: now,
      updated_at: now,
    };

    store.orders.unshift(newOrder);
    writeStore(store);
    await syncOrderToSupabase(newOrder);

    return NextResponse.json({
      ok: true,
      mode: "shiprocket",
      environment,
      token: res.data.result.token,
      expires_at: res.data.result.expires_at,
      order_id: srOrderId,
      sellerDomain: sellerDomain || "localhost:3001",
      checkoutScriptUrl: assets.jsUrl,
      checkoutCssUrl: assets.cssUrl,
      fallbackUrl: `${redirectUrl}?oid=${encodeURIComponent(srOrderId)}&ost=INITIATED`,
    });
  }

  // Fallback Demo Checkout Mode (when Shiprocket API keys are not yet added)
  const demoOrderId = `PC-${Date.now().toString().slice(-8)}`;
  const customer = body.customer || {};
  const demoStatus = body.demo_confirm ? "SUCCESS" : "INITIATED";

  const demoOrder: StoreOrder = {
    order_id: demoOrderId,
    user_id: currentUser?.id || null,
    fastrr_order_id: `DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
    platform_order_id: demoOrderId,
    status: demoStatus,
    source: "web",
    payment_type: customer.payment_type || "PREPAID",
    payment_status: demoStatus === "SUCCESS" ? "Success" : "Pending",
    phone: customer.phone || currentUser?.phone || "9999999999",
    email: customer.email || currentUser?.email || "guest@popculture.in",
    shipping_plan: "Express",
    shipping_charges: 0,
    subtotal_price: computedSubtotal,
    coupon_codes: validatedCouponCode ? [validatedCouponCode] : [],
    coupon_discount: couponDiscount,
    loyalty_points_applied: pointsRedeemed,
    total_discount: discountAmt,
    total_amount_payable: payableAmount,
    rto_prediction: "low",
    shipping_address: customer.name
      ? {
          first_name: customer.name,
          line1: customer.address || "123 Snack Street",
          city: customer.city || "Siliguri",
          pincode: customer.pincode || "734001",
          country: "India",
          country_code: "IN",
          phone: customer.phone || "9999999999",
          email: customer.email || "guest@popculture.in",
        }
      : null,
    cart_data: {
      items: normalizedItems.map((it) => ({
        variant_id: it.variant_id,
        quantity: it.quantity,
        name: it.catalog_data.name,
        price: it.catalog_data.price,
      })),
    },
    redirect_url: redirectUrl,
    isDemo: true,
    stockDeducted: false,
    created_at: now,
    updated_at: now,
  };

  if (demoStatus === "SUCCESS") {
    for (const item of demoOrder.cart_data.items) {
      const vid = Number(item.variant_id);
      for (const prod of store.products) {
        const variant = prod.variants.find((v) => v.id === vid);
        if (variant) {
          variant.quantity = Math.max(0, variant.quantity - item.quantity);
          variant.updated_at = now;
        }
      }
    }
    demoOrder.stockDeducted = true;

    // Deduct redeemed Crunch Points and credit cashback reward (1 pt per ₹20 spent)
    if (currentUser) {
      const earned = Math.floor(payableAmount / 20);
      const nextPts = Math.max(0, currentUser.loyaltyPoints - pointsRedeemed + earned);
      const uIdx = store.users.findIndex((u) => u.id === currentUser.id);
      if (uIdx !== -1) {
        store.users[uIdx].loyaltyPoints = nextPts;
        store.users[uIdx].updatedAt = now;
      }
      await syncProfilePointsToSupabase(currentUser.id, nextPts);
    }
  }

  store.orders.unshift(demoOrder);
  appendWebhookLog(store, {
    direction: "OUTBOUND",
    event: "DEMO_CHECKOUT",
    endpoint: "/api/shiprocket/checkout-token",
    httpStatus: 200,
    ok: true,
    summary: `Demo checkout order ${demoOrderId} created (${demoStatus}) for ₹${payableAmount}`,
  });
  writeStore(store);
  await syncOrderToSupabase(demoOrder);

  if (demoStatus === "SUCCESS") {
    await sendOrderConfirmationEmails(demoOrder);
  }

  return NextResponse.json({
    ok: true,
    mode: "demo",
    environment,
    order_id: demoOrderId,
    status: demoStatus,
    fallbackUrl: `/checkout/status?oid=${encodeURIComponent(demoOrderId)}&ost=${demoStatus}&demo=1`,
  });
}
