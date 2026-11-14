"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Star,
  ChevronDown,
  ArrowRight,
  Flame,
  Leaf,
  Plus,
  Minus,
} from "lucide-react";
import { PRODUCTS, COMBOS, ProductDetails } from "@/data/products";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import type { StoreProduct } from "@/lib/store";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "peri-peri";
  const staticCombo =
    COMBOS[slug] ||
    (slug === "ultimate-trio-pack" ? COMBOS["trio-variety-pack"] : undefined) ||
    (slug === "trio-variety-pack" ? COMBOS["ultimate-trio-pack"] : undefined);
  const staticProduct: ProductDetails | undefined =
    PRODUCTS[slug] ||
    (staticCombo
      ? {
          slug: staticCombo.slug,
          id: staticCombo.id,
          numericId: staticCombo.numericId,
          variantIds: {
            single: staticCombo.variantId,
            trio: staticCombo.variantId + 1,
            party: staticCombo.variantId + 2,
          },
          name: staticCombo.name,
          badge: staticCombo.badge,
          emoji: staticCombo.emoji || "🍿",
          tagline: staticCombo.tagline,
          shortDesc: staticCombo.shortDesc,
          flavorProfile: {
            crunch: 5,
            spice: 4,
            tangy: 4,
            cheesiness: 4,
          },
          keyBenefits: [
            "Even Seasoning Distribution (Zero Lump Tech)",
            "100% Nitrogen-Flushed Foil Pouches",
            "Zero Cholesterol & Zero Palm Oil",
            "Locally Sourced from Bihar & Roasted in Siliguri",
          ],
          packImage: staticCombo.packImage,
          themeColor: staticCombo.themeColor,
          accentBg: staticCombo.accentBg,
          gradient: "from-[#F79E1B] to-[#ED0006]",
          bgSvg: "/patterns/chilli-pattern.svg",
          accentColor: staticCombo.themeColor,
          servingSize: "20g per pouch",
          ingredients:
            "Slow-Roasted Popped Lotus Seeds (Foxnuts / Makhana), Cold-Pressed Edible Oil Blend, Signature Artisan Spice Seasoning. No Added Sugar • Zero Trans Fats • Zero Palm Oil.",
          allergen: "MANUFACTURED IN A FACILITY THAT ALSO PROCESSES NUTS AND DAIRY.",
          disclaimer:
            "*The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. Store in a cool dry place away from direct sunlight.",
          borderAccentColor: staticCombo.themeColor,
          nutrition: [
            { label: "Energy", amount: "442 kcal", isBold: true },
            { label: "Protein", amount: "9.2g", isBold: true },
            { label: "Carbohydrates", amount: "67.4g" },
            { label: "Dietary Fibre", amount: "8.1g" },
            { label: "Total Fat", amount: "15.8g" },
            { label: "Cholesterol", amount: "0 mg", isBold: true },
          ],
          pricing: {
            single: {
              label: staticCombo.badge,
              count: staticCombo.packCountText,
              price: staticCombo.price,
              originalPrice: staticCombo.originalPrice,
              badge: staticCombo.savingsBadge || "SPECIAL BUNDLE",
            },
            trio: {
              label: `2 × ${staticCombo.name}`,
              count: `Double Bundle (${staticCombo.packCountText} × 2)`,
              price: Math.round(staticCombo.price * 1.9),
              originalPrice: staticCombo.originalPrice * 2,
              badge: "DOUBLE STASH",
            },
            party: {
              label: `3 × ${staticCombo.name}`,
              count: `Triple Stash (${staticCombo.packCountText} × 3)`,
              price: Math.round(staticCombo.price * 2.75),
              originalPrice: staticCombo.originalPrice * 3,
              badge: "BEST VALUE",
            },
          },
          faqs: [
            {
              q: "What flavours are included in this bundle?",
              a: staticCombo.includedFlavours.join(", "),
            },
            {
              q: "Are the packs individually sealed?",
              a: "Yes! Every single pack inside the bundle is individually nitrogen-flushed and airtight foil-sealed to guarantee maximum crunch freshness.",
            },
            {
              q: "What is the shelf life?",
              a: "9 months from the date of manufacture. Store in a cool, dry place.",
            },
          ],
          reviews: [
            {
              name: "Rohan M.",
              rating: 5,
              title: "Best variety pack ever!",
              comment: "Love getting all the flavours together. The masala is perfectly distributed with zero lumps.",
              date: "2 days ago",
            },
            {
              name: "Sneha K.",
              rating: 5,
              title: "Super crunchy & healthy",
              comment: "Kids and family finished the entire box in a weekend. Reordering again!",
              date: "1 week ago",
            },
          ],
        }
      : undefined);

  const [dynamicProduct, setDynamicProduct] = useState<ProductDetails | null>(
    staticProduct || null
  );
  const [loadingDynamic, setLoadingDynamic] = useState(!staticProduct);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.products)) {
          const found = (d.products as StoreProduct[]).find((p) => p.slug === slug);
          if (found) {
            if (staticProduct) {
              const v0 = found.variants[0];
              const singlePrice = v0 ? parseFloat(v0.price) : staticProduct.pricing.single.price;
              const trioPrice = found.variants[1]
                ? parseFloat(found.variants[1].price)
                : staticProduct.pricing.trio.price;
              const partyPrice = found.variants[2]
                ? parseFloat(found.variants[2].price)
                : staticProduct.pricing.party.price;
              setDynamicProduct({
                ...staticProduct,
                pricing: {
                  single: { ...staticProduct.pricing.single, price: singlePrice },
                  trio: { ...staticProduct.pricing.trio, price: trioPrice },
                  party: { ...staticProduct.pricing.party, price: partyPrice },
                },
              });
            } else {
              const template = Object.values(PRODUCTS)[0];
              const v0 = found.variants[0];
              const singlePrice = v0 ? parseFloat(v0.price) : 149;
              const singleOrig = v0 ? parseFloat(v0.compare_at_price) || singlePrice : singlePrice;
              setDynamicProduct({
                ...template,
                slug: found.slug,
                id: String(found.id),
                numericId: found.id,
                variantIds: {
                  single: v0?.id || found.id * 100 + 1,
                  trio: found.variants[1]?.id || found.id * 100 + 2,
                  party: found.variants[2]?.id || found.id * 100 + 3,
                },
                name: found.title,
                badge: found.badge || "✨ NEW FLAVOUR",
                emoji: found.emoji || "🍿",
                tagline: found.tagline || "Roasted Himalayan Makhana",
                shortDesc:
                  found.body_html?.replace(/<[^>]+>/g, "") ||
                  "Slow-roasted foxnuts seasoned in small batches for crunch.",
                themeColor: found.themeColor || "#D73B3A",
                accentBg: found.accentBg || "#D73B3A",
                packImage: found.image || "/packets/peri peri.svg",
                pricing: {
                  single: {
                    label: v0?.title || "1 Pouch (60g)",
                    count: "60g Pouch",
                    price: singlePrice,
                    originalPrice: singleOrig,
                  },
                  trio: {
                    label: found.variants[1]?.title || "Pack of 3",
                    count: "3 × 60g (180g)",
                    price: found.variants[1] ? parseFloat(found.variants[1].price) : singlePrice * 3,
                    originalPrice: singleOrig * 3,
                  },
                  party: {
                    label: found.variants[2]?.title || "Pack of 6",
                    count: "6 × 60g (360g)",
                    price: found.variants[2] ? parseFloat(found.variants[2].price) : singlePrice * 6,
                    originalPrice: singleOrig * 6,
                  },
                },
              });
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDynamic(false));
  }, [slug, staticProduct]);

  const product: ProductDetails | undefined = dynamicProduct || undefined;

  // Selected pack option: 'single' | 'trio' | 'party'
  const [selectedPack, setSelectedPack] = useState<"single" | "trio" | "party">("single");
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { addItem } = useCart();

  if (loadingDynamic) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] text-[#522C28]">
        <Navbar />
        <div className="max-w-4xl mx-auto py-24 text-center font-black uppercase text-sm">
          Loading flavour details...
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const packData = product.pricing[selectedPack];
  const totalPrice = packData.price * quantity;
  const originalTotalPrice = packData.originalPrice * quantity;
  const totalSavings = originalTotalPrice - totalPrice;

  const handleAddToCart = (andOpenDrawer = false) => {
    addItem(
      {
        variantId: product.variantIds[selectedPack],
        slug: product.slug,
        name: product.name,
        variantLabel: packData.label,
        price: packData.price,
        originalPrice: packData.originalPrice,
        image: product.packImage,
      },
      quantity,
      andOpenDrawer
    );
    if (!andOpenDrawer) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2400);
    }
  };

  const otherProducts = Object.values(PRODUCTS).filter((p) => p.slug !== product.slug);

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#25100E] font-sans antialiased selection:bg-[#E53925] selection:text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/#flavours"
          className="inline-flex items-center gap-2 text-xs font-black text-[#522C28]/75 hover:text-[#D73B3A] transition-colors uppercase tracking-wider group"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:-translate-x-1" />
          <span>Back to All Flavours</span>
        </Link>
      </div>

      {/* Added to cart toast notification */}
      {addedToast && (
        <div className="animate-toast-in fixed bottom-6 right-6 z-50 bg-[#25100E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-[#FFCD3C]">
          <span className="text-xl">🍿</span>
          <div>
            <p className="text-xs font-black uppercase text-[#FFCD3C]">Added to Munch Box!</p>
            <p className="text-[11px] text-white/90">
              {quantity} × {product.name} ({packData.label})
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT HERO SHOWCASE
          ========================================================================= */}
      <section className="relative w-full pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
        {/* Subtle decorative background blob matching product theme */}
        <div
          style={{ backgroundColor: product.themeColor }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        />
        <div
          style={{ backgroundColor: product.themeColor }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb & Live Flavour Switcher Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-[#522C28]/10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#522C28]/70">
              <Link href="/" className="hover:text-[#25100E]">Home</Link>
              <span>/</span>
              <Link href="/#flavours" className="hover:text-[#25100E]">Flavours</Link>
              <span>/</span>
              <span className="text-[#25100E] font-black">{product.name}</span>
            </div>

            {/* Quick Switch Flavour Pills */}
            <div className="inline-flex items-center p-1 rounded-full bg-white/90 shadow-sm border border-[#25100E]/15">
              {Object.values(PRODUCTS).map((p) => {
                const isCurrent = p.slug === product.slug;
                return (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      isCurrent
                        ? "bg-[#25100E] text-[#FFCD3C] shadow-sm scale-102"
                        : "text-[#522C28] hover:text-[#25100E] hover:bg-[#FFF3E3]"
                    }`}
                  >
                    <span>{p.badge}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: PACKET STAGE & BADGES */}
            <div className="lg:col-span-6 flex flex-col items-center">
              
              {/* Product Packet Presentation Stage */}
              <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-gradient-to-b from-white to-[#FDF2E8] p-8 flex items-center justify-center border border-[#522C28]/15 shadow-[0_12px_36px_rgba(37,16,14,0.08)] overflow-hidden group">
                
                {/* Flavour color glow behind pouch */}
                <div
                  style={{ backgroundColor: product.themeColor }}
                  className="absolute inset-16 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"
                />

                {/* Main Product Pouch Image */}
                <img
                  src={product.packImage}
                  alt={product.name}
                  className="relative z-10 w-auto h-full max-h-[360px] object-contain drop-shadow-[0_20px_35px_rgba(120,40,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
                />

                {/* Floating Micro-badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-[#25100E] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <span>✨</span>
                    <span>SLOW ROASTED</span>
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>VEG</span>
                  </span>
                </div>
              </div>

              {/* 4 Health Pillars Grid under Pouch */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-[460px] mt-4">
                {[
                  { icon: "✨", title: "No Preservatives", sub: "Clean & Pure" },
                  { icon: "🔥", title: "Never Fried", sub: "Slow-Roasted" },
                  { icon: "🌾", title: "Gluten Free", sub: "Guilt-Free Bite" },
                  { icon: "🛡️", title: "0g Trans Fat", sub: "Heart Healthy" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-2xl bg-white border border-[#25100E]/10 text-center shadow-xs flex flex-col items-center"
                  >
                    <span className="text-xl mb-0.5">{item.icon}</span>
                    <span className="text-[11px] font-black uppercase text-[#25100E]">{item.title}</span>
                    <span className="text-[9px] text-[#522C28]/70 font-semibold">{item.sub}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: DETAILS, PRICING & BUY ACTIONS */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Product Name & Tagline */}
              <div className="mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#E53925]">
                  ✦ Pop Culture Foxnuts ✦
                </span>
                <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#25100E] mt-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  {product.name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#E53925] mt-1">
                  {product.tagline}
                </p>
              </div>

              {/* Star Rating & Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-black text-[#25100E]">4.9</span>
                <span className="text-xs text-[#522C28]/70 font-semibold">(420+ Verified Snackers)</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A201B] font-medium leading-relaxed mb-6">
                {product.shortDesc}
              </p>

              {/* Pack Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#25100E]">
                    Select Pack Size:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Free delivery above ₹699+
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {(["single", "trio", "party"] as const).map((packKey) => {
                    const option = product.pricing[packKey];
                    const isSelected = selectedPack === packKey;
                    return (
                      <button
                        key={packKey}
                        type="button"
                        onClick={() => setSelectedPack(packKey)}
                        className={`relative p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-[transform,border-color,background-color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-98 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#25100E] bg-white shadow-md ring-2 ring-[#FFCD3C]/60 scale-102"
                            : "border-[#522C28]/20 bg-white/70 hover:bg-white hover:border-[#522C28]/40"
                        }`}
                      >
                        {option.badge && (
                          <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-[#E53925] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                            {option.badge}
                          </span>
                        )}
                        <div>
                          <p className="text-xs sm:text-sm font-black uppercase text-[#25100E]">
                            {option.label}
                          </p>
                          <p className="text-[10px] text-[#522C28]/70 font-semibold mt-0.5">
                            {option.count}
                          </p>
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-black text-[#25100E]">
                            ₹{option.price}
                          </span>
                          <span className="text-[10px] text-[#522C28]/50 line-through font-bold">
                            ₹{option.originalPrice}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Price Calculation */}
              <div className="flex items-center gap-4 mb-6 p-3.5 rounded-2xl bg-white border border-[#25100E]/15">
                <span className="text-xs font-black uppercase text-[#25100E]">Quantity:</span>
                <div className="flex items-center border-2 border-[#25100E] rounded-full overflow-hidden bg-[#FFF8EE]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 sm:p-2 hover:bg-[#25100E] hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <span className="px-3.5 text-xs sm:text-sm font-black text-[#25100E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 sm:p-2 hover:bg-[#25100E] hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                <div className="ml-auto text-right">
                  <div className="text-base sm:text-xl font-black text-[#25100E]">
                    ₹{totalPrice}
                  </div>
                  {totalSavings > 0 && (
                    <div className="text-[10px] text-emerald-700 font-bold">
                      You save ₹{totalSavings}!
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="w-full sm:flex-1 py-3 sm:py-3.5 rounded-full bg-[#25100E] text-[#FFCD3C] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:bg-[#1A0A09] hover:scale-102 active:scale-98 transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#FFCD3C]/60"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to Cart (₹{totalPrice})</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  style={{ backgroundColor: product.themeColor }}
                  className="w-full sm:flex-1 py-3 sm:py-3.5 rounded-full text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-[transform,box-shadow,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now ⚡</span>
                </button>
              </div>

              {/* Trust & Delivery Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#522C28]/10 text-center text-[#522C28]/80">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#E53925] mb-1" />
                  <span className="text-[10px] font-bold uppercase text-[#25100E]">Fast Dispatch</span>
                  <span className="text-[9px]">Ships within 24h</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#2D6A4F] mb-1" />
                  <span className="text-[10px] font-bold uppercase text-[#25100E]">100% Quality</span>
                  <span className="text-[9px]">Freshness Sealed</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-[#F79E1B] mb-1" />
                  <span className="text-[10px] font-bold uppercase text-[#25100E]">Easy Support</span>
                  <span className="text-[9px]">WhatsApp Hotline</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          AUTHENTIC NUTRITIONAL FACTS & INGREDIENTS SECTION (MATCHING PACKAGING)
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#FDF2E8] border-t border-b border-[#522C28]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#E53925]">
              ✦ TRANSPARENT NUTRITION ✦
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#25100E] mt-1">
              Ingredients & Nutritional Facts
            </h2>
            <p className="text-xs sm:text-sm text-[#522C28]/80 font-medium mt-1">
              Clean, honest snacking. Exactly what goes into your body—no hidden fillers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: INGREDIENTS & ALLERGENS CARDS */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Ingredients Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#25100E]/15 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🥣</span>
                  <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#25100E]">
                    Ingredients List
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed text-[#3D1A16] whitespace-pre-line bg-[#FFF8EE] p-4 rounded-2xl border border-[#25100E]/10">
                  {product.ingredients}
                </p>
              </div>

              {/* Allergen & Clean Promise Warning Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm flex items-start gap-4">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-900">
                    Allergen Declaration
                  </h4>
                  <p className="text-xs font-bold text-amber-800 mt-1 uppercase tracking-wide">
                    {product.allergen}
                  </p>
                  <p className="text-[11px] text-amber-700/90 mt-1 font-medium">
                    Manufactured in a certified facility adhering to strict FSSAI quality protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: EXACT PACKAGING NUTRITIONAL FACTS LABEL */}
            <div className="lg:col-span-5 flex justify-center">
              
              {/* Outer border container matching packaging accent color */}
              <div
                style={{ borderColor: product.borderAccentColor }}
                className="w-full max-w-[380px] bg-white p-4 sm:p-5 rounded-2xl border-[10px] shadow-xl text-black font-sans"
              >
                {/* Header */}
                <div className="border-b-[5px] border-black pb-1 mb-1">
                  <h3 className="font-black text-2xl sm:text-3xl tracking-tight uppercase leading-none font-sans">
                    NUTRITIONAL FACTS
                  </h3>
                  <p className="text-right text-xs sm:text-sm font-bold mt-1">
                    Serving Size: {product.servingSize}
                  </p>
                </div>

                {/* Table Column Titles */}
                <div className="flex justify-between items-baseline py-1 border-b-[3px] border-black text-xs font-black">
                  <span>Amount per 100g*</span>
                  <span>%Daily Value**</span>
                </div>

                {/* Nutrition Rows */}
                <div className="divide-y divide-gray-300 text-xs">
                  {product.nutrition.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center py-1 ${
                        item.isBold ? "font-bold text-black" : "text-gray-800"
                      }`}
                    >
                      <span className={item.isIndent ? "pl-4 text-gray-700" : ""}>
                        {item.label} {item.amount}
                      </span>
                      {item.dailyValue && (
                        <span className="font-bold text-black">{item.dailyValue}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* FSSAI Disclaimer Footer */}
                <div className="border-t-[4px] border-black pt-2 mt-2">
                  <p className="text-[9px] sm:text-[10px] text-gray-600 font-medium leading-tight">
                    {product.disclaimer}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          HEALTH COMPARISON MATRIX: POP CULTURE VS TRADITIONAL SNACKS
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#FFF8EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#25100E]">
              Why Pop Culture Wins Every Time
            </h3>
            <p className="text-xs sm:text-sm text-[#522C28]/80 font-medium mt-1">
              Compare our slow-roasted lotus pops with regular fried snacks.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#25100E]/15 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#25100E] text-white">
                  <th className="p-3.5 sm:p-4 font-black uppercase">Per 100g Comparison</th>
                  <th className="p-3.5 sm:p-4 font-black uppercase text-[#FFCD3C] bg-[#1A0A09]">
                    🍿 Pop Culture
                  </th>
                  <th className="p-3.5 sm:p-4 font-bold uppercase text-gray-300">🥔 Fried Chips</th>
                  <th className="p-3.5 sm:p-4 font-bold uppercase text-gray-300">🍿 Butter Popcorn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#522C28]/10 font-medium">
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-[#25100E]">Cooking Method</td>
                  <td className="p-3.5 sm:p-4 font-black text-emerald-700 bg-emerald-50/50">
                    Slow Roasted
                  </td>
                  <td className="p-3.5 sm:p-4 text-red-700">Deep Fried</td>
                  <td className="p-3.5 sm:p-4 text-amber-700">Oil / Air Popped</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-[#25100E]">Trans Fat</td>
                  <td className="p-3.5 sm:p-4 font-black text-emerald-700 bg-emerald-50/50">0g Zero</td>
                  <td className="p-3.5 sm:p-4 text-red-700">High / Present</td>
                  <td className="p-3.5 sm:p-4 text-amber-700">Moderate</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-[#25100E]">Plant Protein</td>
                  <td className="p-3.5 sm:p-4 font-black text-emerald-700 bg-emerald-50/50">
                    7.8g – 10g
                  </td>
                  <td className="p-3.5 sm:p-4 text-gray-600">~5g</td>
                  <td className="p-3.5 sm:p-4 text-gray-600">~6g</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-[#25100E]">Guilt Factor</td>
                  <td className="p-3.5 sm:p-4 font-black text-emerald-700 bg-emerald-50/50">
                    0% Guilt Free
                  </td>
                  <td className="p-3.5 sm:p-4 text-red-700">Heavy & Greasy</td>
                  <td className="p-3.5 sm:p-4 text-amber-700">High Butter Bloat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
          ========================================================================= */}
      <section className="w-full py-12 bg-[#FDF2E8] border-t border-[#522C28]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#25100E]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {product.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#25100E]/15 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left font-black text-xs sm:text-sm text-[#25100E] flex items-center justify-between cursor-pointer hover:bg-[#FFF8EE]/50 transition-colors duration-200"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 stroke-[2.5] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? "rotate-180 text-[#E53925]" : "text-[#522C28]"
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#4A201B] font-medium leading-relaxed border-t border-[#25100E]/10 pt-3">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          OTHER FLAVOURS YOU'LL LOVE
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#FFF8EE] border-t border-[#522C28]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#E53925]">
              ✦ EXPLORE MORE CRUNCH ✦
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#25100E] mt-1">
              Other Flavours You’ll Love
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {otherProducts.map((other) => (
              <div
                key={other.slug}
                className="p-6 rounded-3xl bg-white border border-[#25100E]/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#FFF8EE] text-[#25100E] text-xs font-black uppercase tracking-wider border border-[#25100E]/15">
                    {other.badge}
                  </span>
                  <span className="text-xs font-black text-[#25100E]">From ₹{other.pricing.single.price}</span>
                </div>

                <div className="h-44 flex items-center justify-center my-2">
                  <img
                    src={other.packImage}
                    alt={other.name}
                    className="h-full w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </div>

                <div className="mt-4">
                  <h4 className="font-display text-xl font-black uppercase text-[#25100E]">
                    {other.name}
                  </h4>
                  <p className="text-xs text-[#522C28]/70 font-semibold line-clamp-2 mt-1">
                    {other.tagline}
                  </p>
                  <Link
                    href={`/product/${other.slug}`}
                    className="mt-4 w-full py-2.5 rounded-full bg-[#25100E] text-[#FFCD3C] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#1A0A09] transition-colors"
                  >
                    <span>View Flavour</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM STRAIGHT MARQUEE RIBBON
          ========================================================================= */}
      <div className="relative z-20 w-full bg-gradient-to-r from-[#C92328] via-[#E23E3E] to-[#C92328] border-t-2 border-[#FFF8EE]/40 border-b-2 border-[#1A0A09]/20 shadow-lg py-2 sm:py-3.5 md:py-4 overflow-hidden select-none">
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
