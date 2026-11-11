"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  completeOAuthIfNeeded,
  getSupabaseBrowserAsync,
  signOutSupabaseBrowser,
  syncSupabaseAccessToken,
} from "@/lib/supabaseBrowser";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "customer" | "admin";
  loyaltyPoints: number;
  gameHighScore: number;
  totalRuns: number;
  totalDistance: number;
  savedAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = res.ok ? await res.json() : { user: null };
      if (data.user) {
        setUser(data.user as AuthUser);
        return data.user as AuthUser;
      }

      // If Supabase redirected back to '/' (Site URL) with ?code= / #access_token=
      // or holds an active browser OAuth session, bridge it into our HTTP-only cookie automatically.
      try {
        const synced = await completeOAuthIfNeeded<AuthUser>({
          cleanUrl: typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/callback"),
        });
        if (synced) {
          setUser(synced);
          return synced;
        }
      } catch {
        // Leave logged out if OAuth completion fails outside /auth/callback
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();

    let unsubscribe: (() => void) | undefined;
    void getSupabaseBrowserAsync().then((sb) => {
      if (!sb) return;
      const { data } = sb.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.access_token) {
          void syncSupabaseAccessToken<AuthUser>(session.access_token)
            .then((synced) => {
              if (synced) setUser(synced);
            })
            .catch(() => {});
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });

    return () => {
      unsubscribe?.();
    };
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {}),
      signOutSupabaseBrowser(),
    ]);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
