"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { completeOAuthIfNeeded } from "@/lib/supabaseBrowser";
import { useAuth, type AuthUser } from "@/components/AuthContext";

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";
  const { setUser, refreshUser } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function completeOAuth() {
      const oauthError =
        searchParams.get("error_description") || searchParams.get("error");
      if (oauthError) {
        setError(oauthError);
        return;
      }

      const code = searchParams.get("code");

      try {
        const syncedUser = await completeOAuthIfNeeded<AuthUser>({
          explicitCode: code,
          cleanUrl: false,
          throwOnMissingSession: true,
        });
        if (syncedUser) {
          setUser(syncedUser);
        } else {
          await refreshUser();
        }
        if (!cancelled) {
          router.replace(nextUrl);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unexpected OAuth error.");
        }
      }
    }

    void completeOAuth();
    return () => {
      cancelled = true;
    };
  }, [nextUrl, refreshUser, router, searchParams, setUser]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-[#522C28]/15 shadow-xl p-8 text-center space-y-4">
      {error ? (
        <>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl uppercase text-[#25100E]">
            Google Sign-In Failed
          </h1>
          <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-full bg-[#D73B3A] text-white font-black text-xs uppercase tracking-wider"
          >
            Back to Sign In
          </Link>
        </>
      ) : (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-[#D73B3A] mx-auto" />
          <h1 className="font-display text-2xl uppercase text-[#25100E]">
            Signing You In...
          </h1>
          <p className="text-xs font-semibold text-[#522C28]/70">
            Syncing your Google account & Crunch Points wallet...
          </p>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16">
        <Suspense
          fallback={
            <div className="max-w-md mx-auto text-center py-12 font-black text-sm">
              Completing sign in...
            </div>
          }
        >
          <OAuthCallbackHandler />
        </Suspense>
      </main>
    </div>
  );
}
