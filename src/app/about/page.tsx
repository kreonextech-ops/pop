"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Heart,
  Quote,
  Flame,
  CheckCircle2,
  Compass,
  Package,
  Scroll,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  // Active founder story unroll: 'nikhil' | 'priyaank' | null
  const [activeStory, setActiveStory] = useState<"nikhil" | "priyaank">("nikhil");

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero headline entrance
      gsap.from(".about-hero-elem", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Quote section pop
      if (quoteRef.current) {
        gsap.from(quoteRef.current.querySelector(".quote-box"), {
          scale: 0.92,
          opacity: 0,
          duration: 0.85,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
          },
        });
      }

      // Value pillars stagger
      if (valuesRef.current) {
        gsap.from(valuesRef.current.querySelectorAll(".value-card"), {
          y: 35,
          opacity: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 82%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleFounderClick = (founder: "nikhil" | "priyaank") => {
    setActiveStory(founder);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col selection:bg-[#FFCD3C] selection:text-[#25100E]">
      <Navbar />

      {/* =========================================================================
          HERO: THE BELIEF THAT BUILT POP CULTURE
          ========================================================================= */}
      <section
        ref={heroRef}
        className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D73B3A]/10 border border-[#D73B3A]/25 text-[#D73B3A] text-xs font-black uppercase tracking-widest mb-6 about-hero-elem">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OUR STORY &amp; FOUNDERS</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#25100E] leading-[1.05] max-w-4xl mx-auto about-hero-elem">
          Healthy snacking should be the{" "}
          <span className="text-[#D73B3A] underline decoration-[#FAC537] decoration-4 underline-offset-6">
            coolest thing
          </span>{" "}
          on your shelf.
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-[#522C28]/80 font-medium max-w-2xl mx-auto leading-relaxed about-hero-elem">
          We kept noticing the same gap on every Indian shelf: snacks were either tasty but unhealthy,
          or healthy but boring. Nobody was making healthy snacking feel exciting. That gap became Pop Culture.
        </p>

        {/* Floating Quick Stat Badges */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto about-hero-elem">
          <div className="p-3.5 rounded-2xl bg-white border border-[#25100E]/10 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-[#D73B3A] block">100%</span>
            <span className="text-[11px] font-bold text-[#522C28]/80 uppercase">5-Sutta Lotus Seeds</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#25100E]/10 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-[#FAC537] block">0%</span>
            <span className="text-[11px] font-bold text-[#522C28]/80 uppercase">Never Deep Fried</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#25100E]/10 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-[#3CA837] block">Siliguri HQ</span>
            <span className="text-[11px] font-bold text-[#522C28]/80 uppercase">Handcrafted Base</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#25100E]/10 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-[#25100E] block">Khagaria</span>
            <span className="text-[11px] font-bold text-[#522C28]/80 uppercase">Origin Roots</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOUNDERS SHOWCASE: TWO IN A ROW (LEFT: NIKHIL, RIGHT: PRIYAANK)
          ========================================================================= */}
      <section className="w-full py-10 sm:py-16 bg-white border-y border-[#522C28]/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#D73B3A]">
              ✦ THE FACES BEHIND THE CRUNCH ✦
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#25100E] tracking-tight mt-1">
              MEET THE FOUNDERS
            </h2>
            <p className="text-xs sm:text-sm text-[#522C28]/70 font-semibold mt-1 max-w-md mx-auto">
              Click either founder below to unroll their story and see the vision and craft that drives Pop Culture.
            </p>
          </div>

          {/* Two In A Row Grid: Left Nikhil, Right Priyaank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            
            {/* LEFT: NIKHIL RAJ */}
            <div
              onClick={() => handleFounderClick("nikhil")}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative group ${
                activeStory === "nikhil"
                  ? "bg-[#FFF9F2] border-[#D73B3A] shadow-xl scale-[1.02] ring-4 ring-[#D73B3A]/15"
                  : "bg-white border-[#522C28]/15 hover:border-[#D73B3A]/40 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Active selection pill */}
              {activeStory === "nikhil" && (
                <span className="absolute -top-3 px-3 py-0.5 rounded-full bg-[#D73B3A] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Scroll className="w-3 h-3" />
                  <span>Story Unrolled</span>
                </span>
              )}

              {/* Portrait Image Frame (No quote text, ready for user image) */}
              <div className="relative w-full aspect-[4/5] max-w-[280px] rounded-2xl bg-gradient-to-br from-[#FFF3E3] via-[#FFE8DA] to-[#FAC537]/30 border-2 border-[#522C28]/15 p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
                {/* Decorative background watermark */}
                <span className="absolute text-5xl font-black uppercase text-[#25100E]/5 select-none font-display pointer-events-none rotate-[-12deg]">
                  KHAGARIA
                </span>

                {/* Stylized Portrait Placeholder (User image goes here) */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#25100E] text-[#FAC537] flex items-center justify-center font-display text-4xl sm:text-5xl font-black shadow-xl border-4 border-white mb-3">
                  NR
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-[#D73B3A] bg-white/90 px-3 py-1 rounded-full border border-[#D73B3A]/20 shadow-xs">
                  Founder &amp; Vision Lead
                </span>
              </div>

              {/* Name & Details below image */}
              <div className="mt-5 w-full">
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#25100E] tracking-tight">
                  Nikhil Raj
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#D73B3A] mt-0.5">
                  Founder &amp; Vision Lead
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#522C28]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#D73B3A]" />
                  <span>From Khagaria, Bihar • Based in Siliguri</span>
                </div>

                {/* Unroll action button */}
                <button
                  type="button"
                  className={`mt-4 w-full py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeStory === "nikhil"
                      ? "bg-[#D73B3A] text-white shadow-sm"
                      : "bg-[#FFF3E3] text-[#25100E] group-hover:bg-[#D73B3A] group-hover:text-white"
                  }`}
                >
                  <Scroll className="w-3.5 h-3.5" />
                  <span>{activeStory === "nikhil" ? "Reading Nikhil's Journey" : "Click to Read Story ↓"}</span>
                </button>
              </div>
            </div>

            {/* RIGHT: PRIYAANK SINHAL */}
            <div
              onClick={() => handleFounderClick("priyaank")}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative group ${
                activeStory === "priyaank"
                  ? "bg-[#FFF9F2] border-[#FAC537] shadow-xl scale-[1.02] ring-4 ring-[#FAC537]/25"
                  : "bg-white border-[#522C28]/15 hover:border-[#FAC537]/50 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Active selection pill */}
              {activeStory === "priyaank" && (
                <span className="absolute -top-3 px-3 py-0.5 rounded-full bg-[#25100E] text-[#FAC537] text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Scroll className="w-3 h-3" />
                  <span>Story Unrolled</span>
                </span>
              )}

              {/* Portrait Image Frame (No quote text, ready for user image) */}
              <div className="relative w-full aspect-[4/5] max-w-[280px] rounded-2xl bg-gradient-to-br from-[#FFF3E3] via-[#FFF0DB] to-[#FFCD3C]/35 border-2 border-[#522C28]/15 p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
                <span className="absolute text-5xl font-black uppercase text-[#25100E]/5 select-none font-display pointer-events-none rotate-[-12deg]">
                  CRAFT
                </span>

                {/* Stylized Portrait Placeholder (User image goes here) */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#D73B3A] text-white flex items-center justify-center font-display text-4xl sm:text-5xl font-black shadow-xl border-4 border-white mb-3">
                  PS
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-[#25100E] bg-white/90 px-3 py-1 rounded-full border border-[#25100E]/20 shadow-xs">
                  Co-Founder &amp; Craft Lead
                </span>
              </div>

              {/* Name & Details below image */}
              <div className="mt-5 w-full">
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#25100E] tracking-tight">
                  Priyaank Sinhal
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#E53925] mt-0.5">
                  Co-Founder &amp; Craft Lead
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#522C28]/70">
                  <Sparkle className="w-3.5 h-3.5 text-[#FAC537]" />
                  <span>Age 21 Catalyst • Craft Obsession</span>
                </div>

                {/* Unroll action button */}
                <button
                  type="button"
                  className={`mt-4 w-full py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeStory === "priyaank"
                      ? "bg-[#25100E] text-[#FFCD3C] shadow-sm"
                      : "bg-[#FFF3E3] text-[#25100E] group-hover:bg-[#25100E] group-hover:text-[#FFCD3C]"
                  }`}
                >
                  <Scroll className="w-3.5 h-3.5" />
                  <span>{activeStory === "priyaank" ? "Reading Priyaank's Journey" : "Click to Read Story ↓"}</span>
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================================
              THE UNROLLED SCROLL STORY DISPLAY (DYNAMIC ANIMATED PARCHMENT BANNER)
              ========================================================================= */}
          <div ref={scrollRef} className="mt-12 sm:mt-16 scroll-mt-24">
            
            {/* Top Carved Scroll Rod / Header Roll */}
            <div className="relative mx-auto max-w-4xl h-7 sm:h-9 bg-gradient-to-r from-[#5B2E1D] via-[#8C482A] to-[#5B2E1D] rounded-full shadow-lg border-2 border-[#FFCD3C]/40 flex items-center justify-between px-4 z-20">
              <span className="w-3 h-3 rounded-full bg-[#FFCD3C] shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-black text-[#FFCD3C]">
                  ✦ POP CULTURE CHRONICLES • {activeStory === "nikhil" ? "NIKHIL RAJ" : "PRIYAANK SINHAL"} ✦
                </span>
              </div>
              <span className="w-3 h-3 rounded-full bg-[#FFCD3C] shadow-sm" />
            </div>

            {/* Parchment Scroll Body with Textured Edges */}
            <div className="relative mx-auto max-w-4xl -my-1.5 bg-[#FAF3E6] border-x-4 border-[#8C482A] shadow-2xl p-6 sm:p-12 md:p-14 relative overflow-hidden transition-all duration-500 ease-out z-10">
              
              {/* Subtle vintage paper watermark texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#D73B3A_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

              {/* Story Tab Switcher inside the Scroll */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <button
                  onClick={() => setActiveStory("nikhil")}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeStory === "nikhil"
                      ? "bg-[#D73B3A] text-white shadow-md scale-105"
                      : "bg-[#FFF8EE] text-[#522C28] hover:bg-[#FFE3D6]"
                  }`}
                >
                  Nikhil Raj’s Story
                </button>
                <button
                  onClick={() => setActiveStory("priyaank")}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeStory === "priyaank"
                      ? "bg-[#25100E] text-[#FFCD3C] shadow-md scale-105"
                      : "bg-[#FFF8EE] text-[#522C28] hover:bg-[#FFF0DB]"
                  }`}
                >
                  Priyaank Sinhal’s Story
                </button>
              </div>

              {/* NIKHIL'S STORY (VERBATIM) */}
              {activeStory === "nikhil" && (
                <div className="space-y-5 text-sm sm:text-base text-[#3E1D19] leading-relaxed animate-fade-in font-medium">
                  <div className="border-b border-[#522C28]/15 pb-4 mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-[#D73B3A]">
                      // THE JOURNEY FROM KHAGARIA TO PAN-INDIA
                    </span>
                    <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#25100E] mt-1">
                      Where You Start Doesn’t Decide Where You Go
                    </h3>
                  </div>

                  <p>
                    Nikhil Raj’s story starts in <strong>Khagaria, a small town in Bihar</strong>, where big dreams didn’t come with big resources. Growing up, he learned early that value comes from hard work, honest dealings, and showing up every single day.
                  </p>

                  <p>
                    He began in the family business, learning the craft from the ground up: how to deal with suppliers, understand customers, manage cash flow, and earn trust one sale at a time. Those years gave him something no classroom could: a deep respect for quality and an instinct for what people actually want.
                  </p>

                  <p>
                    But Nikhil felt a pull toward something more. Running a business was one thing. Building a brand people love was another. He kept noticing the same gap on every shelf: snacks were either tasty but unhealthy, or healthy but boring. Nobody was making healthy snacking feel exciting.
                  </p>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border-l-4 border-[#D73B3A] shadow-xs my-4">
                    <p className="font-bold text-[#25100E]">
                      That gap became Pop Culture.
                    </p>
                    <p className="text-sm mt-1 text-[#522C28]/90">
                      Pop Culture was built from scratch on a simple belief: healthy snacking should be the coolest thing on your shelf. Every pack is designed to taste great, look bold, and fit naturally into how young India lives, eats, and shares.
                    </p>
                  </div>

                  <p>
                    From a small town in Khagaria to building a brand for a new generation, Nikhil’s journey is proof that where you start doesn’t decide where you go. Today, he and his co-founders are on a mission to change how India snacks, one crunchy, guilt-free bite at a time.
                  </p>

                  <div className="pt-4 border-t border-[#522C28]/15 flex items-center justify-between">
                    <span className="font-display text-sm sm:text-base font-black text-[#D73B3A] uppercase tracking-wide">
                      Pop Culture. Snack Smart. Snack Cool.
                    </span>
                    <span className="text-xs font-bold text-[#522C28]/60">
                      — Nikhil Raj, Founder
                    </span>
                  </div>
                </div>
              )}

              {/* PRIYAANK'S STORY (VERBATIM) */}
              {activeStory === "priyaank" && (
                <div className="space-y-5 text-sm sm:text-base text-[#3E1D19] leading-relaxed animate-fade-in font-medium">
                  <div className="border-b border-[#522C28]/15 pb-4 mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-[#E53925]">
                      // THE FORCE BEHIND THE CRAFT
                    </span>
                    <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#25100E] mt-1">
                      Quality Over Quantity. A Rule, Not A Slogan.
                    </h3>
                  </div>

                  <p>
                    <strong>Priyaank Sinhal started young. At just 21</strong>, while most people his age were still figuring out what to do next, he had already chosen his path: build something of his own.
                  </p>

                  <p>
                    What set him apart early on was a refusal to follow the usual playbook. Many founders chase everything at once: more products, more categories, more noise. Priyaank went the other way. He believed that doing a few things exceptionally well beats doing many things halfway. Quality over quantity wasn’t a slogan for him. It was a rule.
                  </p>

                  <p>
                    That mindset shows up in the smallest details. From the texture of a snack to the finish on a pack, Priyaank has an eye that catches what others miss, and a standard that doesn’t bend. If something isn’t right, it doesn’t ship. Simple as that.
                  </p>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border-l-4 border-[#FAC537] shadow-xs my-4">
                    <p className="font-bold text-[#25100E]">
                      And he loves the work.
                    </p>
                    <p className="text-sm mt-1 text-[#522C28]/90">
                      Not the title, not the spotlight, but the daily grind of making a good product better. He’s usually the first one in and the last one thinking about what could be improved.
                    </p>
                  </div>

                  <p>
                    As co-founder of Pop Culture, Priyaank is the force behind the craft, making sure every bite lives up to the promise of being the coolest way to snack healthy.
                  </p>

                  <div className="pt-4 border-t border-[#522C28]/15 flex items-center justify-between">
                    <span className="font-display text-sm sm:text-base font-black text-[#25100E] uppercase tracking-wide">
                      Pop Culture. Snack Smart. Snack Cool.
                    </span>
                    <span className="text-xs font-bold text-[#522C28]/60">
                      — Priyaank Sinhal, Co-Founder
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Carved Scroll Rod / Roll */}
            <div className="relative mx-auto max-w-4xl h-7 sm:h-9 bg-gradient-to-r from-[#5B2E1D] via-[#8C482A] to-[#5B2E1D] rounded-full shadow-lg border-2 border-[#FFCD3C]/40 flex items-center justify-between px-4 z-20">
              <span className="w-3 h-3 rounded-full bg-[#FFCD3C] shadow-sm" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#FFCD3C]">
                ✦ CRAFTED WITH PRIDE IN SILIGURI • ROOTED IN BIHAR ✦
              </span>
              <span className="w-3 h-3 rounded-full bg-[#FFCD3C] shadow-sm" />
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          THE BRAND PROMISE & MANIFESTO
          ========================================================================= */}
      <section ref={quoteRef} className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="quote-box p-8 sm:p-14 rounded-3xl bg-[#25100E] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-[#D73B3A]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-[#FAC537]/20 blur-3xl pointer-events-none" />

          <Quote className="w-12 h-12 text-[#FAC537]/50 mx-auto mb-4" />

          <span className="text-xs font-black uppercase tracking-widest text-[#FAC537]">
            ✦ THE POP CULTURE CREED ✦
          </span>

          <h2 className="font-display text-3xl sm:text-5xl uppercase font-black tracking-tight text-white mt-3 max-w-3xl mx-auto leading-tight">
            Pop Culture. <br className="hidden sm:inline" />
            <span className="text-[#FAC537]">Snack Smart.</span>{" "}
            <span className="text-[#D73B3A]">Snack Cool.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Every pouch reflects our uncompromising belief that healthy snacks don’t have to taste
            like medicine, and indulgence shouldn’t come with regret. Real lotus seeds, genuine flavours,
            and honest crunch.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#flavours"
              className="px-6 py-3 rounded-full bg-[#D73B3A] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-[#FB0008] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>Explore The Flavours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all inline-flex items-center gap-2"
            >
              <span>Shop All Munch Packs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OUR 4 PILLARS (INCLUDING 360° EVEN MASALA DISTRIBUTION & ZERO LUMPS)
          ========================================================================= */}
      <section ref={valuesRef} className="w-full pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#D73B3A]">
            ✦ HOW WE WORK ✦
          </span>
          <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#25100E] mt-1">
            The Standards We Never Compromise On
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Even Masala Distribution */}
          <div className="value-card p-6 rounded-3xl bg-white border border-[#25100E]/15 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-3xl mb-3 block">✨</span>
              <h4 className="font-display text-lg font-black uppercase text-[#25100E]">
                360° Even Masala, Zero Lumps
              </h4>
              <p className="text-xs text-[#522C28]/75 font-semibold mt-1.5 leading-relaxed">
                Ever had a snack with a powdery clump in one bite and nothing in the next? Not here. Every single lotus seed goes through our micro-dusting tumble for a seamless, 360° even spice coat. No lumps, no sticky clusters, just pure uniform flavour in every crunch.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-[#D73B3A] mt-4 block">
              100% Uniform Coating
            </span>
          </div>

          {/* Pillar 2: 5-Sutta Jumbo Seeds */}
          <div className="value-card p-6 rounded-3xl bg-white border border-[#25100E]/15 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-3xl mb-3 block">🌱</span>
              <h4 className="font-display text-lg font-black uppercase text-[#25100E]">
                Genuine 5-Sutta Jumbo Seeds
              </h4>
              <p className="text-xs text-[#522C28]/75 font-semibold mt-1.5 leading-relaxed">
                Directly hand-sorted from the wetlands of Bihar. We reject smaller, dense filler seeds and pick only jumbo, airy pops that deliver the signature melt-in-mouth crunch.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-[#3CA837] mt-4 block">
              Direct Farmer Sourced
            </span>
          </div>

          {/* Pillar 3: Slow-Roasted Purity */}
          <div className="value-card p-6 rounded-3xl bg-white border border-[#25100E]/15 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-3xl mb-3 block">🔥</span>
              <h4 className="font-display text-lg font-black uppercase text-[#25100E]">
                0% Fry, 100% Even Slow-Roast
              </h4>
              <p className="text-xs text-[#522C28]/75 font-semibold mt-1.5 leading-relaxed">
                Zero palm oil, zero trans-fats, zero deep-frying. Roasted to golden perfection in our Siliguri roastery facility so you can munch freely without heavy stomach regret.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-[#F79E1B] mt-4 block">
              Clean Roasting Process
            </span>
          </div>

          {/* Pillar 4: Strict Quality Gate */}
          <div className="value-card p-6 rounded-3xl bg-white border border-[#25100E]/15 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-3xl mb-3 block">🛡️</span>
              <h4 className="font-display text-lg font-black uppercase text-[#25100E]">
                If It’s Not Right, It Doesn’t Ship
              </h4>
              <p className="text-xs text-[#522C28]/75 font-semibold mt-1.5 leading-relaxed">
                Priyaank’s golden rule: doing a few things exceptionally well beats doing many halfway. Strict air-tight foil sealing and batch tasting ensure every pouch is restaurant-grade fresh.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-[#25100E] mt-4 block">
              Priyaank’s Unbending Standard
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BOTTOM STRAIGHT MARQUEE RIBBON (Centered Star Structure)
          ========================================================================= */}
      <div className="relative z-20 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3.5 md:py-4 overflow-hidden select-none mt-auto">
        <div className="flex w-max animate-wave-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-5 sm:gap-7 pr-5 sm:pr-7">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-5 sm:gap-7 font-display text-[15px] sm:text-[24px] md:text-[28px] text-[#FFF8EE] uppercase font-bold whitespace-nowrap"
                >
                  <span className="font-display tracking-[0.09em]">THE COOLEST WAY TO SNACK BETTER</span>
                  <span className="font-display text-[#FFCD3C] leading-none">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
