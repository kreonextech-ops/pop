"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import type { StoreOrder, StoreGameRun } from "@/lib/store";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [recentRuns, setRecentRuns] = useState<StoreGameRun[]>([]);
  const [fetching, setFetching] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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

    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.orders)) setOrders(d.orders);
        if (Array.isArray(d.recentRuns)) setRecentRuns(d.recentRuns);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [loading, user, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
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
      if (res.ok) {
        await refreshUser();
        setSaveMessage("Profile & delivery address saved!");
        setTimeout(() => setSaveMessage(null), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] text-[#522C28]">
        <Navbar />
        <div className="max-w-4xl mx-auto py-24 text-center font-black uppercase text-sm">
          Loading your Crunch Club account...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Top Greeting Banner */}
        <div className="bg-white rounded-3xl border-2 border-[#522C28]/15 p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
              ✦ CRUNCH CLUB MEMBER ✦
            </span>
            <h1 className="font-display text-3xl sm:text-4xl uppercase text-[#25100E] mt-1">
              Hey, {user.fullName}!
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#522C28]/70">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

        {/* 3 Highlight Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border-2 border-[#FAC537] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAC537]/25 text-[#D73B3A] flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">
                Crunch Points Wallet
              </p>
              <p className="font-display text-3xl text-[#25100E]">{user.loyaltyPoints} pts</p>
              <p className="text-[11px] font-bold text-[#3CA837]">
                Worth ₹{user.loyaltyPoints} off orders
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#522C28]/15 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D73B3A]/10 text-[#D73B3A] flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">
                Fox Runner High Score
              </p>
              <p className="font-display text-3xl text-[#25100E]">{user.gameHighScore}m</p>
              <p className="text-[11px] font-bold text-[#522C28]/70">
                {user.totalRuns} runs • {user.totalDistance}m total
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#522C28]/15 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#3CA837] flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#522C28]/60">Orders Placed</p>
              <p className="font-display text-3xl text-[#25100E]">
                {fetching ? "..." : orders.length}
              </p>
              <p className="text-[11px] font-bold text-[#522C28]/70">Track live deliveries</p>
            </div>
          </div>
        </div>

        {/* Profile Form & Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Profile & Address */}
          <form
            onSubmit={handleSaveProfile}
            className="lg:col-span-2 bg-white rounded-3xl border border-[#522C28]/15 p-6 shadow-xs space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D73B3A]" />
              <h2 className="font-display text-xl uppercase text-[#25100E]">
                Profile & Saved Address
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3 py-2 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              />
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
                className="w-full px-3 py-2 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
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
                className="w-full px-3 py-2 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              />
            </div>

            {saveMessage && (
              <p className="text-xs font-bold text-[#3CA837] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {saveMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-full bg-[#25100E] text-[#FAC537] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile</span>
            </button>
          </form>

          {/* Right Column: Order History + Recent Game Runs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Orders */}
            <div className="bg-white rounded-3xl border border-[#522C28]/15 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl uppercase text-[#25100E]">Order History</h2>
                <Link
                  href="/shop"
                  className="text-xs font-black text-[#D73B3A] hover:underline inline-flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order More
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center bg-[#FFF8EE]/60 rounded-2xl border border-[#522C28]/10">
                  <p className="text-sm font-bold text-[#522C28]/70">No orders placed yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block mt-3 px-4 py-2 rounded-full bg-[#D73B3A] text-white text-xs font-black uppercase"
                  >
                    Shop Flavours
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="p-4 rounded-2xl bg-[#FFF8EE]/70 border border-[#522C28]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#25100E]">
                            #{order.order_id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              order.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#522C28]/75 font-semibold mt-1">
                          {(order.cart_data?.items || [])
                            .map((i) => `${i.quantity}× ${i.name || "Snack"}`)
                            .join(", ")}
                        </p>
                        <p className="text-[10px] text-[#522C28]/55 mt-0.5">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-black text-base text-[#25100E]">
                          ₹{order.total_amount_payable ?? 0}
                        </p>
                        <Link
                          href={`/checkout/status?oid=${encodeURIComponent(order.order_id)}&ost=${order.status}`}
                          className="text-[11px] font-black text-[#D73B3A] hover:underline"
                        >
                          View Receipt →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Game Runs */}
            <div className="bg-white rounded-3xl border border-[#522C28]/15 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-xl uppercase text-[#25100E]">
                  Recent Fox Runner Runs
                </h2>
                <Link href="/#discover" className="text-xs font-black text-[#D73B3A] hover:underline">
                  Play Again →
                </Link>
              </div>
              {recentRuns.length === 0 ? (
                <p className="text-xs font-semibold text-[#522C28]/70 py-4">
                  Play Fox Runner on the homepage while signed in to earn Crunch Points (1 pt per
                  25m)!
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {recentRuns.map((run) => (
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
        </div>
      </main>
    </div>
  );
}
