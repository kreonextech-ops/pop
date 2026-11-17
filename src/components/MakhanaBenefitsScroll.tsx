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
  Activity,
  Zap,
  Heart,
  Droplets,
  Shield,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

type WordSegment = {
  text: string;
  accent?: boolean;
};

type BenefitDualProps = {
  stageRef: React.RefObject<HTMLDivElement>;
  tagBgClass: string;
  tagIcon: React.ReactNode;
  tagText: string;
  headlineLine1: WordSegment[];
  headlineLine2: WordSegment[];
  wordsClass: string;
  pills: { icon: React.ReactNode; label: string }[];
  pillsClass: string;
  compareBoxRef: React.RefObject<HTMLDivElement>;
  whatsInList: string[];
  whatsNotList: string[];
  visualComponent: React.ReactNode;
};

function BenefitSlideLayout({
  stageRef,
  tagBgClass,
  tagIcon,
  tagText,
  headlineLine1,
  headlineLine2,
  wordsClass,
  pills,
  pillsClass,
  compareBoxRef,
  whatsInList,
  whatsNotList,
  visualComponent,
}: BenefitDualProps) {
  return (
    <div
      ref={stageRef}
      className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
    >
      <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-3 flex flex-col md:flex-row items-center justify-center gap-3 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-14">
        {/* Left Column: Visual Graphics Stage */}
        <div className="relative w-[240px] min-[400px]:w-[280px] sm:w-[350px] md:w-[400px] lg:w-[430px] shrink-0">
          {visualComponent}
        </div>

        {/* Right Column: Display Copy + Comparison Matrix */}
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Category Tag */}
          <div className="mb-1.5 sm:mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border ${tagBgClass}`}
            >
              {tagIcon}
              <span>{tagText}</span>
            </span>
          </div>

          {/* Dual Headline */}
          <h3 className="font-display uppercase tracking-tight leading-[1.06]">
            <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 min-[400px]:gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[22px] min-[400px]:text-[26px] sm:text-[34px] md:text-[38px] lg:text-[44px]">
              {headlineLine1.map((w, idx) => (
                <span key={`${w.text}-${idx}`} className="inline-block overflow-hidden py-1 -my-1">
                  <span
                    className={`${wordsClass} font-display inline-block will-change-transform ${
                      w.accent ? "text-[#D73B3A]" : ""
                    }`}
                  >
                    {w.text}
                  </span>
                </span>
              ))}
            </span>
            <span className="block" />
            <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 min-[400px]:gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[22px] min-[400px]:text-[26px] sm:text-[34px] md:text-[38px] lg:text-[44px]">
              {headlineLine2.map((w, idx) => (
                <span key={`${w.text}-${idx}`} className="inline-block overflow-hidden py-1 -my-1">
                  <span
                    className={`${wordsClass} font-display inline-block will-change-transform ${
                      w.accent ? "text-[#E88938]" : ""
                    }`}
                  >
                    {w.text}
                  </span>
                </span>
              ))}
            </span>
          </h3>

          {/* Quick Pillar Pills */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            {pills.map((p, idx) => (
              <span
                key={idx}
                className={`${pillsClass} inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-xs`}
              >
                {p.icon}
                <span>{p.label}</span>
              </span>
            ))}
          </div>

          {/* Comparison Matrix (What's In vs What's Out) */}
          <div
            ref={compareBoxRef}
            className="mt-3 sm:mt-4 w-full max-w-xl rounded-2xl border border-[#522C28]/15 bg-[#FFF8EE]/90 backdrop-blur-[2px] p-2.5 sm:p-4 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left">
              {/* Pop Culture Side */}
              <div className="rounded-xl bg-[#E8F5E9]/80 border border-[#3CA837]/30 p-2 sm:p-3">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#2E7D32] flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                  Pop Culture Makhana
                </span>
                <ul className="mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-bold text-[#25100E]">
                  {whatsInList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-[#3CA837] font-black shrink-0">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conventional Fried Snacks Side */}
              <div className="rounded-xl bg-[#FFEBEE]/80 border border-[#D73B3A]/25 p-2 sm:p-3">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#C62828] flex items-center gap-1">
                  <X className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                  Conventional Snacks
                </span>
                <ul className="mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-medium text-[#522C28]/80">
                  {whatsNotList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <X className="w-2.5 h-2.5 text-[#D73B3A] shrink-0 mt-0.5 stroke-[3]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MakhanaBenefitsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);

  // Stop 0: Intro Heading
  const introLine1OutRef = useRef<HTMLDivElement>(null);
  const introLine2OutRef = useRef<HTMLDivElement>(null);

  // Stop 1: Benefits 1 (Gluten-Free & Low GI)
  const slide1StageRef = useRef<HTMLDivElement>(null);
  const slide1CompareBoxRef = useRef<HTMLDivElement>(null);
  const seesawBaseRef = useRef<HTMLDivElement>(null);
  const seesawBeamRef = useRef<HTMLDivElement>(null);
  const seesawPlankRef = useRef<HTMLDivElement>(null);
  const leftSeatRef = useRef<HTMLDivElement>(null);
  const cloudDropRef = useRef<HTMLDivElement>(null);
  const rightSeatRef = useRef<HTMLDivElement>(null);
  const makhanaSpin1Ref = useRef<HTMLImageElement>(null);
  const giChartWrapRef = useRef<HTMLDivElement>(null);
  const giSteadyPathRef = useRef<SVGPathElement>(null);
  const giSpikePathRef = useRef<SVGPathElement>(null);

  // Stop 2: Benefits 2 (Heart Health & Antioxidants)
  const slide2StageRef = useRef<HTMLDivElement>(null);
  const slide2CompareBoxRef = useRef<HTMLDivElement>(null);
  const heartMeterWrapRef = useRef<HTMLDivElement>(null);
  const ekgPathRef = useRef<SVGPathElement>(null);
  const barKRef = useRef<HTMLDivElement>(null);
  const barMgRef = useRef<HTMLDivElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);
  const shieldRingRef = useRef<SVGCircleElement>(null);
  const makhanaSpin2Ref = useRef<HTMLImageElement>(null);

  // Stop 3: 5 Sutta Promise + Grand Flavour Bowl & CTA
  const slide3StageRef = useRef<HTMLDivElement>(null);
  const promiseRingRef = useRef<HTMLDivElement>(null);
  const promiseMakhanaDropRef = useRef<HTMLDivElement>(null);
  const promiseMakhanaSpinRef = useRef<HTMLImageElement>(null);
  const promiseSealRef = useRef<HTMLDivElement>(null);
  const bowlWrapRef = useRef<HTMLDivElement>(null);
  const bowlBurstRef = useRef<SVGSVGElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);

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
      const s1Words = gsap.utils.toArray<HTMLElement>(".slide1-word");
      const s1Pills = gsap.utils.toArray<HTMLElement>(".slide1-pill");
      const s2Words = gsap.utils.toArray<HTMLElement>(".slide2-word");
      const s2Pills = gsap.utils.toArray<HTMLElement>(".slide2-pill");
      const s3Words = gsap.utils.toArray<HTMLElement>(".slide3-word");
      const s3Pills = gsap.utils.toArray<HTMLElement>(".slide3-pill");

      // =====================================================================
      // 1. Initial State Setup
      // =====================================================================
      gsap.set(introWords, { yPercent: 110, scale: 0.94, autoAlpha: 0 });

      [slide1StageRef.current, slide2StageRef.current, slide3StageRef.current].forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: 0 });
      });

      // Slide 1 Initial
      gsap.set(s1Words, { yPercent: 110, autoAlpha: 0 });
      gsap.set(s1Pills, { autoAlpha: 0, y: 8, scale: 0.92 });
      if (slide1CompareBoxRef.current) gsap.set(slide1CompareBoxRef.current, { autoAlpha: 0, y: 12 });
      if (seesawBaseRef.current) gsap.set(seesawBaseRef.current, { autoAlpha: 0, y: 15 });
      if (seesawPlankRef.current) gsap.set(seesawPlankRef.current, { autoAlpha: 0 });
      if (seesawBeamRef.current) gsap.set(seesawBeamRef.current, { rotation: 0 });
      if (cloudDropRef.current) gsap.set(cloudDropRef.current, { autoAlpha: 0, y: -40 });
      if (rightSeatRef.current) gsap.set(rightSeatRef.current, { autoAlpha: 0, y: -60, scale: 1.2 });
      if (giChartWrapRef.current) gsap.set(giChartWrapRef.current, { autoAlpha: 0, y: 16 });
      if (giSteadyPathRef.current) gsap.set(giSteadyPathRef.current, { strokeDashoffset: 300 });
      if (giSpikePathRef.current) gsap.set(giSpikePathRef.current, { strokeDashoffset: 300 });

      // Slide 2 Initial
      gsap.set(s2Words, { yPercent: 110, autoAlpha: 0 });
      gsap.set(s2Pills, { autoAlpha: 0, y: 8, scale: 0.92 });
      if (slide2CompareBoxRef.current) gsap.set(slide2CompareBoxRef.current, { autoAlpha: 0, y: 12 });
      if (heartMeterWrapRef.current) gsap.set(heartMeterWrapRef.current, { autoAlpha: 0, y: 16 });
      if (ekgPathRef.current) gsap.set(ekgPathRef.current, { strokeDashoffset: 260 });
      if (barKRef.current) gsap.set(barKRef.current, { scaleX: 0, transformOrigin: "left center" });
      if (barMgRef.current) gsap.set(barMgRef.current, { scaleX: 0, transformOrigin: "left center" });
      if (shieldWrapRef.current) gsap.set(shieldWrapRef.current, { autoAlpha: 0, scale: 0.88 });
      if (shieldRingRef.current) gsap.set(shieldRingRef.current, { strokeDashoffset: 280 });

      // Slide 3 Initial
      gsap.set(s3Words, { yPercent: 110, autoAlpha: 0 });
      gsap.set(s3Pills, { autoAlpha: 0, y: 8, scale: 0.92 });
      if (promiseRingRef.current) gsap.set(promiseRingRef.current, { autoAlpha: 0, scale: 0.85 });
      if (promiseMakhanaDropRef.current) gsap.set(promiseMakhanaDropRef.current, { autoAlpha: 0, y: -80, scale: 0.9 });
      if (promiseSealRef.current) gsap.set(promiseSealRef.current, { autoAlpha: 0, y: 10, scale: 0.9 });
      if (bowlBurstRef.current) gsap.set(bowlBurstRef.current, { autoAlpha: 0, scale: 0.8, rotation: -30 });
      if (bowlWrapRef.current) gsap.set(bowlWrapRef.current, { autoAlpha: 0, y: 30, scale: 0.92 });
      if (ctaWrapRef.current) gsap.set(ctaWrapRef.current, { autoAlpha: 0, y: 15, scale: 0.95 });

      // Intro Entrance when user approaches section
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
      // 2. Main Timeline: Heading + 3 Content Slides (Tight & Fast Pin)
      // =====================================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=3600",
          pin: pinSection,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Time Normalized Positions (Total duration: 10.0 seconds)
      // Stop 0 (Heading): 0.0 - 1.2
      // Stop 1 (Slide 1): 2.4 - 4.4
      // Stop 2 (Slide 2): 5.4 - 7.4
      // Stop 3 (Slide 3): 8.4 - 10.0

      // --- TRANSITION 0 -> 1: Heading Out, Slide 1 In ---
      tl.to({}, { duration: 1.2 }); // Hold Heading at start

      tl.to(
        introExitLines,
        {
          y: -36,
          scale: 0.95,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        1.2
      );

      // Slide 1 Entrance (1.8 -> 2.6)
      if (slide1StageRef.current) {
        tl.to(slide1StageRef.current, { autoAlpha: 1, duration: 0.2 }, 1.7);
      }
      tl.to(s1Words, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 1.8);
      tl.to(s1Pills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.3)" }, 2.0);
      if (slide1CompareBoxRef.current) {
        tl.to(slide1CompareBoxRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2.15);
      }

      // Slide 1 Graphics: Seesaw & Energy Curve
      if (seesawBaseRef.current) tl.to(seesawBaseRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, 1.8);
      if (seesawPlankRef.current) tl.to(seesawPlankRef.current, { autoAlpha: 1, duration: 0.2 }, 1.9);
      if (cloudDropRef.current) tl.to(cloudDropRef.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, 1.95);
      if (rightSeatRef.current) {
        tl.to(
          rightSeatRef.current,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "bounce.out" },
          2.05
        );
      }
      if (makhanaSpin1Ref.current) {
        tl.to(makhanaSpin1Ref.current, { rotation: 180, duration: 0.8, ease: "power2.out" }, 2.05);
      }
      if (seesawBeamRef.current) {
        tl.to(seesawBeamRef.current, { rotation: -7, duration: 0.45, ease: "power2.out" }, 2.15);
      }
      if (giChartWrapRef.current) tl.to(giChartWrapRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.2);
      if (giSteadyPathRef.current) {
        tl.to(giSteadyPathRef.current, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, 2.25);
      }
      if (giSpikePathRef.current) {
        tl.to(giSpikePathRef.current, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, 2.3);
      }

      // --- HOLD SLIDE 1 ---
      tl.to({}, { duration: 1.8 }, 2.6); // Steady rest at Stop 1 until 4.4

      // --- TRANSITION 1 -> 2: Slide 1 Out, Slide 2 In ---
      if (slide1StageRef.current) {
        tl.to(
          slide1StageRef.current,
          { y: -36, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
          4.4
        );
      }

      // Slide 2 Entrance (4.8 -> 5.6)
      if (slide2StageRef.current) {
        tl.to(slide2StageRef.current, { autoAlpha: 1, duration: 0.2 }, 4.7);
      }
      tl.to(s2Words, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 4.8);
      tl.to(s2Pills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.3)" }, 5.0);
      if (slide2CompareBoxRef.current) {
        tl.to(slide2CompareBoxRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 5.15);
      }

      // Slide 2 Graphics: EKG Heart Pulse & Antioxidant Shield
      if (heartMeterWrapRef.current) tl.to(heartMeterWrapRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 4.8);
      if (ekgPathRef.current) {
        tl.to(ekgPathRef.current, { strokeDashoffset: 0, duration: 0.65, ease: "power1.inOut" }, 4.9);
      }
      if (barKRef.current) tl.to(barKRef.current, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 5.1);
      if (barMgRef.current) tl.to(barMgRef.current, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 5.2);
      if (shieldWrapRef.current) {
        tl.to(shieldWrapRef.current, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.2)" }, 5.05);
      }
      if (shieldRingRef.current) {
        tl.to(shieldRingRef.current, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, 5.15);
      }
      if (makhanaSpin2Ref.current) {
        tl.to(makhanaSpin2Ref.current, { rotation: 220, duration: 0.8, ease: "power2.out" }, 5.0);
      }

      // --- HOLD SLIDE 2 ---
      tl.to({}, { duration: 1.8 }, 5.6); // Steady rest at Stop 2 until 7.4

      // --- TRANSITION 2 -> 3: Slide 2 Out, Slide 3 (Promise + Finale) In ---
      if (slide2StageRef.current) {
        tl.to(
          slide2StageRef.current,
          { y: -36, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
          7.4
        );
      }

      // Slide 3 Entrance (7.8 -> 8.6)
      if (slide3StageRef.current) {
        tl.to(slide3StageRef.current, { autoAlpha: 1, duration: 0.2 }, 7.7);
      }
      tl.to(s3Words, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 7.8);
      tl.to(s3Pills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.3)" }, 8.0);
      if (promiseRingRef.current) {
        tl.to(promiseRingRef.current, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.2)" }, 7.85);
      }
      if (promiseMakhanaDropRef.current) {
        tl.to(
          promiseMakhanaDropRef.current,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "bounce.out" },
          7.9
        );
      }
      if (promiseMakhanaSpinRef.current) {
        tl.to(promiseMakhanaSpinRef.current, { rotation: 180, duration: 0.8, ease: "power2.out" }, 7.9);
      }
      if (promiseSealRef.current) {
        tl.to(promiseSealRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.3)" }, 8.1);
      }
      if (bowlBurstRef.current) {
        tl.to(bowlBurstRef.current, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.2)" }, 7.95);
      }
      if (bowlWrapRef.current) {
        tl.to(bowlWrapRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }, 8.05);
      }
      if (ctaWrapRef.current) {
        tl.to(ctaWrapRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, 8.25);
      }

      // --- HOLD SLIDE 3 FINALE ---
      tl.to({}, { duration: 1.4 }, 8.6); // Steady rest at Stop 3 until 10.0

      // =====================================================================
      // 3. ZERO-STUCK STRICT SNAP & GESTURE STEPPING
      // (Impossible to stop mid-animation; snaps squarely to nearest slide)
      // =====================================================================
      const stopTimes = [0.4, 3.4, 6.4, 9.4];
      const totalDur = tl.duration(); // 10.0
      const snapPoints = stopTimes.map((t) => t / totalDur);

      // Attach ScrollTrigger Snap so any native scroll release automatically locks onto nearest slide
      if (tl.scrollTrigger) {
        tl.scrollTrigger.vars.snap = {
          snapTo: snapPoints,
          duration: { min: 0.28, max: 0.6 },
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
        lockUntil = performance.now() + 680;
        const targetY = getStopScrollY(clamped);
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, {
            duration: 0.65,
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

        // Release at boundaries so user can naturally scroll to other sections
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
        {/* Background Layer (Clean Desert Horizon) */}
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
            STOP 1: BENEFITS 1 — LIGHTNESS & SUSTAINED FUEL
            ================================================================= */}
        <BenefitSlideLayout
          stageRef={slide1StageRef}
          tagBgClass="bg-[#FFF8EE] border-[#3CA837]/40 text-[#2E7D32]"
          tagIcon={<WheatOff className="w-3.5 h-3.5 text-[#3CA837]" />}
          tagText="100% GLUTEN-FREE • LOW GI ~22"
          headlineLine1={[{ text: "LIGHT" }, { text: "AS" }, { text: "A" }, { text: "CLOUD,", accent: true }]}
          headlineLine2={[{ text: "STEADY" }, { text: "ALL-DAY" }, { text: "ENERGY." }]}
          wordsClass="slide1-word"
          pills={[
            { icon: <Feather className="w-3 h-3 text-[#E88938]" />, label: "Water Lily Pops" },
            { icon: <Zap className="w-3 h-3 text-[#FAC537]" />, label: "Low GI (~22)" },
            { icon: <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />, label: "Zero Wheat Bloat" },
          ]}
          pillsClass="slide1-pill"
          compareBoxRef={slide1CompareBoxRef}
          whatsInList={[
            "100% Handpicked Water Lily Seeds",
            "Slow-roasted in olive & rice bran oil mist",
            "Sustained slow-burn complex carbohydrates",
            "Zero bloated heaviness after snacking",
          ]}
          whatsNotList={[
            "Deep-fried in palm oil vats",
            "Refined wheat (Maida) & gluten fillers",
            "Rapid sugar spikes and sluggish crashes",
            "Greasy oily film on your fingers",
          ]}
          visualComponent={
            <div className="relative w-full aspect-[380/280] flex flex-col items-center justify-end pb-2">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

              {/* Top: Seesaw Graphic */}
              <div className="relative w-full h-[150px] sm:h-[180px] flex items-end justify-center mb-1">
                {/* Fulcrum Base */}
                <div
                  ref={seesawBaseRef}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 sm:w-24 flex flex-col items-center z-0 will-change-transform"
                >
                  <svg viewBox="0 0 110 56" fill="none" className="w-full h-auto">
                    <path d="M55 6 L82 48 L28 48 Z" fill="#E88938" stroke="#522C28" strokeWidth="4" strokeLinejoin="round" />
                    <rect x="10" y="45" width="90" height="9" rx="4.5" fill="#522C28" />
                    <circle cx="55" cy="11" r="6" fill="#FAC537" stroke="#522C28" strokeWidth="3" />
                  </svg>
                </div>

                {/* Seesaw Plank Beam */}
                <div
                  ref={seesawBeamRef}
                  className="relative w-[88%] h-5 sm:h-6 mb-6 sm:mb-7 z-10 will-change-transform"
                >
                  <div ref={seesawPlankRef} className="absolute inset-0">
                    <div className="w-full h-3 rounded-full bg-[#FAC537] border-[3px] border-[#522C28]" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8EE] border-[3px] border-[#522C28]" />
                  </div>

                  {/* Left: Heavy Junk Drop */}
                  <div
                    ref={leftSeatRef}
                    className="absolute left-[3%] bottom-[80%] w-[32%] aspect-[10/7] flex items-end justify-center will-change-transform"
                  >
                    <div ref={cloudDropRef} className="w-full h-full flex flex-col items-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#D73B3A] text-white text-[9px] font-black uppercase tracking-wider">
                        HEAVY JUNK
                      </span>
                      <svg viewBox="0 0 70 32" fill="none" className="w-14 h-auto mt-1 opacity-80">
                        <ellipse cx="35" cy="16" rx="30" ry="12" fill="#522C28" fillOpacity="0.25" />
                      </svg>
                    </div>
                  </div>

                  {/* Right: Light Feather Makhana Drop */}
                  <div
                    ref={rightSeatRef}
                    className="absolute right-[3%] bottom-[85%] w-[32%] aspect-square flex items-end justify-center will-change-transform"
                  >
                    <img
                      ref={makhanaSpin1Ref}
                      src="/scroll/asset/01_makhana_with_salt.png"
                      alt="Super Light Foxnut"
                      className="w-full h-full object-contain drop-shadow-[0_10px_16px_rgba(82,44,40,0.2)]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom: Steady Energy Wave Strip */}
              <div
                ref={giChartWrapRef}
                className="w-full max-w-[280px] sm:max-w-[320px] rounded-xl border border-[#522C28]/15 bg-white/95 px-3 py-2 shadow-xs z-10"
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                  <span className="text-[#3CA837] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3CA837]" /> Pop Culture (Steady ~22)
                  </span>
                  <span className="text-[#D73B3A] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#D73B3A]" /> Sugar Crash (70+)
                  </span>
                </div>
                <svg viewBox="0 0 240 40" fill="none" className="w-full h-7 overflow-visible">
                  {/* Crash Spike */}
                  <path
                    ref={giSpikePathRef}
                    d="M 10 32 Q 50 2, 80 10 T 150 35 T 230 36"
                    stroke="#D73B3A"
                    strokeWidth="2.5"
                    strokeDasharray="300"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Steady Wave */}
                  <path
                    ref={giSteadyPathRef}
                    d="M 10 28 Q 70 20, 130 22 T 230 20"
                    stroke="#3CA837"
                    strokeWidth="3.2"
                    strokeDasharray="300"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          }
        />

        {/* =================================================================
            STOP 2: BENEFITS 2 — HEART HEALTH & CELLULAR DEFENCE
            ================================================================= */}
        <BenefitSlideLayout
          stageRef={slide2StageRef}
          tagBgClass="bg-[#FFF8EE] border-[#D73B3A]/40 text-[#D73B3A]"
          tagIcon={<Heart className="w-3.5 h-3.5 text-[#D73B3A]" />}
          tagText="HEART-LOVING • CELLULAR DEFENCE"
          headlineLine1={[{ text: "RICH" }, { text: "IN" }, { text: "POTASSIUM,", accent: true }]}
          headlineLine2={[{ text: "ANTIOXIDANT" }, { text: "SHIELD." }]}
          wordsClass="slide2-word"
          pills={[
            { icon: <Activity className="w-3 h-3 text-[#D73B3A]" />, label: "High Potassium (K)" },
            { icon: <Shield className="w-3 h-3 text-[#3CA837]" />, label: "Kaempferol Flavonoids" },
            { icon: <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />, label: "0g Trans Fat" },
          ]}
          pillsClass="slide2-pill"
          compareBoxRef={slide2CompareBoxRef}
          whatsInList={[
            "Rich in Potassium & Magnesium for cardiovascular health",
            "Potent Kaempferol flavonoids fight cellular oxidation",
            "Low sodium natural mineral balance",
            "0mg Cholesterol & 0g Trans Fat per serving",
          ]}
          whatsNotList={[
            "High sodium causing sudden blood pressure spikes",
            "Atherogenic trans-fats clogging arteries",
            "Synthetic chemical preservatives (TBHQ / BHA)",
            "Inflammatory oxidised frying oils",
          ]}
          visualComponent={
            <div className="relative w-full aspect-[380/280] flex flex-col items-center justify-center p-2">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

              {/* Heart Pulse EKG & Mineral Bar Card */}
              <div
                ref={heartMeterWrapRef}
                className="w-full max-w-[290px] sm:max-w-[330px] rounded-2xl border border-[#522C28]/15 bg-white/95 p-3 shadow-sm z-10"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#522C28]/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D73B3A] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-[#D73B3A]" />
                    Cardio Mineral Matrix
                  </span>
                  <span className="text-[9px] font-bold text-[#3CA837] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                    Optimal K : Na
                  </span>
                </div>

                {/* EKG Live Line */}
                <div className="h-9 w-full bg-[#FFF8EE] rounded-lg p-1 flex items-center mb-2.5 overflow-hidden">
                  <svg viewBox="0 0 240 32" fill="none" className="w-full h-full overflow-visible">
                    <path
                      ref={ekgPathRef}
                      d="M 0 16 L 40 16 L 50 6 L 62 26 L 74 2 L 86 28 L 96 16 L 160 16 L 170 8 L 180 24 L 190 4 L 200 16 L 240 16"
                      stroke="#D73B3A"
                      strokeWidth="2.4"
                      strokeDasharray="260"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Mineral Meters */}
                <div className="space-y-1.5 text-[10px] font-bold text-[#522C28]">
                  <div>
                    <div className="flex justify-between mb-0.5 text-[9px] uppercase tracking-wider">
                      <span>Potassium (K) — Muscle & Heart</span>
                      <span className="text-[#3CA837] font-black">HIGH</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#522C28]/10 overflow-hidden">
                      <div ref={barKRef} className="h-full w-[88%] rounded-full bg-[#3CA837]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5 text-[9px] uppercase tracking-wider">
                      <span>Magnesium (Mg) — Cellular Recovery</span>
                      <span className="text-[#3CA837] font-black">HIGH</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#522C28]/10 overflow-hidden">
                      <div ref={barMgRef} className="h-full w-[78%] rounded-full bg-[#FAC537]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Shield & Makhana Badge */}
              <div
                ref={shieldWrapRef}
                className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 shadow-xs z-10"
              >
                <div className="w-7 h-7 relative flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      ref={shieldRingRef}
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#3CA837"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="280"
                    />
                  </svg>
                  <img
                    ref={makhanaSpin2Ref}
                    src="/scroll/asset/02_makhana_cheese.png"
                    alt="Antioxidant Makhana"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-[#25100E] leading-tight">
                    Kaempferol Flavonoids
                  </div>
                  <div className="text-[9px] font-bold text-[#3CA837]">Natural Cellular Protection</div>
                </div>
              </div>
            </div>
          }
        />

        {/* =================================================================
            STOP 3: THE 5 SUTTA PROMISE + GRAND FLAVOUR BOWL & CTA
            (Merged Slides 5 & 6)
            ================================================================= */}
        <div
          ref={slide3StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-3 flex flex-col md:flex-row items-center justify-center gap-3 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-14">
            {/* Visual Left: 5 Sutta Jumbo Wax Seal & Overflowing Flavour Bowl */}
            <div className="relative w-[240px] min-[400px]:w-[280px] sm:w-[350px] md:w-[400px] lg:w-[430px] aspect-[400/320] shrink-0 flex items-center justify-center">
              {/* Background Sunburst Behind Bowl */}
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

              {/* Overflowing Snack Bowl (Front & Center) */}
              <div ref={bowlWrapRef} className="relative z-10 w-[68%] aspect-square flex items-center justify-center">
                <img
                  src="/scroll/asset/04_makhana_bowl.png"
                  alt="Overflowing Pop Culture Makhana Bowl"
                  className="w-full h-full object-contain drop-shadow-[0_16px_26px_rgba(82,44,40,0.25)]"
                />
              </div>

              {/* Floating Jumbo 5 Sutta Seal Badge (Top Left Corner) */}
              <div className="absolute top-2 left-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8EE] border-2 border-[#522C28] shadow-md">
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

              {/* Quality Commitment Tag (Bottom Right Corner) */}
              <div
                ref={promiseSealRef}
                className="absolute bottom-2 right-2 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25100E] text-[#FAC537] text-[10px] font-black uppercase tracking-wider shadow-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-[#3CA837]" />
                <span>Nitrogen Sealed Fresh</span>
              </div>
            </div>

            {/* Content Right: The 5 Sutta Quality Promise + Clickable CTA */}
            <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Category Tag */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] border border-[#E88938]/40 text-[#9A4A0B] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D73B3A]" />
                  <span>THE 5 SUTTA QUALITY STANDARD</span>
                </span>
              </div>

              {/* Display Headline */}
              <h3 className="font-display uppercase tracking-tight leading-[1.05]">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["REAL", "JUMBO", "PURITY,"].map((w) => (
                    <span key={w} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="slide3-word font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
                <span className="block" />
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["EXPLORE", "ALL", "CRUNCH."].map((w) => (
                    <span key={w} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="slide3-word font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
              </h3>

              {/* Three Pillars */}
              <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="slide3-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                  Purity First
                </span>
                <span className="slide3-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#E88938] stroke-[3]" />
                  Handpicked Bihar Foxnuts
                </span>
                <span className="slide3-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                  Zero Palm Oil
                </span>
              </div>

              {/* Promise Quote Callout */}
              <div className="mt-3 max-w-xl rounded-2xl border border-[#522C28]/15 border-l-4 border-l-[#D73B3A] bg-[#FFF8EE]/90 px-3 py-2 sm:px-4 sm:py-3 shadow-xs text-left">
                <p className="text-[11px] sm:text-xs md:text-sm font-bold text-[#522C28] leading-snug">
                  We bring genuine 5 sutta makhana and boldly seasoned flavours with an unwavering commitment to purity, consistency, and transparency.
                </p>
              </div>

              {/* Direct CTA Action Button */}
              <div ref={ctaWrapRef} className="mt-4 pointer-events-auto">
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
