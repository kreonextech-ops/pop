"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  ShoppingBasket,
  HelpCircle,
  Store,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";
import DiscoverFoxGame from "@/components/DiscoverFoxGame";
import InteractiveScatterLayer, { ScatterPieceData } from "@/components/InteractiveScatterLayer";
import MakhanaBenefitsScroll from "@/components/MakhanaBenefitsScroll";

const cheeseScatterPieces: ScatterPieceData[] = [
  {
    id: 1,
    src: "/scatter/cheese/04_swiss_cheese_wedge.png",
    alt: "Swiss Cheese Wedge Top-Left",
    desktop: { x: -335, y: -140, rotate: -24, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -24, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-gentle",
    delay: "0.01s",
  },
  {
    id: 2,
    src: "/scatter/cheese/10_triangle_cheese_wedge.png",
    alt: "Triangle Cheese Wedge Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-slow",
    delay: "0.02s",
  },
  {
    id: 3,
    src: "/scatter/cheese/03_cheese_cubes.png",
    alt: "Golden Cheddar Cubes Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-reverse",
    delay: "0.03s",
  },
  {
    id: 4,
    src: "/scatter/cheese/09_hole_filled_cheese_block.png",
    alt: "Porous Cheese Block Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-wiggle",
    delay: "0.04s",
  },
  {
    id: 5,
    src: "/scatter/cheese/08_crumbly_cheese_chunks.png",
    alt: "Crumbly Cheese Chunks Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-slow",
    delay: "0.05s",
  },
  {
    id: 6,
    src: "/scatter/cheese/01_melting_cheese.png",
    alt: "Melty Cheese Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-gentle",
    delay: "0.06s",
  },
];

const periPeriScatterPieces: ScatterPieceData[] = [
  {
    id: 1,
    src: "/scatter/peri-peri/01_single_chilli.png",
    alt: "Single Red Chilli Top-Left",
    desktop: { x: -335, y: -140, rotate: -25, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -25, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-gentle",
    delay: "0.01s",
  },
  {
    id: 2,
    src: "/scatter/peri-peri/02_sliced_chilli.png",
    alt: "Sliced Red Chilli Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-slow",
    delay: "0.02s",
  },
  {
    id: 3,
    src: "/scatter/peri-peri/04_flame_chilli.png",
    alt: "Flame Chilli Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-reverse",
    delay: "0.03s",
  },
  {
    id: 4,
    src: "/scatter/peri-peri/05_spice_splatter_chilli.png",
    alt: "Spice Splatter Chilli Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-wiggle",
    delay: "0.04s",
  },
  {
    id: 5,
    src: "/scatter/peri-peri/06_cut_chilli.png",
    alt: "Cut Chilli Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-slow",
    delay: "0.05s",
  },
  {
    id: 6,
    src: "/scatter/peri-peri/03_crossed_chillies.png",
    alt: "Crossed Chillies Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-gentle",
    delay: "0.06s",
  },
];

const plainScatterPieces: ScatterPieceData[] = [
  {
    id: 1,
    src: "/scatter/plain/05_makhana_with_leaves.png",
    alt: "Makhana with Lotus Leaves Top-Left",
    desktop: { x: -335, y: -140, rotate: -20, scale: 1.08 },
    mobile: { x: -185, y: -100, rotate: -20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-gentle",
    delay: "0.01s",
  },
  {
    id: 2,
    src: "/scatter/plain/08_makhana_leaf_cluster.png",
    alt: "Makhana Leaf Cluster Top-Right",
    desktop: { x: 335, y: -140, rotate: 20, scale: 1.08 },
    mobile: { x: 185, y: -100, rotate: 20, scale: 0.78 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-slow",
    delay: "0.02s",
  },
  {
    id: 3,
    src: "/scatter/plain/03_cracked_makhana.png",
    alt: "Cracked Crunchy Makhana Mid-Left",
    desktop: { x: -355, y: 12, rotate: 12, scale: 1.05 },
    mobile: { x: -198, y: 10, rotate: 12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-reverse",
    delay: "0.03s",
  },
  {
    id: 4,
    src: "/scatter/plain/06_large_makhana_with_crumbs.png",
    alt: "Popped Makhana with Crumbs Mid-Right",
    desktop: { x: 355, y: 12, rotate: -12, scale: 1.05 },
    mobile: { x: 198, y: 10, rotate: -12, scale: 0.76 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-wiggle",
    delay: "0.04s",
  },
  {
    id: 5,
    src: "/scatter/plain/01_single_makhana.png",
    alt: "Single Roasted Makhana Lower-Left",
    desktop: { x: -325, y: 165, rotate: -16, scale: 1.02 },
    mobile: { x: -182, y: 125, rotate: -16, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-slow",
    delay: "0.05s",
  },
  {
    id: 6,
    src: "/scatter/plain/02_three_makhana_cluster.png",
    alt: "Three Makhana Cluster Lower-Right",
    desktop: { x: 325, y: 165, rotate: 22, scale: 1.02 },
    mobile: { x: 182, y: 125, rotate: 22, scale: 0.74 },
    size: "w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26",
    floatClass: "animate-float-gentle",
    delay: "0.06s",
  },
];

export default function BiteJoyPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(3);
  const [activePlanetIndex, setActivePlanetIndex] = useState(0); // 0 = Peri Peri Punch, 2 = Cheese Blast
  const [isScattered, setIsScattered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [resetScatterTrigger, setResetScatterTrigger] = useState(0);
  const [isTransitioningFlavour, setIsTransitioningFlavour] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Eagerly preload all flavour packets, backgrounds, and scatter piece textures into browser cache
    const allAssetUrls = [
      "/packets/peri peri.svg",
      "/packets/cheese.svg",
      "/packets/plain.png",
      "/product-bg/peri-peri.svg",
      "/product-bg/mobile-peri-peri.svg",
      "/product-bg/cheese.svg",
      "/product-bg/mobile-cheese.svg",
      "/product-bg/plain.svg",
      "/product-bg/mobile-plain.svg",
      ...cheeseScatterPieces.map((p) => p.src),
      ...periPeriScatterPieces.map((p) => p.src),
      ...plainScatterPieces.map((p) => p.src),
    ];
    allAssetUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    // Initial smooth burst delay after page mounts
    const timer = setTimeout(() => setIsScattered(true), 250);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Orchestrate the snappy retract & burst lifecycle during flavour switching
  const changeFlavour = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activePlanetIndex || isTransitioningFlavour) return;
      setIsTransitioningFlavour(true);

      // 1. Snappy pull current assets back behind the packet (180ms)
      setIsScattered(false);

      // 2. Once retracted behind the pouch (180ms), swap flavour pack and background
      setTimeout(() => {
        setActivePlanetIndex(targetIndex);

        // 3. Ultra-short frame tick (30ms), then burst outward immediately from behind!
        setTimeout(() => {
          setIsScattered(true);
          setIsTransitioningFlavour(false);
        }, 30);
      }, 180);
    },
    [activePlanetIndex, isTransitioningFlavour]
  );

  const nextPlanet = useCallback(() => {
    changeFlavour((activePlanetIndex + 1) % 3);
  }, [changeFlavour, activePlanetIndex]);

  const prevPlanet = useCallback(() => {
    changeFlavour((activePlanetIndex - 1 + 3) % 3);
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
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      nextPlanet();
    } else if (diff < -40) {
      prevPlanet();
    }
    setTouchStartX(null);
  };

  const currentScatterPieces =
    activePlanetIndex === 0
      ? periPeriScatterPieces
      : activePlanetIndex === 1
      ? plainScatterPieces
      : cheeseScatterPieces;

  const flavourPlanets = [
    {
      id: "periperi",
      code: "01 / 03",
      name: "PERI PERI PUNCH",
      tagline: "Fiery, Zesty & Bold Indian Spices",
      description: "A scorching cosmic burst of bird's eye chillies, citrus zest, and roasted makhana crunch.",
      packImage: "/packets/peri peri.svg",
      bgSvg: "/product-bg/peri-peri.svg",
      bgMobileSvg: "/product-bg/mobile-peri-peri.svg",
      themeColor: "#D73B3A",
      planetGradient: "radial-gradient(circle at 35% 30%, #FF6B6B 0%, #D73B3A 55%, #7A1211 100%)",
      glowColor: "rgba(215, 59, 58, 0.45)",
      badge: "Spicy Hit 🌶️",
      accentBg: "#FB0008",
    },
    {
      id: "plain",
      code: "02 / 03",
      name: "PLAIN MAKHANA",
      tagline: "Pure, Roasted & Naturally Crisp Lotus Seeds",
      description: "100% natural pond-harvested lotus seeds, slow-roasted to crispy perfection with zero additives and pure crunch.",
      packImage: "/packets/plain.png",
      bgSvg: "/product-bg/plain.svg",
      bgMobileSvg: "/product-bg/mobile-plain.svg",
      themeColor: "#2D6A4F",
      planetGradient: "radial-gradient(circle at 35% 30%, #D8F3DC 0%, #52B788 55%, #1B4332 100%)",
      glowColor: "rgba(45, 106, 79, 0.45)",
      badge: "Pure & Raw 🌱",
      accentBg: "#2D6A4F",
    },
    {
      id: "cheddar",
      code: "03 / 03",
      name: "CHEESE BLAST",
      tagline: "Rich, Melty & Creamy Golden Crunch",
      description: "A velvety celestial cloud of slow-aged golden cheddar dust melted over crunchy lotus pops.",
      packImage: "/packets/cheese.svg",
      bgSvg: "/product-bg/cheese.svg",
      bgMobileSvg: "/product-bg/mobile-cheese.svg",
      themeColor: "#FFCD3C",
      planetGradient: "radial-gradient(circle at 35% 30%, #FFE082 0%, #F37D20 55%, #8C3900 100%)",
      glowColor: "rgba(255, 205, 60, 0.45)",
      badge: "Ultra Cheesy 🧀",
      accentBg: "#F37D20",
    },
  ];



  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentFlavour = flavourPlanets[activePlanetIndex] || flavourPlanets[0];

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] font-sans antialiased overflow-x-hidden selection:bg-[#D73B3A] selection:text-white relative">
      
      {/* =========================================================================
          TOP NAVBAR
          ========================================================================= */}
      <header className="w-full bg-[#FFF8EE]/95 sticky top-0 z-50 backdrop-blur-md border-b border-[#522C28]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/pop-culture-logo.svg"
              alt="Pop Culture"
              className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 font-bold text-xs sm:text-sm text-[#522C28]">
            <Link href="#flavours" className="hover:text-[#D73B3A] transition-colors">
              Flavours
            </Link>
            <Link href="#discover" className="hover:text-[#D73B3A] transition-colors">
              Discover
            </Link>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-3.5 text-[#522C28]">
            <button className="p-1.5 hover:text-[#D73B3A] transition-colors" aria-label="Search">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button className="p-1.5 hover:text-[#D73B3A] transition-colors" aria-label="Account">
              <User className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setCartCount((c) => c + 1)}
              className="relative p-2 rounded-full bg-[#D73B3A] text-white hover:bg-[#FB0008] transition-all shadow-sm"
              aria-label="Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFCD3C] text-[#522C28] text-[9px] font-black rounded-full flex items-center justify-center border border-[#522C28]">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          HERO SECTION WITH CANVA-INSPIRED CURVED ARCH MARQUEE & RECLINING FOX
          ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-72px)] bg-[#F9F3EA] flex flex-col justify-between">
        {/* Top breathing room */}
        <div className="w-full pt-2 sm:pt-4" />

        {/* Hero Stage Container holding Reclining Fox & Straight Marquee */}
        <div className="relative w-full mt-auto flex flex-col items-center justify-end">
          
          {/* Sunglasses Fox With Sweeping Tail - Lounging directly on top of the straight marquee */}
          <div className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 flex justify-end -mb-3 sm:-mb-5 md:-mb-6 pointer-events-none">
            <div className="w-full flex justify-center lg:justify-end pr-0 lg:pr-6 xl:pr-10">
              <img
                src="/Sunglasses Fox With Sweeping Tail.png"
                alt="Sunglasses Fox With Sweeping Tail"
                className="w-auto h-auto max-w-[94vw] sm:max-w-[88vw] md:max-w-[80vw] lg:max-w-[72vw] xl:max-w-[940px] max-h-[46vh] sm:max-h-[50vh] md:max-h-[54vh] lg:max-h-[58vh] xl:max-h-[500px] object-contain drop-shadow-2xl select-none pointer-events-auto transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Top Straight Marquee Ribbon */}
          <div className="relative z-20 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-3 sm:py-3.5 md:py-4 overflow-hidden select-none">
            <div className="flex w-max animate-wave-marquee">
              <div className="flex shrink-0 items-center gap-6 pr-6">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    style={{ fontFamily: "'Lilita One', cursive, sans-serif" }}
                    className="font-display text-[20px] sm:text-[24px] md:text-[28px] text-[#FFF8EE] tracking-[0.09em] uppercase font-bold whitespace-nowrap"
                  >
                    THE COOLEST WAY TO SNACK BETTER <span className="text-[#FFCD3C]">✦</span>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-6 pr-6">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    style={{ fontFamily: "'Lilita One', cursive, sans-serif" }}
                    className="font-display text-[20px] sm:text-[24px] md:text-[28px] text-[#FFF8EE] tracking-[0.09em] uppercase font-bold whitespace-nowrap"
                  >
                    THE COOLEST WAY TO SNACK BETTER <span className="text-[#FFCD3C]">✦</span>
                  </span>
                ))}
              </div>
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
        className="pt-2 sm:pt-12 md:pt-14 pb-0 bg-[#FDF2E8] text-[#522C28] relative z-10 overflow-hidden select-none w-full aspect-[941/1250] sm:aspect-auto flex flex-col justify-between transition-all duration-500 ease-out"
      >
        
        {/* Dynamic Product Background SVG Layer (Smooth Crossfade with Instant Pre-colored Theme Fallback) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {[
            {
              id: "periperi",
              themeBg: "#E53925", // Peri Peri Red
              desktopSvg: "/product-bg/peri-peri.svg",
              mobileSvg: "/product-bg/mobile-peri-peri.svg",
              active: activePlanetIndex === 0,
            },
            {
              id: "plain",
              themeBg: "#FFF3E3", // Warm Plain Cream
              desktopSvg: "/product-bg/plain.svg",
              mobileSvg: "/product-bg/mobile-plain.svg",
              active: activePlanetIndex === 1,
            },
            {
              id: "cheese",
              themeBg: "#F79E1B", // Cheddar Golden Cheese
              desktopSvg: "/product-bg/cheese.svg",
              mobileSvg: "/product-bg/mobile-cheese.svg",
              active: activePlanetIndex === 2,
            },
          ].map((bg) => (
            <div
              key={bg.id}
              style={{ backgroundColor: bg.themeBg }}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
                bg.active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <picture className="w-full h-full block">
                <source media="(max-width: 640px)" srcSet={bg.mobileSvg} />
                <img
                  src={bg.desktopSvg}
                  alt=""
                  loading="eager"
                  decoding="sync"
                  className="w-full h-full object-fill sm:object-cover object-center"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-20 pt-3 sm:pt-8 mb-1 sm:mb-3 shrink-0 transition-all duration-500 ease-out">
          <h2 className="font-display text-lg sm:text-3xl md:text-4xl font-black tracking-tight text-[#25100E] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            Find Your Flavour
          </h2>
          <p className="mt-0.5 text-[11px] sm:text-sm text-[#4A201B] font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            {currentFlavour.tagline}
          </p>
        </div>

        {/* Central Packet Stage with Dynamic Ingredient Scatter & Slider Controls */}
        <div className="relative max-w-4xl w-full mx-auto px-2 sm:px-8 flex items-center justify-center h-[245px] sm:h-[330px] md:h-[370px] my-auto shrink-0 overflow-visible">
          
          {/* Slider Prev Arrow Button (Left) */}
          <button
            onClick={prevPlanet}
            aria-label="Previous Flavour"
            title="Slide to Previous Flavour"
            className="absolute left-1 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-[#25100E] shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-[#25100E]/15 hover:scale-115 active:scale-90 transition-all cursor-pointer backdrop-blur-sm group"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Slider Next Arrow Button (Right) */}
          <button
            onClick={nextPlanet}
            aria-label="Next Flavour"
            title="Slide to Next Flavour"
            className="absolute right-1 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-[#25100E] shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-[#25100E]/15 hover:scale-115 active:scale-90 transition-all cursor-pointer backdrop-blur-sm group"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Main Stage Anchor for Packet & Scatter Particles */}
          <div className="relative flex items-center justify-center">
            
            {/* Interactive Physics, Free-Floating & Draggable/Throwable Scatter Layer */}
            <InteractiveScatterLayer
              pieces={currentScatterPieces}
              isMobile={isMobile}
              isScattered={isScattered}
              activeFlavourId={currentFlavour.id}
              onResetTrigger={resetScatterTrigger}
            />

            {/* Central Product Packet Stack (Pre-rendered, Zero-Lag, Instant Crossfade) */}
            <div
              onClick={triggerScatter}
              className={`relative z-30 flex items-center justify-center h-[235px] sm:h-80 md:h-[340px] lg:h-[380px] w-56 sm:w-72 md:w-80 group cursor-pointer select-none transition-transform duration-250 ease-out animate-float-gentle ${
                isTransitioningFlavour ? "scale-92" : "scale-100"
              }`}
              title="Click pouch to recall & re-burst scatter pieces!"
            >
              {flavourPlanets.map((flavour, idx) => {
                const isActive = activePlanetIndex === idx;
                return (
                  <div
                    key={flavour.id}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                      isActive
                        ? "opacity-100 scale-100 z-10 pointer-events-auto"
                        : "opacity-0 scale-90 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={flavour.packImage}
                      alt={flavour.name}
                      loading="eager"
                      decoding="sync"
                      className="h-full w-auto max-w-full object-contain drop-shadow-[0_20px_35px_rgba(120,40,0,0.35)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95 pointer-events-auto"
                    />
                  </div>
                );
              })}
            </div>

            {/* Playful Interactive Hint Badge */}
            <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 z-35 pointer-events-none whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 text-[#522C28] text-[9px] sm:text-[10px] font-bold shadow-sm border border-[#522C28]/15 backdrop-blur-sm animate-pulse">
                <span>✦</span>
                <span>Move & fling the ingredients with mouse or finger!</span>
                <span>✦</span>
              </span>
            </div>

          </div>
        </div>

        {/* Flavour Details & Action Buttons */}
        <div className="relative max-w-xl w-full mx-auto px-4 text-center mt-1 sm:mt-2 mb-1 sm:mb-2 relative z-30 shrink-0 flex flex-col items-center">
          
          {/* Interactive Flavour Switcher Slider Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 z-30">
            {flavourPlanets.map((flavour, idx) => {
              const isActive = activePlanetIndex === idx;
              return (
                <button
                  key={flavour.id}
                  onClick={() => changeFlavour(idx)}
                  className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? "bg-[#25100E] text-white shadow-md scale-105 ring-2 ring-[#FFCD3C]"
                      : "bg-white/80 hover:bg-white text-[#522C28] border border-[#522C28]/20 hover:scale-100"
                  }`}
                >
                  <span className="text-xs">{flavour.badge.split(" ").slice(-1)[0]}</span>
                  <span>{flavour.name}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[9px] sm:text-xs font-black tracking-widest text-[#522C28]/70 uppercase">
            {currentFlavour.code}
          </div>
          <h3 className="font-display text-base sm:text-2xl md:text-3xl font-black tracking-wider text-[#25100E] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] mt-0.5">
            {currentFlavour.name}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-[#3D1A16] max-w-[270px] sm:max-w-md mx-auto font-medium leading-tight sm:leading-relaxed mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            {currentFlavour.description}
          </p>

          {/* Dual Action Buttons: Buy Now & See Details */}
          <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3 z-30 relative">
            {/* Buy Now Button (Primary Solid) */}
            <button
              onClick={() => setCartCount((c) => c + 1)}
              style={{ backgroundColor: currentFlavour.accentBg || "#D73B3A" }}
              className="px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-white font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-[0_4px_14px_rgba(215,59,58,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer group"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
              <span>Buy Now</span>
            </button>

            {/* See Details Button (Secondary Outline) */}
            <Link
              href="#details"
              className="px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/95 hover:bg-white text-[#25100E] border border-[#25100E]/25 hover:border-[#25100E] font-bold text-[11px] sm:text-sm uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
            >
              <span>See Details</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Bottom Straight Marquee Ribbon */}
        <div className="relative z-30 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3 md:py-3.5 overflow-hidden select-none mt-auto shrink-0 transition-all duration-500 ease-out">
          <div className="flex w-max animate-wave-marquee-reverse">
            <div className="flex shrink-0 items-center gap-6 pr-6">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  style={{ fontFamily: "'Lilita One', cursive, sans-serif" }}
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
                  style={{ fontFamily: "'Lilita One', cursive, sans-serif" }}
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

      {/* =========================================================================
          SECTION: PLAYFUL POP CULTURE SNACK FOOTER
          Exact replica of Playful Pop Culture Snack Footer.png
          ========================================================================= */}
      {/* =========================================================================
          SECTION: PLAYFUL POP CULTURE SNACK FOOTER
          Responsive: Original design on Desktop (lg:), optimized layout on Mobile (<lg)
          ========================================================================= */}
      <footer
        style={{ backgroundColor: "#FCF5EB" }}
        className="w-full bg-[#FCF5EB] text-[#522C28] relative z-10 overflow-hidden"
      >
        {/* -----------------------------------------------------------------------
            DESKTOP FOOTER (lg and up) - Balanced vertical layout (Logo & Nav up)
            ----------------------------------------------------------------------- */}
        <div className="hidden lg:block pt-4 lg:pt-6">
          {/* Main Upper Content Row */}
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-start justify-between gap-8 pb-0 relative z-20 min-h-[200px]">
            
            {/* 1. Left Column: Pop Culture Primary Logo + Tagline - Positioned High */}
            <div className="flex flex-col items-start max-w-[240px] flex-shrink-0 pt-1 lg:pt-2">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                <img
                  src="/footer/Pop Culture Primary Logo.png"
                  alt="Pop Culture Primary Logo"
                  className="h-20 md:h-22 lg:h-24 w-auto object-contain"
                />
              </Link>
              <p className="text-xs md:text-[13px] text-[#522C28] font-medium leading-relaxed mt-2.5">
                the coolest way to snack better
              </p>
              {/* Playful Yellow Curved Stroke */}
              <svg className="w-16 h-2.5 mt-2" viewBox="0 0 70 8" fill="none">
                <path d="M2 6C22 1.5 48 1.5 68 6" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* 2. Center: Fox Mascot in Snack Bowl - Grounded into the red wave */}
            <div className="flex-shrink-0 flex items-end justify-center self-end -mb-8 lg:-mb-14 z-20">
              <img
                src="/footer/fox-in-bowl.png"
                alt="Relaxed Fox in Snack Bowl"
                className="w-60 lg:w-72 xl:w-80 h-auto object-contain drop-shadow-sm select-none"
              />
            </div>

            {/* 3. Right: Navigation Columns (SHOP | HELP | COMPANY) - Positioned High */}
            <div className="flex items-start gap-6 lg:gap-8 pt-1 lg:pt-2">
              
              {/* Shop Column */}
              <div className="space-y-2.5 min-w-[90px]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-xs font-black tracking-wide">
                  <ShoppingBasket className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>SHOP</span>
                </div>
                <ul className="space-y-1.5 text-xs font-semibold text-[#522C28]">
                  <li><Link href="#shop" className="hover:text-[#A5151C] transition-colors">All Snacks</Link></li>
                  <li><Link href="#build-box" className="hover:text-[#A5151C] transition-colors">Build a Box</Link></li>
                  <li><Link href="#gift-cards" className="hover:text-[#A5151C] transition-colors">Gift Cards</Link></li>
                </ul>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-24 bg-[#522C28]/15 self-center" />

              {/* Help Column */}
              <div className="space-y-2.5 min-w-[105px]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-xs font-black tracking-wide">
                  <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>HELP</span>
                </div>
                <ul className="space-y-1.5 text-xs font-semibold text-[#522C28]">
                  <li><Link href="#faqs" className="hover:text-[#A5151C] transition-colors">FAQs</Link></li>
                  <li><Link href="#shipping" className="hover:text-[#A5151C] transition-colors">Shipping & Returns</Link></li>
                  <li><Link href="#contact" className="hover:text-[#A5151C] transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-24 bg-[#522C28]/15 self-center" />

              {/* Company Column */}
              <div className="space-y-2.5 min-w-[105px]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-xs font-black tracking-wide">
                  <Store className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>COMPANY</span>
                </div>
                <ul className="space-y-1.5 text-xs font-semibold text-[#522C28]">
                  <li><Link href="#story" className="hover:text-[#A5151C] transition-colors">Our Story</Link></li>
                  <li><Link href="#ingredients" className="hover:text-[#A5151C] transition-colors">Ingredients</Link></li>
                  <li><Link href="#rewards" className="hover:text-[#A5151C] transition-colors">Rewards Program</Link></li>
                </ul>
              </div>

            </div>

          </div>

          {/* Desktop Lower Red Strip: strip.svg with copyright, center social icons, legal links */}
          <div className="relative w-full overflow-hidden leading-none z-10 -mt-10 lg:-mt-12">
            <img
              src="/footer/strip.svg"
              alt="Wavy Red Snack Banner"
              className="w-full h-auto min-h-[100px] block pointer-events-none"
            />

            <div className="absolute bottom-3 md:bottom-4 left-0 w-full px-8 lg:px-12 flex items-center justify-between text-xs text-white font-medium z-20">
              {/* Copyright */}
              <p className="text-white/95">
                © 2026 Pop Culture Inc. All rights reserved.
              </p>

              {/* Social Icons & Dividers */}
              <div className="flex items-center gap-3">
                <div className="h-3.5 w-[1px] bg-white/40" />
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="w-7 h-7 rounded-lg border border-white/60 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="w-7 h-7 rounded-lg border border-white/60 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-7 h-7 rounded-lg border border-white/60 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-7 h-7 rounded-lg border border-white/60 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="h-3.5 w-[1px] bg-white/40" />
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-3 text-white/95">
                <Link href="#privacy" className="hover:underline">Privacy Policy</Link>
                <span>|</span>
                <Link href="#terms" className="hover:underline">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            MOBILE / TABLET FOOTER (< lg) - Optimized layout
            - Prominent, better-sized logo utilizing available space
            - Fox mascot raised up with social icons below it
            - Properly distributed 3-column navigation
            ----------------------------------------------------------------------- */}
        <div className="block lg:hidden pt-6 sm:pt-8">
          <div className="max-w-[640px] mx-auto px-4 sm:px-6 relative z-20">
            
            {/* Top Row: Larger Prominent Logo (Left) & Fox Mascot with Social Icons (Right) */}
            <div className="flex items-start justify-between gap-4 pb-5 sm:pb-6">
              
              {/* 1. Left: Balanced Logo + Tagline */}
              <div className="flex flex-col items-start flex-1 max-w-[150px] sm:max-w-[175px]">
                <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                  <img
                    src="/footer/Pop Culture Primary Logo.png"
                    alt="Pop Culture Primary Logo"
                    className="h-13 sm:h-14 w-auto object-contain drop-shadow-xs"
                  />
                </Link>
                <p className="text-xs text-[#522C28] font-semibold leading-tight mt-1.5">
                  the coolest way to snack better
                </p>
                {/* Playful Yellow Curved Stroke */}
                <svg className="w-14 h-2 mt-1" viewBox="0 0 70 8" fill="none">
                  <path d="M2 6C22 1.5 48 1.5 68 6" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* 2. Right: Fox Mascot (Raised Up) + Social Icons Directly Below */}
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <img
                  src="/footer/fox-in-bowl.png"
                  alt="Relaxed Fox in Snack Bowl"
                  className="w-32 sm:w-40 h-auto object-contain drop-shadow-sm select-none"
                />

                {/* Social Icons ("3 icon of insta n ol") directly below Fox */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 hover:bg-white border border-[#522C28]/20 hover:border-[#A5151C] flex items-center justify-center text-[#522C28] hover:text-[#A5151C] shadow-xs transition-all hover:scale-105"
                  >
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 hover:bg-white border border-[#522C28]/20 hover:border-[#A5151C] flex items-center justify-center text-[#522C28] hover:text-[#A5151C] shadow-xs transition-all hover:scale-105"
                  >
                    <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 hover:bg-white border border-[#522C28]/20 hover:border-[#A5151C] flex items-center justify-center text-[#522C28] hover:text-[#A5151C] shadow-xs transition-all hover:scale-105"
                  >
                    <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 hover:bg-white border border-[#522C28]/20 hover:border-[#A5151C] flex items-center justify-center text-[#522C28] hover:text-[#A5151C] shadow-xs transition-all hover:scale-105"
                  >
                    <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  </a>
                </div>
              </div>

            </div>

            {/* Middle Row: SHOP | HELP | COMPANY - Properly distributed across 3 equal columns */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-[#522C28]/15 pb-2">
              
              {/* Shop Column */}
              <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-[11px] sm:text-xs font-black tracking-wide">
                  <ShoppingBasket className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  <span>SHOP</span>
                </div>
                <ul className="space-y-1 text-xs font-semibold text-[#522C28]">
                  <li><Link href="#shop" className="hover:text-[#A5151C] transition-colors">All Snacks</Link></li>
                  <li><Link href="#build-box" className="hover:text-[#A5151C] transition-colors">Build a Box</Link></li>
                  <li><Link href="#gift-cards" className="hover:text-[#A5151C] transition-colors">Gift Cards</Link></li>
                </ul>
              </div>

              {/* Help Column */}
              <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left border-l border-[#522C28]/10 pl-2 sm:pl-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-[11px] sm:text-xs font-black tracking-wide">
                  <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  <span>HELP</span>
                </div>
                <ul className="space-y-1 text-xs font-semibold text-[#522C28]">
                  <li><Link href="#faqs" className="hover:text-[#A5151C] transition-colors">FAQs</Link></li>
                  <li><Link href="#shipping" className="hover:text-[#A5151C] transition-colors">Shipping & Returns</Link></li>
                  <li><Link href="#contact" className="hover:text-[#A5151C] transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              {/* Company Column */}
              <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left border-l border-[#522C28]/10 pl-2 sm:pl-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-[11px] sm:text-xs font-black tracking-wide">
                  <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  <span>COMPANY</span>
                </div>
                <ul className="space-y-1 text-xs font-semibold text-[#522C28]">
                  <li><Link href="#story" className="hover:text-[#A5151C] transition-colors">Our Story</Link></li>
                  <li><Link href="#ingredients" className="hover:text-[#A5151C] transition-colors">Ingredients</Link></li>
                  <li><Link href="#rewards" className="hover:text-[#A5151C] transition-colors">Rewards Program</Link></li>
                </ul>
              </div>

            </div>

          </div>

          {/* Mobile Lower Red Strip: strip.svg with copyright & legal links */}
          <div className="relative w-full overflow-hidden leading-none z-10 -mt-4 sm:-mt-6">
            <img
              src="/footer/strip.svg"
              alt="Wavy Red Snack Banner"
              className="w-full h-auto min-h-[60px] sm:min-h-[75px] block pointer-events-none"
            />

            <div className="absolute bottom-2 sm:bottom-3 left-0 w-full px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-xs text-white font-medium z-20">
              <p className="order-2 sm:order-1 text-white/95 text-center sm:text-left">
                © 2026 Pop Culture Inc. All rights reserved.
              </p>
              <div className="order-1 sm:order-2 flex items-center space-x-2.5 text-white/95">
                <Link href="#privacy" className="hover:underline">Privacy Policy</Link>
                <span>|</span>
                <Link href="#terms" className="hover:underline">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}
