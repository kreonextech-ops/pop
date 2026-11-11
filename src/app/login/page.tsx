"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles, LogIn, UserPlus, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Google Sign-In requires Supabase NEXT_PUBLIC_SUPABASE_URL & ANON_KEY.");
      return;
    }

    setGoogleLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        nextUrl
      )}`;
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });
      if (oauthErr) {
        setError(oauthErr.message);
        setGoogleLoading(false);
      }
    } catch {
      setError("Failed launching Google Sign-In.");
      setGoogleLoading(false);
    }
  };

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

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#FFF8EE] text-[#25100E] border-2 border-[#522C28]/15 hover:border-[#D73B3A] font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer mb-4"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#D73B3A]" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#522C28]/15 w-full" />
        <span className="bg-white px-3 text-[10px] font-black uppercase text-[#522C28]/50 tracking-widest">
          or use email
        </span>
        <div className="border-t border-[#522C28]/15 w-full" />
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
