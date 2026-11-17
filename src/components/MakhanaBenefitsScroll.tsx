"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoothScrollTo } from "@/components/LenisProvider";
import {
  WheatOff,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Feather,
  Heart,
  Droplets,
  Zap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function MakhanaBenefitsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);

  // Stop 0: Intro Heading
  const introLine1OutRef = useRef<HTMLDivElement>(null);
  const introLine2OutRef = useRef<HTMLDivElement>(null);

  // Stop 1: 100% Gluten-Free + Feather-Light Clean Seesaw
  const s1StageRef = useRef<HTMLDivElement>(null);
  const s1PropsFloatRef = useRef<HTMLDivElement>(null);
  const seesawBaseRef = useRef<HTMLDivElement>(null);
  const seesawBeamRef = useRef<HTMLDivElement>(null);
  const seesawPlankRef = useRef<HTMLDivElement>(null);
  const leftSeatRef = useRef<HTMLDivElement>(null);
  const cloudDropRef = useRef<HTMLDivElement>(null);
  const rightSeatRef = useRef<HTMLDivElement>(null);
  const s1MakhanaSpinRef = useRef<HTMLImageElement>(null);
  const s1TagRef = useRef<HTMLDivElement>(null);
  const s1CompareBoxRef = useRef<HTMLDivElement>(null);

  // Stop 2: Heart Health + Potassium/Magnesium EKG Monitor
  const s2StageRef = useRef<HTMLDivElement>(null);
  const s2PropsFloatRef = useRef<HTMLDivElement>(null);
  const s2MakhanaDropRef = useRef<HTMLDivElement>(null);
  const s2MakhanaSpinRef = useRef<HTMLImageElement>(null);
  const heartMeterWrapRef = useRef<HTMLDivElement>(null);
  const ekgPathRef = useRef<SVGPathElement>(null);
  const barKRef = useRef<HTMLDivElement>(null);
  const barMgRef = useRef<HTMLDivElement>(null);
  const s2TagRef = useRef<HTMLDivElement>(null);
  const s2CompareBoxRef = useRef<HTMLDivElement>(null);

  // Stop 3: 5 Sutta Promise + Grand Flavour Bowl & CTA (Merged Slides 5 & 6)
  const s3StageRef = useRef<HTMLDivElement>(null);
  const promiseRingRef = useRef<HTMLDivElement>(null);
  const promiseMakhanaDropRef = useRef<HTMLDivElement>(null);
  const promiseMakhanaSpinRef = useRef<HTMLImageElement>(null);
  const promiseSealRef = useRef<HTMLDivElement>(null);
  const s3TagRef = useRef<HTMLDivElement>(null);
  const s3QuoteRef = useRef<HTMLDivElement>(null);
  const bowlBurstRef = useRef<SVGSVGElement>(null);
  const bowlWrapRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const bindLenis = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    };
    if (window.__lenis) {
      bindLenis();
    } else {
      window.addEventListener("lenis:ready", bindLenis, { once: true });
    }

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const pinSection = pinSectionRef.current;
      if (!container || !pinSection) return;

      const introWords = gsap.utils.toArray<HTMLElement>(".scroll-intro-word-in");
      const introExitLines = [introLine1OutRef.current, introLine2OutRef.current].filter(Boolean);
      const s1Words = gsap.utils.toArray<HTMLElement>(".s1-word");
      const s1Pills = gsap.utils.toArray<HTMLElement>(".s1-pill");
      const s2Words = gsap.utils.toArray<HTMLElement>(".s2-word");
      const s2Pills = gsap.utils.toArray<HTMLElement>(".s2-pill");
      const s3Words = gsap.utils.toArray<HTMLElement>(".s3-word");
      const s3Pills = gsap.utils.toArray<HTMLElement>(".s3-pill");

      // =====================================================================
      // 1. Initial State Definitions
      // =====================================================================
      gsap.set(introWords, { yPercent: 110, scale: 0.94, autoAlpha: 0 });

      [s1StageRef.current, s2StageRef.current, s3StageRef.current].forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: 0 });
      });

      // --- Stop 1 (Seesaw) ---
      gsap.set(s1Words, { yPercent: 110, autoAlpha: 0 });
      gsap.set(s1Pills, { autoAlpha: 0, y: 8, scale: 0.92 });
      if (s1TagRef.current) gsap.set(s1TagRef.current, { autoAlpha: 0, y: -10 });
      if (s1CompareBoxRef.current) gsap.set(s1CompareBoxRef.current, { autoAlpha: 0, y: 14 });
      if (seesawBaseRef.current) gsap.set(seesawBaseRef.current, { autoAlpha: 0, y: 20 });
      if (seesawPlankRef.current) gsap.set(seesawPlankRef.current, { autoAlpha: 0 });
      if (seesawBeamRef.current) gsap.set(seesawBeamRef.current, { rotation: 0, transformOrigin: "50% 50%" });
      if (leftSeatRef.current) gsap.set(leftSeatRef.current, { rotation: 0, transformOrigin: "50% 100%" });
      if (cloudDropRef.current) gsap.set(cloudDropRef.current, { autoAlpha: 0, y: -45 });
      if (rightSeatRef.current) {
        gsap.set(rightSeatRef.current, {
          xPercent: -110,
          yPercent: -35,
          y: -190,
          scale: 1.45,
          rotation: 0,
          autoAlpha: 0,
          transformOrigin: "50% 100%",
        });
      }
      if (s1MakhanaSpinRef.current) gsap.set(s1MakhanaSpinRef.current, { rotation: -280 });
      if (s1PropsFloatRef.current) gsap.set(s1PropsFloatRef.current, { autoAlpha: 0, scale: 0.86 });

      // --- Stop 2 (Heart Health / Minerals) ---
      gsap.set(s2Words, { yPercent: 110, autoAlpha: 0 });
      gsap.set(s2Pills, { autoAlpha: 0, y: 8, scale: 0.92 });
      if (s2TagRef.current) gsap.set(s2TagRef.current, { autoAlpha: 0, y: -10 });
      if (s2CompareBoxRef.current) gsap.set(s2CompareBoxRef.current, { autoAlpha: 0, y: 14 });
      if (s2MakhanaDropRef.current) {
        gsap.set(s2MakhanaDropRef.current, {
          xPercent: -50,
          yPercent: -50,
          y: -190,
          scale: 1.25,
          autoAlpha: 0,
        });
      }
      if (s2MakhanaSpinRef.current) gsap.set(s2MakhanaSpinRef.current, { rotation: -240 });
      if (s2PropsFloatRef.current) gsap.set(s2PropsFloatRef.current, { autoAlpha: 0, scale: 0.86 });
      if (heartMeterWrapRef.current) gsap.set(heartMeterWrapRef.current, { autoAlpha: 0, y: 18 });
      if (ekgPathRef.current) gsap.set(ekgPathRef.current, { strokeDashoffset: 260 });
      if (barKRef.current) gsap.set(barKRef.current, { scaleX: 0, transformOrigin: "left center" });
      if (barMgRef.current) gsap.set(barMgRef.current, { scaleX: 0, transformOrigin: "left center" });

      // --- Stop 3 (5 Sutta Promise + Bowl & CTA) ---
      gsap.set(s3Words, { yPercent: 110, autoAlpha: 0 });
      gsap.set(s3Pills, { autoAlpha: 0, y: 8, scale: 0.92 });
      if (s3TagRef.current) gsap.set(s3TagRef.current, { autoAlpha: 0, y: -10 });
      if (promiseRingRef.current) gsap.set(promiseRingRef.current, { autoAlpha: 0, scale: 0.84 });
      if (promiseMakhanaDropRef.current) {
        gsap.set(promiseMakhanaDropRef.current, { y: -160, scale: 0.9, autoAlpha: 0 });
      }
      if (promiseMakhanaSpinRef.current) gsap.set(promiseMakhanaSpinRef.current, { rotation: -200 });
      if (promiseSealRef.current) gsap.set(promiseSealRef.current, { autoAlpha: 0, y: 12, scale: 0.85 });
      if (s3QuoteRef.current) gsap.set(s3QuoteRef.current, { autoAlpha: 0, y: 16 });
      if (bowlBurstRef.current) gsap.set(bowlBurstRef.current, { autoAlpha: 0, scale: 0.75, rotation: -30 });
      if (bowlWrapRef.current) gsap.set(bowlWrapRef.current, { autoAlpha: 0, y: 30, scale: 0.92 });
      if (ctaBtnRef.current) gsap.set(ctaBtnRef.current, { autoAlpha: 0, y: 15, scale: 0.95 });

      // Intro Entrance on Scroll Approach
      gsap.to(introWords, {
        yPercent: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 45%",
          end: "top 5%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // =====================================================================
      // 2. Continuous Story Timeline: Heading -> S1 -> S2 -> S3
      // Total Timeline Duration: 12.0s
      // Stop 0: 0.5s | Stop 1: 4.2s | Stop 2: 7.8s | Stop 3: 11.4s
      // =====================================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=4200",
          pin: pinSection,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // --- STOP 0 HOLD ---
      tl.to({}, { duration: 0.8 });

      // --- EXIT STOP 0 (Heading Out) ---
      tl.to(
        introExitLines,
        {
          y: -40,
          scale: 0.95,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        0.8
      );

      // =====================================================================
      // FULL ANIMATION SEQUENCE FOR SLIDE 1 (Seesaw Drop & Balance)
      // Entrance window: 1.35s -> 3.2s | Rest: 3.2s -> 4.8s
      // =====================================================================
      if (s1StageRef.current) {
        tl.to(s1StageRef.current, { autoAlpha: 1, duration: 0.15 }, 1.35);
      }
      if (s1TagRef.current) {
        tl.to(s1TagRef.current, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }, 1.45);
      }
      tl.to(s1Words, { yPercent: 0, autoAlpha: 1, duration: 0.48, stagger: 0.05, ease: "power3.out" }, 1.5);
      tl.to(s1Pills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.3)" }, 1.7);

      // Phase 1A: Makhana Drops from Sky Spinning into Center View
      if (rightSeatRef.current) {
        tl.to(rightSeatRef.current, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 1.55);
      }
      if (s1MakhanaSpinRef.current) {
        tl.to(s1MakhanaSpinRef.current, { rotation: 0, duration: 0.65, ease: "power2.out" }, 1.55);
      }
      if (s1PropsFloatRef.current) {
        tl.to(s1PropsFloatRef.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, 1.75);
      }

      // Phase 1B: Seesaw Beam appears, Makhana glides to Right Pad, Beam Tilts +6deg!
      if (seesawBaseRef.current) tl.to(seesawBaseRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.15);
      if (seesawPlankRef.current) tl.to(seesawPlankRef.current, { autoAlpha: 1, duration: 0.3 }, 2.2);

      if (rightSeatRef.current) {
        tl.to(
          rightSeatRef.current,
          { xPercent: 0, yPercent: 0, y: 0, scale: 1, duration: 0.45, ease: "power2.inOut" },
          2.25
        );
      }

      // Beam tilts toward Makhana (+6deg)
      if (seesawBeamRef.current && leftSeatRef.current && rightSeatRef.current) {
        tl.to(seesawBeamRef.current, { rotation: 6, duration: 0.28, ease: "sine.inOut" }, 2.5);
        tl.to(leftSeatRef.current, { rotation: -6, duration: 0.28, ease: "sine.inOut" }, 2.5);
        tl.to(rightSeatRef.current, { rotation: -6, duration: 0.28, ease: "sine.inOut" }, 2.5);
      }

      // Feather drops softly onto Left Pad
      if (cloudDropRef.current) {
        tl.to(cloudDropRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2.6);
      }

      // Seesaw balances level to 0deg (Feather balances single Foxnut!)
      if (seesawBeamRef.current && leftSeatRef.current && rightSeatRef.current) {
        tl.to(seesawBeamRef.current, { rotation: -2, duration: 0.25, ease: "sine.inOut" }, 2.85);
        tl.to(leftSeatRef.current, { rotation: 2, duration: 0.25, ease: "sine.inOut" }, 2.85);
        tl.to(rightSeatRef.current, { rotation: 2, duration: 0.25, ease: "sine.inOut" }, 2.85);

        tl.to(seesawBeamRef.current, { rotation: 0, duration: 0.3, ease: "power2.out" }, 3.1);
        tl.to(leftSeatRef.current, { rotation: 0, duration: 0.3, ease: "power2.out" }, 3.1);
        tl.to(rightSeatRef.current, { rotation: 0, duration: 0.3, ease: "power2.out" }, 3.1);
      }

      // Slide 1 Comparison Box reveals
      if (s1CompareBoxRef.current) {
        tl.to(s1CompareBoxRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2.45);
      }

      // --- HOLD SLIDE 1 ---
      tl.to({}, { duration: 1.5 }); // Steady at Stop 1 until 4.8s

      // --- TRANSITION 1 -> 2: Slide 1 Out, Slide 2 In ---
      if (s1StageRef.current) {
        tl.to(s1StageRef.current, { y: -38, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 4.8);
      }

      // =====================================================================
      // FULL ANIMATION SEQUENCE FOR SLIDE 2 (Heart Health & Mineral Monitor)
      // Entrance window: 5.2s -> 6.8s | Rest: 6.8s -> 8.4s
      // =====================================================================
      if (s2StageRef.current) {
        tl.to(s2StageRef.current, { autoAlpha: 1, duration: 0.15 }, 5.2);
      }
      if (s2TagRef.current) {
        tl.to(s2TagRef.current, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }, 5.25);
      }
      tl.to(s2Words, { yPercent: 0, autoAlpha: 1, duration: 0.48, stagger: 0.05, ease: "power3.out" }, 5.3);
      tl.to(s2Pills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.3)" }, 5.45);

      // 3-Makhana Cluster Drops & Spins from Sky
      if (s2MakhanaDropRef.current) {
        tl.to(s2MakhanaDropRef.current, { y: 0, autoAlpha: 1, duration: 0.58, ease: "power2.out" }, 5.35);
      }
      if (s2MakhanaSpinRef.current) {
        tl.to(s2MakhanaSpinRef.current, { rotation: 0, duration: 0.62, ease: "power2.out" }, 5.35);
      }
      if (s2PropsFloatRef.current) {
        tl.to(s2PropsFloatRef.current, { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, 5.55);
      }

      // Makhana glides into position above Monitor Card
      if (s2MakhanaDropRef.current) {
        tl.to(
          s2MakhanaDropRef.current,
          { yPercent: -82, y: 0, scale: 0.82, duration: 0.45, ease: "power2.inOut" },
          5.95
        );
      }

      // Heart Monitor Card Pops Up
      if (heartMeterWrapRef.current) {
        tl.to(heartMeterWrapRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 6.1);
      }

      // EKG Live Line Draws In
      if (ekgPathRef.current) {
        tl.to(ekgPathRef.current, { strokeDashoffset: 0, duration: 0.65, ease: "power1.inOut" }, 6.2);
      }

      // Potassium (K) and Magnesium (Mg) Bars Fill Up!
      if (barKRef.current) {
        tl.to(barKRef.current, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 6.45);
      }
      if (barMgRef.current) {
        tl.to(barMgRef.current, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 6.55);
      }

      // Slide 2 Comparison Box reveals
      if (s2CompareBoxRef.current) {
        tl.to(s2CompareBoxRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 6.3);
      }

      // --- HOLD SLIDE 2 ---
      tl.to({}, { duration: 1.5 }); // Steady at Stop 2 until 8.4s

      // --- TRANSITION 2 -> 3: Slide 2 Out, Slide 3 In ---
      if (s2StageRef.current) {
        tl.to(s2StageRef.current, { y: -38, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 8.4);
      }

      // =====================================================================
      // FULL ANIMATION SEQUENCE FOR SLIDE 3 (5 Sutta Promise + Bowl & CTA)
      // Entrance window: 8.8s -> 10.4s | Rest: 10.4s -> 12.0s
      // =====================================================================
      if (s3StageRef.current) {
        tl.to(s3StageRef.current, { autoAlpha: 1, duration: 0.15 }, 8.8);
      }
      if (s3TagRef.current) {
        tl.to(s3TagRef.current, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }, 8.85);
      }
      tl.to(s3Words, { yPercent: 0, autoAlpha: 1, duration: 0.48, stagger: 0.05, ease: "power3.out" }, 8.9);
      tl.to(s3Pills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.3)" }, 9.1);

      // Jumbo 5 Sutta Makhana drops spinning into golden aura ring!
      if (promiseRingRef.current) {
        tl.to(promiseRingRef.current, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.2)" }, 8.95);
      }
      if (promiseMakhanaDropRef.current) {
        tl.to(
          promiseMakhanaDropRef.current,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
          9.0
        );
      }
      if (promiseMakhanaSpinRef.current) {
        tl.to(promiseMakhanaSpinRef.current, { rotation: 0, duration: 0.65, ease: "power2.out" }, 9.0);
      }
      if (promiseSealRef.current) {
        tl.to(promiseSealRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, 9.3);
      }

      // Pop Culture Bowl & Sunburst Rays Radiate
      if (bowlBurstRef.current) {
        tl.to(bowlBurstRef.current, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.65, ease: "back.out(1.3)" }, 9.25);
      }
      if (bowlWrapRef.current) {
        tl.to(bowlWrapRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" }, 9.35);
      }

      // Brand Quote & Action CTA Button Pop In
      if (s3QuoteRef.current) {
        tl.to(s3QuoteRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 9.45);
      }
      if (ctaBtnRef.current) {
        tl.to(ctaBtnRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.5)" }, 9.6);
      }

      // --- HOLD SLIDE 3 FINALE ---
      tl.to({}, { duration: 1.6 }); // Steady at Stop 3 until 12.0s

      // =====================================================================
      // 3. ZERO-STUCK HARDWARE SNAPPING (Never Pause in Middle of Any Slide)
      // =====================================================================
      const stopTimes = [0.4, 3.8, 7.4, 11.0];
      const totalDur = tl.duration(); // 12.0
      const snapPoints = stopTimes.map((t) => t / totalDur);

      if (tl.scrollTrigger) {
        tl.scrollTrigger.vars.snap = {
          snapTo: snapPoints,
          duration: { min: 0.35, max: 0.65 },
          delay: 0.04,
          ease: "power2.inOut",
        };
        tl.scrollTrigger.refresh();
      }

      let lockUntil = 0;
      let lockedIdx = 0;
      let touchStartY: number | null = null;
      let touchConsumed = false;

      const getStopScrollY = (idx: number) => {
        const st = tl.scrollTrigger;
        if (!st) return window.scrollY;
        const progress = Math.min(1, Math.max(0, stopTimes[idx] / totalDur));
        return st.start + (st.end - st.start) * progress;
      };

      const getNearestStepIndex = (scrollY: number) => {
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < stopTimes.length; i++) {
          const dist = Math.abs(scrollY - getStopScrollY(i));
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        return bestIdx;
      };

      const isPinnedActive = () => {
        const st = tl.scrollTrigger;
        if (!st) return false;
        const y = window.scrollY;
        return y >= st.start - 8 && y <= st.end + 8;
      };

      const goToStep = (nextIdx: number) => {
        const clamped = Math.max(0, Math.min(stopTimes.length - 1, nextIdx));
        lockedIdx = clamped;
        lockUntil = performance.now() + 720;
        const targetY = getStopScrollY(clamped);
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, {
            duration: 0.72,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
            force: true,
          });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      };

      const onWheel = (e: WheelEvent) => {
        if (!isPinnedActive() || Math.abs(e.deltaY) < 6) return;
        const now = performance.now();
        const activeIdx = now < lockUntil ? lockedIdx : getNearestStepIndex(window.scrollY);
        const dir = e.deltaY > 0 ? 1 : -1;

        if ((dir < 0 && activeIdx <= 0) || (dir > 0 && activeIdx >= stopTimes.length - 1)) {
          return;
        }

        e.preventDefault();
        if (now < lockUntil) return;
        goToStep(activeIdx + dir);
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) {
          touchStartY = null;
          return;
        }
        touchStartY = e.touches[0].clientY;
        touchConsumed = false;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (touchStartY === null || !isPinnedActive() || e.touches.length !== 1) return;
        const dy = e.touches[0].clientY - touchStartY;
        if (Math.abs(dy) < 12) return;

        const now = performance.now();
        const activeIdx = now < lockUntil ? lockedIdx : getNearestStepIndex(window.scrollY);
        const dir = dy < 0 ? 1 : -1;

        if ((dir < 0 && activeIdx <= 0) || (dir > 0 && activeIdx >= stopTimes.length - 1)) {
          return;
        }

        e.preventDefault();
        if (touchConsumed || now < lockUntil) return;
        if (Math.abs(dy) >= 20) {
          touchConsumed = true;
          goToStep(activeIdx + dir);
        }
      };

      const onTouchEnd = () => {
        touchStartY = null;
        touchConsumed = false;
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });

      return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="discover"
      className="relative w-full bg-[#FFF8EE] text-[#522C28] overflow-hidden"
    >
      <div
        ref={pinSectionRef}
        className="relative w-full h-[100svh] min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden"
      >
        {/* Clean Desert Horizon Background */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="/scroll/scroll.webp"
            alt="Pop Culture Desert Landscape Desktop"
            loading="eager"
            decoding="async"
            className="hidden md:block w-full h-full object-cover object-bottom"
          />
          <img
            src="/scroll/mobile scroll.webp"
            alt="Pop Culture Desert Landscape Mobile"
            loading="eager"
            decoding="async"
            className="block md:hidden w-full h-full object-cover object-bottom"
          />
        </div>

        {/* =================================================================
            STOP 0: HEADING HOOK
            ================================================================= */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-5 sm:px-8 -translate-y-8 sm:-translate-y-10 text-center pointer-events-none">
          <h2 className="font-display uppercase tracking-tight flex flex-col items-center justify-center gap-1 sm:gap-1.5">
            <div ref={introLine1OutRef} className="will-change-transform">
              <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 text-[#522C28] text-[28px] min-[420px]:text-[34px] sm:text-[46px] md:text-[56px] lg:text-[64px] leading-[1.04]">
                {["THE", "STORY", "OF"].map((word) => (
                  <span key={word} className="inline-block overflow-hidden py-1.5 -my-1.5">
                    <span className="scroll-intro-word-in font-display inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            </div>

            <div ref={introLine2OutRef} className="will-change-transform">
              <span className="inline-flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 text-[#D73B3A] text-[38px] min-[420px]:text-[46px] sm:text-[64px] md:text-[80px] lg:text-[92px] leading-[0.98]">
                {["THE", "COOLEST", "SNACK"].map((word) => (
                  <span key={word} className="inline-block overflow-hidden py-1.5 -my-1.5">
                    <span className="scroll-intro-word-in font-display inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </h2>
        </div>

        {/* =================================================================
            STOP 1: 100% GLUTEN-FREE & LIGHT AS A CLOUD SEESAW
            ================================================================= */}
        <div
          ref={s1StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-3 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-14">
            {/* Visual Stage: Spacious Seesaw with Real Feather & Falling Makhana */}
            <div className="relative w-[235px] min-[400px]:w-[275px] sm:w-[340px] md:w-[390px] lg:w-[420px] shrink-0">
              <div className="relative w-full aspect-[380/260] flex items-end justify-center pb-6 sm:pb-7">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] h-[82%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

                {/* Orbiting Gluten-Free Badges */}
                <div ref={s1PropsFloatRef} className="absolute inset-0 z-20">
                  <div className="absolute left-[4%] top-[10%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#3CA837] text-[#236B20] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm -rotate-6">
                    <WheatOff className="w-3.5 h-3.5 text-[#3CA837]" />
                    <span>Zero Wheat</span>
                  </div>
                  <div className="absolute right-[4%] top-[14%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#522C28]/80 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D73B3A]" />
                    <span>Celiac Safe</span>
                  </div>
                  <div className="absolute left-[14%] bottom-[8%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#E88938] text-[#9A4A0B] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-3">
                    <Feather className="w-3.5 h-3.5 text-[#E88938]" />
                    <span>Water Lily Seed</span>
                  </div>
                </div>

                {/* Seesaw Base & Triangle Fulcrum */}
                <div
                  ref={seesawBaseRef}
                  className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 flex flex-col items-center z-0 will-change-transform"
                >
                  <svg viewBox="0 0 110 56" fill="none" className="w-full h-auto overflow-visible">
                    <path d="M55 6 L82 48 L28 48 Z" fill="#E88938" stroke="#522C28" strokeWidth="4" strokeLinejoin="round" />
                    <rect x="10" y="45" width="90" height="9" rx="4.5" fill="#522C28" />
                    <circle cx="55" cy="11" r="6" fill="#FAC537" stroke="#522C28" strokeWidth="3" />
                  </svg>
                </div>

                {/* Seesaw Beam */}
                <div
                  ref={seesawBeamRef}
                  className="relative w-[92%] h-5 sm:h-6 mb-7 sm:mb-8 z-10 will-change-transform"
                >
                  <div ref={seesawPlankRef} className="absolute inset-0">
                    <div className="w-full h-3 sm:h-3.5 mt-1 rounded-full bg-[#FAC537] border-[3px] border-[#522C28] shadow-xs" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8EE] border-[3px] border-[#522C28]" />
                    <div className="absolute left-1.5 -top-1 w-16 min-[400px]:w-20 sm:w-24 h-2 rounded-full bg-[#E88938] border-2 border-[#522C28]" />
                    <div className="absolute right-1.5 -top-1 w-16 min-[400px]:w-20 sm:w-24 h-2 rounded-full bg-[#E88938] border-2 border-[#522C28]" />
                  </div>

                  {/* Left Seat: Feather SVG */}
                  <div
                    ref={leftSeatRef}
                    className="absolute left-[4%] bottom-[85%] w-[31%] aspect-[10/7] flex items-end justify-center will-change-transform"
                  >
                    <div ref={cloudDropRef} className="w-full h-full will-change-transform">
                      <svg
                        viewBox="0 0 110 74"
                        fill="none"
                        className="w-full h-full drop-shadow-[0_6px_8px_rgba(82,44,40,0.14)]"
                        aria-label="Illustrated light feather"
                      >
                        <path
                          d="M14 64 C22 50 32 34 50 20 C67 7 86 6 98 11 C96 24 88 37 74 47 L64 47 L69 52 C58 59 44 62 31 61 L22 65 Z"
                          fill="#FFF8EE"
                          stroke="#522C28"
                          strokeWidth="3.8"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M28 57 C45 45 64 31 86 18 C80 30 68 42 52 50 C43 55 34 57 28 57 Z"
                          fill="#FAC537"
                          fillOpacity="0.65"
                        />
                        <path d="M10 66 C30 50 56 32 90 14" stroke="#E88938" strokeWidth="3" />
                      </svg>
                    </div>
                  </div>

                  {/* Right Seat: High-Res Roasted Makhana Puff */}
                  <div
                    ref={rightSeatRef}
                    className="absolute right-[5%] bottom-[82%] w-[28%] aspect-square flex items-end justify-center will-change-transform"
                  >
                    <img
                      ref={s1MakhanaSpinRef}
                      src="/scroll/asset/09_large_single_makhana.png"
                      alt="Single Roasted Makhana Puff"
                      className="w-full h-full object-contain drop-shadow-[0_10px_14px_rgba(82,44,40,0.22)] will-change-transform"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Right: Display Typography + Clean Comparison Matrix */}
            <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div ref={s1TagRef} className="mb-1.5 sm:mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EE] border border-[#3CA837]/40 text-[#2E7D32] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <WheatOff className="w-3.5 h-3.5 text-[#3CA837]" />
                  <span>100% GLUTEN-FREE • LIGHT AS AIR</span>
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight leading-[1.06]">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["LIGHT", "AS", "A", "CLOUD,"].map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="s1-word font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
                <span className="block" />
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["ZERO", "GREASY", "GUILT."].map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="s1-word font-display inline-block will-change-transform text-[#E88938]">{w}</span>
                    </span>
                  ))}
                </span>
              </h3>

              <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="s1-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                  100% Handpicked Water Lily
                </span>
                <span className="s1-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#E88938] stroke-[3]" />
                  Slow-Roasted, Never Fried
                </span>
                <span className="s1-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                  Zero Palm Oil
                </span>
              </div>

              {/* Clean Comparison Box */}
              <div
                ref={s1CompareBoxRef}
                className="mt-3.5 sm:mt-4 w-full max-w-xl rounded-2xl border border-[#522C28]/15 bg-[#FFF8EE]/90 backdrop-blur-[2px] p-2.5 sm:p-4 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left">
                  <div className="rounded-xl bg-[#E8F5E9]/80 border border-[#3CA837]/30 p-2 sm:p-3">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#2E7D32] flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                      Pop Culture Makhana
                    </span>
                    <ul className="mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-bold text-[#25100E]">
                      <li>✦ 100% Lotus seeds (Popped water lily)</li>
                      <li>✦ Roasted with light olive & rice bran mist</li>
                      <li>✦ Zero bloated feeling after snacking</li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[#FFEBEE]/80 border border-[#D73B3A]/25 p-2 sm:p-3">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#C62828] flex items-center gap-1">
                      <X className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                      Conventional Snacks
                    </span>
                    <ul className="mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-medium text-[#522C28]/80">
                      <li>✕ Submerged in cheap palm oil vats</li>
                      <li>✕ Heavy refined wheat (Maida) & fillers</li>
                      <li>✕ Leaves greasy residue on fingers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            STOP 2: HEART HEALTH & CARDIO MONITOR
            ================================================================= */}
        <div
          ref={s2StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-3 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-14">
            {/* Visual Stage: 3-Makhana Drop & Live EKG / Mineral Progress Bars */}
            <div className="relative w-[235px] min-[400px]:w-[275px] sm:w-[340px] md:w-[390px] lg:w-[420px] shrink-0">
              <div className="relative w-full aspect-[380/275] sm:aspect-[380/265]">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] h-[82%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

                {/* Orbiting Mineral Pills */}
                <div ref={s2PropsFloatRef} className="absolute inset-0 z-10">
                  <div className="absolute left-[4%] top-[12%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#D73B3A] text-[#B82928] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm -rotate-6">
                    <Heart className="w-3.5 h-3.5 text-[#D73B3A]" />
                    <span>0mg Cholesterol</span>
                  </div>
                  <div className="absolute right-[4%] top-[16%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#3CA837] text-[#236B20] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-6">
                    <Zap className="w-3.5 h-3.5 text-[#3CA837]" />
                    <span>Rich Potassium</span>
                  </div>
                  <div className="absolute left-[18%] bottom-[8%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#E88938] text-[#9A4A0B] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-3">
                    <Droplets className="w-3.5 h-3.5 text-[#E88938]" />
                    <span>Low Sodium</span>
                  </div>
                </div>

                {/* Three Makhana Cluster Drop */}
                <div
                  ref={s2MakhanaDropRef}
                  className="absolute left-1/2 top-[43%] w-[35%] aspect-square z-10 will-change-transform"
                >
                  <img
                    ref={s2MakhanaSpinRef}
                    src="/scroll/asset/02_three_makhana_cluster.png"
                    alt="Three Crispy Pop Culture Foxnuts"
                    className="w-full h-full object-contain drop-shadow-[0_10px_14px_rgba(82,44,40,0.22)] will-change-transform"
                  />
                </div>

                {/* EKG Heart Pulse & Mineral Monitor Card */}
                <div
                  ref={heartMeterWrapRef}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[92%] rounded-xl border border-[#522C28]/20 bg-[#FFF8EE]/95 p-2 sm:p-2.5 shadow-sm z-20 will-change-transform"
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#522C28]/15">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D73B3A] flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-[#D73B3A]" />
                      Heart & Mineral Monitor
                    </span>
                    <span className="text-[9px] font-extrabold uppercase text-[#236B20] bg-[#3CA837]/15 px-2 py-0.5 rounded-full">
                      K:Na Optimal Ratio
                    </span>
                  </div>

                  {/* EKG Live Line */}
                  <div className="h-8 w-full bg-[#25100E]/05 rounded-md p-1 flex items-center mb-1.5 overflow-hidden">
                    <svg viewBox="0 0 240 28" fill="none" className="w-full h-full">
                      <path
                        ref={ekgPathRef}
                        d="M 0 14 L 35 14 L 45 4 L 55 24 L 65 2 L 75 26 L 85 14 L 150 14 L 160 6 L 170 22 L 180 4 L 190 14 L 240 14"
                        stroke="#D73B3A"
                        strokeWidth="2.5"
                        strokeDasharray="260"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Mineral Bars */}
                  <div className="space-y-1 text-[10px] font-bold text-[#522C28]">
                    <div>
                      <div className="flex justify-between mb-0.5 text-[9px] uppercase tracking-wider">
                        <span>High Potassium (K) — Cardio Fuel</span>
                        <span className="text-[#3CA837] font-black">HIGH</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#522C28]/15 overflow-hidden">
                        <div ref={barKRef} className="h-full w-[88%] rounded-full bg-[#3CA837]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-0.5 text-[9px] uppercase tracking-wider">
                        <span>Magnesium (Mg) — Muscle Recovery</span>
                        <span className="text-[#3CA837] font-black">HIGH</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#522C28]/15 overflow-hidden">
                        <div ref={barMgRef} className="h-full w-[78%] rounded-full bg-[#FAC537]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Right: Typography & Comparison Matrix */}
            <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div ref={s2TagRef} className="mb-1.5 sm:mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EE] border border-[#D73B3A]/40 text-[#D73B3A] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-[#D73B3A]" />
                  <span>HEART HEALTH • CELLULAR RECOVERY</span>
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight leading-[1.06]">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["RICH", "IN", "POTASSIUM,"].map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="s2-word font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
                <span className="block" />
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["ZERO", "TRANS", "FAT."].map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="s2-word font-display inline-block will-change-transform text-[#E88938]">{w}</span>
                    </span>
                  ))}
                </span>
              </h3>

              <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="s2-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                  Cardiovascular Support
                </span>
                <span className="s2-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#E88938] stroke-[3]" />
                  Natural Plant Flavonoids
                </span>
                <span className="s2-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                  0mg Cholesterol
                </span>
              </div>

              {/* Comparison Box */}
              <div
                ref={s2CompareBoxRef}
                className="mt-3.5 sm:mt-4 w-full max-w-xl rounded-2xl border border-[#522C28]/15 bg-[#FFF8EE]/90 backdrop-blur-[2px] p-2.5 sm:p-4 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left">
                  <div className="rounded-xl bg-[#E8F5E9]/80 border border-[#3CA837]/30 p-2 sm:p-3">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#2E7D32] flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                      Cardio Nutrition
                    </span>
                    <ul className="mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-bold text-[#25100E]">
                      <li>✦ Naturally high in Potassium & Magnesium</li>
                      <li>✦ Zero trans fats & zero cholesterol</li>
                      <li>✦ Low sodium mineral balance</li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[#FFEBEE]/80 border border-[#D73B3A]/25 p-2 sm:p-3">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#C62828] flex items-center gap-1">
                      <X className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                      Fried Snack Hazards
                    </span>
                    <ul className="mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-medium text-[#522C28]/80">
                      <li>✕ Dangerous trans fats clog blood vessels</li>
                      <li>✕ Massive salt levels cause sodium spikes</li>
                      <li>✕ Zero beneficial electrolytes or minerals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            STOP 3: 5 SUTTA QUALITY PROMISE & GRAND FLAVOUR BOWL
            (Combined Slides 5 & 6)
            ================================================================= */}
        <div
          ref={s3StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-3 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-14">
            {/* Visual Stage: 5 Sutta Jumbo Pop & Overflowing Pop Culture Bowl */}
            <div className="relative w-[235px] min-[400px]:w-[275px] sm:w-[340px] md:w-[390px] lg:w-[420px] aspect-[380/280] shrink-0 flex items-center justify-center">
              {/* Sunburst Rays Behind Bowl */}
              <svg
                ref={bowlBurstRef}
                viewBox="0 0 320 320"
                fill="none"
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
              >
                {[0, 30, 60, 90, 120, 150].map((deg) => (
                  <line
                    key={deg}
                    x1="160"
                    y1="16"
                    x2="160"
                    y2="304"
                    stroke="#FAC537"
                    strokeOpacity="0.45"
                    strokeWidth="12"
                    strokeLinecap="round"
                    transform={`rotate(${deg} 160 160)`}
                  />
                ))}
                <circle cx="160" cy="160" r="105" fill="#FFF8EE" fillOpacity="0.88" />
              </svg>

              {/* Overflowing Snack Bowl (Front Center) */}
              <div ref={bowlWrapRef} className="relative z-10 w-[70%] aspect-square flex items-center justify-center">
                <img
                  src="/scroll/asset/04_makhana_bowl.png"
                  alt="Overflowing Pop Culture Makhana Bowl"
                  className="w-full h-full object-contain drop-shadow-[0_16px_26px_rgba(82,44,40,0.25)]"
                />
              </div>

              {/* Floating Jumbo 5 Sutta Makhana & Wax Seal (Top-Left) */}
              <div className="absolute top-1 left-1 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8EE] border-2 border-[#522C28] shadow-md">
                <div
                  ref={promiseRingRef}
                  className="w-7 h-7 rounded-full bg-[#FFF3E0] border border-[#E88938] flex items-center justify-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D73B3A]" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs font-black uppercase text-[#25100E] leading-none">
                    5 Sutta Grade
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-[#E88938]">100% Hand-Sorted</div>
                </div>
              </div>

              {/* Freshness Commitment Badge (Bottom-Right) */}
              <div
                ref={promiseSealRef}
                className="absolute bottom-1 right-1 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25100E] text-[#FAC537] text-[10px] font-black uppercase tracking-wider shadow-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-[#3CA837]" />
                <span>Nitrogen Sealed Fresh</span>
              </div>
            </div>

            {/* Content Right: The 5 Sutta Quality Standard + Clickable CTA */}
            <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div ref={s3TagRef} className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] border border-[#E88938]/40 text-[#9A4A0B] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D73B3A]" />
                  <span>THE 5 SUTTA QUALITY STANDARD</span>
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight leading-[1.05]">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["REAL", "JUMBO", "PURITY,"].map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="s3-word font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
                <span className="block" />
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["EXPLORE", "ALL", "CRUNCH."].map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="s3-word font-display inline-block will-change-transform text-[#E88938]">{w}</span>
                    </span>
                  ))}
                </span>
              </h3>

              <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="s3-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                  Purity First
                </span>
                <span className="s3-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#E88938] stroke-[3]" />
                  Handpicked Bihar Lotus
                </span>
                <span className="s3-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                  Batch Slow-Roasted
                </span>
              </div>

              {/* Brand Promise Callout */}
              <div
                ref={s3QuoteRef}
                className="mt-3.5 max-w-xl rounded-2xl border border-[#522C28]/15 border-l-4 border-l-[#D73B3A] bg-[#FFF8EE]/90 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xs text-left"
              >
                <p className="text-[11px] sm:text-xs md:text-sm font-bold text-[#522C28] leading-snug">
                  We bring genuine 5 sutta makhana and boldly seasoned flavours with an unwavering commitment to purity, consistency, and transparency.
                </p>
              </div>

              {/* Direct Call to Action */}
              <div ref={ctaBtnRef} className="mt-4 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => smoothScrollTo("#flavours")}
                  className="px-6 sm:px-8 py-3 rounded-full bg-[#D73B3A] hover:bg-[#B52A29] text-white font-display text-sm sm:text-base font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer ring-2 ring-[#FAC537]/60"
                >
                  <span>Explore All Flavours</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
