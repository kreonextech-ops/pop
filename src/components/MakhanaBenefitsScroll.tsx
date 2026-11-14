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
  Flame,
  Heart,
  Droplets,
  Leaf,
  Sun,
  Shield,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

type WordSegment = {
  text: string;
  accent?: boolean;
};

type BenefitCopyProps = {
  wordClass: string;
  compareWordClass: string;
  chipClass: string;
  inItemClass: string;
  outItemClass: string;
  tagRef: React.RefObject<HTMLDivElement>;
  tagBgClass: string;
  tagIcon: React.ReactNode;
  tagText: string;
  headlineLine1: WordSegment[];
  headlineLine2: WordSegment[];
  propsList: { icon: React.ReactNode; label: string }[];
  compareBoxRef: React.RefObject<HTMLDivElement>;
  compareWords: WordSegment[];
  whatsInRef: React.RefObject<HTMLDivElement>;
  whatsInList: string[];
  whatsNotRef: React.RefObject<HTMLDivElement>;
  whatsNotList: string[];
};

function BenefitCopyColumn({
  wordClass,
  compareWordClass,
  chipClass,
  inItemClass,
  outItemClass,
  tagRef,
  tagBgClass,
  tagIcon,
  tagText,
  headlineLine1,
  headlineLine2,
  propsList,
  compareBoxRef,
  compareWords,
  whatsInRef,
  whatsInList,
  whatsNotRef,
  whatsNotList,
}: BenefitCopyProps) {
  return (
    <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
      <div ref={tagRef} className="mb-1.5 sm:mb-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border ${tagBgClass}`}
        >
          {tagIcon}
          <span>{tagText}</span>
        </span>
      </div>

      <h3 className="font-display uppercase tracking-tight leading-[1.06]">
        <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 min-[400px]:gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[20px] min-[400px]:text-[24px] sm:text-[34px] md:text-[38px] lg:text-[44px]">
          {headlineLine1.map((w, idx) => (
            <span key={`${w.text}-${idx}`} className="inline-block overflow-hidden py-1 -my-1">
              <span
                className={`${wordClass} font-display inline-block will-change-transform ${
                  w.accent ? "text-[#D73B3A]" : ""
                }`}
              >
                {w.text}
              </span>
            </span>
          ))}
        </span>
        <span className="block" />
        <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 min-[400px]:gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[20px] min-[400px]:text-[24px] sm:text-[34px] md:text-[38px] lg:text-[44px]">
          {headlineLine2.map((w, idx) => (
            <span key={`${w.text}-${idx}`} className="inline-block overflow-hidden py-1 -my-1">
              <span
                className={`${wordClass} font-display inline-block will-change-transform ${
                  w.accent === false ? "text-[#522C28]" : ""
                }`}
              >
                {w.text}
              </span>
            </span>
          ))}
        </span>
      </h3>

      <div className="mt-1.5 sm:mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1 min-[400px]:gap-1.5 sm:gap-2">
        {propsList.map((prop) => (
          <span
            key={prop.label}
            className={`${chipClass} inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#FFF8EE]/90 border border-[#522C28]/15 text-[#522C28] text-[9.5px] min-[400px]:text-[10px] sm:text-xs font-extrabold uppercase tracking-wide`}
          >
            {prop.icon}
            {prop.label}
          </span>
        ))}
      </div>

      <div ref={compareBoxRef} className="mt-2 sm:mt-3.5 w-full max-w-xl">
        <div className="font-display uppercase tracking-tight leading-[1.06] mb-1.5 sm:mb-2">
          <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 sm:gap-x-2 text-[#522C28] text-[15px] min-[400px]:text-[18px] sm:text-[24px] md:text-[27px]">
            {compareWords.map((w, idx) => (
              <span key={`${w.text}-${idx}`} className="inline-block overflow-hidden py-0.5 -my-0.5">
                <span
                  className={`${compareWordClass} font-display inline-block will-change-transform ${
                    w.accent ? "text-[#D73B3A]" : ""
                  }`}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 min-[400px]:gap-2 sm:gap-3 text-left">
          <div
            ref={whatsInRef}
            className="rounded-xl sm:rounded-2xl border border-[#3CA837]/30 bg-[#FFF8EE]/85 backdrop-blur-[2px] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5"
          >
            <p className="text-[9.5px] sm:text-[11px] font-black uppercase tracking-wider text-[#236B20] mb-0.5 sm:mb-1">
              What&apos;s In
            </p>
            <ul className="space-y-0.5 text-[10px] min-[400px]:text-[11px] sm:text-xs font-bold text-[#522C28] leading-snug">
              {whatsInList.map((item) => (
                <li key={item} className={`${inItemClass} flex items-center gap-1 sm:gap-1.5`}>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3CA837] shrink-0 stroke-[3]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={whatsNotRef}
            className="rounded-xl sm:rounded-2xl border border-[#D73B3A]/25 bg-[#FFF8EE]/85 backdrop-blur-[2px] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5"
          >
            <p className="text-[9.5px] sm:text-[11px] font-black uppercase tracking-wider text-[#D73B3A] mb-0.5 sm:mb-1">
              What&apos;s Not
            </p>
            <ul className="space-y-0.5 text-[10px] min-[400px]:text-[11px] sm:text-xs font-bold text-[#522C28] leading-snug">
              {whatsNotList.map((item) => (
                <li key={item} className={`${outItemClass} flex items-center gap-1 sm:gap-1.5`}>
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D73B3A] shrink-0 stroke-[3]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MakhanaBenefitsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);

  // Beat 1: Intro Heading
  const introLine1OutRef = useRef<HTMLDivElement>(null);
  const introLine2OutRef = useRef<HTMLDivElement>(null);

  // Beat 2: 100% Gluten-Free + Clean HTML Fulcrum Seesaw (Zero svgOrigin!)
  const beat2StageRef = useRef<HTMLDivElement>(null);
  const beat2PropsFloatRef = useRef<HTMLDivElement>(null);
  const seesawBaseRef = useRef<HTMLDivElement>(null);
  const seesawBeamRef = useRef<HTMLDivElement>(null);
  const seesawPlankRef = useRef<HTMLDivElement>(null);
  const leftSeatRef = useRef<HTMLDivElement>(null);
  const cloudDropRef = useRef<HTMLDivElement>(null);
  const rightSeatRef = useRef<HTMLDivElement>(null);
  const beat2MakhanaSpinRef = useRef<HTMLImageElement>(null);
  const beat2TagRef = useRef<HTMLDivElement>(null);
  const beat2CompareBoxRef = useRef<HTMLDivElement>(null);
  const beat2InRef = useRef<HTMLDivElement>(null);
  const beat2NotRef = useRef<HTMLDivElement>(null);

  // Beat 3: Low GI ~22 + Steady Energy Wave Card
  const beat3StageRef = useRef<HTMLDivElement>(null);
  const beat3PropsFloatRef = useRef<HTMLDivElement>(null);
  const beat3MakhanaDropRef = useRef<HTMLDivElement>(null);
  const beat3MakhanaSpinRef = useRef<HTMLImageElement>(null);
  const giChartWrapRef = useRef<HTMLDivElement>(null);
  const giSpikePathRef = useRef<SVGPathElement>(null);
  const giSteadyPathRef = useRef<SVGPathElement>(null);
  const giBadgeRef = useRef<HTMLDivElement>(null);
  const beat3TagRef = useRef<HTMLDivElement>(null);
  const beat3CompareBoxRef = useRef<HTMLDivElement>(null);
  const beat3InRef = useRef<HTMLDivElement>(null);
  const beat3NotRef = useRef<HTMLDivElement>(null);

  // Beat 4: Heart Health + Strictly Bounded HTML Mineral Monitor Card
  const beat4StageRef = useRef<HTMLDivElement>(null);
  const beat4PropsFloatRef = useRef<HTMLDivElement>(null);
  const beat4MakhanaDropRef = useRef<HTMLDivElement>(null);
  const beat4MakhanaSpinRef = useRef<HTMLImageElement>(null);
  const heartMeterWrapRef = useRef<HTMLDivElement>(null);
  const ekgPathRef = useRef<SVGPathElement>(null);
  const barKRef = useRef<HTMLDivElement>(null);
  const barMgRef = useRef<HTMLDivElement>(null);
  const beat4TagRef = useRef<HTMLDivElement>(null);
  const beat4CompareBoxRef = useRef<HTMLDivElement>(null);
  const beat4InRef = useRef<HTMLDivElement>(null);
  const beat4NotRef = useRef<HTMLDivElement>(null);

  // Beat 5: Anti-Aging Antioxidants + Bounded Aura Ring & Crest Badge
  const beat5StageRef = useRef<HTMLDivElement>(null);
  const beat5PropsFloatRef = useRef<HTMLDivElement>(null);
  const beat5MakhanaDropRef = useRef<HTMLDivElement>(null);
  const beat5MakhanaSpinRef = useRef<HTMLImageElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);
  const shieldRingRef = useRef<SVGCircleElement>(null);
  const shieldBadgeRef = useRef<HTMLDivElement>(null);
  const beat5TagRef = useRef<HTMLDivElement>(null);
  const beat5CompareBoxRef = useRef<HTMLDivElement>(null);
  const beat5InRef = useRef<HTMLDivElement>(null);
  const beat5NotRef = useRef<HTMLDivElement>(null);

  // Promise Beat (Before Finale Flavours): Genuine 5 Sutta Quality Commitment
  const promiseStageRef = useRef<HTMLDivElement>(null);
  const promiseMakhanaDropRef = useRef<HTMLDivElement>(null);
  const promiseMakhanaSpinRef = useRef<HTMLImageElement>(null);
  const promiseRingRef = useRef<HTMLDivElement>(null);
  const promiseSealRef = useRef<HTMLDivElement>(null);
  const promiseTagRef = useRef<HTMLDivElement>(null);
  const promiseQuoteRef = useRef<HTMLDivElement>(null);

  // Beat 6: Grand Finale Pop Culture Bowl + Flavours CTA
  const beat6StageRef = useRef<HTMLDivElement>(null);
  const beat6BowlWrapRef = useRef<HTMLDivElement>(null);
  const beat6BurstRef = useRef<SVGSVGElement>(null);
  const beat6TagRef = useRef<HTMLDivElement>(null);
  const beat6BodyRef = useRef<HTMLParagraphElement>(null);
  const beat6CtaRef = useRef<HTMLDivElement>(null);

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

    const ctx = gsap.context(() => {
      const introWords = gsap.utils.toArray<HTMLElement>(".scroll-intro-word-in");
      const introExitLines = [introLine1OutRef.current, introLine2OutRef.current].filter(
        Boolean
      ) as HTMLDivElement[];

      const qBeat = (n: number) => ({
        words: gsap.utils.toArray<HTMLElement>(`.beat${n}-word-in`),
        compareWords: gsap.utils.toArray<HTMLElement>(`.beat${n}-compare-word-in`),
        chips: gsap.utils.toArray<HTMLElement>(`.beat${n}-prop-chip`),
        inItems: gsap.utils.toArray<HTMLElement>(`.beat${n}-in-item`),
        outItems: gsap.utils.toArray<HTMLElement>(`.beat${n}-out-item`),
      });

      const b2 = qBeat(2);
      const b3 = qBeat(3);
      const b4 = qBeat(4);
      const b5 = qBeat(5);
      const b6Words = gsap.utils.toArray<HTMLElement>(".beat6-word-in");
      const b6Chips = gsap.utils.toArray<HTMLElement>(".beat6-flavour-chip");
      const promiseWords = gsap.utils.toArray<HTMLElement>(".promise-word-in");
      const promisePills = gsap.utils.toArray<HTMLElement>(".promise-pill");

      // =====================================================================
      // 1. Initialize Clean Hidden States
      // =====================================================================
      gsap.set(introWords, { yPercent: 115, scale: 0.92, autoAlpha: 0 });

      [
        beat2StageRef.current,
        beat3StageRef.current,
        beat4StageRef.current,
        beat5StageRef.current,
        promiseStageRef.current,
        beat6StageRef.current,
      ].forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: 0 });
      });

      // --- Promise Beat Initial States ---
      if (promiseMakhanaDropRef.current) {
        gsap.set(promiseMakhanaDropRef.current, { y: -180, scale: 0.9, autoAlpha: 0 });
      }
      if (promiseMakhanaSpinRef.current) gsap.set(promiseMakhanaSpinRef.current, { rotation: -200 });
      if (promiseRingRef.current) gsap.set(promiseRingRef.current, { autoAlpha: 0, scale: 0.84 });
      if (promiseSealRef.current) gsap.set(promiseSealRef.current, { autoAlpha: 0, y: 12, scale: 0.85 });
      if (promiseTagRef.current) gsap.set(promiseTagRef.current, { autoAlpha: 0, y: 16, scale: 0.92 });
      gsap.set(promiseWords, { yPercent: 115, scale: 0.92, autoAlpha: 0 });
      gsap.set(promisePills, { autoAlpha: 0, y: 12, scale: 0.9 });
      if (promiseQuoteRef.current) gsap.set(promiseQuoteRef.current, { autoAlpha: 0, y: 20 });

      // --- Beat 2: Clean HTML Fulcrum Seesaw Initial States ---
      if (seesawBaseRef.current) gsap.set(seesawBaseRef.current, { autoAlpha: 0, y: 24 });
      if (seesawPlankRef.current) gsap.set(seesawPlankRef.current, { autoAlpha: 0 });
      if (seesawBeamRef.current) gsap.set(seesawBeamRef.current, { rotation: 0, transformOrigin: "50% 50%" });
      if (leftSeatRef.current) gsap.set(leftSeatRef.current, { rotation: 0, transformOrigin: "50% 100%" });
      if (cloudDropRef.current) gsap.set(cloudDropRef.current, { autoAlpha: 0, y: -56 });

      // Makhana lives inside rightSeatRef on the right seesaw pad; starts centered high for Phase 2A drop!
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
      if (beat2MakhanaSpinRef.current) gsap.set(beat2MakhanaSpinRef.current, { rotation: -280 });
      if (beat2PropsFloatRef.current) gsap.set(beat2PropsFloatRef.current, { autoAlpha: 0, scale: 0.86 });

      // --- Beat 3 (Low GI Curve) Initial States ---
      if (beat3MakhanaDropRef.current) {
        gsap.set(beat3MakhanaDropRef.current, {
          xPercent: -50,
          yPercent: -50,
          y: -190,
          scale: 1.24,
          autoAlpha: 0,
        });
      }
      if (beat3MakhanaSpinRef.current) gsap.set(beat3MakhanaSpinRef.current, { rotation: -240 });
      if (beat3PropsFloatRef.current) gsap.set(beat3PropsFloatRef.current, { autoAlpha: 0, scale: 0.86 });
      if (giChartWrapRef.current) gsap.set(giChartWrapRef.current, { autoAlpha: 0, y: 20 });
      if (giSpikePathRef.current) gsap.set(giSpikePathRef.current, { strokeDashoffset: 360 });
      if (giSteadyPathRef.current) gsap.set(giSteadyPathRef.current, { strokeDashoffset: 320 });
      if (giBadgeRef.current) gsap.set(giBadgeRef.current, { autoAlpha: 0, scale: 0.78 });

      // --- Beat 4 (Heart Pulse & Bounded HTML Bars) Initial States ---
      if (beat4MakhanaDropRef.current) {
        gsap.set(beat4MakhanaDropRef.current, {
          xPercent: -50,
          yPercent: -50,
          y: -190,
          scale: 1.24,
          autoAlpha: 0,
        });
      }
      if (beat4MakhanaSpinRef.current) gsap.set(beat4MakhanaSpinRef.current, { rotation: -240 });
      if (beat4PropsFloatRef.current) gsap.set(beat4PropsFloatRef.current, { autoAlpha: 0, scale: 0.86 });
      if (heartMeterWrapRef.current) gsap.set(heartMeterWrapRef.current, { autoAlpha: 0, y: 20 });
      if (ekgPathRef.current) gsap.set(ekgPathRef.current, { strokeDashoffset: 260 });
      if (barKRef.current) gsap.set(barKRef.current, { scaleX: 0, transformOrigin: "left center" });
      if (barMgRef.current) gsap.set(barMgRef.current, { scaleX: 0, transformOrigin: "left center" });

      // --- Beat 5 (Antioxidant Shield) Initial States ---
      if (beat5MakhanaDropRef.current) {
        gsap.set(beat5MakhanaDropRef.current, {
          xPercent: -50,
          yPercent: -50,
          y: -190,
          scale: 1.2,
          autoAlpha: 0,
        });
      }
      if (beat5MakhanaSpinRef.current) gsap.set(beat5MakhanaSpinRef.current, { rotation: -240 });
      if (beat5PropsFloatRef.current) gsap.set(beat5PropsFloatRef.current, { autoAlpha: 0, scale: 0.86 });
      if (shieldWrapRef.current) gsap.set(shieldWrapRef.current, { autoAlpha: 0, scale: 0.9 });
      if (shieldRingRef.current) gsap.set(shieldRingRef.current, { strokeDashoffset: 660 });
      if (shieldBadgeRef.current) gsap.set(shieldBadgeRef.current, { autoAlpha: 0, y: 10, scale: 0.85 });

      // --- Beat 6 (Finale Bowl) Initial States ---
      if (beat6BowlWrapRef.current) gsap.set(beat6BowlWrapRef.current, { autoAlpha: 0, y: 55, scale: 0.86 });
      if (beat6BurstRef.current) gsap.set(beat6BurstRef.current, { autoAlpha: 0, rotation: -25, scale: 0.82 });
      if (beat6TagRef.current) gsap.set(beat6TagRef.current, { autoAlpha: 0, y: 16, scale: 0.92 });
      gsap.set(b6Words, { yPercent: 115, scale: 0.92, autoAlpha: 0 });
      gsap.set(b6Chips, { autoAlpha: 0, y: 12, scale: 0.88 });
      if (beat6BodyRef.current) gsap.set(beat6BodyRef.current, { autoAlpha: 0, y: 14 });
      if (beat6CtaRef.current) gsap.set(beat6CtaRef.current, { autoAlpha: 0, y: 16, scale: 0.94 });

      // Shared right-column text initial states for Beats 2..5
      [
        { b: b2, tag: beat2TagRef.current, box: beat2CompareBoxRef.current, iR: beat2InRef.current, nR: beat2NotRef.current },
        { b: b3, tag: beat3TagRef.current, box: beat3CompareBoxRef.current, iR: beat3InRef.current, nR: beat3NotRef.current },
        { b: b4, tag: beat4TagRef.current, box: beat4CompareBoxRef.current, iR: beat4InRef.current, nR: beat4NotRef.current },
        { b: b5, tag: beat5TagRef.current, box: beat5CompareBoxRef.current, iR: beat5InRef.current, nR: beat5NotRef.current },
      ].forEach(({ b, tag, box, iR, nR }) => {
        if (tag) gsap.set(tag, { autoAlpha: 0, y: 16, scale: 0.92 });
        gsap.set(b.words, { yPercent: 115, scale: 0.92, autoAlpha: 0 });
        gsap.set(b.chips, { autoAlpha: 0, y: 14, scale: 0.9 });
        if (box) gsap.set(box, { autoAlpha: 0 });
        gsap.set(b.compareWords, { yPercent: 115, scale: 0.92, autoAlpha: 0 });
        if (iR) gsap.set(iR, { autoAlpha: 0, y: 16 });
        if (nR) gsap.set(nR, { autoAlpha: 0, y: 16 });
        gsap.set(b.inItems, { autoAlpha: 0, x: -10 });
        gsap.set(b.outItems, { autoAlpha: 0, x: -10 });
      });

      // =====================================================================
      // Beat 1 Entrance
      // =====================================================================
      gsap.to(introWords, {
        yPercent: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: container,
          start: "top 38%",
          end: "top -180px",
          scrub: 0.72,
          invalidateOnRefresh: true,
        },
      });

      // =====================================================================
      // Master Pinned Story Timeline (Beats 1 -> 6)
      // =====================================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=8600",
          pin: pinSection,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const scheduleBenefitCopy = (
        tA: number,
        tB: number,
        b: ReturnType<typeof qBeat>,
        tag: HTMLDivElement | null,
        box: HTMLDivElement | null,
        iR: HTMLDivElement | null,
        nR: HTMLDivElement | null
      ) => {
        if (tag) tl.to(tag, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.3)" }, tA + 0.1);
        if (b.words.length > 0) {
          tl.to(b.words, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.42, stagger: 0.06, ease: "power3.out", force3D: true }, tA + 0.2);
        }
        if (b.chips.length > 0) {
          tl.to(b.chips, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.06, ease: "back.out(1.2)" }, tA + 0.42);
        }
        if (box) tl.to(box, { autoAlpha: 1, duration: 0.12 }, tB + 0.18);
        if (b.compareWords.length > 0) {
          tl.to(b.compareWords, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: "power3.out", force3D: true }, tB + 0.24);
        }
        if (iR) tl.to(iR, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }, tB + 0.44);
        if (b.inItems.length > 0) {
          tl.to(b.inItems, { autoAlpha: 1, x: 0, duration: 0.24, stagger: 0.06, ease: "power2.out" }, tB + 0.5);
        }
        if (nR) tl.to(nR, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }, tB + 0.6);
        if (b.outItems.length > 0) {
          tl.to(b.outItems, { autoAlpha: 1, x: 0, duration: 0.24, stagger: 0.06, ease: "power2.out" }, tB + 0.66);
        }
      };

      // --- BEAT 1 HOLD + EXIT ---
      tl.to({}, { duration: 0.4 });
      if (introExitLines.length > 0) {
        tl.to(introExitLines, {
          y: -44,
          scale: 0.94,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.inOut",
          force3D: true,
        });
      }

      // =====================================================================
      // BEAT 2: 100% Gluten-Free + Balanced Cloud Seesaw
      // =====================================================================
      const t2A = 0.86;
      const t2B = t2A + 0.95;

      if (beat2StageRef.current) tl.to(beat2StageRef.current, { autoAlpha: 1, duration: 0.12 }, t2A);
      if (rightSeatRef.current) {
        tl.to(rightSeatRef.current, { y: 0, autoAlpha: 1, duration: 0.58, ease: "power2.out" }, t2A);
      }
      if (beat2MakhanaSpinRef.current) {
        tl.to(beat2MakhanaSpinRef.current, { rotation: 0, duration: 0.62, ease: "power2.out" }, t2A);
      }
      if (beat2PropsFloatRef.current) {
        tl.to(beat2PropsFloatRef.current, { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, t2A + 0.24);
      }

      scheduleBenefitCopy(
        t2A,
        t2B,
        b2,
        beat2TagRef.current,
        beat2CompareBoxRef.current,
        beat2InRef.current,
        beat2NotRef.current
      );

      if (beat2PropsFloatRef.current) {
        tl.to(beat2PropsFloatRef.current, { autoAlpha: 0, scale: 0.85, duration: 0.22, ease: "power2.in" }, t2B);
      }
      if (seesawBaseRef.current) {
        tl.to(seesawBaseRef.current, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, t2B + 0.05);
      }
      if (seesawPlankRef.current) {
        tl.to(seesawPlankRef.current, { autoAlpha: 1, duration: 0.36, ease: "power2.out" }, t2B + 0.06);
      }

      // Single makhana slides cleanly onto the right seesaw pad (all transform percentages = 0, scale = 1)
      if (rightSeatRef.current) {
        tl.to(rightSeatRef.current, { xPercent: 0, yPercent: 0, y: 0, scale: 1, duration: 0.4, ease: "power2.inOut" }, t2B + 0.06);
      }

      // Seesaw tilts smoothly +6deg toward Makhana -> Cloud floats softly onto left pad -> Seesaw balances level to 0deg!
      if (seesawBeamRef.current && leftSeatRef.current && rightSeatRef.current) {
        tl.to(seesawBeamRef.current, { rotation: 6, duration: 0.25, ease: "sine.inOut" }, t2B + 0.36);
        tl.to(leftSeatRef.current, { rotation: -6, duration: 0.25, ease: "sine.inOut" }, t2B + 0.36);
        tl.to(rightSeatRef.current, { rotation: -6, duration: 0.25, ease: "sine.inOut" }, t2B + 0.36);
      }

      if (cloudDropRef.current) {
        tl.to(cloudDropRef.current, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, t2B + 0.42);
      }

      if (seesawBeamRef.current && leftSeatRef.current && rightSeatRef.current) {
        tl.to(seesawBeamRef.current, { rotation: -2, duration: 0.24, ease: "sine.inOut" }, t2B + 0.72);
        tl.to(leftSeatRef.current, { rotation: 2, duration: 0.24, ease: "sine.inOut" }, t2B + 0.72);
        tl.to(rightSeatRef.current, { rotation: 2, duration: 0.24, ease: "sine.inOut" }, t2B + 0.72);

        tl.to(seesawBeamRef.current, { rotation: 0, duration: 0.28, ease: "power2.out" }, t2B + 0.96);
        tl.to(leftSeatRef.current, { rotation: 0, duration: 0.28, ease: "power2.out" }, t2B + 0.96);
        tl.to(rightSeatRef.current, { rotation: 0, duration: 0.28, ease: "power2.out" }, t2B + 0.96);
      }

      if (beat2StageRef.current) {
        tl.to(beat2StageRef.current, { y: -40, autoAlpha: 0, duration: 0.38, ease: "power2.inOut", force3D: true }, t2B + 1.55);
      }

      // =====================================================================
      // BEAT 3: Low GI ~22 + Steady Energy Wave Card
      // =====================================================================
      const t3A = t2B + 1.98;
      const t3B = t3A + 0.95;

      if (beat3StageRef.current) tl.to(beat3StageRef.current, { autoAlpha: 1, duration: 0.12 }, t3A);
      if (beat3MakhanaDropRef.current) {
        tl.to(beat3MakhanaDropRef.current, { y: 0, autoAlpha: 1, duration: 0.58, ease: "power2.out", force3D: true }, t3A);
      }
      if (beat3MakhanaSpinRef.current) {
        tl.to(beat3MakhanaSpinRef.current, { rotation: 0, duration: 0.62, ease: "power2.out", force3D: true }, t3A);
      }
      if (beat3PropsFloatRef.current) {
        tl.to(beat3PropsFloatRef.current, { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, t3A + 0.24);
      }

      scheduleBenefitCopy(
        t3A,
        t3B,
        b3,
        beat3TagRef.current,
        beat3CompareBoxRef.current,
        beat3InRef.current,
        beat3NotRef.current
      );

      if (beat3PropsFloatRef.current) {
        tl.to(beat3PropsFloatRef.current, { autoAlpha: 0, scale: 0.85, duration: 0.22, ease: "power2.in" }, t3B);
      }
      if (beat3MakhanaDropRef.current) {
        tl.to(beat3MakhanaDropRef.current, { yPercent: -82, y: 0, scale: 0.82, duration: 0.42, ease: "power2.inOut" }, t3B + 0.05);
      }
      if (giChartWrapRef.current) {
        tl.to(giChartWrapRef.current, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, t3B + 0.08);
      }
      if (giSpikePathRef.current) {
        tl.to(giSpikePathRef.current, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, t3B + 0.26);
      }
      if (giSteadyPathRef.current) {
        tl.to(giSteadyPathRef.current, { strokeDashoffset: 0, duration: 0.52, ease: "power2.out" }, t3B + 0.38);
      }
      if (giBadgeRef.current) {
        tl.to(giBadgeRef.current, { autoAlpha: 1, scale: 1, duration: 0.32, ease: "back.out(1.4)" }, t3B + 0.7);
      }

      if (beat3StageRef.current) {
        tl.to(beat3StageRef.current, { y: -40, autoAlpha: 0, duration: 0.38, ease: "power2.inOut", force3D: true }, t3B + 1.5);
      }

      // =====================================================================
      // BEAT 4: Heart Health + Strictly Bounded HTML Mineral Monitor Card
      // =====================================================================
      const t4A = t3B + 1.92;
      const t4B = t4A + 0.95;

      if (beat4StageRef.current) tl.to(beat4StageRef.current, { autoAlpha: 1, duration: 0.12 }, t4A);
      if (beat4MakhanaDropRef.current) {
        tl.to(beat4MakhanaDropRef.current, { y: 0, autoAlpha: 1, duration: 0.58, ease: "power2.out", force3D: true }, t4A);
      }
      if (beat4MakhanaSpinRef.current) {
        tl.to(beat4MakhanaSpinRef.current, { rotation: 0, duration: 0.62, ease: "power2.out", force3D: true }, t4A);
      }
      if (beat4PropsFloatRef.current) {
        tl.to(beat4PropsFloatRef.current, { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, t4A + 0.24);
      }

      scheduleBenefitCopy(
        t4A,
        t4B,
        b4,
        beat4TagRef.current,
        beat4CompareBoxRef.current,
        beat4InRef.current,
        beat4NotRef.current
      );

      if (beat4PropsFloatRef.current) {
        tl.to(beat4PropsFloatRef.current, { autoAlpha: 0, scale: 0.85, duration: 0.22, ease: "power2.in" }, t4B);
      }
      if (beat4MakhanaDropRef.current) {
        tl.to(beat4MakhanaDropRef.current, { yPercent: -82, y: 0, scale: 0.82, duration: 0.42, ease: "power2.inOut" }, t4B + 0.05);
      }
      if (heartMeterWrapRef.current) {
        tl.to(heartMeterWrapRef.current, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, t4B + 0.08);
      }
      if (ekgPathRef.current) {
        tl.to(ekgPathRef.current, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, t4B + 0.25);
      }
      if (barKRef.current) {
        tl.to(barKRef.current, { scaleX: 1, duration: 0.42, ease: "power3.out" }, t4B + 0.42);
      }
      if (barMgRef.current) {
        tl.to(barMgRef.current, { scaleX: 1, duration: 0.42, ease: "power3.out" }, t4B + 0.56);
      }

      if (beat4StageRef.current) {
        tl.to(beat4StageRef.current, { y: -40, autoAlpha: 0, duration: 0.38, ease: "power2.inOut", force3D: true }, t4B + 1.5);
      }

      // =====================================================================
      // BEAT 5: Antioxidant Glow + Bounded Protective Ring & Crest Badge
      // =====================================================================
      const t5A = t4B + 1.92;
      const t5B = t5A + 0.95;

      if (beat5StageRef.current) tl.to(beat5StageRef.current, { autoAlpha: 1, duration: 0.12 }, t5A);
      if (beat5MakhanaDropRef.current) {
        tl.to(beat5MakhanaDropRef.current, { y: 0, autoAlpha: 1, duration: 0.58, ease: "power2.out", force3D: true }, t5A);
      }
      if (beat5MakhanaSpinRef.current) {
        tl.to(beat5MakhanaSpinRef.current, { rotation: 0, duration: 0.62, ease: "power2.out", force3D: true }, t5A);
      }
      if (beat5PropsFloatRef.current) {
        tl.to(beat5PropsFloatRef.current, { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, t5A + 0.24);
      }

      scheduleBenefitCopy(
        t5A,
        t5B,
        b5,
        beat5TagRef.current,
        beat5CompareBoxRef.current,
        beat5InRef.current,
        beat5NotRef.current
      );

      if (beat5PropsFloatRef.current) {
        tl.to(beat5PropsFloatRef.current, { autoAlpha: 0, scale: 0.85, duration: 0.22, ease: "power2.in" }, t5B);
      }
      if (beat5MakhanaDropRef.current) {
        tl.to(beat5MakhanaDropRef.current, { scale: 0.88, duration: 0.42, ease: "power2.inOut" }, t5B + 0.05);
      }
      if (shieldWrapRef.current) {
        tl.to(shieldWrapRef.current, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }, t5B + 0.1);
      }
      if (shieldRingRef.current) {
        tl.to(shieldRingRef.current, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" }, t5B + 0.22);
      }
      if (shieldBadgeRef.current) {
        tl.to(shieldBadgeRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "back.out(1.4)" }, t5B + 0.52);
      }

      if (beat5StageRef.current) {
        tl.to(beat5StageRef.current, { y: -40, autoAlpha: 0, duration: 0.38, ease: "power2.inOut", force3D: true }, t5B + 1.5);
      }

      // =====================================================================
      // PROMISE BEAT (Before Flavours): Genuine 5 Sutta Quality Commitment
      // =====================================================================
      const tP = t5B + 1.92;

      if (promiseStageRef.current) tl.to(promiseStageRef.current, { autoAlpha: 1, duration: 0.12 }, tP);
      if (promiseMakhanaDropRef.current) {
        tl.to(promiseMakhanaDropRef.current, { y: 0, scale: 1, autoAlpha: 1, duration: 0.56, ease: "power2.out", force3D: true }, tP);
      }
      if (promiseMakhanaSpinRef.current) {
        tl.to(promiseMakhanaSpinRef.current, { rotation: 0, duration: 0.6, ease: "power2.out", force3D: true }, tP);
      }
      if (promiseRingRef.current) {
        tl.to(promiseRingRef.current, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.out" }, tP + 0.14);
      }
      if (promiseSealRef.current) {
        tl.to(promiseSealRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "back.out(1.4)" }, tP + 0.32);
      }
      if (promiseTagRef.current) {
        tl.to(promiseTagRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.3)" }, tP + 0.1);
      }
      if (promiseWords.length > 0) {
        tl.to(promiseWords, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.44, stagger: 0.06, ease: "power3.out", force3D: true }, tP + 0.2);
      }
      if (promisePills.length > 0) {
        tl.to(promisePills, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.07, ease: "back.out(1.3)" }, tP + 0.44);
      }
      if (promiseQuoteRef.current) {
        tl.to(promiseQuoteRef.current, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, tP + 0.56);
      }

      if (promiseStageRef.current) {
        tl.to(promiseStageRef.current, { y: -40, autoAlpha: 0, duration: 0.38, ease: "power2.inOut", force3D: true }, tP + 1.65);
      }

      // =====================================================================
      // BEAT 6: Grand Finale — Overflowing Bowl & 4 Bold Flavours CTA
      // =====================================================================
      const t6 = tP + 2.08;

      if (beat6StageRef.current) tl.to(beat6StageRef.current, { autoAlpha: 1, duration: 0.12 }, t6);
      if (beat6BurstRef.current) {
        tl.to(beat6BurstRef.current, { autoAlpha: 1, rotation: 0, scale: 1, duration: 0.55, ease: "power2.out" }, t6 + 0.05);
      }
      if (beat6BowlWrapRef.current) {
        tl.to(beat6BowlWrapRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.25)", force3D: true }, t6 + 0.08);
      }
      if (beat6TagRef.current) {
        tl.to(beat6TagRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.3)" }, t6 + 0.15);
      }
      if (b6Words.length > 0) {
        tl.to(b6Words, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.44, stagger: 0.06, ease: "power3.out", force3D: true }, t6 + 0.24);
      }
      if (b6Chips.length > 0) {
        tl.to(b6Chips, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(1.3)" }, t6 + 0.45);
      }
      if (beat6BodyRef.current) {
        tl.to(beat6BodyRef.current, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, t6 + 0.55);
      }
      if (beat6CtaRef.current) {
        tl.to(beat6CtaRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, t6 + 0.68);
      }

      tl.to({}, { duration: 0.8 }, t6 + 1.05);

      // =====================================================================
      // Step-by-Step Scroll Progression (1 Scroll / Swipe = 1 Beat Stop)
      // Prevents fast desktop wheel or mobile thumb-flicks from skipping benefits.
      // =====================================================================
      const stopTimes = [
        0.4,
        t2A + 0.72,
        t2B + 1.25,
        t3A + 0.72,
        t3B + 1.22,
        t4A + 0.72,
        t4B + 1.22,
        t5A + 0.72,
        t5B + 1.22,
        tP + 1.15,
        t6 + 1.25,
      ];

      let lockUntil = 0;
      let lockedIdx = 0;
      let touchStartY: number | null = null;
      let touchConsumed = false;

      const getStopScrollY = (idx: number) => {
        const st = tl.scrollTrigger;
        if (!st) return window.scrollY;
        const totalDur = Math.max(0.01, tl.duration());
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
        return y >= st.start - 4 && y <= st.end + 4;
      };

      const goToStep = (nextIdx: number) => {
        const clamped = Math.max(0, Math.min(stopTimes.length - 1, nextIdx));
        lockedIdx = clamped;
        lockUntil = performance.now() + 720;
        const targetY = getStopScrollY(clamped);
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, {
            duration: 0.78,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
            force: true,
          });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      };

      const onWheel = (e: WheelEvent) => {
        if (!isPinnedActive() || Math.abs(e.deltaY) < 4) return;
        const now = performance.now();
        const activeIdx = now < lockUntil ? lockedIdx : getNearestStepIndex(window.scrollY);
        const dir = e.deltaY > 0 ? 1 : -1;

        // Release cleanly at top/bottom boundaries so user can scroll to #flavours or #discover
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
        if (Math.abs(dy) < 10) return;

        const now = performance.now();
        const activeIdx = now < lockUntil ? lockedIdx : getNearestStepIndex(window.scrollY);
        const dir = dy < 0 ? 1 : -1; // swipe up -> scroll down (next), swipe down -> scroll up (prev)

        // Allow native scroll when leaving the first or last beat
        if ((dir < 0 && activeIdx <= 0) || (dir > 0 && activeIdx >= stopTimes.length - 1)) {
          return;
        }

        e.preventDefault();
        if (touchConsumed || now < lockUntil) return;
        if (Math.abs(dy) >= 24) {
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
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
      let isMounted = true;
      if (typeof document !== "undefined" && document.fonts?.ready) {
        void document.fonts.ready.then(() => {
          if (isMounted) ScrollTrigger.refresh();
        });
      }

      return () => {
        isMounted = false;
        clearTimeout(refreshTimer);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
      };
    }, container);

    return () => {
      window.removeEventListener("lenis:ready", onLenisReady);
      unbindLenis?.();
      ctx.revert();
    };
  }, []);

  const scrollToFlavours = () => {
    smoothScrollTo("#flavours");
  };

  return (
    <section
      ref={containerRef}
      id="benefits"
      className="relative w-full bg-[#FCF4E5] text-[#522C28] select-none"
    >
      {/* Pinned Viewport Container (Top padding keeps clear of sticky header) */}
      <div
        ref={pinSectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center pt-14 sm:pt-16 pb-4 [contain:layout_paint]"
      >
        {/* Constant Background Artwork Throughout the Entire Scroll Section */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
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
            BEAT 1: Centered Display Heading Stage
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
            BEAT 2: 100% Gluten-Free + Clean HTML Fulcrum Cloud Seesaw
            ================================================================= */}
        <div
          ref={beat2StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-2 min-[400px]:gap-3 sm:gap-6 md:gap-10 lg:gap-14">
            <div className="relative w-[225px] min-[400px]:w-[270px] sm:w-[340px] md:w-[385px] lg:w-[410px] shrink-0">
              <div className="relative w-full aspect-[380/250] flex items-end justify-center pb-5 sm:pb-6">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] h-[78%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

                {/* Phase 2A Orbiting Gluten-Free Props */}
                <div ref={beat2PropsFloatRef} className="absolute inset-0 z-20">
                  <div className="absolute left-[4%] top-[12%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#3CA837] text-[#236B20] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm -rotate-6">
                    <WheatOff className="w-3.5 h-3.5 text-[#3CA837]" />
                    <span>Zero Wheat</span>
                  </div>
                  <div className="absolute right-[4%] top-[16%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#522C28]/80 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D73B3A]" />
                    <span>Celiac Safe</span>
                  </div>
                  <div className="absolute left-[14%] bottom-[10%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#E88938] text-[#9A4A0B] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-3">
                    <Feather className="w-3.5 h-3.5 text-[#E88938]" />
                    <span>Water Lily Seed</span>
                  </div>
                </div>

                {/* Seesaw Base & Triangle Fulcrum (Clean HTML/SVG) */}
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

                {/* Single HTML Seesaw Beam (Holds Cloud on Left & Real Makhana on Right — Zero Desync!) */}
                <div
                  ref={seesawBeamRef}
                  className="relative w-[92%] h-5 sm:h-6 mb-7 sm:mb-8 z-10 will-change-transform"
                >
                  {/* Visible Seesaw Plank & Pad Trays */}
                  <div ref={seesawPlankRef} className="absolute inset-0">
                    <div className="w-full h-3 sm:h-3.5 mt-1 rounded-full bg-[#FAC537] border-[3px] border-[#522C28] shadow-xs" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8EE] border-[3px] border-[#522C28]" />
                    <div className="absolute left-1.5 -top-1 w-16 min-[400px]:w-20 sm:w-24 h-2 rounded-full bg-[#E88938] border-2 border-[#522C28]" />
                    <div className="absolute right-1.5 -top-1 w-16 min-[400px]:w-20 sm:w-24 h-2 rounded-full bg-[#E88938] border-2 border-[#522C28]" />
                  </div>

                  {/* Left Seat: Crisp Pop-Art Feather SVG (Genuinely Feather-Light!) */}
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
                        {/* Outer Feather Silhouette */}
                        <path
                          d="M14 64 C22 50 32 34 50 20 C67 7 86 6 98 11 C96 24 88 37 74 47 L64 47 L69 52 C58 59 44 62 31 61 L22 65 Z"
                          fill="#FFF8EE"
                          stroke="#522C28"
                          strokeWidth="3.8"
                          strokeLinejoin="round"
                        />
                        {/* Warm Golden Accent Shading */}
                        <path
                          d="M28 57 C45 45 64 31 86 18 C80 30 68 42 52 50 C43 55 34 57 28 57 Z"
                          fill="#FAC537"
                          fillOpacity="0.65"
                        />
                        {/* Center Quill Shaft */}
                        <path
                          d="M10 66 C30 50 56 32 90 14"
                          stroke="#E88938"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Crisp Inner Barb Details */}
                        <path
                          d="M46 31 L42 22 M62 21 L59 12 M56 39 L67 40"
                          stroke="#522C28"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Right Seat: Real Makhana Image (Starts Centered High for Drop -> Glides Right onto Pad) */}
                  <div
                    ref={rightSeatRef}
                    className="absolute right-[5%] bottom-[82%] w-[28%] aspect-square flex items-end justify-center will-change-transform"
                  >
                    <img
                      ref={beat2MakhanaSpinRef}
                      src="/scroll/asset/09_large_single_makhana.png"
                      alt="Single Roasted Makhana Puff"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain drop-shadow-[0_10px_14px_rgba(82,44,40,0.22)] will-change-transform"
                    />
                  </div>
                </div>
              </div>
            </div>

            <BenefitCopyColumn
              wordClass="beat2-word-in"
              compareWordClass="beat2-compare-word-in"
              chipClass="beat2-prop-chip"
              inItemClass="beat2-in-item"
              outItemClass="beat2-out-item"
              tagRef={beat2TagRef}
              tagBgClass="bg-[#3CA837]/15 border-[#3CA837]/35 text-[#236B20]"
              tagIcon={<Sparkles className="w-3.5 h-3.5 text-[#3CA837]" />}
              tagText="BENEFIT 01 • 100% GLUTEN-FREE"
              headlineLine1={[{ text: "PURE" }, { text: "LOTUS" }, { text: "SEED." }]}
              headlineLine2={[{ text: "100%" }, { text: "GLUTEN-FREE." }]}
              propsList={[
                { icon: <WheatOff className="w-3 h-3 text-[#3CA837]" />, label: "Wheat-Free" },
                { icon: <ShieldCheck className="w-3 h-3 text-[#D73B3A]" />, label: "Celiac Safe" },
                { icon: <Feather className="w-3 h-3 text-[#E88938]" />, label: "100% Non-GMO" },
              ]}
              compareBoxRef={beat2CompareBoxRef}
              compareWords={[
                { text: "LIGHT" },
                { text: "AS" },
                { text: "A" },
                { text: "FEATHER,", accent: true },
                { text: "EASY" },
                { text: "ON" },
                { text: "YOUR" },
                { text: "STOMACH." },
              ]}
              whatsInRef={beat2InRef}
              whatsInList={["Pure Water Lily Seeds", "Airy Easy Digestion", "All-Day Light Energy"]}
              whatsNotRef={beat2NotRef}
              whatsNotList={["Zero Wheat or Maida", "Zero Stomach Bloat", "Zero Gluten"]}
            />
          </div>
        </div>

        {/* =================================================================
            BEAT 3: Low GI ~22 + Steady Energy Wave Card (Bounded HTML+SVG)
            ================================================================= */}
        <div
          ref={beat3StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-2 min-[400px]:gap-3 sm:gap-6 md:gap-10 lg:gap-14">
            <div className="relative w-[235px] min-[400px]:w-[275px] sm:w-[340px] md:w-[385px] lg:w-[410px] shrink-0">
              <div className="relative w-full aspect-[380/275] sm:aspect-[380/265]">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] h-[78%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

                <div ref={beat3PropsFloatRef} className="absolute inset-0 z-10">
                  <div className="absolute left-[4%] top-[12%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#1976D2] text-[#0D47A1] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm -rotate-6">
                    <Activity className="w-3.5 h-3.5 text-[#1976D2]" />
                    <span>Low GI ~22</span>
                  </div>
                  <div className="absolute right-[4%] top-[16%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#E88938] text-[#9A4A0B] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-6">
                    <Zap className="w-3.5 h-3.5 text-[#E88938]" />
                    <span>Slow Release</span>
                  </div>
                  <div className="absolute left-[18%] bottom-[8%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#3CA837] text-[#236B20] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-3">
                    <Flame className="w-3.5 h-3.5 text-[#D73B3A]" />
                    <span>Clean Fuel</span>
                  </div>
                </div>

                {/* Cracked Makhana */}
                <div
                  ref={beat3MakhanaDropRef}
                  className="absolute left-1/2 top-[43%] w-[33%] aspect-square z-10 will-change-transform"
                >
                  <img
                    ref={beat3MakhanaSpinRef}
                    src="/scroll/asset/03_cracked_makhana.png"
                    alt="Cracked Crispy Roasted Makhana"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-[0_10px_14px_rgba(82,44,40,0.22)] will-change-transform"
                  />
                </div>

                {/* Phase 3B Strictly Bounded Energy Chart Card */}
                <div
                  ref={giChartWrapRef}
                  className="absolute left-1.5 right-1.5 sm:left-2 sm:right-2 bottom-1 rounded-2xl border-[3px] border-[#522C28] bg-[#FFF8EE]/95 p-2 sm:p-3 shadow-sm overflow-hidden will-change-transform"
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
                    <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#522C28]">
                      Blood Energy Response
                    </span>
                    <div
                      ref={giBadgeRef}
                      className="px-2 py-0.5 rounded-full bg-[#3CA837] border-2 border-[#522C28] text-[#FFF8EE] text-[8.5px] sm:text-[10px] font-black leading-none shrink-0"
                    >
                      GI ~22
                    </div>
                  </div>
                  <svg viewBox="0 0 300 62" fill="none" className="w-full h-9 sm:h-12">
                    <line x1="6" y1="22" x2="294" y2="22" stroke="#522C28" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="6" y1="42" x2="294" y2="42" stroke="#522C28" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <path
                      ref={giSpikePathRef}
                      d="M8 50 C34 50 54 8 88 10 C122 12 146 56 196 54 C236 52 266 44 292 48"
                      stroke="#D73B3A"
                      strokeOpacity="0.55"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="360"
                    />
                    <path
                      ref={giSteadyPathRef}
                      d="M8 44 C64 26 128 24 198 25 C244 26 270 23 292 24"
                      stroke="#3CA837"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeDasharray="320"
                    />
                  </svg>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold mt-0.5">
                    <span className="inline-flex items-center gap-1 text-[#236B20]">
                      <span className="w-2 h-2 rounded-full bg-[#3CA837]" />
                      Makhana: Steady Fuel
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#D73B3A]">
                      <span className="w-2 h-2 rounded-full bg-[#D73B3A]/70" />
                      Chips: Spike &amp; Crash
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <BenefitCopyColumn
              wordClass="beat3-word-in"
              compareWordClass="beat3-compare-word-in"
              chipClass="beat3-prop-chip"
              inItemClass="beat3-in-item"
              outItemClass="beat3-out-item"
              tagRef={beat3TagRef}
              tagBgClass="bg-[#1976D2]/12 border-[#1976D2]/30 text-[#0D47A1]"
              tagIcon={<Activity className="w-3.5 h-3.5 text-[#1976D2]" />}
              tagText="BENEFIT 02 • LOW GLYCEMIC INDEX ~22"
              headlineLine1={[{ text: "SLOW" }, { text: "CLEAN" }, { text: "FUEL." }]}
              headlineLine2={[{ text: "LOW" }, { text: "GI" }, { text: "~22." }]}
              propsList={[
                { icon: <Activity className="w-3 h-3 text-[#1976D2]" />, label: "Low GI ~22" },
                { icon: <Zap className="w-3 h-3 text-[#E88938]" />, label: "Steady Vitality" },
                { icon: <ShieldCheck className="w-3 h-3 text-[#3CA837]" />, label: "Diabetic Friendly" },
              ]}
              compareBoxRef={beat3CompareBoxRef}
              compareWords={[
                { text: "STEADY" },
                { text: "ENERGY," },
                { text: "ZERO" },
                { text: "4 PM" },
                { text: "CRASH.", accent: true },
              ]}
              whatsInRef={beat3InRef}
              whatsInList={["Slow-Release Carbs", "Clean Metabolic Fuel", "Long-Lasting Focus"]}
              whatsNotRef={beat3NotRef}
              whatsNotList={["Zero Sugar Spikes", "Zero Insulin Surge", "Zero Afternoon Brain Fog"]}
            />
          </div>
        </div>

        {/* =================================================================
            BEAT 4: Heart Health + Strictly Bounded HTML Mineral Bars Card
            ================================================================= */}
        <div
          ref={beat4StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-2 min-[400px]:gap-3 sm:gap-6 md:gap-10 lg:gap-14">
            <div className="relative w-[235px] min-[400px]:w-[275px] sm:w-[340px] md:w-[385px] lg:w-[410px] shrink-0">
              <div className="relative w-full aspect-[380/275] sm:aspect-[380/265]">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] h-[78%] rounded-full bg-[radial-gradient(circle,rgba(255,213,158,0.45)_0%,rgba(255,231,196,0.22)_50%,transparent_75%)]" />

                <div ref={beat4PropsFloatRef} className="absolute inset-0 z-10">
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

                {/* Three Makhana Cluster */}
                <div
                  ref={beat4MakhanaDropRef}
                  className="absolute left-1/2 top-[43%] w-[35%] aspect-square z-10 will-change-transform"
                >
                  <img
                    ref={beat4MakhanaSpinRef}
                    src="/scroll/asset/02_three_makhana_cluster.png"
                    alt="Cluster of Three Roasted Makhanas"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-[0_10px_14px_rgba(82,44,40,0.22)] will-change-transform"
                  />
                </div>

                {/* Phase 4B Strictly Contained Heart & Mineral Bars HTML Card */}
                <div
                  ref={heartMeterWrapRef}
                  className="absolute left-1.5 right-1.5 sm:left-2 sm:right-2 bottom-1 rounded-2xl border-[3px] border-[#522C28] bg-[#FFF8EE]/95 px-2.5 py-2 sm:px-4 sm:py-3 shadow-sm overflow-hidden will-change-transform"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#D73B3A] fill-[#D73B3A] shrink-0" />
                    <svg viewBox="0 0 180 34" fill="none" className="flex-1 h-5 sm:h-7">
                      <path
                        ref={ekgPathRef}
                        d="M4 18 L52 18 L64 4 L76 30 L88 9 L98 18 L174 18"
                        stroke="#D73B3A"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="260"
                      />
                    </svg>
                    <span className="px-2 py-0.5 sm:px-2.5 rounded-full bg-[#FCE4EC] border-2 border-[#D73B3A] text-[#B82928] text-[8.5px] sm:text-[10px] font-black uppercase tracking-wide shrink-0">
                      0mg Chol
                    </span>
                  </div>

                  {/* Contained HTML Bars (Overflow-Hidden Guarantees Zero Escaping!) */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-16 sm:w-20 text-[8.5px] sm:text-[10px] font-black text-[#522C28] uppercase tracking-wider shrink-0">
                        Potassium
                      </span>
                      <div className="flex-1 h-2.5 sm:h-3 rounded-full bg-[#522C28]/10 overflow-hidden">
                        <div ref={barKRef} className="h-full w-[88%] rounded-full bg-[#3CA837]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 sm:w-20 text-[8.5px] sm:text-[10px] font-black text-[#522C28] uppercase tracking-wider shrink-0">
                        Magnesium
                      </span>
                      <div className="flex-1 h-2.5 sm:h-3 rounded-full bg-[#522C28]/10 overflow-hidden">
                        <div ref={barMgRef} className="h-full w-[80%] rounded-full bg-[#E88938]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <BenefitCopyColumn
              wordClass="beat4-word-in"
              compareWordClass="beat4-compare-word-in"
              chipClass="beat4-prop-chip"
              inItemClass="beat4-in-item"
              outItemClass="beat4-out-item"
              tagRef={beat4TagRef}
              tagBgClass="bg-[#FCE4EC] border-[#D73B3A]/30 text-[#B82928]"
              tagIcon={<Heart className="w-3.5 h-3.5 text-[#D73B3A]" />}
              tagText="BENEFIT 03 • HEART HEALTH"
              headlineLine1={[{ text: "ZERO" }, { text: "CHOLESTEROL." }]}
              headlineLine2={[{ text: "PURE" }, { text: "HEART" }, { text: "LOVE." }]}
              propsList={[
                { icon: <Heart className="w-3 h-3 text-[#D73B3A]" />, label: "0mg Cholesterol" },
                { icon: <Droplets className="w-3 h-3 text-[#1976D2]" />, label: "Low Sodium" },
                { icon: <Zap className="w-3 h-3 text-[#3CA837]" />, label: "K & Mg Rich" },
              ]}
              compareBoxRef={beat4CompareBoxRef}
              compareWords={[
                { text: "CALMING" },
                { text: "MINERALS," },
                { text: "ZERO" },
                { text: "TRANS" },
                { text: "FATS.", accent: true },
              ]}
              whatsInRef={beat4InRef}
              whatsInList={["Heart-Smart Potassium", "Calming Magnesium", "Gentle Circulation Care"]}
              whatsNotRef={beat4NotRef}
              whatsNotList={["Zero Cholesterol (0mg)", "Zero Trans Fats", "Zero Excess Salt"]}
            />
          </div>
        </div>

        {/* =================================================================
            BEAT 5: Antioxidant Glow + Bounded Aura Ring & Crest Badge
            ================================================================= */}
        <div
          ref={beat5StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-2 min-[400px]:gap-3 sm:gap-6 md:gap-10 lg:gap-14">
            <div className="relative w-[225px] min-[400px]:w-[270px] sm:w-[330px] md:w-[375px] lg:w-[400px] shrink-0">
              <div className="relative w-full aspect-[360/265] flex items-center justify-center">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[76%] h-[76%] rounded-full bg-[radial-gradient(circle,rgba(243,229,245,0.7)_0%,rgba(255,213,158,0.28)_50%,transparent_75%)]" />

                <div ref={beat5PropsFloatRef} className="absolute inset-0 z-10">
                  <div className="absolute left-[4%] top-[12%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#7B1FA2] text-[#6A1B9A] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm -rotate-6">
                    <Shield className="w-3.5 h-3.5 text-[#7B1FA2]" />
                    <span>Flavonoids</span>
                  </div>
                  <div className="absolute right-[4%] top-[16%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#3CA837] text-[#236B20] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-6">
                    <Leaf className="w-3.5 h-3.5 text-[#3CA837]" />
                    <span>Gallic Acid</span>
                  </div>
                  <div className="absolute left-[18%] bottom-[8%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border-2 border-[#E88938] text-[#9A4A0B] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide shadow-sm rotate-3">
                    <Sun className="w-3.5 h-3.5 text-[#E88938]" />
                    <span>Skin Glow</span>
                  </div>
                </div>

                {/* Lotus Leaf & Makhana Cluster */}
                <div
                  ref={beat5MakhanaDropRef}
                  className="absolute left-1/2 top-[48%] w-[40%] aspect-square z-10 will-change-transform"
                >
                  <img
                    ref={beat5MakhanaSpinRef}
                    src="/scroll/asset/08_makhana_leaf_cluster.png"
                    alt="Lotus Leaf and Roasted Makhana Cluster"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-[0_12px_18px_rgba(82,44,40,0.2)] will-change-transform"
                  />
                </div>

                {/* Bounded Antioxidant Ring SVG */}
                <div ref={shieldWrapRef} className="absolute inset-0 pointer-events-none will-change-transform">
                  <svg viewBox="0 0 360 265" fill="none" className="w-full h-full">
                    <circle cx="180" cy="126" r="108" stroke="#FAC537" strokeWidth="2.5" strokeDasharray="8 8" />
                    <circle
                      ref={shieldRingRef}
                      cx="180"
                      cy="126"
                      r="96"
                      stroke="#7B1FA2"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeDasharray="660"
                      transform="rotate(-90 180 126)"
                    />
                  </svg>
                </div>

                {/* Crest Badge Strictly Anchored Below Left Stage Ring (Zero Text Overlap!) */}
                <div
                  ref={shieldBadgeRef}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EE] border-[2.5px] border-[#7B1FA2] shadow-sm whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7B1FA2]" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#522C28]">
                    Free Radical Defense Shield
                  </span>
                </div>
              </div>
            </div>

            <BenefitCopyColumn
              wordClass="beat5-word-in"
              compareWordClass="beat5-compare-word-in"
              chipClass="beat5-prop-chip"
              inItemClass="beat5-in-item"
              outItemClass="beat5-out-item"
              tagRef={beat5TagRef}
              tagBgClass="bg-[#F3E5F5] border-[#7B1FA2]/30 text-[#6A1B9A]"
              tagIcon={<ShieldCheck className="w-3.5 h-3.5 text-[#7B1FA2]" />}
              tagText="BENEFIT 04 • ANTIOXIDANT DEFENSE"
              headlineLine1={[{ text: "BOTANICAL" }, { text: "DEFENSE." }]}
              headlineLine2={[{ text: "CELLULAR" }, { text: "GLOW." }]}
              propsList={[
                { icon: <Shield className="w-3 h-3 text-[#7B1FA2]" />, label: "Flavonoids" },
                { icon: <Leaf className="w-3 h-3 text-[#3CA837]" />, label: "Gallic Acid" },
                { icon: <Sun className="w-3 h-3 text-[#E88938]" />, label: "Collagen Care" },
              ]}
              compareBoxRef={beat5CompareBoxRef}
              compareWords={[
                { text: "PROTECT" },
                { text: "YOUR" },
                { text: "NATURAL" },
                { text: "RADIANCE.", accent: true },
              ]}
              whatsInRef={beat5InRef}
              whatsInList={["Natural Flavonoids", "Gallic Acid Power", "Skin Elasticity Care"]}
              whatsNotRef={beat5NotRef}
              whatsNotList={["Zero Artificial Colors", "Zero Preservatives", "Zero Greasy Oils"]}
            />
          </div>
        </div>

        {/* =================================================================
            PROMISE BEAT (Before Flavours): Genuine 5 Sutta Quality Belief
            ================================================================= */}
        <div
          ref={promiseStageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-6xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-2.5 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-14">
            {/* Jumbo 5 Sutta Makhana Visual + Grade Seal */}
            <div className="relative w-[175px] min-[400px]:w-[215px] sm:w-[300px] md:w-[350px] lg:w-[380px] aspect-square shrink-0 flex items-center justify-center">
              <div
                ref={promiseRingRef}
                className="absolute inset-4 rounded-full border-[3px] border-dashed border-[#E88938]/75 bg-[radial-gradient(circle,rgba(255,213,158,0.48)_0%,rgba(255,231,196,0.2)_55%,transparent_75%)] will-change-transform"
              />

              <div ref={promiseMakhanaDropRef} className="relative z-10 w-[72%] aspect-square will-change-transform">
                <img
                  ref={promiseMakhanaSpinRef}
                  src="/scroll/asset/06_large_makhana_with_crumbs.png"
                  alt="Genuine 5 Sutta Grade Hand-Sorted Makhana"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-[0_14px_22px_rgba(82,44,40,0.24)] will-change-transform"
                />
              </div>

              <div
                ref={promiseSealRef}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8EE] border-[2.5px] border-[#522C28] shadow-sm whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D73B3A]" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#522C28]">
                  Genuine 5 Sutta Grade
                </span>
              </div>
            </div>

            {/* Right Column: Promise Tag, Display Headline, 3 Pillars, & Exact Brand Quote */}
            <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div ref={promiseTagRef} className="mb-1.5 sm:mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] border border-[#E88938]/40 text-[#9A4A0B] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D73B3A]" />
                  <span>OUR PROMISE • 5 SUTTA STANDARD</span>
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight leading-[1.05]">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#522C28] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["QUALITY", "SHOULD", "BE", "REAL,"].map((w) => (
                    <span key={w} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="promise-word-in font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
                <span className="block" />
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-2.5 text-[#D73B3A] text-[24px] min-[400px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px]">
                  {["NOT", "JUST", "PROMISED."].map((w) => (
                    <span key={w} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="promise-word-in font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
              </h3>

              <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="promise-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#3CA837] stroke-[3]" />
                  Purity
                </span>
                <span className="promise-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#E88938] stroke-[3]" />
                  Consistency
                </span>
                <span className="promise-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8EE]/95 border border-[#522C28]/15 text-[#522C28] text-[10px] sm:text-xs font-extrabold uppercase tracking-wide">
                  <Check className="w-3 h-3 text-[#D73B3A] stroke-[3]" />
                  Transparency
                </span>
              </div>

              <div
                ref={promiseQuoteRef}
                className="mt-2 sm:mt-4 max-w-xl rounded-2xl border border-[#522C28]/15 border-l-4 border-l-[#D73B3A] bg-[#FFF8EE]/85 backdrop-blur-[2px] px-3 py-2 sm:px-5 sm:py-3.5 shadow-xs text-left"
              >
                <p className="text-[11px] min-[400px]:text-xs sm:text-sm md:text-[15px] font-bold text-[#522C28] leading-snug sm:leading-relaxed">
                  We bring genuine 5 sutta makhana and thoughtfully curated flavours to the market with a commitment to purity, consistency, and transparency. Every pack reflects our belief that quality should be real, not just promised.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            BEAT 6: Grand Finale — Strictly Bounded Bowl & 4 Bold Flavours CTA
            ================================================================= */}
        <div
          ref={beat6StageRef}
          className="absolute inset-0 pt-14 sm:pt-16 pb-4 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none"
        >
          <div className="w-full max-w-5xl mx-auto -translate-y-1 sm:-translate-y-4 flex flex-col md:flex-row items-center justify-center gap-2.5 min-[400px]:gap-4 sm:gap-6 md:gap-10 lg:gap-12">
            {/* Overflowing Bowl Visual (Strict Aspect-Square Keeps Bowl Inside Rays!) */}
            <div className="relative w-[170px] min-[400px]:w-[205px] sm:w-[290px] md:w-[340px] lg:w-[370px] aspect-square shrink-0 flex items-center justify-center overflow-hidden">
              <svg
                ref={beat6BurstRef}
                viewBox="0 0 320 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
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
                <circle cx="160" cy="160" r="102" fill="#FFF8EE" fillOpacity="0.88" />
              </svg>

              <div ref={beat6BowlWrapRef} className="relative z-10 w-[78%] aspect-square will-change-transform">
                <img
                  src="/scroll/asset/04_makhana_bowl.png"
                  alt="Overflowing Wooden Bowl of Pop Culture Makhana"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-[0_14px_22px_rgba(82,44,40,0.26)]"
                />
              </div>
            </div>

            {/* Finale Copy + Flavour Pills + Clickable CTA */}
            <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div ref={beat6TagRef} className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] border border-[#E65100]/30 text-[#D8661E] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>THE GOLD STANDARD OF SNACKING</span>
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight flex flex-col gap-1 sm:gap-1.5">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-3 text-[#522C28] text-[26px] min-[400px]:text-[30px] sm:text-[40px] md:text-[44px] lg:text-[52px] leading-[1.06]">
                  {["ALL", "THE", "CRUNCH."].map((w) => (
                    <span key={w} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="beat6-word-in font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 sm:gap-x-3 text-[#D73B3A] text-[28px] min-[400px]:text-[32px] sm:text-[44px] md:text-[48px] lg:text-[56px] leading-[1.06]">
                  {["POP", "CULTURE", "WAY."].map((w) => (
                    <span key={w} className="inline-block overflow-hidden py-1 -my-1">
                      <span className="beat6-word-in font-display inline-block will-change-transform">{w}</span>
                    </span>
                  ))}
                </span>
              </h3>

              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="beat6-flavour-chip px-2.5 py-1 rounded-full bg-[#D73B3A] text-[#FFF8EE] text-[10px] sm:text-xs font-black uppercase tracking-wide">
                  🌶️ Peri Peri
                </span>
                <span className="beat6-flavour-chip px-2.5 py-1 rounded-full bg-[#FAC537] text-[#522C28] text-[10px] sm:text-xs font-black uppercase tracking-wide">
                  🧀 Cheddar Cheese
                </span>
                <span className="beat6-flavour-chip px-2.5 py-1 rounded-full bg-[#E1366C] text-[#FFF8EE] text-[10px] sm:text-xs font-black uppercase tracking-wide">
                  🧂 Pink Salt
                </span>
                <span className="beat6-flavour-chip px-2.5 py-1 rounded-full bg-[#3CA837] text-[#FFF8EE] text-[10px] sm:text-xs font-black uppercase tracking-wide">
                  🌱 Pure Raw
                </span>
              </div>

              <p
                ref={beat6BodyRef}
                className="mt-3 text-xs sm:text-sm md:text-base font-bold text-[#522C28]/85 max-w-lg"
              >
                Hand-sorted, slow-roasted lotus seeds in 4 bold flavours — light on your stomach, big on real crunch.
              </p>

              <div ref={beat6CtaRef} className="mt-4 sm:mt-5 pointer-events-auto">
                <button
                  type="button"
                  onClick={scrollToFlavours}
                  className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#D73B3A] hover:bg-[#B82928] text-[#FFF8EE] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_24px_rgba(215,59,58,0.35)] hover:scale-105 active:scale-95 transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex items-center gap-2"
                >
                  <span>EXPLORE ALL 4 FLAVOURS</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
