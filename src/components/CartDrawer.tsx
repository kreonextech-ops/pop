"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Tag,
  Loader2,
  Coins,
  Truck,
} from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

declare global {
  interface Window {
    HeadlessCheckout?: {
      addToCart: (
        event: unknown,
        token: string,
        options?: { fallbackUrl?: string; isInitiatedFromApp?: boolean }
      ) => void;
    };
  }
}

interface ShiprocketPublicConfig {
  environment: "staging" | "production";
  configured: boolean;
  sellerDomain: string;
  checkoutScriptUrl: string;
  checkoutCssUrl: string;
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalCount,
    subtotal,
    totalSavings,
  } = useCart();

  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [config, setConfig] = useState<ShiprocketPublicConfig | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Demo fallback checkout form when Shiprocket API credentials are not yet configured
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoCustomer, setDemoCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    payment_type: "PREPAID" as "PREPAID" | "CASH_ON_DELIVERY",
  });

  useEffect(() => {
    if (!user) return;
    setDemoCustomer((prev) => ({
      ...prev,
      name: prev.name || user.fullName || "",
      phone: prev.phone || user.phone || "",
      email: prev.email || user.email || "",
      address: prev.address || user.savedAddress?.line1 || "",
      city: prev.city || user.savedAddress?.city || "",
      pincode: prev.pincode || user.savedAddress?.pincode || "",
    }));
  }, [user]);

  useEffect(() => {
    let loaded = false;
    let idleId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const loadShiprocket = () => {
      if (loaded) return;
      loaded = true;
      fetch("/api/shiprocket/config")
        .then((r) => r.json())
        .then((data: ShiprocketPublicConfig) => {
          setConfig(data);

          // Inject Shiprocket Checkout CSS & JS once
          if (data.checkoutCssUrl && !document.querySelector(`link[href="${data.checkoutCssUrl}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = data.checkoutCssUrl;
            document.head.appendChild(link);
          }
          if (data.checkoutScriptUrl && !document.querySelector(`script[src="${data.checkoutScriptUrl}"]`)) {
            const script = document.createElement("script");
            script.src = data.checkoutScriptUrl;
            script.async = true;
            document.body.appendChild(script);
          }
        })
        .catch(() => {
          // silent fallback
        });
    };

    if (isCartOpen) {
      loadShiprocket();
      return;
    }

    const winWithIdle = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof winWithIdle.requestIdleCallback === "function") {
      idleId = winWithIdle.requestIdleCallback(loadShiprocket, { timeout: 3500 });
    } else {
      timerId = setTimeout(loadShiprocket, 2600);
    }

    return () => {
      if (idleId !== null && typeof winWithIdle.cancelIdleCallback === "function") {
        winWithIdle.cancelIdleCallback(idleId);
      }
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [isCartOpen]);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    setCheckoutError(null);
    setCouponMessage(null);
    if (!code) {
      setAppliedDiscount(0);
      return;
    }

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedDiscount(data.discount || 0);
        setCouponMessage(data.message || `${code} applied!`);
      } else {
        setAppliedDiscount(0);
        setCheckoutError(data.error || "Invalid coupon code");
      }
    } catch {
      setCheckoutError("Could not validate coupon.");
    }
  };

  const afterCoupon = Math.max(0, subtotal - appliedDiscount);
  const maxRedeemablePoints =
    user && user.loyaltyPoints > 0
      ? Math.min(user.loyaltyPoints, Math.floor(afterCoupon * 0.2))
      : 0;
  const pointsDiscount = redeemPoints ? maxRedeemablePoints : 0;
  const finalTotal = Math.max(0, afterCoupon - pointsDiscount);

  const handleShiprocketCheckout = async (e: React.MouseEvent) => {
    if (items.length === 0) return;
    setLoadingCheckout(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/shiprocket/checkout-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variant_id: i.variantId,
            quantity: i.quantity,
            name: `${i.name} (${i.variantLabel})`,
            price: i.price,
            image_url: i.image,
          })),
          coupon_code: appliedDiscount > 0 ? couponCode.trim().toUpperCase() : undefined,
          discount_amount: appliedDiscount,
          redeem_points: redeemPoints,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setCheckoutError(data.error || "Unable to initiate checkout");
        setLoadingCheckout(false);
        return;
      }

      if (data.mode === "shiprocket" && data.token) {
        if (window.HeadlessCheckout?.addToCart) {
          closeCart();
          window.HeadlessCheckout.addToCart(e.nativeEvent, data.token, {
            fallbackUrl: data.fallbackUrl,
            isInitiatedFromApp: true,
          });
        } else {
          setCheckoutError(
            "Shiprocket checkout script is still loading or blocked. Redirecting to fallback..."
          );
          if (data.fallbackUrl) router.push(data.fallbackUrl);
        }
      } else {
        // Credentials not set yet -> reveal Sandbox Demo Checkout form
        setShowDemoForm(true);
      }
    } catch {
      setCheckoutError("Network error while initiating checkout.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCheckout(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/shiprocket/checkout-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variant_id: i.variantId,
            quantity: i.quantity,
            name: `${i.name} (${i.variantLabel})`,
            price: i.price,
            image_url: i.image,
          })),
          coupon_code: appliedDiscount > 0 ? couponCode.trim().toUpperCase() : undefined,
          discount_amount: appliedDiscount,
          redeem_points: redeemPoints,
          demo_confirm: true,
          customer: demoCustomer,
        }),
      });
      const data = await res.json();
      if (data.ok && data.fallbackUrl) {
        await refreshUser();
        setShowDemoForm(false);
        closeCart();
        router.push(data.fallbackUrl);
      } else {
        setCheckoutError(data.error || "Failed to place sandbox order");
      }
    } catch {
      setCheckoutError("Network error placing order");
    } finally {
      setLoadingCheckout(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isCartOpen) {
      window.__lenis?.stop();
    } else {
      window.__lenis?.start();
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (isCartOpen) {
        window.__lenis?.start();
      }
    };
  }, [isCartOpen, closeCart]);

  return (
    <>
      <input
        type="hidden"
        id="sellerDomain"
        value={config?.sellerDomain || "localhost:3001"}
      />

      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden={!isCartOpen}
        className={`fixed inset-0 bg-[#25100E]/60 backdrop-blur-xs z-[90] transition-opacity duration-300 ease-out will-change-[opacity] ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over Cart Panel */}
      <aside
        aria-hidden={!isCartOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FFF8EE] text-[#522C28] z-[100] shadow-2xl border-l-2 border-[#522C28]/15 flex flex-col transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          isCartOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#522C28]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D73B3A] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display text-xl uppercase text-[#25100E] leading-none">
                Your Munch Box
              </h2>
              <p className="text-[11px] font-bold text-[#522C28]/70 mt-0.5">
                {totalCount} {totalCount === 1 ? "item" : "items"} ready to crunch
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close Cart"
            className="w-8 h-8 rounded-full bg-[#FFF8EE] hover:bg-[#FAECE7] text-[#522C28] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Free Delivery Progress Bar (Above ₹699+) */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-[#FFF3E3] border-b border-[#522C28]/10">
            <div className="flex items-center justify-between text-[11px] font-black text-[#25100E]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#3CA837]" />
                {subtotal > 699 ? (
                  <span className="text-[#2D6A4F]">You&apos;ve unlocked FREE delivery!</span>
                ) : (
                  <span>
                    Add ₹{700 - subtotal} more for{" "}
                    <span className="text-[#D73B3A]">FREE delivery</span> above ₹699+
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold text-[#522C28]/70">
                {Math.min(100, Math.round((subtotal / 700) * 100))}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#522C28]/10 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.round((subtotal / 700) * 100))}%` }}
                className={`h-full rounded-full transition-all duration-300 ${
                  subtotal > 699 ? "bg-[#3CA837]" : "bg-[#D73B3A]"
                }`}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#FAECE7] flex items-center justify-center text-4xl mb-4">
                🍿
              </div>
              <h3 className="font-display text-2xl uppercase text-[#25100E]">
                Your Munch Box is Empty
              </h3>
              <p className="text-xs font-medium text-[#522C28]/75 mt-1 max-w-xs">
                Explore our slow-roasted signature flavours and value combo boxes!
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-5 px-6 py-2.5 rounded-full bg-[#D73B3A] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#ED0006] transition-colors"
              >
                Browse The Shop
              </Link>
            </div>
          ) : showDemoForm ? (
            <form onSubmit={handleDemoSubmit} className="space-y-3 bg-white p-4 rounded-2xl border border-[#522C28]/15">
              <div className="flex items-center justify-between pb-2 border-b border-[#522C28]/10">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FAC537] text-[#25100E] text-[10px] font-black uppercase">
                    Sandbox Checkout Mode
                  </span>
                  <p className="text-[11px] text-[#522C28]/75 font-medium mt-1">
                    Shiprocket keys not configured yet — place a local test order or add keys in{" "}
                    <Link href="/admin" onClick={closeCart} className="underline font-bold text-[#D73B3A]">
                      Admin
                    </Link>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoForm(false)}
                  className="text-xs font-bold text-[#D73B3A] underline cursor-pointer"
                >
                  Back
                </button>
              </div>

              <input
                required
                placeholder="Full Name"
                value={demoCustomer.name}
                onChange={(e) => setDemoCustomer({ ...demoCustomer, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 text-xs font-semibold bg-[#FFF8EE]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="Phone (10 digits)"
                  value={demoCustomer.phone}
                  onChange={(e) => setDemoCustomer({ ...demoCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 text-xs font-semibold bg-[#FFF8EE]"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={demoCustomer.email}
                  onChange={(e) => setDemoCustomer({ ...demoCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 text-xs font-semibold bg-[#FFF8EE]"
                />
              </div>
              <input
                required
                placeholder="Street Address"
                value={demoCustomer.address}
                onChange={(e) => setDemoCustomer({ ...demoCustomer, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 text-xs font-semibold bg-[#FFF8EE]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="City"
                  value={demoCustomer.city}
                  onChange={(e) => setDemoCustomer({ ...demoCustomer, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 text-xs font-semibold bg-[#FFF8EE]"
                />
                <input
                  required
                  placeholder="Pincode"
                  value={demoCustomer.pincode}
                  onChange={(e) => setDemoCustomer({ ...demoCustomer, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 text-xs font-semibold bg-[#FFF8EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(["PREPAID", "CASH_ON_DELIVERY"] as const).map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setDemoCustomer({ ...demoCustomer, payment_type: pt })}
                    className={`py-2 rounded-xl text-[11px] font-black uppercase border cursor-pointer ${
                      demoCustomer.payment_type === pt
                        ? "bg-[#25100E] text-[#FAC537] border-[#25100E]"
                        : "bg-white text-[#522C28] border-[#522C28]/20"
                    }`}
                  >
                    {pt === "PREPAID" ? "UPI / Card (Prepaid)" : "Cash On Delivery"}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loadingCheckout}
                className="w-full py-3 rounded-full bg-[#3CA837] hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingCheckout ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Place Sandbox Order (₹{finalTotal})</span>
              </button>
            </form>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="p-3.5 rounded-2xl bg-white border border-[#522C28]/15 shadow-xs flex items-center gap-3.5"
                >
                  <div className="w-16 h-20 rounded-xl bg-[#FFF8EE] flex items-center justify-center p-1.5 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display text-sm uppercase text-[#25100E] leading-tight truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-[#522C28]/70">
                          {item.variantLabel}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        aria-label="Remove item"
                        className="text-[#522C28]/40 hover:text-[#D73B3A] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-[#522C28]/20 bg-[#FFF8EE] p-0.5">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-black text-[#25100E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-[#25100E]">
                          ₹{item.price * item.quantity}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="block text-[10px] text-[#522C28]/50 line-through font-bold">
                            ₹{item.originalPrice * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Input */}
              <div className="p-3 rounded-2xl bg-white border border-[#522C28]/15 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D73B3A] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Coupon code (try POP10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs font-bold bg-transparent outline-none uppercase placeholder:normal-case"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-1.5 rounded-full bg-[#25100E] text-[#FAC537] text-[10px] font-black uppercase cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className="text-[11px] font-bold text-[#3CA837] px-1">✓ {couponMessage}</p>
              )}

              {/* Crunch Points Redemption */}
              {user ? (
                <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#FAC537] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Coins className="w-4 h-4 text-[#D73B3A] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#25100E]">
                        Use Crunch Points ({user.loyaltyPoints} available)
                      </p>
                      <p className="text-[10px] font-bold text-[#522C28]/70">
                        {maxRedeemablePoints > 0
                          ? `Save ₹${maxRedeemablePoints} on this order (up to 20% off)`
                          : "Add items or earn points in Fox Runner"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={maxRedeemablePoints === 0}
                    onClick={() => setRedeemPoints((v) => !v)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase cursor-pointer disabled:opacity-40 ${
                      redeemPoints
                        ? "bg-[#3CA837] text-white"
                        : "bg-[#FAC537] text-[#522C28]"
                    }`}
                  >
                    {redeemPoints ? `Applied -₹${pointsDiscount}` : "Redeem"}
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/80 border border-[#522C28]/10 text-[11px] font-bold text-[#522C28]/80 flex items-center justify-between">
                  <span>Have Crunch Points from Fox Runner?</span>
                  <Link href="/login" onClick={closeCart} className="text-[#D73B3A] font-black underline">
                    Sign In
                  </Link>
                </div>
              )}
            </>
          )}

          {checkoutError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
              {checkoutError}
            </div>
          )}
        </div>

        {/* Footer Totals & Checkout CTA */}
        {items.length > 0 && !showDemoForm && (
          <div className="p-5 bg-white border-t border-[#522C28]/15 space-y-3">
            <div className="space-y-1 text-xs font-bold">
              <div className="flex justify-between text-[#522C28]/80">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {(totalSavings > 0 || appliedDiscount > 0 || pointsDiscount > 0) && (
                <div className="flex justify-between text-[#3CA837]">
                  <span>Total Savings {pointsDiscount > 0 ? "(incl. Points)" : ""}</span>
                  <span>-₹{totalSavings + appliedDiscount + pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#25100E] pt-1.5 border-t border-[#522C28]/10">
                <span>Total Payable</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleShiprocketCheckout}
              disabled={loadingCheckout}
              className="w-full py-3.5 rounded-full bg-[#25100E] hover:bg-[#1A0A09] text-[#FAC537] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#FAC537]/60 transition-[transform,background-color] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-98"
            >
              {loadingCheckout ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-[#FAC537]" />
              )}
              <span>
                {config?.configured
                  ? `Checkout via Shiprocket (₹${finalTotal})`
                  : `Proceed to Checkout (₹${finalTotal})`}
              </span>
            </button>

            <p className="text-[10px] text-center font-semibold text-[#522C28]/70 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3CA837]" />
              <span>
                {config?.configured
                  ? `Secured by Shiprocket Checkout (${config.environment})`
                  : "1-Click UPI, Cards & COD Ready"}
              </span>
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
