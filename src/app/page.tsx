"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Heart,
  Star,
  Clock,
  ArrowRight,
  Gift,
  Coins,
  KeyRound,
  Search,
  User,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HeroMakhanaPhysics from "@/components/HeroMakhanaPhysics";
import InteractiveScatterLayer, { ScatterPieceData } from "@/components/InteractiveScatterLayer";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import { PRODUCTS } from "@/data/products";

const MakhanaBenefitsScroll = dynamic(
  () => import("@/components/MakhanaBenefitsScroll"),
  { ssr: true }
);
const DiscoverFoxGame = dynamic(
  () => import("@/components/DiscoverFoxGame"),
  { ssr: true }
);

const cheeseScatterPieces: ScatterPieceData[] = [
  {
    id: 301,
    src: "/scatter/cheese/04_swiss_cheese_wedge.png",
    alt: "Swiss Cheese Wedge Top-Left",
    desktop: { x: -335, y: -140, rotate: -24, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -24, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-1",
    delay: "0.01s",
  },
  {
    id: 302,
    src: "/scatter/cheese/10_triangle_cheese_wedge.png",
    alt: "Triangle Cheese Wedge Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-2",
    delay: "0.02s",
  },
  {
    id: 303,
    src: "/scatter/cheese/03_cheese_cubes.png",
    alt: "Golden Cheddar Cubes Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-3",
    delay: "0.03s",
  },
  {
    id: 304,
    src: "/scatter/cheese/09_hole_filled_cheese_block.png",
    alt: "Porous Cheese Block Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-4",
    delay: "0.04s",
  },
  {
    id: 305,
    src: "/scatter/cheese/08_crumbly_cheese_chunks.png",
    alt: "Crumbly Cheese Chunks Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-5",
    delay: "0.05s",
  },
  {
    id: 306,
    src: "/scatter/cheese/01_melting_cheese.png",
    alt: "Melty Cheese Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-6",
    delay: "0.06s",
  },
];

const periPeriScatterPieces: ScatterPieceData[] = [
  {
    id: 101,
    src: "/scatter/peri-peri/01_single_chilli.png",
    alt: "Single Red Chilli Top-Left",
    desktop: { x: -335, y: -140, rotate: -25, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -25, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-1",
    delay: "0.01s",
  },
  {
    id: 102,
    src: "/scatter/peri-peri/02_sliced_chilli.png",
    alt: "Sliced Red Chilli Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-2",
    delay: "0.02s",
  },
  {
    id: 103,
    src: "/scatter/peri-peri/04_flame_chilli.png",
    alt: "Flame Chilli Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-3",
    delay: "0.03s",
  },
  {
    id: 104,
    src: "/scatter/peri-peri/05_spice_splatter_chilli.png",
    alt: "Spice Splatter Chilli Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-4",
    delay: "0.04s",
  },
  {
    id: 105,
    src: "/scatter/peri-peri/06_cut_chilli.png",
    alt: "Cut Chilli Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-5",
    delay: "0.05s",
  },
  {
    id: 106,
    src: "/scatter/peri-peri/03_crossed_chillies.png",
    alt: "Crossed Chillies Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-6",
    delay: "0.06s",
  },
];

const plainScatterPieces: ScatterPieceData[] = [
  {
    id: 201,
    src: "/scatter/plain/05_makhana_with_leaves.png",
    alt: "Makhana with Lotus Leaves Top-Left",
    desktop: { x: -335, y: -140, rotate: -20, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-1",
    delay: "0.01s",
  },
  {
    id: 202,
    src: "/scatter/plain/08_makhana_leaf_cluster.png",
    alt: "Makhana Leaf Cluster Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-2",
    delay: "0.02s",
  },
  {
    id: 203,
    src: "/scatter/plain/03_cracked_makhana.png",
    alt: "Cracked Crunchy Makhana Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-3",
    delay: "0.03s",
  },
  {
    id: 204,
    src: "/scatter/plain/06_large_makhana_with_crumbs.png",
    alt: "Popped Makhana with Crumbs Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-4",
    delay: "0.04s",
  },
  {
    id: 205,
    src: "/scatter/plain/01_single_makhana.png",
    alt: "Single Roasted Makhana Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-5",
    delay: "0.05s",
  },
  {
    id: 206,
    src: "/scatter/plain/02_three_makhana_cluster.png",
    alt: "Three Makhana Cluster Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-6",
    delay: "0.06s",
  },
];

const pinkSaltScatterPieces: ScatterPieceData[] = [
  {
    id: 401,
    src: "/scatter/pink-salt/01_salt_bowl.png",
    alt: "Pink Salt Bowl Top-Left",
    desktop: { x: -335, y: -140, rotate: -20, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-1",
    delay: "0.01s",
  },
  {
    id: 402,
    src: "/scatter/pink-salt/03_large_pink_salt_crystals.png",
    alt: "Large Pink Salt Crystals Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-2",
    delay: "0.02s",
  },
  {
    id: 403,
    src: "/scatter/pink-salt/05_salt_crystal_pile_with_leaves.png",
    alt: "Pink Salt Crystal Pile Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-3",
    delay: "0.03s",
  },
  {
    id: 404,
    src: "/scatter/pink-salt/06_pink_salt_grinder.png",
    alt: "Pink Salt Grinder Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-4",
    delay: "0.04s",
  },
  {
    id: 405,
    src: "/scatter/pink-salt/09_raw_himalayan_salt_chunks.png",
    alt: "Raw Himalayan Salt Chunks Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-5",
    delay: "0.05s",
  },
  {
    id: 406,
    src: "/scatter/pink-salt/02_wooden_salt_scoop.png",
    alt: "Wooden Salt Scoop Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-scatter-wander-6",
    delay: "0.06s",
  },
];

export default function BiteJoyPage() {
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { totalCount, openCart, addItem } = useCart();
  const [activePlanetIndex, setActivePlanetIndex] = useState(0); // 0 = Peri Peri Punch, 2 = Cheese Blast
  const [isScattered, setIsScattered] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [resetScatterTrigger, setResetScatterTrigger] = useState(0);
  const [isTransitioningFlavour, setIsTransitioningFlavour] = useState(false);

  useEffect(() => {
    const mobileViewport = window.innerWidth < 640;
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Defer secondary flavour assets until browser is idle so Hero hydrates & paints instantaneously
    const deferredAssets = [
      "/packets/peri peri.svg",
      mobileViewport ? "/product-bg/mobile-peri-peri.webp" : "/product-bg/peri-peri.webp",
      "/packets/cheese.svg",
      "/packets/pink-salt-pouch.png",
      "/packets/raw-makhana-pouch.png",
      mobileViewport ? "/product-bg/mobile-cheese.webp" : "/product-bg/cheese.webp",
      mobileViewport ? "/product-bg/mobile-pink-salt.webp" : "/product-bg/pink-salt.webp",
      mobileViewport ? "/product-bg/mobile-plain.webp" : "/product-bg/plain.webp",
      ...periPeriScatterPieces.map((p) => p.src),
      ...cheeseScatterPieces.map((p) => p.src),
      ...pinkSaltScatterPieces.map((p) => p.src),
      ...plainScatterPieces.map((p) => p.src),
    ];

    let idleHandle: number | null = null;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;
    const preloadDeferred = () => {
      deferredAssets.forEach((url) => {
        const img = new Image();
        img.decoding = "async";
        img.src = url;
      });
    };

    const winWithIdle = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof winWithIdle.requestIdleCallback === "function") {
      idleHandle = winWithIdle.requestIdleCallback(preloadDeferred, { timeout: 1400 });
    } else {
      fallbackTimeout = setTimeout(preloadDeferred, 650);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (idleHandle !== null && typeof winWithIdle.cancelIdleCallback === "function") {
        winWithIdle.cancelIdleCallback(idleHandle);
      }
      if (fallbackTimeout !== null) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, []);

  // Orchestrate crisp ultra-snappy retract & burst lifecycle during flavour switching
  const changeFlavour = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activePlanetIndex || isTransitioningFlavour) return;
      setIsTransitioningFlavour(true);

      // 1. Snappy pull current assets back behind the packet (120ms)
      setIsScattered(false);

      // 2. Once retracted behind the pouch (120ms), swap flavour pack and background
      setTimeout(() => {
        setActivePlanetIndex(targetIndex);

        // 3. Immediate next frame burst outward
        requestAnimationFrame(() => {
          setIsScattered(true);
          setIsTransitioningFlavour(false);
        });
      }, 120);
    },
    [activePlanetIndex, isTransitioningFlavour]
  );

  const nextPlanet = useCallback(() => {
    changeFlavour((activePlanetIndex + 1) % 4);
  }, [changeFlavour, activePlanetIndex]);

  const prevPlanet = useCallback(() => {
    changeFlavour((activePlanetIndex - 1 + 4) % 4);
  }, [changeFlavour, activePlanetIndex]);

  // Keyboard navigation for slider (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPlanet();
      } else if (e.key === "ArrowRight") {
        nextPlanet();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPlanet, prevPlanet]);

  // When clicking the pouch packet directly, gracefully recall behind and re-burst from behind!
  const triggerScatter = () => {
    if (isTransitioningFlavour) return;
    setResetScatterTrigger((prev) => prev + 1);
    setIsScattered(false);
    setTimeout(() => {
      setIsScattered(true);
    }, 200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // If the touch originated from a scatter piece, packet, or button, ignore section swipe
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-scatter-piece]") ||
      target.closest("[data-packet]") ||
      target.closest("button") ||
      target.closest("a")
    ) {
      setTouchStartX(null);
      return;
    }
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-scatter-piece]") ||
      target.closest("[data-packet]") ||
      target.closest("button") ||
      target.closest("a")
    ) {
      setTouchStartX(null);
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    // Require intentional swipe on background of at least 70px to switch flavours
    if (diff > 70) {
      nextPlanet();
    } else if (diff < -70) {
      prevPlanet();
    }
    setTouchStartX(null);
  };

  const scatterByFlavour = [
    periPeriScatterPieces,
    cheeseScatterPieces,
    pinkSaltScatterPieces,
    plainScatterPieces,
  ];
  const currentScatterPieces = scatterByFlavour[activePlanetIndex] || periPeriScatterPieces;

  const flavourPlanets = [
    {
      id: "periperi",
      slug: "peri-peri",
      code: "01 / 04",
      name: "PERI PERI",
      tagline: "",
      description: "",
      packImage: "/packets/peri peri.svg",
      bgSvg: "/product-bg/peri-peri.webp",
      bgMobileSvg: "/product-bg/mobile-peri-peri.webp",
      themeBg: "#E53925",
      themeColor: "#D73B3A",
      planetGradient: "radial-gradient(circle at 35% 30%, #FF6B6B 0%, #D73B3A 55%, #7A1211 100%)",
      glowColor: "rgba(215, 59, 58, 0.45)",
      badge: "🌶️ PERI PERI",
      accentBg: "#FB0008",
    },
    {
      id: "cheddar",
      slug: "cheddar-cheese",
      code: "02 / 04",
      name: "CHEDDAR CHEESE",
      tagline: "",
      description: "",
      packImage: "/packets/cheese.svg",
      bgSvg: "/product-bg/cheese.webp",
      bgMobileSvg: "/product-bg/mobile-cheese.webp",
      themeBg: "#F79E1B",
      themeColor: "#FFCD3C",
      planetGradient: "radial-gradient(circle at 35% 30%, #FFE082 0%, #F37D20 55%, #8C3900 100%)",
      glowColor: "rgba(255, 205, 60, 0.45)",
      badge: "🧀 CHEDDAR CHEESE",
      accentBg: "#F37D20",
    },
    {
      id: "pinksalt",
      slug: "pink-salt",
      code: "03 / 04",
      name: "HIMALAYAN PINK SALT",
      tagline: "",
      description: "",
      packImage: "/packets/pink-salt-pouch.png",
      bgSvg: "/product-bg/pink-salt.webp",
      bgMobileSvg: "/product-bg/mobile-pink-salt.webp",
      themeBg: "#FFF3F5",
      themeColor: "#E1366C",
      planetGradient: "radial-gradient(circle at 35% 30%, #FFB3C7 0%, #E1366C 55%, #7A1238 100%)",
      glowColor: "rgba(225, 54, 108, 0.45)",
      badge: "🧂 PINK SALT",
      accentBg: "#E1366C",
    },
    {
      id: "plain",
      slug: "raw-makhana",
      code: "04 / 04",
      name: "RAW MAKHANA",
      tagline: "",
      description: "",
      packImage: "/packets/raw-makhana-pouch.png",
      bgSvg: "/product-bg/plain.webp",
      bgMobileSvg: "/product-bg/mobile-plain.webp",
      themeBg: "#FFF3E3",
      themeColor: "#2D6A4F",
      planetGradient: "radial-gradient(circle at 35% 30%, #D8F3DC 0%, #52B788 55%, #1B4332 100%)",
      glowColor: "rgba(45, 106, 79, 0.45)",
      badge: "🌱 RAW MAKHANA",
      accentBg: "#2D6A4F",
    },
  ];



  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentFlavour = flavourPlanets[activePlanetIndex] || flavourPlanets[0];

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] font-sans antialiased overflow-x-clip selection:bg-[#D73B3A] selection:text-white relative">
      
      {/* =========================================================================
          TOP NAVBAR
          ========================================================================= */}
      <Navbar />

      {/* =========================================================================
          HERO SECTION WITH MINIMAL CTAs, 4 CASCADING PACKETS, FOX & GRAVITY MAKHANA
          ========================================================================= */}
      <section className="relative w-full sm:min-h-[calc(100svh-72px)] bg-[#F9F3EA] flex flex-col justify-between [contain:layout_paint]">
        {/* Interactive Stage above the Red Marquee (Floor sits directly on top of the marquee) */}
        <div
          ref={heroStageRef}
          className="relative flex-1 w-full flex flex-col justify-center overflow-hidden"
        >
          {/* Main Hero Grid: Minimal Copy/CTAs (Left) + Canva-Style Stack + Front-Left Fox (Right) */}
          <div className="relative z-20 w-full max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-14 flex-1 flex flex-col lg:flex-row items-center justify-start sm:justify-evenly lg:justify-between gap-2 sm:gap-8 lg:gap-6 pt-3 sm:pt-6 lg:pt-6 pointer-events-none">
            {/* Left Column: Minimal Brand Copy & Dual CTAs (Ultra-concise on mobile, rich on desktop) */}
            <div className="w-full lg:w-[42%] flex flex-col items-center lg:items-start text-center lg:text-left lg:py-8 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white border border-[#C92328]/20 text-[#C92328] text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs mb-1.5 sm:mb-3">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="sm:hidden">Makhana • ₹149</span>
                <span className="hidden sm:inline">Slow-Roasted Makhana • ₹149</span>
              </span>

              <h1 className="font-display text-[32px] min-[360px]:text-4xl sm:text-5xl lg:text-[54px] xl:text-[64px] leading-[0.94] sm:leading-[0.96] tracking-tight uppercase text-[#25100E]">
                SNACK BETTER.{" "}
                <span className="block font-display text-[#C92328]">POP LOUDER.</span>
              </h1>

              <p className="hidden sm:block mt-3 text-base text-[#522C28]/85 font-semibold max-w-md">
                Crisp gluten-free lotus seeds in 4 bold flavours — light crunch, zero guilt.
              </p>

              {/* Hero CTAs (z-40 keeps buttons always clickable above falling makhana) */}
              <div
                style={{ zIndex: 40 }}
                className="relative mt-2.5 sm:mt-5 flex flex-nowrap sm:flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 pointer-events-auto"
              >
                <Link
                  href="/shop"
                  className="px-4 sm:px-7 py-2 sm:py-3 rounded-full bg-[#C92328] hover:bg-[#A5151C] text-[#FFF8EE] font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-[0_8px_22px_rgba(201,35,40,0.32)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="sm:hidden">Shop Now</span>
                  <span className="hidden sm:inline">Shop All Snacks</span>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("flavours")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-3.5 sm:px-6 py-2 sm:py-3 rounded-full bg-white hover:bg-[#FFF8EE] text-[#25100E] border-2 border-[#25100E]/15 hover:border-[#25100E]/40 font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span className="sm:hidden">Flavours</span>
                  <span className="hidden sm:inline">Explore Flavours</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>

              <p className="hidden sm:block mt-4 text-xs font-bold text-[#522C28]/70 tracking-wide uppercase">
                100% Roasted • 67% Less Fat • Free Delivery Above ₹699+
              </p>
            </div>

            {/* Right Column: Tight Canva Stack Completely Inside Bounds + Compact Fox at Bottom-Left */}
            <div className="relative w-full lg:w-[58%] flex items-end justify-center lg:justify-end self-end lg:mt-auto pt-1 sm:pt-4 lg:pt-8 pb-6 sm:pb-9 lg:pb-8">
              <div className="relative flex items-end justify-center max-w-full pr-1 sm:pr-3 lg:pr-4">
                {/* Base Flow Container: All 4 Pouches stay 100% inside right viewport edge with even visual heights */}
                <div className="relative z-10 flex items-end justify-center pointer-events-none">
                  {/* 1. Front-Left: Cheddar Cheese */}
                  <button
                    type="button"
                    aria-label="Preview Cheddar Cheese"
                    onClick={() => {
                      setActivePlanetIndex(1);
                      document.getElementById("flavours")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="relative z-40 pointer-events-auto cursor-pointer translate-y-[4px] -rotate-[7deg] hover:-translate-y-2 transition-transform duration-200 origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/cheese.svg"
                      alt="Cheddar Cheese Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[132px] sm:h-[195px] md:h-[235px] lg:h-[268px] xl:h-[306px] w-auto object-contain select-none"
                    />
                  </button>

                  {/* 2. Tucked Behind Cheese & Pink Salt: Peri Peri Punch (wider spacing keeps "PERI PERI" readable) */}
                  <button
                    type="button"
                    aria-label="Preview Peri Peri Punch"
                    onClick={() => {
                      setActivePlanetIndex(0);
                      document.getElementById("flavours")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="relative z-20 pointer-events-auto cursor-pointer -ml-[22px] sm:-ml-[34px] md:-ml-[42px] lg:-ml-[48px] xl:-ml-[54px] translate-y-[2px] -rotate-[1deg] hover:-translate-y-3 transition-transform duration-200 origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/peri peri.svg"
                      alt="Peri Peri Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[130px] sm:h-[192px] md:h-[232px] lg:h-[264px] xl:h-[302px] w-auto object-contain select-none"
                    />
                  </button>

                  {/* 3. Front Center-Right: Himalayan Pink Salt (visually height-matched to Cheese & Peri Peri) */}
                  <button
                    type="button"
                    aria-label="Preview Himalayan Pink Salt"
                    onClick={() => {
                      setActivePlanetIndex(2);
                      document.getElementById("flavours")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="relative z-30 pointer-events-auto cursor-pointer -ml-[24px] sm:-ml-[36px] md:-ml-[44px] lg:-ml-[50px] xl:-ml-[56px] -translate-y-[3px] sm:-translate-y-[5px] rotate-[4deg] hover:-translate-y-4 transition-transform duration-200 origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/pink-salt-pouch.png"
                      alt="Himalayan Pink Salt Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[128px] sm:h-[188px] md:h-[226px] lg:h-[258px] xl:h-[296px] w-auto object-contain select-none"
                    />
                  </button>

                  {/* 4. Back-Right: Raw Makhana (100% visible inside viewport) */}
                  <button
                    type="button"
                    aria-label="Preview Raw Makhana"
                    onClick={() => {
                      setActivePlanetIndex(3);
                      document.getElementById("flavours")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="relative z-10 pointer-events-auto cursor-pointer -ml-[26px] sm:-ml-[38px] md:-ml-[46px] lg:-ml-[52px] xl:-ml-[58px] translate-y-[3px] rotate-[9deg] hover:-translate-y-2 transition-transform duration-200 origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/raw-makhana-pouch.png"
                      alt="Raw Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[128px] sm:h-[188px] md:h-[226px] lg:h-[258px] xl:h-[296px] w-auto object-contain select-none"
                    />
                  </button>
                </div>

                {/* Compact Sunglasses Fox perched at bottom-front-left (leaves Pink Salt fox & Raw Makhana completely clear!) */}
                <img
                  src="/Sunglasses Fox With Sweeping Tail.png"
                  alt="Sunglasses Fox With Sweeping Tail"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="pointer-events-none select-none absolute -bottom-6 sm:-bottom-9 md:-bottom-10 -left-2 sm:-left-7 md:-left-9 lg:-left-12 z-20 w-[124px] sm:w-[190px] md:w-[220px] lg:w-[235px] xl:w-[265px] h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Gravity-Driven + Finger/Gyro-Interactive Makhana Layer (Rendered AFTER grid at z-35 across full width) */}
          <HeroMakhanaPhysics containerRef={heroStageRef} />
        </div>

        {/* Top Straight Marquee Ribbon (Acts as Hero Physics Floor) */}
        <div className="relative z-30 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3.5 md:py-4 overflow-hidden select-none">
            <div className="flex w-max animate-wave-marquee">
              <div className="flex shrink-0 items-center gap-6 pr-6">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="font-display text-[15px] sm:text-[24px] md:text-[28px] text-[#FFF8EE] tracking-[0.09em] uppercase font-bold whitespace-nowrap"
                  >
                    THE COOLEST WAY TO SNACK BETTER <span className="text-[#FFCD3C]">✦</span>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-6 pr-6">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="font-display text-[15px] sm:text-[24px] md:text-[28px] text-[#FFF8EE] tracking-[0.09em] uppercase font-bold whitespace-nowrap"
                  >
                    THE COOLEST WAY TO SNACK BETTER <span className="text-[#FFCD3C]">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
      </section>



      {/* =========================================================================
          SECTION 3: FIND YOUR FLAVOUR / 3D PLANET CAROUSEL
          Silky smooth 3D orbit carousel, fluid gradient morphing, & zero-flash crossfade
          Responsive: Mobile view aspect ratio strictly matches new mobile background SVG (941/1250)
          ========================================================================= */}
      <section
        id="flavours"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="pt-2 sm:pt-8 md:pt-10 pb-0 bg-[#FDF2E8] text-[#522C28] relative z-10 overflow-hidden select-none w-full aspect-[941/1250] sm:aspect-auto sm:min-h-[720px] flex flex-col justify-between [contain:layout_paint]"
      >
        
        {/* Dynamic Product Background Layer (Smooth Crossfade with Instant Pre-colored Theme Fallback) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {flavourPlanets.map((bg, idx) => (
            <div
              key={bg.id}
              style={{ backgroundColor: bg.themeBg }}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out will-change-[opacity] ${
                activePlanetIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <picture className="w-full h-full block">
                <source media="(max-width: 640px)" srcSet={bg.bgMobileSvg} />
                <img
                  src={bg.bgSvg}
                  alt=""
                  loading={activePlanetIndex === idx ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-fill sm:object-cover object-center"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-20 pt-3 sm:pt-6 mb-1 sm:mb-2 shrink-0">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-[#25100E] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            Find Your Flavour
          </h2>
        </div>

        {/* Central Packet Stage with Dynamic Ingredient Scatter & Slider Controls */}
        <div className="relative max-w-4xl w-full mx-auto px-2 sm:px-8 flex items-center justify-center h-[245px] sm:h-[320px] md:h-[350px] my-auto shrink-0 overflow-visible">
          
          {/* Slider Prev Arrow Button (Left) */}
          <button
            onClick={prevPlanet}
            aria-label="Previous Flavour"
            title="Slide to Previous Flavour"
            className="absolute left-1 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#25100E] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-2 border-[#25100E]/15 hover:border-[#25100E]/40 hover:scale-110 active:scale-90 transition-[transform,border-color,background-color] cursor-pointer flex items-center justify-center group"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Slider Next Arrow Button (Right) */}
          <button
            onClick={nextPlanet}
            aria-label="Next Flavour"
            title="Slide to Next Flavour"
            className="absolute right-1 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#25100E] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-2 border-[#25100E]/15 hover:border-[#25100E]/40 hover:scale-110 active:scale-90 transition-[transform,border-color,background-color] cursor-pointer flex items-center justify-center group"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Main Stage Anchor for Packet & Scatter Particles */}
          <div className="relative flex items-center justify-center">
            
            {/* Interactive Physics, Free-Floating & Draggable/Throwable Scatter Layer */}
            <InteractiveScatterLayer
              key={currentFlavour.id}
              pieces={currentScatterPieces}
              isMobile={isMobile}
              isScattered={isScattered}
              activeFlavourId={currentFlavour.id}
              onResetTrigger={resetScatterTrigger}
            />

            {/* Central Product Packet Stack (Pre-rendered, Zero-Lag, Instant Crossfade) */}
            <div
              data-packet="true"
              onClick={triggerScatter}
              className={`relative z-30 flex items-center justify-center h-[235px] sm:h-[290px] md:h-[305px] lg:h-[320px] w-56 sm:w-72 md:w-80 group cursor-pointer select-none transition-transform duration-250 ease-out animate-float-gentle ${
                isTransitioningFlavour ? "scale-92" : "scale-100"
              }`}
              title="Click pouch to recall & re-burst scatter pieces!"
            >
              {flavourPlanets.map((flavour, idx) => {
                const isActive = activePlanetIndex === idx;
                return (
                  <div
                    key={flavour.id}
                    className={`absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-250 ease-out will-change-[transform,opacity] ${
                      isActive
                        ? "opacity-100 scale-100 z-10 pointer-events-auto"
                        : "opacity-0 scale-90 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={flavour.packImage}
                      alt={flavour.name}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-auto max-w-full object-contain drop-shadow-xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95 pointer-events-auto"
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Flavour Details, Switcher & Action Buttons */}
        <div className="relative max-w-xl w-full mx-auto px-4 text-center mt-1 sm:mt-2 mb-2 sm:mb-4 relative z-30 shrink-0 flex flex-col items-center">
          
          {/* 1. Flavour Name directly below the Product Pouch (Clickable link to product page) */}
          <Link
            href={`/product/${currentFlavour.slug || "peri-peri"}`}
            title={`View ${currentFlavour.name} details & nutrition`}
            className="group cursor-pointer block"
          >
            <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase text-[#25100E] drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] group-hover:scale-102 transition-transform">
              {currentFlavour.name}
            </h3>
          </Link>

          {/* 2. Premium Tactile Flavour Switcher Dock */}
          <div className="mt-2 sm:mt-2.5 z-30">
            <div className="inline-flex flex-wrap justify-center items-center gap-1 p-1 sm:p-1.5 rounded-2xl sm:rounded-full bg-white/95 shadow-[0_4px_16px_rgba(37,16,14,0.12)] border border-[#25100E]/15">
              {flavourPlanets.map((flavour, idx) => {
                const isActive = activePlanetIndex === idx;
                const activeClasses =
                  flavour.id === "periperi"
                    ? "bg-[#E53925] text-white shadow-md scale-102 ring-2 ring-[#FFCD3C]/80"
                    : flavour.id === "cheddar"
                    ? "bg-[#F79E1B] text-[#25100E] shadow-md scale-102 ring-2 ring-[#25100E]/30"
                    : flavour.id === "pinksalt"
                    ? "bg-[#E1366C] text-white shadow-md scale-102 ring-2 ring-[#FFCD3C]/70"
                    : "bg-[#2D6A4F] text-white shadow-md scale-102 ring-2 ring-[#52B788]/60";
                return (
                  <button
                    key={flavour.id}
                    onClick={() => changeFlavour(idx)}
                    className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none whitespace-nowrap ${
                      isActive
                        ? activeClasses
                        : "text-[#522C28] hover:bg-[#FFF3E3] hover:text-[#25100E]"
                    }`}
                  >
                    <span>{flavour.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Dual Action Buttons: Buy Now & See Details */}
          <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3 z-30 relative">
            {/* Buy Now Button (High-Contrast Theme-Adaptive Solid) */}
            <button
              onClick={() => {
                const prod = PRODUCTS[currentFlavour.slug || "peri-peri"] || PRODUCTS["peri-peri"];
                addItem(
                  {
                    variantId: prod.variantIds.single,
                    slug: prod.slug,
                    name: prod.name,
                    variantLabel: prod.pricing.single.label,
                    price: prod.pricing.single.price,
                    originalPrice: prod.pricing.single.originalPrice,
                    image: prod.packImage,
                  },
                  1,
                  true
                );
              }}
              className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer group ${
                currentFlavour.id === "plain"
                  ? "bg-[#D73B3A] text-white hover:bg-[#B71C1C] shadow-[0_6px_20px_rgba(215,59,58,0.35)]"
                  : currentFlavour.id === "pinksalt"
                  ? "bg-[#E1366C] text-white hover:bg-[#C22255] shadow-[0_6px_20px_rgba(225,54,108,0.35)] ring-2 ring-white/70"
                  : "bg-[#25100E] text-[#FFCD3C] hover:bg-[#1A0A09] shadow-[0_6px_20px_rgba(37,16,14,0.35)] ring-2 ring-[#FFCD3C]/60"
              }`}
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Buy Now</span>
            </button>

            {/* See Details Button (Solid Crisp White) */}
            <Link
              href={`/product/${currentFlavour.slug || "peri-peri"}`}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer bg-white hover:bg-[#FFF8EE] text-[#25100E] border-2 border-[#25100E]/20 hover:border-[#25100E]"
            >
              <span>See Details</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </Link>
          </div>

        </div>

        {/* Bottom Straight Marquee Ribbon */}
        <div className="relative z-30 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3 md:py-3.5 overflow-hidden select-none mt-auto shrink-0 [contain:layout_paint]">
          <div className="flex w-max animate-wave-marquee-reverse">
            <div className="flex shrink-0 items-center gap-6 pr-6">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="font-display text-[15px] sm:text-[22px] md:text-[26px] text-[#FFF8EE] tracking-[0.08em] uppercase font-bold whitespace-nowrap"
                >
                  THE COOLEST WAY TO SNACK BETTER <span className="text-[#FFCD3C]">✦</span>
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-6 pr-6">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="font-display text-[15px] sm:text-[22px] md:text-[26px] text-[#FFF8EE] tracking-[0.08em] uppercase font-bold whitespace-nowrap"
                >
                  THE COOLEST WAY TO SNACK BETTER <span className="text-[#FFCD3C]">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 4: KEY HEALTH BENEFITS SCROLL ANIMATION (Makhana vs The Fryer)
          ========================================================================= */}
      <MakhanaBenefitsScroll />

      {/* =========================================================================
          SECTION 5: DISCOVER SOMETHING NEW (Game Arena - Full Bleed Seamless Sky)
          ========================================================================= */}
      <section id="discover" className="relative w-full overflow-hidden">
        {/* Seamless Fox Game (Edge-to-edge sky, no box boundary) */}
        <DiscoverFoxGame />

        {/* Transition wave at the bottom of the sky section returning cleanly to Footer #FCF5EB */}
        <div className="w-full overflow-hidden leading-none pointer-events-none -mt-2 translate-y-[2px] relative z-20">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 sm:h-12 md:h-14 block"
            preserveAspectRatio="none"
          >
            <path
              d="M0,25 C360,55 720,5 1080,35 C1260,50 1380,20 1440,25 L1440,60 L0,60 Z"
              fill="#FCF5EB"
            />
          </svg>
        </div>
      </section>

    </div>
  );
}
