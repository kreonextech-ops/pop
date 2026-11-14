"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Plus,
  Minus,
  Check,
  X,
  ArrowRight,
  Flame,
  Award,
  Truck,
  RotateCcw,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartContext";

type BoxSize = 4 | 6 | 12;

interface FlavourOption {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  image: string;
  themeColor: string;
  accentBg: string;
  badge: string;
  notes: string[];
}

const FLAVOURS: FlavourOption[] = [
  {
    id: "peri-peri",
    name: "Peri Peri Punch",
    tagline: "Fiery, Tangy & Irresistibly Bold",
    emoji: "🌶️",
    image: "/packets/peri peri.svg",
    themeColor: "#E53925",
    accentBg: "#ED0006",
    badge: "🔥 HOT & SPICY",
    notes: ["African Bird's Eye Chili", "Slow-Roasted Lotus Seeds", "Zero Palm Oil"],
  },
  {
    id: "cheddar-cheese",
    name: "Cheddar Cheese Melt",
    tagline: "Velvety, Savoury & Golden Crunch",
    emoji: "🧀",
    image: "/packets/cheese.svg",
    themeColor: "#F79E1B",
    accentBg: "#FAC537",
    badge: "🧀 VELVET MELT",
    notes: ["Real Aged Cheddar Powder", "Melt-in-Mouth Texture", "High Protein"],
  },
  {
    id: "pink-salt",
    name: "Himalayan Pink Salt",
    tagline: "Crisp, Mineral-Rich & Pure",
    emoji: "🌸",
    image: "/packets/pink-salt-pouch.png",
    themeColor: "#E1366C",
    accentBg: "#F472B6",
    badge: "🌸 CLEAN CRUNCH",
    notes: ["84 Trace Minerals", "Pure Light Roast", "Gluten-Free"],
  },
  {
    id: "raw-makhana",
    name: "100% Raw Foxnuts",
    tagline: "Jumbo Grade Handpicked Lotus Seeds",
    emoji: "🍃",
    image: "/packets/raw-makhana-pouch.png",
    themeColor: "#2D6A4F",
    accentBg: "#52B788",
    badge: "🍃 ZERO ADDITIVES",
    notes: ["Jumbo 5-Suta Grade", "Naturally Sun-Dried", "DIY Roasting Ready"],
  },
];

interface BoxTierConfig {
  size: BoxSize;
  title: string;
  price: number;
  originalPrice: number;
  savings: string;
  perks: string;
  isPopular?: boolean;
}

const BOX_TIERS: Record<BoxSize, BoxTierConfig> = {
  4: {
    size: 4,
    title: "4-Pack Sampler",
    price: 160,
    originalPrice: 180,
    savings: "SAVE 11%",
    perks: "Great for quick trials",
  },
  6: {
    size: 6,
    title: "6-Pack Party Box",
    price: 220,
    originalPrice: 270,
    savings: "SAVE 18%",
    perks: "FREE Shipping Included",
    isPopular: true,
  },
  12: {
    size: 12,
    title: "12-Pack Mega Stash",
    price: 399,
    originalPrice: 540,
    savings: "SAVE 26%",
    perks: "FREE Shipping + Sticker Pack",
  },
};

export default function BuildABoxPage() {
  const [selectedSize, setSelectedSize] = useState<BoxSize>(6);
  // Array of flavour IDs representing pouches loaded in order
  const [slots, setSlots] = useState<string[]>([
    "peri-peri",
    "peri-peri",
    "cheddar-cheese",
    "cheddar-cheese",
    "pink-salt",
    "raw-makhana",
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { addItem, openCart } = useCart();

  const tier = BOX_TIERS[selectedSize];

  // Adjust slots when changing size
  const handleSizeChange = (newSize: BoxSize) => {
    setSelectedSize(newSize);
    setSlots((prev) => {
      if (prev.length === newSize) return prev;
      if (prev.length > newSize) return prev.slice(0, newSize);
      // Expand by repeating existing or filling with defaults
      const expanded = [...prev];
      const defaults = ["peri-peri", "cheddar-cheese", "pink-salt", "raw-makhana"];
      let i = 0;
      while (expanded.length < newSize) {
        expanded.push(defaults[i % defaults.length]);
        i++;
      }
      return expanded;
    });
  };

  // Add flavour to next free slot
  const handleAddFlavour = (flavourId: string) => {
    if (slots.length >= selectedSize) {
      setToastMsg(`Box is full! Remove a pack to add ${flavourId.replace("-", " ")}.`);
      setTimeout(() => setToastMsg(null), 2500);
      return;
    }
    setSlots((prev) => [...prev, flavourId]);
  };

  // Remove one instance of flavour
  const handleRemoveFlavour = (flavourId: string) => {
    setSlots((prev) => {
      const idx = prev.lastIndexOf(flavourId);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  // Remove specific slot by index
  const handleRemoveSlotIndex = (index: number) => {
    setSlots((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  // Clear all
  const handleResetBox = () => {
    setSlots([]);
  };

  // Flavour counts
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      "peri-peri": 0,
      "cheddar-cheese": 0,
      "pink-salt": 0,
      "raw-makhana": 0,
    };
    slots.forEach((id) => {
      if (c[id] !== undefined) c[id]++;
    });
    return c;
  }, [slots]);

  // Dynamic "Box Persona"
  const boxPersona = useMemo(() => {
    if (slots.length === 0) {
      return {
        title: "✨ Clean Slate",
        desc: "Tap your favourite snacks below to fill your custom crate!",
        accent: "#522C28",
      };
    }
    const maxFlavour = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const maxCount = maxFlavour[1];
    const topId = maxFlavour[0];

    if (maxCount >= slots.length * 0.75) {
      if (topId === "peri-peri")
        return {
          title: "🔥 The Firebreather Box",
          desc: "Full-throttle heat! Zero hesitation, pure spicy crunch.",
          accent: "#E53925",
        };
      if (topId === "cheddar-cheese")
        return {
          title: "🧀 The Velvet Melter Box",
          desc: "Ultimate comfort snacking. Rich, golden, and deeply satisfying.",
          accent: "#F79E1B",
        };
      if (topId === "pink-salt")
        return {
          title: "🌸 The Zen Purist Box",
          desc: "Clean, mineral-rich, guilt-free crunch for mindful days.",
          accent: "#E1366C",
        };
      return {
        title: "🍃 The Chef’s Harvest Box",
        desc: "100% pure raw lotus seeds ready for custom roasts & healthy cooking.",
        accent: "#2D6A4F",
      };
    }

    if (counts["peri-peri"] > 0 && counts["cheddar-cheese"] > 0 && counts["pink-salt"] === 0 && counts["raw-makhana"] === 0) {
      return {
        title: "⚡ Spicy Cheddar Fusion",
        desc: "The ultimate movie night combo: spicy kick paired with velvety melt.",
        accent: "#ED0006",
      };
    }

    return {
      title: "🌈 The Crunch Explorer",
      desc: "A beautifully curated balance of fiery, savory, crisp, and pure textures.",
      accent: "#FFCD3C",
    };
  }, [counts, slots.length]);

  // Quick Preset Handlers
  const handleApplyPreset = (type: "balanced" | "spicy-cheddar" | "clean") => {
    if (type === "balanced") {
      const balanced: string[] = [];
      const keys = ["peri-peri", "cheddar-cheese", "pink-salt", "raw-makhana"];
      for (let i = 0; i < selectedSize; i++) {
        balanced.push(keys[i % keys.length]);
      }
      setSlots(balanced);
    } else if (type === "spicy-cheddar") {
      const spicyCheddar: string[] = [];
      for (let i = 0; i < selectedSize; i++) {
        spicyCheddar.push(i % 2 === 0 ? "peri-peri" : "cheddar-cheese");
      }
      setSlots(spicyCheddar);
    } else if (type === "clean") {
      const clean: string[] = [];
      for (let i = 0; i < selectedSize; i++) {
        clean.push(i % 2 === 0 ? "pink-salt" : "raw-makhana");
      }
      setSlots(clean);
    }
  };

  // Add custom box to cart
  const handleAddBoxToCart = () => {
    if (slots.length < selectedSize) {
      setToastMsg(`Please fill all ${selectedSize} slots before adding to cart! (${selectedSize - slots.length} left)`);
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    // Build human-readable breakdown
    const parts = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const item = FLAVOURS.find((f) => f.id === id);
        return `${count}× ${item?.name || id}`;
      })
      .join(", ");

    const customItem = {
      variantId: 900000 + selectedSize * 100 + Math.floor(Math.random() * 90),
      slug: `custom-box-${selectedSize}`,
      name: `CUSTOM ${selectedSize}-PACK BOX`,
      variantLabel: parts,
      price: tier.price,
      originalPrice: tier.originalPrice,
      image: FLAVOURS.find((f) => f.id === slots[0])?.image || "/packets/peri peri.svg",
    };

    addItem(customItem, 1, true);
    setToastMsg(`Custom ${selectedSize}-Pack Box added to your cart! 🎁`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isBoxFull = slots.length === selectedSize;

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] font-sans antialiased selection:bg-[#D73B3A] selection:text-white">
      <Navbar />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#25100E] text-[#FFF8EE] px-5 py-3 rounded-2xl shadow-2xl border border-[#FFCD3C]/40 flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-bold">
          <Sparkles className="w-4 h-4 text-[#FFCD3C] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-28">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53925]/10 text-[#E53925] text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Snack Studio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#25100E]">
            BUILD YOUR OWN BOX
          </h1>
          <p className="text-sm sm:text-base text-[#522C28]/80 mt-2 font-medium">
            Mix and match your dream flavour combination. Pack more, unlock big bulk savings, and get it delivered straight to your door.
          </p>
        </div>

        {/* STEP 1: Select Box Size */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#522C28]/80 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#25100E] text-[#FFF8EE] inline-flex items-center justify-center text-[10px]">1</span>
              <span>Select Box Size</span>
            </h2>
            <span className="text-[11px] font-bold text-[#E53925]">
              Bigger Box = Bigger Savings
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {(Object.values(BOX_TIERS) as BoxTierConfig[]).map((t) => {
              const active = selectedSize === t.size;
              return (
                <button
                  key={t.size}
                  onClick={() => handleSizeChange(t.size)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    active
                      ? "bg-[#25100E] text-[#FFF8EE] border-[#25100E] shadow-xl scale-[1.02]"
                      : "bg-white text-[#522C28] border-[#522C28]/15 hover:border-[#25100E]/40 hover:bg-[#FFFDF9]"
                  }`}
                >
                  {t.isPopular && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#E53925] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                      MOST POPULAR
                    </span>
                  )}

                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${active ? "text-[#FFCD3C]" : "text-[#E53925]"}`}>
                      {t.savings}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-black uppercase mt-0.5">
                      {t.title}
                    </h3>
                    <p className={`text-[11px] mt-1 ${active ? "text-white/70" : "text-[#522C28]/70"}`}>
                      {t.perks}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-current/10 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black">₹{t.price}</span>
                      <span className={`text-xs line-through ${active ? "text-white/50" : "text-[#522C28]/40"}`}>
                        ₹{t.originalPrice}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold opacity-80">
                      ₹{Math.round(t.price / t.size)} / pack
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Interactive Box Stage & Flavour Persona */}
        <div className="mb-12 bg-white rounded-3xl border-2 border-[#522C28]/15 p-5 sm:p-8 shadow-sm">
          
          {/* Header of Stage */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#522C28]/10">
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#522C28]/80 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#25100E] text-[#FFF8EE] inline-flex items-center justify-center text-[10px]">2</span>
                <span>Your Custom Snack Crate</span>
              </h2>
              <p className="text-xs font-bold text-[#522C28]/70 mt-0.5">
                {slots.length} of {selectedSize} slots packed ({selectedSize - slots.length} remaining)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {slots.length > 0 && (
                <button
                  onClick={handleResetBox}
                  className="px-3 py-1.5 rounded-full border border-[#522C28]/20 text-[11px] font-black uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Empty Box</span>
                </button>
              )}
            </div>
          </div>

          {/* Persona Live Badge */}
          <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">🎭</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#522C28]/60">
                  BOX FLAVOUR PERSONA
                </span>
                <h4 className="font-display text-base sm:text-lg font-black uppercase text-[#25100E]">
                  {boxPersona.title}
                </h4>
                <p className="text-xs text-[#522C28]/80 font-medium">
                  {boxPersona.desc}
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 sm:pt-0 sm:border-l sm:border-[#522C28]/10 sm:pl-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#522C28]/50 block sm:inline">
                Presets:
              </span>
              <button
                onClick={() => handleApplyPreset("balanced")}
                className="px-2.5 py-1 rounded-full bg-white border border-[#522C28]/15 text-[10px] font-black uppercase hover:bg-[#25100E] hover:text-[#FFCD3C] transition-colors cursor-pointer"
              >
                Explorer
              </button>
              <button
                onClick={() => handleApplyPreset("spicy-cheddar")}
                className="px-2.5 py-1 rounded-full bg-white border border-[#522C28]/15 text-[10px] font-black uppercase hover:bg-[#25100E] hover:text-[#FFCD3C] transition-colors cursor-pointer"
              >
                Spicy + Melt
              </button>
              <button
                onClick={() => handleApplyPreset("clean")}
                className="px-2.5 py-1 rounded-full bg-white border border-[#522C28]/15 text-[10px] font-black uppercase hover:bg-[#25100E] hover:text-[#FFCD3C] transition-colors cursor-pointer"
              >
                Zen Pure
              </button>
            </div>
          </div>

          {/* Interactive Box Visual Slots Grid */}
          <div className="mt-6">
            <div
              className={`grid gap-3 sm:gap-4 ${
                selectedSize === 4
                  ? "grid-cols-2 sm:grid-cols-4"
                  : selectedSize === 6
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                  : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
              }`}
            >
              {[...Array(selectedSize)].map((_, index) => {
                const flavourId = slots[index];
                const flavour = flavourId
                  ? FLAVOURS.find((f) => f.id === flavourId)
                  : null;

                if (flavour) {
                  return (
                    <div
                      key={index}
                      className="group relative rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-sm border-2 animate-scale-up"
                      style={{
                        backgroundColor: `${flavour.accentBg}15`,
                        borderColor: flavour.themeColor,
                      }}
                    >
                      {/* Slot number badge */}
                      <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-black/60 text-white">
                        #{index + 1}
                      </span>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveSlotIndex(index)}
                        aria-label={`Remove ${flavour.name}`}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer z-10"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      {/* Packet Image */}
                      <div className="my-2 h-24 sm:h-28 flex items-center justify-center">
                        <img
                          src={flavour.image}
                          alt={flavour.name}
                          className="h-full w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Name */}
                      <div className="w-full">
                        <p className="text-[11px] font-black uppercase text-[#25100E] truncate">
                          {flavour.name}
                        </p>
                      </div>
                    </div>
                  );
                }

                // Empty Slot
                return (
                  <div
                    key={index}
                    onClick={() => {
                      const el = document.getElementById("flavour-picker");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-2xl border-2 border-dashed border-[#522C28]/25 p-4 flex flex-col items-center justify-center text-center min-h-[140px] sm:min-h-[160px] bg-[#FFF8EE]/40 text-[#522C28]/60 hover:border-[#E53925] hover:bg-[#FFF8EE] hover:scale-102 transition-all cursor-pointer group"
                    title="Click to pick a flavour below"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#522C28]/10 group-hover:bg-[#E53925] group-hover:text-white flex items-center justify-center text-xs font-black text-[#522C28]/60 transition-colors mb-2">
                      +
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#522C28]/70 group-hover:text-[#E53925]">
                      Empty Slot #{index + 1}
                    </span>
                    <span className="text-[9px] text-[#522C28]/50 group-hover:text-[#522C28]/80 mt-0.5">
                      Tap to choose flavour
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP 3: Flavour Picker Deck */}
        <div id="flavour-picker" className="mb-12 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#522C28]/80 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#25100E] text-[#FFF8EE] inline-flex items-center justify-center text-[10px]">3</span>
              <span>Pick Your Flavours</span>
            </h2>
            <div className="flex items-center gap-2">
              {slots.length < selectedSize && (
                <button
                  type="button"
                  onClick={() => {
                    const defaults = ["peri-peri", "cheddar-cheese", "pink-salt", "raw-makhana"];
                    setSlots((prev) => {
                      const next = [...prev];
                      let i = 0;
                      while (next.length < selectedSize) {
                        next.push(defaults[i % defaults.length]);
                        i++;
                      }
                      return next;
                    });
                  }}
                  className="px-3 py-1 rounded-full bg-[#FFCD3C] hover:bg-[#F79E1B] text-[#25100E] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                >
                  <span>⚡ Auto-Fill Remaining</span>
                </button>
              )}
              <span className="text-[11px] font-bold text-[#522C28]/60">
                Tap any card to add
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLAVOURS.map((f) => {
              const currentCount = counts[f.id] || 0;
              return (
                <div
                  key={f.id}
                  onClick={() => {
                    if (!isBoxFull) {
                      handleAddFlavour(f.id);
                    } else {
                      setToastMsg(`Box is full! Remove a pack from above to add ${f.name}.`);
                      setTimeout(() => setToastMsg(null), 2500);
                    }
                  }}
                  className={`bg-white rounded-3xl border-2 p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 ${
                    currentCount > 0
                      ? "border-[#25100E]/40 ring-2 ring-[#FFCD3C]/40"
                      : "border-[#522C28]/15 hover:border-[#E53925]/50"
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${f.themeColor}18`,
                          color: f.themeColor,
                        }}
                      >
                        {f.badge}
                      </span>

                      {currentCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#25100E] text-[#FFCD3C] text-[10px] font-black uppercase">
                          {currentCount} in box
                        </span>
                      )}
                    </div>

                    {/* Image stage */}
                    <div className="h-40 sm:h-44 flex items-center justify-center my-2 relative">
                      <div
                        className="absolute inset-4 rounded-full blur-xl opacity-20 pointer-events-none"
                        style={{ backgroundColor: f.themeColor }}
                      />
                      <img
                        src={f.image}
                        alt={f.name}
                        className="h-full w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Title & Notes */}
                    <h3 className="font-display text-base sm:text-lg font-black uppercase text-[#25100E] mt-2">
                      {f.name}
                    </h3>
                    <p className="text-[11px] font-bold text-[#522C28]/70 mt-0.5">
                      {f.tagline}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#522C28]/10 flex flex-col gap-0.5">
                      {f.notes.map((n, i) => (
                        <span key={i} className="text-[10px] font-semibold text-[#522C28]/60 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-[#3CA837]" />
                          <span>{n}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Stepper & Direct Add Button */}
                  <div className="mt-4 pt-3 border-t border-[#522C28]/10 flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveFlavour(f.id)}
                        disabled={currentCount === 0}
                        aria-label={`Decrease ${f.name}`}
                        className="w-8 h-8 rounded-full border border-[#522C28]/20 flex items-center justify-center text-[#522C28] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#522C28]/10 active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-display text-base font-black w-6 text-center text-[#25100E]">
                        {currentCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddFlavour(f.id)}
                        disabled={isBoxFull}
                        aria-label={`Increase ${f.name}`}
                        className="w-8 h-8 rounded-full bg-[#25100E] text-[#FFF8EE] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1A0A09] active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFlavour(f.id);
                      }}
                      disabled={isBoxFull}
                      className="px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white bg-[#E53925] hover:bg-[#C92328] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 4: Transparent Box Calculation Breakdown */}
        <div className="mb-14 rounded-3xl bg-white border-2 border-[#25100E]/15 p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25100E]/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E53925]">
                ✦ VALUE &amp; SAVINGS CALCULATION ✦
              </span>
              <h3 className="font-display text-lg sm:text-2xl font-black uppercase text-[#25100E] mt-0.5">
                {tier.title} Breakdown
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-[#FFF8EE] px-4 py-1.5 rounded-full border border-[#25100E]/10">
              <span className="text-xs font-bold text-[#522C28]/70">Effective Price:</span>
              <span className="font-display text-base font-black text-[#E53925]">
                ₹{(tier.price / selectedSize).toFixed(0)} / pack
              </span>
              <span className="text-xs text-[#522C28]/50 line-through">₹45 / pack</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
            <div className="bg-[#FFF8EE]/60 p-3.5 rounded-2xl border border-[#25100E]/08">
              <span className="text-[10px] font-bold uppercase text-[#522C28]/60 block">Packs Chosen</span>
              <span className="font-display text-base sm:text-lg font-black text-[#25100E] mt-0.5 block">
                {slots.length} / {selectedSize} Packs
              </span>
              <span className="text-[10px] text-[#522C28]/70">
                {isBoxFull ? "✅ Box fully packed!" : `Remaining to pack: ${selectedSize - slots.length}`}
              </span>
            </div>
            <div className="bg-[#FFF8EE]/60 p-3.5 rounded-2xl border border-[#25100E]/08">
              <span className="text-[10px] font-bold uppercase text-[#522C28]/60 block">Retail Value</span>
              <span className="font-display text-base sm:text-lg font-black text-[#522C28]/50 line-through mt-0.5 block">
                ₹{tier.originalPrice}
              </span>
              <span className="text-[10px] text-[#522C28]/70">{selectedSize} × ₹45 standard MRP</span>
            </div>
            <div className="bg-[#FFF8EE]/60 p-3.5 rounded-2xl border border-[#25100E]/08">
              <span className="text-[10px] font-bold uppercase text-[#522C28]/60 block">Bundle Savings</span>
              <span className="font-display text-base sm:text-lg font-black text-[#E53925] mt-0.5 block">
                -₹{tier.originalPrice - tier.price} ({tier.savings})
              </span>
              <span className="text-[10px] text-[#E53925] font-bold">Automatic box discount</span>
            </div>
            <div className="bg-[#25100E] p-3.5 rounded-2xl text-white">
              <span className="text-[10px] font-bold uppercase text-white/60 block">Final Box Total</span>
              <span className="font-display text-xl sm:text-2xl font-black text-[#FFCD3C] mt-0.5 block">
                ₹{tier.price}
              </span>
              <span className="text-[10px] text-white/80">
                {selectedSize >= 6 ? "FREE Shipping Included" : "+ Standard Delivery"}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Promise Banner */}
        <div className="rounded-3xl bg-[#25100E] text-[#FFF8EE] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🚚</span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#FFCD3C]">
                FRESHLY ROASTED TO ORDER
              </h3>
              <p className="text-xs sm:text-sm text-white/70 mt-0.5">
                Every custom box is hand-packed with freshly roasted makhana pouches and sealed for maximum crunch.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCD3C]">
                ZERO OIL FRYING
              </span>
              <p className="text-xs font-bold text-white">100% Guilt-Free Snacking</p>
            </div>
          </div>
        </div>

      </main>

      {/* BOTTOM STRAIGHT MARQUEE RIBBON */}
      <div className="relative z-20 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3.5 md:py-4 overflow-hidden select-none mb-20 sm:mb-24">
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

      {/* Floating Bottom Bar (Clear, Interactive, Unblocked) */}
      <aside aria-label="Build a box summary" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#522C28]/15 px-4 sm:px-8 py-3 sm:py-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left summary & Price Calculation */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl sm:text-2xl font-black text-[#25100E]">
                  ₹{tier.price}
                </span>
                <span className="text-xs text-[#522C28]/50 line-through font-semibold">
                  ₹{tier.originalPrice}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E53925] text-white text-[9px] font-black uppercase tracking-wider">
                  Save ₹{tier.originalPrice - tier.price} ({tier.savings})
                </span>
              </div>
              <p className="text-[11px] text-[#522C28]/70 font-semibold mt-0.5">
                {slots.length} of {selectedSize} packs chosen • <span className="text-[#E53925] font-black">₹{Math.round(tier.price / selectedSize)} / pack</span> • {tier.title}
              </p>
            </div>

            {/* Visual slots progress meter */}
            <div className="flex flex-col items-end sm:items-start gap-1">
              <div className="flex items-center gap-1">
                {[...Array(selectedSize)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                      i < slots.length ? "bg-[#E53925]" : "bg-[#522C28]/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono font-bold text-[#522C28]/60">
                {Math.round((slots.length / selectedSize) * 100)}% packed
              </span>
            </div>
          </div>

          {/* Right Action CTA & Auto-Fill */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {!isBoxFull && (
              <button
                type="button"
                onClick={() => {
                  const defaults = ["peri-peri", "cheddar-cheese", "pink-salt", "raw-makhana"];
                  setSlots((prev) => {
                    const next = [...prev];
                    let i = 0;
                    while (next.length < selectedSize) {
                      next.push(defaults[i % defaults.length]);
                      i++;
                    }
                    return next;
                  });
                }}
                className="px-3 sm:px-4 py-2.5 rounded-full bg-[#FFF8EE] hover:bg-[#FFEECB] border border-[#25100E]/20 text-[#25100E] font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 hidden min-[440px]:inline-flex items-center gap-1"
                title="Fill remaining slots automatically with best-selling flavours"
              >
                <span>⚡ Auto-Fill</span>
              </button>
            )}

            <button
              onClick={
                isBoxFull
                  ? handleAddBoxToCart
                  : () => {
                      const el = document.getElementById("flavour-picker");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
              }
              className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                isBoxFull
                  ? "bg-[#25100E] text-[#FFCD3C] hover:bg-[#1A0A09] hover:scale-105 ring-2 ring-[#FFCD3C]/70 shadow-[0_6px_20px_rgba(37,16,14,0.35)]"
                  : "bg-[#E53925] text-white hover:bg-[#C92328] hover:scale-102 shadow-[0_4px_16px_rgba(229,57,37,0.3)]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isBoxFull
                  ? `Add Custom Box to Cart • ₹${tier.price}`
                  : `Pack ${selectedSize - slots.length} More Pack${selectedSize - slots.length > 1 ? "s" : ""} (₹${tier.price})`}
              </span>
            </button>
          </div>

        </div>
      </aside>
    </div>
  );
}
