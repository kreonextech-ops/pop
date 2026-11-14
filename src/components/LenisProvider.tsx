"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Smoothly scrolls to a target selector, element, or Y position using Lenis when available. */
export function smoothScrollTo(target: string | HTMLElement | number, offset = 0) {
  if (typeof window === "undefined") return;
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el && typeof target !== "number") return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, {
      offset,
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }

  if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: "smooth" });
  } else if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    window.dispatchEvent(new Event("lenis:ready"));

    lenis.on("scroll", ScrollTrigger.update);

    // Lock Lenis and GSAP ScrollTrigger onto the exact same ticker frame
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      const hashTarget = window.location.hash;
      const timer = setTimeout(() => {
        smoothScrollTo(hashTarget, 0);
      }, 60);
      return () => clearTimeout(timer);
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
