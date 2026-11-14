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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HeroMakhanaPhysics from "@/components/HeroMakhanaPhysics";
import InteractiveScatterLayer, { ScatterPieceData } from "@/components/InteractiveScatterLayer";
import Navbar from "@/components/Navbar";
import { smoothScrollTo } from "@/components/LenisProvider";
import { useCart } from "@/components/CartContext";
import { PRODUCTS, COMBOS } from "@/data/products";

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
  const swipeStartRef = useRef<{ x: number; y: number; active: boolean; swiped: boolean } | null>(null);
  const pointerSwipeRef = useRef<{ pointerId: number; x: number; y: number; swiped: boolean } | null>(null);
  const lastSwipeTimeRef = useRef<number>(0);
  const packetStageRef = useRef<HTMLDivElement | null>(null);
  const [resetScatterTrigger, setResetScatterTrigger] = useState(0);
  const [isTransitioningFlavour, setIsTransitioningFlavour] = useState(false);
  const [heroBg, setHeroBg] = useState<"pop-art" | "sunset">("pop-art");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bgParam = params.get("bg");
    if (bgParam === "2" || bgParam === "sunset") {
      setHeroBg("sunset");
    } else if (bgParam === "1" || bgParam === "pop-art") {
      setHeroBg("pop-art");
    }

    const mobileViewport = window.innerWidth < 640;
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Defer secondary flavour assets until browser is idle so Hero hydrates & paints instantaneously
    const deferredAssets = [
      mobileViewport ? "/hero/mobile-sunset-wave.jpg" : "/hero/sunset-wave.jpg",
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

      // 1. Snappy pull current assets back behind the packet (155ms)
      setIsScattered(false);

      // 2. Once retracted behind the pouch, swap flavour pack and background
      setTimeout(() => {
        setActivePlanetIndex(targetIndex);

        // 3. Double rAF ensures frame-1 origin paint before springing outward
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsScattered(true);
            setIsTransitioningFlavour(false);
          });
        });
      }, 155);
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
    if (isTransitioningFlavour || performance.now() - lastSwipeTimeRef.current < 300) return;
    setResetScatterTrigger((prev) => prev + 1);
    setIsScattered(false);
    setTimeout(() => {
      setIsScattered(true);
    }, 200);
  };

  const isSwipeIgnoredTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return Boolean(
      el.closest("[data-scatter-piece]") ||
        el.closest("button") ||
        el.closest("a") ||
        el.closest("input") ||
        el.closest("select")
    );
  };

  const applyPacketDragOffset = (dx: number) => {
    const stage = packetStageRef.current;
    if (!stage) return;
    const clamped = Math.max(-72, Math.min(72, dx * 0.45));
    stage.style.transition = "none";
    stage.style.transform = `translate3d(${clamped.toFixed(1)}px, 0px, 0px) rotate(${(clamped * 0.055).toFixed(2)}deg)`;
  };

  const resetPacketDragOffset = () => {
    const stage = packetStageRef.current;
    if (!stage) return;
    stage.style.transition = "transform 340ms cubic-bezier(0.22, 1, 0.36, 1)";
    stage.style.transform = "translate3d(0px, 0px, 0px) rotate(0deg)";
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || isSwipeIgnoredTarget(e.target)) {
      swipeStartRef.current = null;
      return;
    }
    swipeStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      active: true,
      swiped: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const start = swipeStartRef.current;
    if (!start?.active || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - start.x;
    const dy = e.touches[0].clientY - start.y;

    if (!start.swiped) {
      // Cancel swipe tracking if user is clearly scrolling vertically
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx) * 1.15) {
        swipeStartRef.current = null;
        resetPacketDragOffset();
        return;
      }
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        start.swiped = true;
      }
    }

    if (start.swiped) {
      applyPacketDragOffset(dx);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    resetPacketDragOffset();
    if (!start?.active) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    // Intentionally lower 40px threshold & directional check so swiping on the pouch or stage feels responsive on mobile
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 0.9) {
      lastSwipeTimeRef.current = performance.now();
      if (dx < 0) {
        nextPlanet();
      } else {
        prevPlanet();
      }
    }
  };

  const handleTouchCancel = () => {
    swipeStartRef.current = null;
    resetPacketDragOffset();
  };

  // Mouse / pen drag fallback (touch uses native TouchEvent handlers above)
  const handleStagePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0 || isSwipeIgnoredTarget(e.target)) {
      pointerSwipeRef.current = null;
      return;
    }
    pointerSwipeRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      swiped: false,
    };
  };

  const handleStagePointerMove = (e: React.PointerEvent) => {
    const start = pointerSwipeRef.current;
    if (!start || e.pointerType === "touch" || e.pointerId !== start.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (!start.swiped && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      start.swiped = true;
    }
    if (start.swiped) {
      applyPacketDragOffset(dx);
    }
  };

  const handleStagePointerUp = (e: React.PointerEvent) => {
    const start = pointerSwipeRef.current;
    pointerSwipeRef.current = null;
    if (e.pointerType === "touch") return;
    resetPacketDragOffset();
    if (!start || e.pointerId !== start.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 0.9) {
      lastSwipeTimeRef.current = performance.now();
      if (dx < 0) {
        nextPlanet();
      } else {
        prevPlanet();
      }
    }
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
      <section className="relative w-full min-h-[480px] min-[420px]:min-h-[545px] min-[500px]:min-h-[600px] sm:min-h-[calc(100svh-72px)] bg-[#F9F3EA] flex flex-col justify-between [contain:layout_paint]">
        {/* Interactive Stage above the Red Marquee (Floor sits directly on top of the marquee) */}
        <div
          ref={heroStageRef}
          className="relative flex-1 w-full flex flex-col justify-between sm:justify-center overflow-hidden"
        >
          {/* Full-bleed Hero Background Artwork (dual-layer zero-flicker smooth crossfade) */}
          <picture
            className={`pointer-events-none select-none absolute inset-0 z-0 w-full h-full transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              heroBg === "pop-art" ? "opacity-100" : "opacity-0"
            }`}
          >
            <source media="(max-width: 639px)" srcSet="/hero/mobile-pop-art-wave.jpg" />
            <img
              src="/hero/pop-art-wave.jpg"
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-bottom"
            />
          </picture>
          <picture
            className={`pointer-events-none select-none absolute inset-0 z-0 w-full h-full transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              heroBg === "sunset" ? "opacity-100" : "opacity-0"
            }`}
          >
            <source media="(max-width: 639px)" srcSet="/hero/mobile-sunset-wave.jpg" />
            <img
              src="/hero/sunset-wave.jpg"
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-bottom"
            />
          </picture>
          {/* Quick Background Switcher Pill for A/B Testing Both Backgrounds (top right compact) */}
          <div
            style={{ zIndex: 50 }}
            className="absolute top-2 right-2 sm:top-4 sm:right-5 flex justify-end pointer-events-auto"
          >
            <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#522C28]/15 shadow-sm">
              <button
                type="button"
                onClick={() => setHeroBg("pop-art")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-extrabold uppercase tracking-wide transition-colors cursor-pointer ${
                  heroBg === "pop-art"
                    ? "bg-[#D73B3A] text-[#FFF8EE]"
                    : "text-[#522C28]/75 hover:text-[#522C28]"
                }`}
              >
                BG 1
              </button>
              <button
                type="button"
                onClick={() => setHeroBg("sunset")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-extrabold uppercase tracking-wide transition-colors cursor-pointer ${
                  heroBg === "sunset"
                    ? "bg-[#D73B3A] text-[#FFF8EE]"
                    : "text-[#522C28]/75 hover:text-[#522C28]"
                }`}
              >
                BG 2
              </button>
            </div>
          </div>

          {/* Main Hero Grid: Minimal Brand-Deck Copy/CTAs (Left) + Canva-Style Stack + Front-Left Fox (Right) */}
          <div className="relative z-20 w-full max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-14 flex-1 flex flex-col lg:flex-row items-center justify-between sm:justify-evenly lg:justify-between gap-3 sm:gap-8 lg:gap-6 pt-8 min-[440px]:pt-6 sm:pt-6 pointer-events-none">
            {/* Left Column: Minimal Brand Copy & Dual CTAs (Ultra-concise on mobile, rich on desktop) */}
            <div className="w-full lg:w-[42%] flex flex-col items-center lg:items-start text-center lg:text-left lg:py-8 pointer-events-none">
              <h1 className="mt-2 sm:mt-0 font-display text-[34px] min-[400px]:text-[38px] min-[480px]:text-[44px] sm:text-5xl lg:text-[54px] xl:text-[64px] leading-[0.94] sm:leading-[0.96] tracking-tight uppercase text-[#522C28]">
                SNACK BETTER.{" "}
                <span className="block font-display text-[#D73B3A]">POP LOUDER.</span>
              </h1>

              <p className="hidden sm:block mt-3 text-base text-[#522C28]/85 font-semibold max-w-md">
                Carefully sourced, hand-sorted roasted makhana in 4 bold flavours — quality that’s real, not just promised.
              </p>

              {/* Hero CTAs (z-40 keeps buttons always clickable above falling makhana) */}
              <div
                style={{ zIndex: 40 }}
                className="relative mt-3 sm:mt-5 flex flex-nowrap sm:flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 pointer-events-auto"
              >
                <Link
                  href="/shop"
                  className="px-4 min-[440px]:px-5 sm:px-7 py-2 min-[440px]:py-2.5 sm:py-3 rounded-full bg-[#D73B3A] hover:bg-[#B82928] text-[#FFF8EE] font-black text-[11px] min-[440px]:text-xs sm:text-sm uppercase tracking-wider shadow-[0_8px_22px_rgba(215,59,58,0.32)] hover:scale-105 active:scale-95 transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="sm:hidden">Shop Now</span>
                  <span className="hidden sm:inline">Shop All Snacks</span>
                </Link>

                <button
                  type="button"
                  onClick={() => smoothScrollTo("#flavours")}
                  className="px-3.5 min-[440px]:px-4.5 sm:px-6 py-2 min-[440px]:py-2.5 sm:py-3 rounded-full bg-[#FFF8EE] hover:bg-white text-[#522C28] border-2 border-[#522C28]/15 hover:border-[#522C28]/40 font-black text-[11px] min-[440px]:text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span className="sm:hidden">Flavours</span>
                  <span className="hidden sm:inline">Explore Flavours</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>

              <p className="hidden sm:block mt-4 text-xs font-bold text-[#522C28]/75 tracking-wide uppercase">
                Hand-Sorted &amp; Pure • Never Blended • Bold Flavours • Make Good Habits Pop
              </p>
            </div>

            {/* Right Column: Tight Canva Stack Completely Inside Bounds + Compact Fox at Bottom-Left */}
            <div className="relative w-full lg:w-[58%] flex items-end justify-center lg:justify-end self-end mt-auto pt-1 sm:pt-4 lg:pt-8 pb-6 min-[460px]:pb-7 sm:pb-9 lg:pb-8">
              <div className="relative flex items-end justify-center max-w-full pr-1 sm:pr-3 lg:pr-4">
                {/* Base Flow Container: All 4 Pouches stay 100% inside right viewport edge with even visual heights */}
                <div className="relative z-10 flex items-end justify-center pointer-events-none">
                  {/* 1. Front-Left: Cheddar Cheese */}
                  <button
                    type="button"
                    aria-label="Preview Cheddar Cheese"
                    onClick={() => {
                      changeFlavour(1);
                      smoothScrollTo("#flavours");
                    }}
                    className="relative z-40 pointer-events-auto cursor-pointer translate-y-[4px] -rotate-[7deg] hover:-translate-y-2 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/cheese.svg"
                      alt="Cheddar Cheese Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[132px] min-[400px]:h-[150px] min-[460px]:h-[172px] min-[540px]:h-[192px] sm:h-[205px] md:h-[235px] lg:h-[268px] xl:h-[306px] w-auto object-contain select-none"
                    />
                  </button>

                  {/* 2. Tucked Behind Cheese & Pink Salt: Peri Peri Punch (wider spacing keeps "PERI PERI" readable) */}
                  <button
                    type="button"
                    aria-label="Preview Peri Peri Punch"
                    onClick={() => {
                      changeFlavour(0);
                      smoothScrollTo("#flavours");
                    }}
                    className="relative z-20 pointer-events-auto cursor-pointer -ml-[22px] min-[460px]:-ml-[28px] sm:-ml-[34px] md:-ml-[42px] lg:-ml-[48px] xl:-ml-[54px] translate-y-[2px] -rotate-[1deg] hover:-translate-y-3 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/peri peri.svg"
                      alt="Peri Peri Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[130px] min-[400px]:h-[148px] min-[460px]:h-[169px] min-[540px]:h-[189px] sm:h-[202px] md:h-[232px] lg:h-[264px] xl:h-[302px] w-auto object-contain select-none"
                    />
                  </button>

                  {/* 3. Front Center-Right: Himalayan Pink Salt (visually height-matched to Cheese & Peri Peri) */}
                  <button
                    type="button"
                    aria-label="Preview Himalayan Pink Salt"
                    onClick={() => {
                      changeFlavour(2);
                      smoothScrollTo("#flavours");
                    }}
                    className="relative z-30 pointer-events-auto cursor-pointer -ml-[24px] min-[460px]:-ml-[30px] sm:-ml-[36px] md:-ml-[44px] lg:-ml-[50px] xl:-ml-[56px] -translate-y-[3px] sm:-translate-y-[5px] rotate-[4deg] hover:-translate-y-4 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/pink-salt-pouch.png"
                      alt="Himalayan Pink Salt Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[128px] min-[400px]:h-[146px] min-[460px]:h-[166px] min-[540px]:h-[186px] sm:h-[198px] md:h-[226px] lg:h-[258px] xl:h-[296px] w-auto object-contain select-none"
                    />
                  </button>

                  {/* 4. Back-Right: Raw Makhana (100% visible inside viewport) */}
                  <button
                    type="button"
                    aria-label="Preview Raw Makhana"
                    onClick={() => {
                      changeFlavour(3);
                      smoothScrollTo("#flavours");
                    }}
                    className="relative z-10 pointer-events-auto cursor-pointer -ml-[26px] min-[460px]:-ml-[32px] sm:-ml-[38px] md:-ml-[46px] lg:-ml-[52px] xl:-ml-[58px] translate-y-[3px] rotate-[9deg] hover:-translate-y-2 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom shrink-0 will-change-transform"
                  >
                    <img
                      src="/packets/raw-makhana-pouch.png"
                      alt="Raw Makhana Pouch"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-[128px] min-[400px]:h-[146px] min-[460px]:h-[166px] min-[540px]:h-[186px] sm:h-[198px] md:h-[226px] lg:h-[258px] xl:h-[296px] w-auto object-contain select-none"
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
                  className="pointer-events-none select-none absolute -bottom-6 min-[460px]:-bottom-7 sm:-bottom-9 md:-bottom-10 -left-2 min-[460px]:-left-4 sm:-left-7 md:-left-9 lg:-left-12 z-20 w-[124px] min-[400px]:w-[142px] min-[460px]:w-[162px] min-[540px]:w-[180px] sm:w-[195px] md:w-[220px] lg:w-[235px] xl:w-[265px] h-auto object-contain"
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
      </section>

      {/* =========================================================================
          SECTION 3: FIND YOUR FLAVOUR / 3D PLANET CAROUSEL
          Silky smooth 3D orbit carousel, fluid gradient morphing, & zero-flash crossfade
          Responsive: Mobile view aspect ratio strictly matches new mobile background SVG (941/1250)
          ========================================================================= */}
      <section
        id="flavours"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerUp}
        className="pt-5 min-[440px]:pt-6 sm:pt-8 md:pt-10 pb-0 bg-[#FDF2E8] text-[#522C28] relative z-10 overflow-hidden select-none touch-pan-y w-full aspect-[941/1250] sm:aspect-auto sm:min-h-[720px] flex flex-col justify-between [contain:layout_paint]"
      >
        
        {/* Dynamic Product Background Layer (Smooth Crossfade with Instant Pre-colored Theme Fallback) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {flavourPlanets.map((bg, idx) => (
            <div
              key={bg.id}
              style={{ backgroundColor: bg.themeBg }}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] ${
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
          <div ref={packetStageRef} className="relative flex items-center justify-center will-change-transform">
            
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
              className={`relative z-30 flex items-center justify-center h-[235px] sm:h-[290px] md:h-[305px] lg:h-[320px] w-56 sm:w-72 md:w-80 group cursor-pointer select-none touch-pan-y transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] animate-float-gentle ${
                isTransitioningFlavour ? "scale-92" : "scale-100"
              }`}
              title="Click pouch to recall & re-burst scatter pieces!"
            >
              {flavourPlanets.map((flavour, idx) => {
                const isActive = activePlanetIndex === idx;
                return (
                  <div
                    key={flavour.id}
                    className={`absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
                      isActive
                        ? "opacity-100 scale-100 z-10 pointer-events-auto"
                        : "opacity-0 scale-90 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={flavour.packImage}
                      alt={flavour.name}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="h-full w-auto max-w-full object-contain drop-shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-active:scale-95 pointer-events-auto"
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Flavour Details, Switcher & Action Buttons */}
        <div className="relative max-w-4xl w-full mx-auto px-4 text-center mt-1 sm:mt-2 mb-2 sm:mb-4 relative z-30 shrink-0 flex flex-col items-center">
          
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
          <div className="mt-2 sm:mt-2.5 z-30 max-w-full px-2">
            <div className="inline-flex flex-nowrap max-w-full overflow-x-auto no-scrollbar justify-center items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-white/95 shadow-[0_4px_16px_rgba(37,16,14,0.12)] border border-[#25100E]/15">
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
                    className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-[13px] font-black uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex items-center gap-1 sm:gap-1.5 select-none shrink-0 whitespace-nowrap ${
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

          {/* 3. Action Button: Buy Now (Navigates directly to Product Details & Purchase Page) */}
          <div className="mt-2.5 sm:mt-3 flex items-center justify-center z-30 relative">
            <Link
              href={`/product/${currentFlavour.slug || "peri-peri"}`}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 cursor-pointer group ${
                currentFlavour.id === "plain"
                  ? "bg-[#D73B3A] text-white hover:bg-[#B71C1C] shadow-[0_6px_20px_rgba(215,59,58,0.35)]"
                  : currentFlavour.id === "pinksalt"
                  ? "bg-[#E1366C] text-white hover:bg-[#C22255] shadow-[0_6px_20px_rgba(225,54,108,0.35)] ring-2 ring-white/70"
                  : "bg-[#25100E] text-[#FFCD3C] hover:bg-[#1A0A09] shadow-[0_6px_20px_rgba(37,16,14,0.35)] ring-2 ring-[#FFCD3C]/60"
              }`}
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Buy Now</span>
            </Link>
          </div>

        </div>

        {/* Bottom Straight Marquee Ribbon */}
        <div className="relative z-30 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3 md:py-3.5 overflow-hidden select-none mt-auto shrink-0 [contain:layout_paint]">
          <div className="flex w-max animate-wave-marquee-reverse">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-5 sm:gap-7 pr-5 sm:pr-7">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-5 sm:gap-7 font-display text-[15px] sm:text-[22px] md:text-[26px] text-[#FFF8EE] uppercase font-bold whitespace-nowrap"
                  >
                    <span className="font-display tracking-[0.08em]">THE COOLEST WAY TO SNACK BETTER</span>
                    <span className="font-display text-[#FFCD3C] leading-none">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION: HOT COMBOS & CURATED BUNDLES (Light Brand-Coloured Compact Showcase)
          ========================================================================= */}
      <section id="hot-combos" className="relative w-full bg-[#FFF8EE] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-[#25100E]/10 overflow-hidden select-none">
        {/* Subtle background ambient warmth */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#E53925]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#FFCD3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#E53925] font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
                <span>//</span>
                <span>JUST IN • CURATED BUNDLES</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#25100E] mt-1">
                HOT CRUNCH COMBOS
              </h2>
            </div>
            <Link
              href="/shop#combos"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#E53925] hover:text-[#C92328] transition-colors group cursor-pointer self-start sm:self-auto"
            >
              <span>EXPLORE ALL</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cards Grid: 4 items (Compact & Light Brand Aesthetic) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
            {/* Card 1: Ultimate Trio Variety Pack */}
            <div className="bg-white border border-[#25100E]/12 hover:border-[#E53925]/50 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(37,16,14,0.06)] hover:shadow-[0_12px_28px_rgba(229,57,37,0.12)] group relative">
              <Link href="/product/ultimate-trio-pack" className="block cursor-pointer">
                {/* Image Frame */}
                <div className="bg-[#FFF5E5] rounded-xl overflow-hidden h-32 sm:h-36 flex items-center justify-center p-2 relative border border-[#25100E]/08 group-hover:bg-[#FFF0D9] transition-colors">
                  {/* Badge Top Left */}
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#E53925] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    BEST SELLER
                  </span>

                  {/* Pouches Presentation */}
                  <div className="relative flex items-center justify-center">
                    <img
                      src="/packets/peri peri.svg"
                      alt="Ultimate Trio Variety Pack"
                      className="h-28 sm:h-32 w-auto object-contain drop-shadow-xl z-10 transition-transform duration-300 group-hover:scale-105"
                    />
                    <img
                      src="/packets/cheese.svg"
                      alt=""
                      className="h-22 sm:h-26 w-auto object-contain drop-shadow-md -ml-6 z-0 opacity-80 group-hover:opacity-100 transition-all"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#522C28]/60">
                    <span>VARIETY BOX • 3 PACKS</span>
                    <span className="text-[#E53925] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#E53925]" /> 4.9
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-black uppercase text-[#25100E] leading-snug mt-1 group-hover:text-[#E53925] transition-colors">
                    ULTIMATE TRIO VARIETY PACK
                  </h3>
                  <p className="text-[11px] text-[#522C28]/70 mt-0.5 line-clamp-1">
                    1× Peri Peri + 1× Cheese + 1× Raw Makhana
                  </p>
                </div>
              </Link>

              {/* Price & Buy */}
              <div className="mt-3 pt-2.5 border-t border-[#25100E]/10 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-[#25100E]">₹115</span>
                  <span className="text-xs text-[#522C28]/50 line-through font-semibold">₹135</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(
                      {
                        variantId: 10000401,
                        slug: "ultimate-trio-pack",
                        name: "ULTIMATE TRIO VARIETY PACK",
                        variantLabel: "3 × 20g Pouches (60g)",
                        price: 115,
                        originalPrice: 135,
                        image: "/packets/peri peri.svg",
                      },
                      1,
                      true
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#E53925] hover:bg-[#C92328] text-white text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Card 2: Party Crunch Bundle */}
            <div className="bg-white border border-[#25100E]/12 hover:border-[#E53925]/50 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(37,16,14,0.06)] hover:shadow-[0_12px_28px_rgba(229,57,37,0.12)] group relative">
              <Link href="/product/party-crunch-box" className="block cursor-pointer">
                {/* Image Frame */}
                <div className="bg-[#FFF5E5] rounded-xl overflow-hidden h-32 sm:h-36 flex items-center justify-center p-2 relative border border-[#25100E]/08 group-hover:bg-[#FFF0D9] transition-colors">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#F79E1B] text-[#25100E] text-[9px] font-black uppercase tracking-wider shadow-sm">
                    SAVE 18%
                  </span>

                  <div className="relative flex items-center justify-center">
                    <img
                      src="/packets/cheese.svg"
                      alt="Party Crunch Bundle"
                      className="h-28 sm:h-32 w-auto object-contain drop-shadow-xl z-10 transition-transform duration-300 group-hover:scale-105"
                    />
                    <img
                      src="/packets/peri peri.svg"
                      alt=""
                      className="h-22 sm:h-26 w-auto object-contain drop-shadow-md -ml-6 z-0 opacity-80 group-hover:opacity-100 transition-all"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#522C28]/60">
                    <span>PARTY PACK • 6 PACKS</span>
                    <span className="text-[#E53925] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#E53925]" /> 5.0
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-black uppercase text-[#25100E] leading-snug mt-1 group-hover:text-[#E53925] transition-colors">
                    PARTY CRUNCH BUNDLE
                  </h3>
                  <p className="text-[11px] text-[#522C28]/70 mt-0.5 line-clamp-1">
                    2× Peri Peri + 2× Cheese + 2× Raw Makhana
                  </p>
                </div>
              </Link>

              {/* Price & Buy */}
              <div className="mt-3 pt-2.5 border-t border-[#25100E]/10 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-[#25100E]">₹220</span>
                  <span className="text-xs text-[#522C28]/50 line-through font-semibold">₹270</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(
                      {
                        variantId: 10000501,
                        slug: "party-crunch-box",
                        name: "PARTY CRUNCH BUNDLE",
                        variantLabel: "6 × 20g Pouches (120g)",
                        price: 220,
                        originalPrice: 270,
                        image: "/packets/cheese.svg",
                      },
                      1,
                      true
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#E53925] hover:bg-[#C92328] text-white text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Card 3: Mega Muncher 12-Pack */}
            <div className="bg-white border border-[#25100E]/12 hover:border-[#E53925]/50 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(37,16,14,0.06)] hover:shadow-[0_12px_28px_rgba(229,57,37,0.12)] group relative">
              <Link href="/product/mega-muncher-stash" className="block cursor-pointer">
                {/* Image Frame */}
                <div className="bg-[#FFF5E5] rounded-xl overflow-hidden h-32 sm:h-36 flex items-center justify-center p-2 relative border border-[#25100E]/08 group-hover:bg-[#FFF0D9] transition-colors">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#2D6A4F] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    SAVE 22%
                  </span>

                  <div className="relative flex items-center justify-center">
                    <img
                      src="/packets/raw-makhana-pouch.png"
                      alt="Mega Muncher 12-Pack Stash"
                      className="h-28 sm:h-32 w-auto object-contain drop-shadow-xl z-10 transition-transform duration-300 group-hover:scale-105"
                    />
                    <img
                      src="/packets/cheese.svg"
                      alt=""
                      className="h-22 sm:h-26 w-auto object-contain drop-shadow-md -ml-6 z-0 opacity-80 group-hover:opacity-100 transition-all"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#522C28]/60">
                    <span>MEGA STASH • 12 PACKS</span>
                    <span className="text-[#E53925] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#E53925]" /> 4.9
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-black uppercase text-[#25100E] leading-snug mt-1 group-hover:text-[#E53925] transition-colors">
                    MEGA MUNCHER 12-PACK
                  </h3>
                  <p className="text-[11px] text-[#522C28]/70 mt-0.5 line-clamp-1">
                    4× Peri Peri + 4× Cheese + 4× Raw Makhana
                  </p>
                </div>
              </Link>

              {/* Price & Buy */}
              <div className="mt-3 pt-2.5 border-t border-[#25100E]/10 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-[#25100E]">₹420</span>
                  <span className="text-xs text-[#522C28]/50 line-through font-semibold">₹540</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(
                      {
                        variantId: 10000601,
                        slug: "mega-muncher-stash",
                        name: "MEGA MUNCHER 12-PACK STASH",
                        variantLabel: "12 × 20g Pouches (240g)",
                        price: 420,
                        originalPrice: 540,
                        image: "/packets/raw-makhana-pouch.png",
                      },
                      1,
                      true
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#E53925] hover:bg-[#C92328] text-white text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Card 4: Build Your Own Box (Interactive Custom Box CTA) */}
            <Link
              href="/build-a-box"
              className="bg-gradient-to-b from-[#FFFDF9] to-[#FFF3DC] border-2 border-dashed border-[#F79E1B]/70 hover:border-[#E53925] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(247,158,27,0.12)] hover:shadow-[0_12px_28px_rgba(247,158,27,0.22)] group cursor-pointer relative"
            >
              {/* Teaser Frame */}
              <div className="bg-white/80 rounded-xl overflow-hidden h-32 sm:h-36 flex flex-col items-center justify-center p-2 relative border border-[#F79E1B]/30 group-hover:bg-white transition-colors">
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#FFCD3C] text-[#25100E] text-[9px] font-black uppercase tracking-wider shadow-sm">
                  CUSTOMIZE
                </span>

                <span className="text-3xl mb-1 animate-bounce">🎁</span>
                <span className="font-display text-sm font-black uppercase text-[#25100E] tracking-wide text-center">
                  BUILD YOUR OWN BOX
                </span>
                <p className="text-[10px] text-[#522C28]/70 text-center mt-0.5 max-w-[170px] leading-tight">
                  Mix 4, 6, or 12 packs &amp; unlock bulk savings!
                </p>

                {/* Animated Mini Pouches Pill */}
                <div className="flex items-center gap-1.5 mt-2 bg-[#FFF8EE] px-2.5 py-0.5 rounded-full border border-[#25100E]/10">
                  <span className="text-xs">🌶️</span>
                  <span className="text-xs">🧀</span>
                  <span className="text-xs">🌸</span>
                  <span className="text-xs">🍃</span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#522C28]/60">
                  <span>CUSTOM BUNDLE • YOU DECIDE</span>
                  <span className="text-[#F79E1B] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#F79E1B]" /> 5.0
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base font-black uppercase text-[#25100E] leading-snug mt-1 group-hover:text-[#E53925] transition-colors">
                  CUSTOM SNACK CRATE
                </h3>
                <p className="text-[11px] text-[#522C28]/70 mt-0.5 line-clamp-1">
                  Choose your own flavours &amp; pack sizes
                </p>
              </div>

              {/* Price & CTA */}
              <div className="mt-3 pt-2.5 border-t border-[#25100E]/10 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-[#E53925]">From ₹160</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#FFCD3C] group-hover:bg-[#F79E1B] text-[#25100E] text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95">
                  <span>Build Box</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </Link>
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
