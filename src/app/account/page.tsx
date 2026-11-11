"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Coins,
  Trophy,
  Package,
  MapPin,
  LogOut,
  Save,
  Gamepad2,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  RefreshCw,
  Tag,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  LayoutDashboard,
  Clock,
  IndianRupee,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "@/components/CartContext";
import type { StoreCoupon, StoreGameRun, StoreOrder } from "@/lib/store";

type DashboardTab = "overview" | "orders" | "profile" | "rewards";
type OrderFilter = "all" | "active" | "completed";

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
  totalSaved: number;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const { addItem } = useCart();

  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [recentRuns, setRecentRuns] = useState<StoreGameRun[]>([]);
  const [coupons, setCoupons] = useState<StoreCoupon[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await res.json();
      if (Array.isArray(d.orders)) setOrders(d.orders);
      if (Array.isArray(d.recentRuns)) setRecentRuns(d.recentRuns);
      if (Array.isArray(d.coupons)) setCoupons(d.coupons);
      if (d.stats) setStats(d.stats as DashboardStats);
    } catch {
      // Keep UI usable even on transient error
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login?next=/account");
      return;
    }

    setFullName(user.fullName || "");
    setPhone(user.phone || "");
    setLine1(user.savedAddress?.line1 || "");
    setCity(user.savedAddress?.city || "");
    setStateName(user.savedAddress?.state || "");
    setPincode(user.savedAddress?.pincode || "");

    void loadDashboard();
  }, [loading, user, router, loadDashboard]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          savedAddress: line1
            ? { line1, city, state: stateName, pincode }
            : null,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        await refreshUser();
        setSaveMessage("Profile & delivery address saved!");
        setTimeout(() => setSaveMessage(null), 2500);
      } else {
        setSaveError(json.error || "Could not save profile.");
      }
    } catch {
      setSaveError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleReorder = (order: StoreOrder) => {
    const items = order.cart_data?.items || [];
    if (items.length === 0) return;

    items.forEach((item, idx) => {
      const vid = Number(item.variant_id) || 1001;
      addItem(
        {
          variantId: vid,
          slug: "peri-peri",
          name: item.name || "Pop Culture Makhana",
          variantLabel: "Standard Pack",
          price: Number(item.price) || 40,
          image: "/packets/peri peri.svg",
        },
        Math.max(1, Number(item.quantity) || 1),
        idx === items.length - 1
      );
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] text-[#522C28]">
        <Navbar />
        <div className="max-w-4xl mx-auto py-24 text-center font-black uppercase text-sm">
          Loading your Crunch Club dashboard...
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const st = (order.status || "").toUpperCase();
    if (orderFilter === "active") {
      return st !== "DELIVERED" && st !== "FAILED" && st !== "CANCELLED";
    }
    if (orderFilter === "completed") {
      return st === "SUCCESS" || st === "DELIVERED";
    }
    return true;
  });

  const computedTotalSpent =
    stats?.totalSpent ??
    orders.reduce((sum, o) => sum + (Number(o.total_amount_payable) || 0), 0);
  const computedTotalSaved =
    stats?.totalSaved ??
    orders.reduce((sum, o) => sum + (Number(o.total_discount) || 0), 0);
  const computedActiveOrders =
    stats?.activeOrders ??
    orders.filter((o) => {
      const st = (o.status || "").toUpperCase();
      return st !== "DELIVERED" && st !== "FAILED" && st !== "CANCELLED";
    }).length;

  const getStatusBadgeStyle = (status: string) => {
    const st = status.toUpperCase();
    if (st === "SUCCESS" || st === "DELIVERED") {
      return "bg-emerald-100 text-emerald-800 border border-emerald-300";
    }
    if (st === "FAILED" || st === "CANCELLED") {
      return "bg-red-100 text-red-800 border border-red-300";
    }
    if (st === "SHIPPED" || st === "IN_TRANSIT" || st === "OUT_FOR_DELIVERY") {
      return "bg-blue-100 text-blue-800 border border-blue-300";
    }
    return "bg-amber-100 text-amber-800 border border-amber-300";
  };

  const renderOrderCard = (order: StoreOrder) => {
    const addr = order.shipping_address as Record<string, unknown> | null | undefined;
    const addrLine = addr
      ? [addr.line1, addr.city, addr.pincode].filter(Boolean).join(", ")
      : "";

    return (
      <div
        key={order.order_id}
        className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EE]/75 border border-[#522C28]/15 space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-sm text-[#25100E]">#{order.order_id}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusBadgeStyle(
                  order.status || "INITIATED"
                )}`}
              >
                {order.status || "INITIATED"}
              </span>
              {order.payment_type && (
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#522C28]/15 text-[10px] font-bold uppercase text-[#522C28]/75">
                  {order.payment_type}
                </span>
              )}
              {order.isDemo && (
                <span className="px-2 py-0.5 rounded-full bg-[#FAC537]/30 text-[10px] font-black uppercase text-[#522C28]">
                  Demo
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#522C28]/60 mt-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{new Date(order.created_at).toLocaleString()}</span>
              {order.edd ? <span>• Est. Delivery: {order.edd}</span> : null}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-black text-lg text-[#25100E]">
              ₹{order.total_amount_payable ?? order.subtotal_price ?? 0}
            </p>
            {(order.total_discount ?? 0) > 0 && (
              <p className="text-[11px] font-bold text-[#3CA837]">
                Saved ₹{order.total_discount}
                {order.coupon_codes && order.coupon_codes.length > 0
                  ? ` (${order.coupon_codes.join(", ")})`
                  : ""}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/90 rounded-xl border border-[#522C28]/10 px-3 py-2.5 space-y-1">
          {(order.cart_data?.items || []).map((i, idx) => (
            <div key={idx} className="flex justify-between text-xs font-semibold text-[#522C28]">
              <span>
                {i.quantity}× {i.name || `Variant #${i.variant_id}`}
              </span>
              {i.price ? (
                <span className="font-bold text-[#25100E]">₹{i.price * i.quantity}</span>
              ) : null}
            </div>
          ))}
        </div>

        {addrLine && (
          <p className="text-[11px] font-semibold text-[#522C28]/70 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D73B3A] shrink-0" />
            <span className="truncate">Delivering to: {addrLine}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Link
            href={`/checkout/status?oid=${encodeURIComponent(order.order_id)}&ost=${order.status}`}
            className="text-xs font-black text-[#D73B3A] hover:underline"
          >
            View Receipt & Tracking →
          </Link>

          {(order.cart_data?.items || []).length > 0 && (
            <button
              type="button"
              onClick={() => handleReorder(order)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#522C28]/20 hover:border-[#D73B3A] text-[11px] font-black uppercase text-[#25100E] hover:text-[#D73B3A] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reorder</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Top Dashboard Header */}
        <div className="bg-white rounded-3xl border-2 border-[#522C28]/15 p-6 sm:p-8 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Customer Dashboard • Crunch Club</span>
            </span>
            <h1 className="font-display text-3xl sm:text-4xl uppercase text-[#25100E] mt-1">
              Hey, {user.fullName}!
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#522C28]/75">
              {user.email}
              {user.phone ? ` • +91 ${user.phone}` : " • Add your phone below for Shiprocket delivery alerts"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={fetching}
              className="px-3.5 py-2 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 text-xs font-black uppercase text-[#522C28] hover:border-[#D73B3A] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-full bg-[#D73B3A] text-white text-xs font-black uppercase inline-flex items-center gap-1.5 shadow-xs hover:bg-[#FB0008] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Snacks</span>
            </Link>
            <Link
              href="/#discover"
              className="px-4 py-2 rounded-full bg-[#FAC537] text-[#522C28] text-xs font-black uppercase inline-flex items-center gap-1.5 shadow-xs hover:scale-105 transition-transform"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play Fox Runner</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 text-xs font-black uppercase text-[#522C28] hover:border-[#D73B3A] hover:text-[#D73B3A] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 4 Highlight Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border-2 border-[#FAC537] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAC537]/25 text-[#D73B3A] flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">
                Crunch Points Wallet
              </p>
              <p className="font-display text-2xl sm:text-3xl text-[#25100E]">
                {user.loyaltyPoints} pts
              </p>
              <p className="text-[11px] font-bold text-[#3CA837]">
                Worth ₹{user.loyaltyPoints} off orders
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#522C28]/15 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#3CA837] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">Orders Placed</p>
              <p className="font-display text-2xl sm:text-3xl text-[#25100E]">
                {fetching ? "..." : orders.length}
              </p>
              <p className="text-[11px] font-bold text-[#522C28]/70">
                {computedActiveOrders} active • ₹{computedTotalSpent} spent
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#522C28]/15 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D73B3A]/10 text-[#D73B3A] flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">Total Saved</p>
              <p className="font-display text-2xl sm:text-3xl text-[#25100E]">
                ₹{computedTotalSaved}
              </p>
              <p className="text-[11px] font-bold text-[#522C28]/70">
                Coupons & Crunch Points
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#522C28]/15 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D73B3A] flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">
                Fox Runner Best
              </p>
              <p className="font-display text-2xl sm:text-3xl text-[#25100E]">
                {user.gameHighScore}m
              </p>
              <p className="text-[11px] font-bold text-[#522C28]/70">
                {user.totalRuns} runs • {user.totalDistance}m total
              </p>
            </div>
          </div>
        </div>

        {/* Active Member Coupons Strip */}
        {coupons.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#522C28]/15 px-5 py-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D73B3A] shrink-0" />
              <span className="text-xs font-black uppercase text-[#25100E]">
                Your Active Crunch Club Offers:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {coupons.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => void handleCopyCoupon(c.code)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8EE] border border-[#FAC537] hover:border-[#D73B3A] text-xs font-black text-[#25100E] cursor-pointer transition-colors"
                  title="Click to copy promo code"
                >
                  <span className="text-[#D73B3A]">{c.code}</span>
                  <span className="text-[10px] font-bold text-[#522C28]/70">
                    (
                    {c.discountType === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    {c.minOrder > 0 ? ` • Min ₹${c.minOrder}` : ""})
                  </span>
                  {copiedCode === c.code ? (
                    <Check className="w-3 h-3 text-[#3CA837]" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#522C28]/50" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Section Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "orders" as const, label: `My Orders (${orders.length})` },
            { id: "profile" as const, label: "Profile & Address" },
            { id: "rewards" as const, label: "Fox Runner & Points" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase cursor-pointer transition-all ${
                activeTab === tab.id
                  ? "bg-[#25100E] text-[#FAC537] shadow-xs"
                  : "bg-white border border-[#522C28]/15 text-[#522C28]/75 hover:border-[#D73B3A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {(activeTab === "overview" || activeTab === "orders") && (
          <div
            className={`grid grid-cols-1 ${
              activeTab === "overview" ? "lg:grid-cols-5" : ""
            } gap-6`}
          >
            {/* Orders Column */}
            <div
              className={`${
                activeTab === "overview" ? "lg:col-span-3" : ""
              } bg-white rounded-3xl border border-[#522C28]/15 p-6 shadow-xs`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display text-xl uppercase text-[#25100E]">
                    Orders & Live Tracking
                  </h2>
                  <p className="text-[11px] font-semibold text-[#522C28]/65">
                    Every order placed with {user.email} appears here automatically.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: "all", label: "All" },
                      { id: "active", label: "Active" },
                      { id: "completed", label: "Completed" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOrderFilter(f.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-black uppercase cursor-pointer ${
                        orderFilter === f.id
                          ? "bg-[#D73B3A] text-white"
                          : "bg-[#FFF8EE] text-[#522C28]/75 hover:text-[#D73B3A]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {fetching ? (
                <div className="py-10 text-center text-xs font-bold text-[#522C28]/60 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#D73B3A]" />
                  <span>Loading your orders...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-8 text-center bg-[#FFF8EE]/60 rounded-2xl border border-[#522C28]/10">
                  <p className="text-sm font-bold text-[#522C28]/75">
                    {orderFilter === "all"
                      ? "No orders placed yet."
                      : `No ${orderFilter} orders found.`}
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block mt-3 px-5 py-2 rounded-full bg-[#D73B3A] text-white text-xs font-black uppercase"
                  >
                    Shop Crunch Flavours
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">{filteredOrders.map(renderOrderCard)}</div>
              )}
            </div>

            {/* Right Sidebar on Overview: Quick Address & Recent Game Runs */}
            {activeTab === "overview" && (
              <div className="lg:col-span-2 space-y-6">
                {/* Saved Address Summary Card */}
                <div className="bg-white rounded-3xl border border-[#522C28]/15 p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#D73B3A]" />
                      <h2 className="font-display text-lg uppercase text-[#25100E]">
                        Delivery Details
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className="text-xs font-black text-[#D73B3A] hover:underline cursor-pointer"
                    >
                      Edit →
                    </button>
                  </div>

                  {line1 ? (
                    <div className="p-3.5 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10 text-xs space-y-1">
                      <p className="font-black text-[#25100E]">{fullName || user.fullName}</p>
                      <p className="font-semibold text-[#522C28]/80">{line1}</p>
                      <p className="font-semibold text-[#522C28]/80">
                        {[city, stateName, pincode].filter(Boolean).join(", ")}
                      </p>
                      {phone && (
                        <p className="font-bold text-[#522C28]/70">Phone: +91 {phone}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#FFF8EE] border border-dashed border-[#522C28]/25 text-xs">
                      <p className="font-bold text-[#522C28]/75">
                        Save your address & mobile number once for faster 1-click Shiprocket checkout.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="mt-2.5 px-3.5 py-1.5 rounded-full bg-[#25100E] text-[#FAC537] text-[11px] font-black uppercase cursor-pointer"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Fox Runner Runs Card */}
                <div className="bg-white rounded-3xl border border-[#522C28]/15 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display text-lg uppercase text-[#25100E]">
                      Fox Runner Runs
                    </h2>
                    <Link
                      href="/#discover"
                      className="text-xs font-black text-[#D73B3A] hover:underline"
                    >
                      Play & Earn →
                    </Link>
                  </div>
                  {recentRuns.length === 0 ? (
                    <p className="text-xs font-semibold text-[#522C28]/70 py-2">
                      Play Fox Runner on the homepage while signed in to earn 1 Crunch Point per 25m!
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {recentRuns.slice(0, 6).map((run) => (
                        <div
                          key={run.id}
                          className="p-3 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10 text-xs"
                        >
                          <p className="font-mono font-black text-base text-[#25100E]">
                            {run.distance}m
                          </p>
                          <p className="font-bold text-[#3CA837]">+{run.pointsEarned} Crunch Pts</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dedicated Profile & Address Tab */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="max-w-2xl bg-white rounded-3xl border border-[#522C28]/15 p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D73B3A]" />
              <h2 className="font-display text-2xl uppercase text-[#25100E]">
                Profile & Saved Delivery Address
              </h2>
            </div>
            <p className="text-xs font-semibold text-[#522C28]/70">
              Used to prefill Shiprocket checkout and link SMS/WhatsApp order updates to your dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Flat 4B, Linking Road"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="400050"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
            </div>

            {saveError && (
              <p className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl p-2.5">
                {saveError}
              </p>
            )}

            {saveMessage && (
              <p className="text-xs font-bold text-[#3CA837] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {saveMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-full bg-[#25100E] text-[#FAC537] font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile & Address</span>
            </button>
          </form>
        )}

        {/* Dedicated Fox Runner & Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="bg-white rounded-3xl border border-[#522C28]/15 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl uppercase text-[#25100E] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D73B3A]" />
                  <span>Fox Runner & Crunch Points History</span>
                </h2>
                <p className="text-xs font-semibold text-[#522C28]/70 mt-0.5">
                  Earn 1 Crunch Point per 25m run (up to 100 pts/run) and 1 pt per ₹20 spent on
                  orders. Redeem up to 20% of your cart at checkout!
                </p>
              </div>
              <Link
                href="/#discover"
                className="px-5 py-2.5 rounded-full bg-[#FAC537] text-[#522C28] text-xs font-black uppercase inline-flex items-center gap-1.5 self-start"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Now</span>
              </Link>
            </div>

            {recentRuns.length === 0 ? (
              <div className="py-10 text-center bg-[#FFF8EE]/60 rounded-2xl border border-[#522C28]/10">
                <p className="text-sm font-bold text-[#522C28]/75">No Fox Runner runs recorded yet.</p>
                <Link
                  href="/#discover"
                  className="inline-block mt-3 px-5 py-2 rounded-full bg-[#D73B3A] text-white text-xs font-black uppercase"
                >
                  Start Running & Earning
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="p-4 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/15 space-y-1"
                  >
                    <p className="font-mono font-black text-xl text-[#25100E]">{run.distance}m</p>
                    <p className="text-xs font-black text-[#3CA837]">
                      +{run.pointsEarned} Crunch Pts earned
                    </p>
                    <p className="text-[10px] font-semibold text-[#522C28]/55">
                      {new Date(run.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
