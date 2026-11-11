"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    window.dispatchEvent(new Event("lenis:ready"));

    let rafId = 0;
    const onRaf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(onRaf);
    };
    rafId = window.requestAnimationFrame(onRaf);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
