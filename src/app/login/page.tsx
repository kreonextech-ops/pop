"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles, LogIn, UserPlus, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";
  const { refreshUser } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login" ? { email, password } : { email, password, fullName, phone };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }
      await refreshUser();
      router.push(nextUrl);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-[#522C28]/15 shadow-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAC537]/30 text-[#522C28] text-[11px] font-black uppercase tracking-wider border border-[#FAC537]">
          <Sparkles className="w-3.5 h-3.5 text-[#D73B3A]" />
          <span>Pop Culture Crunch Club</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl uppercase text-[#25100E] mt-3">
          {mode === "login" ? "Welcome Back!" : "Join & Get 50 Pts"}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#522C28]/75 mt-1">
          {mode === "login"
            ? "Sign in to view orders, Fox Runner high scores, and Crunch Points."
            : "Create your account for 50 free Crunch Points & Fox Runner rewards."}
        </p>
      </div>

      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10 mb-5">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
            mode === "login"
              ? "bg-[#25100E] text-[#FAC537] shadow-xs"
              : "text-[#522C28]/70 hover:text-[#522C28]"
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError(null);
          }}
          className={`py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
            mode === "register"
              ? "bg-[#D73B3A] text-white shadow-xs"
              : "text-[#522C28]/70 hover:text-[#522C28]"
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Create Account</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === "register" && (
          <>
            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/75 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold focus:outline-none focus:border-[#D73B3A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/75 mb-1">
                Mobile Number (for Shiprocket updates)
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold focus:outline-none focus:border-[#D73B3A]"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-[11px] font-black uppercase text-[#522C28]/75 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold focus:outline-none focus:border-[#D73B3A]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-black uppercase text-[#522C28]/75 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold focus:outline-none focus:border-[#D73B3A]"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#D73B3A] hover:bg-[#FB0008] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          <span>{mode === "login" ? "Sign In to Crunch Club" : "Create Account (+50 Pts)"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-[#522C28]/10 text-center text-xs font-bold text-[#522C28]/70">
        Store Owner?{" "}
        <Link href="/admin" className="text-[#D73B3A] font-black hover:underline">
          Open Admin Console →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12 sm:py-16">
        <Suspense
          fallback={
            <div className="max-w-md mx-auto text-center py-16 font-black text-sm">
              Loading login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
