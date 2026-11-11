"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Heart,
  Activity,
  ShieldCheck,
  Scale,
  Feather,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function MakhanaBenefitsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const bgDesktopRef = useRef<HTMLImageElement>(null);
  const bgMobileRef = useRef<HTMLImageElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);

  // 6 Benefit Cards Refs
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);

  // 6 Makhana Visuals Refs
  const makhana0Ref = useRef<HTMLDivElement>(null);
  const makhana1Ref = useRef<HTMLDivElement>(null);
  const makhana2Ref = useRef<HTMLDivElement>(null);
  const makhana3Ref = useRef<HTMLDivElement>(null);
  const makhana4Ref = useRef<HTMLDivElement>(null);
  const makhana5Ref = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  const stepMeta = [
    { label: "Gluten-Free", num: "01" },
    { label: "Weight & Satiety", num: "02" },
    { label: "Low GI ~22", num: "03" },
    { label: "Heart Health", num: "04" },
    { label: "Anti-Aging Glow", num: "05" },
    { label: "The Superfood Bowl", num: "06" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const bindLenis = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        return () => lenis.off("scroll", ScrollTrigger.update);
      }
      return undefined;
    };

    let unbindLenis = bindLenis();
    const onLenisReady = () => {
      unbindLenis?.();
      unbindLenis = bindLenis();
    };
    if (!unbindLenis) {
      window.addEventListener("lenis:ready", onLenisReady);
    }

    const container = containerRef.current;
    const pinSection = pinSectionRef.current;
    if (!container || !pinSection) return;

    const cards = [
      card0Ref.current,
      card1Ref.current,
      card2Ref.current,
      card3Ref.current,
      card4Ref.current,
      card5Ref.current,
    ];

    const makhanas = [
      makhana0Ref.current,
      makhana1Ref.current,
      makhana2Ref.current,
      makhana3Ref.current,
      makhana4Ref.current,
      makhana5Ref.current,
    ];

    const ctx = gsap.context(() => {
      // Initialize states: Step 0 is active, Steps 1..5 hidden using autoAlpha
      cards.forEach((card, i) => {
        if (!card) return;
        if (i === 0) {
          gsap.set(card, { yPercent: 0, autoAlpha: 1, pointerEvents: "auto" });
        } else {
          gsap.set(card, { yPercent: 40, autoAlpha: 0, pointerEvents: "none" });
        }
      });

      makhanas.forEach((makhana, i) => {
        if (!makhana) return;
        if (i === 0) {
          gsap.set(makhana, { y: 0, scale: 1, autoAlpha: 1 });
        } else {
          gsap.set(makhana, { y: 40, scale: 0.85, autoAlpha: 0 });
        }
      });

      // Master GSAP Scrollytelling Timeline with Native Pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2600",
          pin: pinSection,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(5, Math.floor(self.progress * 6));
            setActiveStep((prev) => (prev !== step ? step : prev));
          },
        },
      });

      scrollTriggerInstanceRef.current = tl.scrollTrigger || null;

      // Desert Dune subtle scale anchored strictly to the bottom (zero bottom gap)
      if (bgDesktopRef.current) {
        tl.to(
          bgDesktopRef.current,
          { scale: 1.04, transformOrigin: "bottom center", ease: "none", force3D: true },
          0
        );
      }
      if (bgMobileRef.current) {
        tl.to(
          bgMobileRef.current,
          { scale: 1.03, transformOrigin: "bottom center", ease: "none", force3D: true },
          0
        );
      }
      if (cloud1Ref.current) {
        tl.to(cloud1Ref.current, { x: 70, ease: "none", force3D: true }, 0);
      }
      if (cloud2Ref.current) {
        tl.to(cloud2Ref.current, { x: -85, ease: "none", force3D: true }, 0);
      }

      // Step-by-step sequential transitions with autoAlpha
      for (let i = 0; i < 5; i++) {
        const outCard = cards[i];
        const inCard = cards[i + 1];
        const outMakhana = makhanas[i];
        const inMakhana = makhanas[i + 1];

        const timePos = i * 1.0 + 0.15;

        if (outCard && inCard) {
          // Animate previous step OUT
          tl.to(
            outCard,
            {
              yPercent: -40,
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.inOut",
              force3D: true,
            },
            timePos
          );

          if (outMakhana) {
            tl.to(
              outMakhana,
              {
                y: -30,
                scale: 0.85,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
                force3D: true,
              },
              timePos
            );
          }

          // Animate next step IN
          tl.fromTo(
            inCard,
            { yPercent: 40, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.55,
              ease: "back.out(1.2)",
              force3D: true,
            },
            timePos + 0.3
          );

          if (inMakhana) {
            tl.fromTo(
              inMakhana,
              { y: 35, scale: 0.85, autoAlpha: 0 },
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.55,
                ease: "back.out(1.3)",
                force3D: true,
              },
              timePos + 0.3
            );
          }
        }
      }

      // Hold finale state for the remaining scrub
      tl.to({}, { duration: 0.6 });

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        clearTimeout(refreshTimer);
      };
    }, container);

    return () => {
      window.removeEventListener("lenis:ready", onLenisReady);
      unbindLenis?.();
      ctx.revert();
    };
  }, []);

  // Jump to specific step by scrolling
  const scrollToStep = (stepIndex: number) => {
    const st = scrollTriggerInstanceRef.current;
    if (!st) return;
    const targetScroll = st.start + (stepIndex / 5) * (st.end - st.start) + 15;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const scrollToFlavours = () => {
    const el = document.getElementById("flavours");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="benefits"
      className="relative w-full bg-[#FCF4E5] text-[#2B120E] select-none"
    >
      {/* Pinned Viewport Container (GSAP locks this smoothly into the viewport) */}
      <div
        ref={pinSectionRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between [contain:layout_paint]"
      >
        {/* Layer 1: Desert Dune Background Art */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          {/* Desktop Panoramic Dunes */}
          <img
            ref={bgDesktopRef}
            src="/scroll/scroll.webp"
            alt="Makhana Landscape Desert Dunes Desktop"
            loading="lazy"
            decoding="async"
            className="hidden md:block w-full h-full object-cover object-bottom will-change-transform"
          />

          {/* Mobile Vertical Dunes */}
          <img
            ref={bgMobileRef}
            src="/scroll/mobile scroll.webp"
            alt="Makhana Landscape Desert Dunes Mobile"
            loading="lazy"
            decoding="async"
            className="block md:hidden w-full h-full object-cover object-bottom will-change-transform"
          />

          {/* Parallax Floating Clouds */}
          <div
            ref={cloud1Ref}
            className="absolute top-10 left-10 sm:left-24 w-32 sm:w-48 h-12 bg-white/40 rounded-full pointer-events-none will-change-transform"
          />
          <div
            ref={cloud2Ref}
            className="absolute top-24 right-10 sm:right-28 w-36 sm:w-60 h-14 bg-white/35 rounded-full pointer-events-none will-change-transform"
          />
        </div>

        {/* Layer 2: Top Header Bar with Live Step Progress */}
        <div className="relative z-30 pt-4 sm:pt-6 px-4 sm:px-8 max-w-5xl w-full mx-auto flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#D8661E]/20 text-[#D8661E] text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E88938]" />
              <span>THE SUPERFOOD BLUEPRINT</span>
            </span>
          </div>

          {/* Step Pill */}
          <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-[#2B120E]/15 shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold text-[#2B120E]/60 uppercase">
              Step
            </span>
            <span className="text-xs sm:text-sm font-black text-[#D8661E]">
              {stepMeta[activeStep]?.num || "01"}
            </span>
            <span className="text-[10px] sm:text-xs text-[#2B120E]/40">/</span>
            <span className="text-[10px] sm:text-xs font-bold text-[#2B120E]/60">
              06
            </span>
          </div>
        </div>

        {/* Layer 3: Central Showcase (Split: Left Makhana Visual, Right Explanatory Card) */}
        <div className="relative z-30 max-w-5xl w-full mx-auto px-4 sm:px-8 my-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
          
          {/* Left Column: Stack of 6 Hero Makhana Visuals */}
          <div className="relative w-44 sm:w-60 md:w-72 h-44 sm:h-60 md:h-72 flex items-center justify-center shrink-0">
            {/* Ambient Radial Aura (pure gradient, zero blur pass) */}
            <div className="absolute w-44 sm:w-60 md:w-72 h-44 sm:h-60 md:h-72 rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.55)_0%,rgba(255,231,196,0.32)_45%,transparent_72%)] pointer-events-none" />

            {/* Visual 0: Gluten-Free Single Cloud Pop */}
            <div
              ref={makhana0Ref}
              className="absolute inset-0 flex items-center justify-center select-none will-change-transform"
            >
              <img
                src="/scroll/asset/01_single_makhana.png"
                alt="Floating Single Cloud Makhana"
                loading="lazy"
                decoding="async"
                className="max-h-[160px] sm:max-h-[210px] md:max-h-[250px] w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Visual 1: Weight Management Macro Pop with Crumbs */}
            <div
              ref={makhana1Ref}
              className="absolute inset-0 flex items-center justify-center select-none will-change-transform"
            >
              <img
                src="/scroll/asset/06_large_makhana_with_crumbs.png"
                alt="Macro Crunchy Makhana with Crumbs"
                loading="lazy"
                decoding="async"
                className="max-h-[160px] sm:max-h-[210px] md:max-h-[250px] w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Visual 2: Low GI Cracked Makhana Core */}
            <div
              ref={makhana2Ref}
              className="absolute inset-0 flex items-center justify-center select-none will-change-transform"
            >
              <img
                src="/scroll/asset/03_cracked_makhana.png"
                alt="Cracked Crunchy Makhana Core"
                loading="lazy"
                decoding="async"
                className="max-h-[160px] sm:max-h-[210px] md:max-h-[250px] w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Visual 3: Heart Health Three Lotus Pop Cluster */}
            <div
              ref={makhana3Ref}
              className="absolute inset-0 flex items-center justify-center select-none will-change-transform"
            >
              <img
                src="/scroll/asset/02_three_makhana_cluster.png"
                alt="Three Makhana Cluster Orbiting"
                loading="lazy"
                decoding="async"
                className="max-h-[160px] sm:max-h-[210px] md:max-h-[250px] w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Visual 4: Anti-Aging Lotus Leaf Cluster */}
            <div
              ref={makhana4Ref}
              className="absolute inset-0 flex items-center justify-center select-none will-change-transform"
            >
              <img
                src="/scroll/asset/08_makhana_leaf_cluster.png"
                alt="Lotus Leaf and Makhana Cluster"
                loading="lazy"
                decoding="async"
                className="max-h-[160px] sm:max-h-[210px] md:max-h-[250px] w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Visual 5: Grand Finale Overflowing Bowl */}
            <div
              ref={makhana5Ref}
              className="absolute inset-0 flex items-center justify-center select-none will-change-transform"
            >
              <img
                src="/scroll/asset/04_makhana_bowl.png"
                alt="Giant Overflowing Bowl of Makhana"
                loading="lazy"
                decoding="async"
                className="max-h-[180px] sm:max-h-[240px] md:max-h-[290px] w-auto object-contain drop-shadow-lg scale-105"
              />
            </div>
          </div>

          {/* Right Column: Stack of 6 Story Cards */}
          <div className="relative w-full md:flex-1 h-[270px] sm:h-[290px] md:h-[310px] flex items-center justify-center">
            
            {/* Card 0: Naturally 100% Gluten-Free */}
            <div
              ref={card0Ref}
              className="absolute inset-0 flex flex-col justify-center bg-white/95 border border-white/80 p-4 sm:p-6 md:p-7 rounded-3xl shadow-[0_14px_30px_rgba(0,0,0,0.06)] text-center md:text-left will-change-transform"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/25">
                  <Feather className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>100% GLUTEN-FREE • ZERO BLOAT</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[#2B120E] leading-tight">
                LIGHT AS A CLOUD,{" "}
                <span className="text-[#2E7D32]">ZERO STOMACH HEAVINESS</span>
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-[#E88938] mt-0.5 mb-1.5">
                Naturally Celiac Safe & Easy to Digest
              </p>
              <p className="text-xs sm:text-sm text-[#3D1A16]/90 font-medium leading-relaxed mb-3">
                Unlike wheat pretzels or flour-dusted crisps, water lily seeds are naturally 100% gluten-free. They digest smoothly without mid-day lethargy or gut inflammation.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2 border-t border-[#2B120E]/10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🌾 Naturally Celiac Safe
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🪶 Zero Bloat Factor
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🌱 100% Non-GMO
                </span>
              </div>
            </div>

            {/* Card 1: Weight Management & Satiety */}
            <div
              ref={card1Ref}
              className="absolute inset-0 flex flex-col justify-center bg-white/95 border border-white/80 p-4 sm:p-6 md:p-7 rounded-3xl shadow-[0_14px_30px_rgba(0,0,0,0.06)] text-center md:text-left will-change-transform"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#FFF3E0] text-[#D8661E] border border-[#D8661E]/25">
                  <Scale className="w-3.5 h-3.5 text-[#D8661E]" />
                  <span>WEIGHT MANAGEMENT • 67% LESS FAT</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[#2B120E] leading-tight">
                HIGH PROTEIN & FIBER:{" "}
                <span className="text-[#D8661E]">CRUSH UNWANTED CRAVINGS</span>
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-[#E88938] mt-0.5 mb-1.5">
                Satisfying Crunch with 67% Less Fat than Chips
              </p>
              <p className="text-xs sm:text-sm text-[#3D1A16]/90 font-medium leading-relaxed mb-3">
                Rich in dietary fiber and clean plant protein, makhana expands in volume to promote natural fullness. Eat the whole bowl without blowing your daily calorie limit.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2 border-t border-[#2B120E]/10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  ⚖️ 67% Less Fat
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  💪 Clean Plant Protein
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🛑 Low Calorie Density
                </span>
              </div>
            </div>

            {/* Card 2: Blood Sugar Friendly (Low GI ~22) */}
            <div
              ref={card2Ref}
              className="absolute inset-0 flex flex-col justify-center bg-white/95 border border-white/80 p-4 sm:p-6 md:p-7 rounded-3xl shadow-[0_14px_30px_rgba(0,0,0,0.06)] text-center md:text-left will-change-transform"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#E3F2FD] text-[#1976D2] border border-[#1976D2]/25">
                  <Activity className="w-3.5 h-3.5 text-[#1976D2]" />
                  <span>LOW GLYCEMIC INDEX ~22 • NO SPIKES</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[#2B120E] leading-tight">
                LOW GI (INDEX ~22):{" "}
                <span className="text-[#1976D2]">NO 4 PM SUGAR CRASH</span>
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-[#E88938] mt-0.5 mb-1.5">
                Steady, Sustained Metabolic Energy
              </p>
              <p className="text-xs sm:text-sm text-[#3D1A16]/90 font-medium leading-relaxed mb-3">
                With a low GI of ~22, makhana digests slowly into clean glucose. No sudden insulin surge, no trembling blood sugar drop, and zero afternoon brain fog.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2 border-t border-[#2B120E]/10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  📉 Clinical Low GI ~22
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  ⚡ Sustained Vitality
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🩺 Diabetic Friendly
                </span>
              </div>
            </div>

            {/* Card 3: Heart Health & Zero Cholesterol */}
            <div
              ref={card3Ref}
              className="absolute inset-0 flex flex-col justify-center bg-white/95 border border-white/80 p-4 sm:p-6 md:p-7 rounded-3xl shadow-[0_14px_30px_rgba(0,0,0,0.06)] text-center md:text-left will-change-transform"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#FCE4EC] text-[#C2185B] border border-[#C2185B]/25">
                  <Heart className="w-3.5 h-3.5 text-[#C2185B]" />
                  <span>HEART HEALTH • 0mg CHOLESTEROL</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[#2B120E] leading-tight">
                POTASSIUM & MAGNESIUM,{" "}
                <span className="text-[#C2185B]">ZERO TRANS FATS</span>
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-[#E88938] mt-0.5 mb-1.5">
                Regulate Blood Pressure & Support Circulation
              </p>
              <p className="text-xs sm:text-sm text-[#3D1A16]/90 font-medium leading-relaxed mb-3">
                Naturally sodium-light and 100% free from cholesterol and trans fats. Rich in potassium and magnesium to support relaxed blood vessels and healthy circulation.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2 border-t border-[#2B120E]/10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  ❤️ 0mg Cholesterol
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🧂 Naturally Low Sodium
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  ⚡ Potassium & Magnesium
                </span>
              </div>
            </div>

            {/* Card 4: Anti-Aging Antioxidants */}
            <div
              ref={card4Ref}
              className="absolute inset-0 flex flex-col justify-center bg-white/95 border border-white/80 p-4 sm:p-6 md:p-7 rounded-3xl shadow-[0_14px_30px_rgba(0,0,0,0.06)] text-center md:text-left will-change-transform"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#F3E5F5] text-[#7B1FA2] border border-[#7B1FA2]/25">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7B1FA2]" />
                  <span>ANTIOXIDANT DEFENSE • CELLULAR GLOW</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[#2B120E] leading-tight">
                FLAVONOIDS & GALLIC ACID:{" "}
                <span className="text-[#7B1FA2]">PROTECT YOUR RADIANCE</span>
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-[#E88938] mt-0.5 mb-1.5">
                Neutralize Free Radicals & Support Collagen
              </p>
              <p className="text-xs sm:text-sm text-[#3D1A16]/90 font-medium leading-relaxed mb-3">
                Packed with gallic acid and natural flavonoids that combat oxidative stress, reduce cellular inflammation, and help maintain youthful skin elasticity.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2 border-t border-[#2B120E]/10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  ✨ Powerful Flavonoids
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🛡️ Free Radical Defense
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#2B120E] text-[10px] sm:text-xs font-bold border border-[#D8661E]/15">
                  🌟 Skin Elasticity Support
                </span>
              </div>
            </div>

            {/* Card 5: The Grand Finale Bowl */}
            <div
              ref={card5Ref}
              className="absolute inset-0 flex flex-col justify-center bg-white/95 border border-[#D8661E]/30 p-4 sm:p-6 md:p-7 rounded-3xl shadow-[0_16px_35px_rgba(216,102,30,0.15)] text-center md:text-left will-change-transform"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#FFF3E0] text-[#E65100] border border-[#E65100]/25">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>THE GOLD STANDARD OF SNACKING</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[#2B120E] leading-tight">
                UPGRADE YOUR MUNCHIES:{" "}
                <span className="text-[#D8661E]">POP CULTURE</span>
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-[#E88938] mt-0.5 mb-1.5">
                100% Roasted Goodness • 3 Explosive Flavours
              </p>
              <p className="text-xs sm:text-sm text-[#3D1A16]/90 font-medium leading-relaxed mb-3">
                Why compromise health for crunch when you can have both? Enjoy slow-roasted golden lotus seeds tossed in Peri Peri, aged cheddar cheese, or Himalayan salt.
              </p>
              <div className="pt-2 border-t border-[#2B120E]/10 flex items-center justify-center md:justify-start gap-2.5">
                <button
                  onClick={scrollToFlavours}
                  className="px-5 py-2.5 rounded-full bg-[#D8661E] hover:bg-[#B84B12] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-[#D8661E]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>EXPLORE ALL 3 FLAVOURS</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Layer 4: Bottom Navigation Bar with Interactive Dot Stepper */}
        <div className="relative z-30 pb-4 sm:pb-6 px-4 sm:px-8 max-w-5xl w-full mx-auto flex items-center justify-between shrink-0">
          
          {/* Previous Button */}
          <button
            onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            aria-label="Previous Benefit"
            className="p-2 sm:p-2.5 rounded-full bg-white/95 border border-[#2B120E]/15 text-[#2B120E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white shadow-xs transition-[transform,opacity,background-color] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 bg-white/95 px-3.5 py-1.5 rounded-full border border-[#2B120E]/15 shadow-xs">
            {stepMeta.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.num}
                  onClick={() => scrollToStep(idx)}
                  aria-label={`Jump to ${s.label}`}
                  title={`${s.num} ${s.label}`}
                  className={`transition-[width,background-color] duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                    isActive
                      ? "w-6 sm:w-7 h-2 sm:h-2.5 bg-[#D8661E] shadow-xs"
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#2B120E]/25 hover:bg-[#2B120E]/50"
                  }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => scrollToStep(Math.min(5, activeStep + 1))}
            disabled={activeStep === 5}
            aria-label="Next Benefit"
            className="p-2 sm:p-2.5 rounded-full bg-white/95 border border-[#2B120E]/15 text-[#2B120E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white shadow-xs transition-[transform,opacity,background-color] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </section>
  );
}
