"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Gift,
  Flame,
  Leaf,
  Filter,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { PRODUCTS, COMBOS, ProductDetails, ComboItem } from "@/data/products";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import type { StoreProduct } from "@/lib/store";

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "flavours" | "combos">("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customProducts, setCustomProducts] = useState<StoreProduct[]>([]);
  const { totalCount, openCart, addItem } = useCart();

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.products)) {
          setCustomProducts(data.products);
        }
      })
      .catch(() => {
        // fallback to static PRODUCTS & COMBOS
      });
  }, []);

  const staticProductSlugs = new Set(Object.keys(PRODUCTS));
  const staticComboSlugs = new Set(Object.keys(COMBOS));

  const extraStoreFlavours = customProducts.filter(
    (p) => !p.isCombo && !staticProductSlugs.has(p.slug)
  );
  const extraStoreCombos = customProducts.filter(
    (p) => p.isCombo && !staticComboSlugs.has(p.slug)
  );

  // Overlay live admin prices if updated in store
  const liveBySlug = new Map(customProducts.map((p) => [p.slug, p]));

  const productList: ProductDetails[] = [
    ...Object.values(PRODUCTS).map((p) => {
      const live = liveBySlug.get(p.slug);
      if (!live || !live.variants[0]) return p;
      const singlePrice = parseFloat(live.variants[0].price) || p.pricing.single.price;
      const trioPrice = live.variants[1] ? parseFloat(live.variants[1].price) : p.pricing.trio.price;
      const partyPrice = live.variants[2] ? parseFloat(live.variants[2].price) : p.pricing.party.price;
      return {
        ...p,
        pricing: {
          single: { ...p.pricing.single, price: singlePrice },
          trio: { ...p.pricing.trio, price: trioPrice },
          party: { ...p.pricing.party, price: partyPrice },
        },
      };
    }),
    ...extraStoreFlavours.map((sp) => {
      const v0 = sp.variants[0];
      const price = v0 ? parseFloat(v0.price) : 149;
      const orig = v0 ? parseFloat(v0.compare_at_price) : price;
      return {
        ...Object.values(PRODUCTS)[0],
        slug: sp.slug,
        id: String(sp.id),
        numericId: sp.id,
        variantIds: {
          single: v0?.id || sp.id * 100 + 1,
          trio: sp.variants[1]?.id || sp.id * 100 + 2,
          party: sp.variants[2]?.id || sp.id * 100 + 3,
        },
        name: sp.title,
        badge: sp.badge,
        emoji: sp.emoji,
        tagline: sp.tagline,
        shortDesc: sp.body_html.replace(/<[^>]+>/g, ""),
        themeColor: sp.themeColor,
        accentBg: sp.accentBg,
        packImage: sp.image,
        pricing: {
          single: { label: v0?.title || "1 Pouch (60g)", count: "60g Pouch", price, originalPrice: orig },
          trio: { label: "Pack of 3", count: "3 × 60g (180g)", price: price * 3, originalPrice: orig * 3 },
          party: { label: "Pack of 6", count: "6 × 60g (360g)", price: price * 6, originalPrice: orig * 6 },
        },
      };
    }),
  ];

  const comboList: ComboItem[] = [
    ...Object.values(COMBOS).map((c) => {
      const live = liveBySlug.get(c.slug);
      if (!live || !live.variants[0]) return c;
      return {
        ...c,
        price: parseFloat(live.variants[0].price) || c.price,
      };
    }),
    ...extraStoreCombos.map((sp) => {
      const v0 = sp.variants[0];
      return {
        slug: sp.slug,
        id: String(sp.id),
        numericId: sp.id,
        variantId: v0?.id || sp.id * 100 + 1,
        name: sp.title,
        badge: sp.badge,
        emoji: sp.emoji,
        tagline: sp.tagline,
        shortDesc: sp.body_html.replace(/<[^>]+>/g, ""),
        packImage: sp.image,
        secondaryImage: sp.secondaryImage,
        includedFlavours: sp.includedFlavours || [],
        themeColor: sp.themeColor,
        accentBg: sp.accentBg,
        price: v0 ? parseFloat(v0.price) : 115,
        originalPrice: v0 ? parseFloat(v0.compare_at_price) : 135,
        savingsBadge: "NEW COMBO",
        rating: 4.9,
        reviewsCount: 1,
        packCountText: sp.packCountText || v0?.title || "Combo Box",
      };
    }),
  ];

  const handleAddToCart = (item: {
    variantId: number;
    slug: string;
    name: string;
    variantLabel: string;
    price: number;
    originalPrice?: number;
    image: string;
  }) => {
    addItem(item, 1, false);
    setToastMessage(`Added 1 × ${item.name} (₹${item.price}) to your cart! 🍿`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const sortedProducts = [...productList].sort((a, b) => {
    if (sortBy === "price-asc") return a.pricing.single.price - b.pricing.single.price;
    if (sortBy === "price-desc") return b.pricing.single.price - a.pricing.single.price;
    return 0;
  });

  const sortedCombos = [...comboList].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] font-sans antialiased selection:bg-[#D73B3A] selection:text-white">
      <Navbar />

      {/* Floating Cart Notification Toast */}
      {toastMessage && (
        <div className="animate-toast-in fixed bottom-6 right-6 z-50 bg-[#25100E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-[#FAC537]">
          <span className="text-xl">✨</span>
          <div>
            <p className="text-xs font-black uppercase text-[#FAC537]">Munch Box Updated!</p>
            <p className="text-[11px] text-white/90 font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          HERO BANNER & TRUST TICKER
          ========================================================================= */}
      <section className="relative w-full pt-8 pb-10 sm:pt-14 sm:pb-14 bg-gradient-to-b from-[#FFF3E3] to-[#FFF8EE] border-b border-[#522C28]/10 text-center overflow-hidden">
        {/* Subtle Decorative Background Accents */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#D73B3A]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#FAC537]/15 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D73B3A]/10 text-[#D73B3A] text-[11px] font-black uppercase tracking-widest border border-[#D73B3A]/20 mb-3">
            <span>✦</span>
            <span>ALL NATURAL ROASTED FOXNUTS</span>
            <span>✦</span>
          </span>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#25100E] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            THE MUNCH SHOP
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-[#522C28]/85 font-semibold max-w-xl mx-auto mt-2 leading-relaxed">
            Small bites, big goodness. Explore our individual signature flavours and value-packed
            combo boxes—slow-roasted to crunchy perfection.
          </p>

          {/* 4 Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 mt-6 pt-5 border-t border-[#522C28]/10 text-[10px] sm:text-xs font-black uppercase text-[#522C28]">
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-[#522C28]/10 shadow-2xs">
              <span className="text-[#3CA837]">✔</span> 100% Slow-Roasted, Never Fried
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-[#522C28]/10 shadow-2xs">
              <span className="text-[#3CA837]">✔</span> 0g Trans Fat & Gluten Free
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-[#522C28]/10 shadow-2xs">
              <span className="text-[#3CA837]">✔</span> Free Delivery Above ₹699+
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-[#522C28]/10 shadow-2xs">
              <span className="text-[#3CA837]">✔</span> Ships within 24 Hours
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FILTER & SORT BAR
          ========================================================================= */}
      <section className="sticky top-0 z-30 bg-[#FFF8EE]/95 backdrop-blur-md border-b border-[#522C28]/10 py-3 sm:py-4 transition-[box-shadow] duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#522C28]/15 shadow-xs w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#25100E] text-[#FAC537] shadow-xs"
                  : "text-[#522C28] hover:text-[#25100E] hover:bg-[#FFF3E3]"
              }`}
            >
              All Items ({productList.length + comboList.length})
            </button>
            <button
              onClick={() => setActiveFilter("flavours")}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 cursor-pointer ${
                activeFilter === "flavours"
                  ? "bg-[#25100E] text-[#FAC537] shadow-xs"
                  : "text-[#522C28] hover:text-[#25100E] hover:bg-[#FFF3E3]"
              }`}
            >
              Flavours ({productList.length})
            </button>
            <button
              onClick={() => setActiveFilter("combos")}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 cursor-pointer ${
                activeFilter === "combos"
                  ? "bg-[#25100E] text-[#FAC537] shadow-xs"
                  : "text-[#522C28] hover:text-[#25100E] hover:bg-[#FFF3E3]"
              }`}
            >
              Combos & Bundles ({comboList.length})
            </button>
          </div>

          {/* Results Summary + Sort Selector */}
          <div className="flex items-center gap-3 text-xs font-bold text-[#522C28]/70">
            <span>
              Showing{" "}
              <span className="font-black text-[#25100E]">
                {activeFilter === "all"
                  ? sortedProducts.length + sortedCombos.length
                  : activeFilter === "flavours"
                  ? sortedProducts.length
                  : sortedCombos.length}
              </span>{" "}
              tasty picks
            </span>
            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
              }
              className="bg-white border border-[#522C28]/20 rounded-full px-3 py-1.5 text-xs font-black text-[#522C28] focus:outline-none focus:border-[#D73B3A]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PRODUCT LISTINGS GRID
          ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* SECTION 1: COMBOS & VALUE BUNDLES (Shown if "all" or "combos") */}
        {(activeFilter === "all" || activeFilter === "combos") && (
          <div className="mb-14 sm:mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#522C28]/10">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
                  ✦ VALUE PACKS ✦
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#25100E] mt-0.5">
                  Combos & Variety Bundles
                </h2>
              </div>
              <span className="text-xs font-bold text-[#3CA837] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                Save up to 22% on bundles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {sortedCombos.map((combo) => (
                <div
                  key={combo.slug}
                  className="rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 will-change-transform"
                >
                  {/* Top Badge Strip */}
                  <div className="p-5 pb-0 flex items-start justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#FFF8EE] text-[#25100E] text-[11px] font-black uppercase tracking-wider border border-[#25100E]/15">
                      {combo.badge}
                    </span>
                    {combo.savingsBadge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D73B3A] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        {combo.savingsBadge}
                      </span>
                    )}
                  </div>

                  {/* Packet Showcase Image Stage */}
                  <div className="relative h-56 sm:h-64 flex items-center justify-center p-4 my-2">
                    <div
                      style={{ backgroundColor: combo.themeColor }}
                      className="absolute inset-8 rounded-full opacity-15 blur-2xl group-hover:opacity-25 transition-opacity"
                    />

                    {/* Dual or Single Presentation */}
                    <div className="relative flex items-center justify-center">
                      <img
                        src={combo.packImage}
                        alt={combo.name}
                        className="h-44 sm:h-52 w-auto object-contain drop-shadow-xl z-10 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      {combo.secondaryImage && (
                        <img
                          src={combo.secondaryImage}
                          alt=""
                          className="h-36 sm:h-44 w-auto object-contain drop-shadow-lg -ml-10 z-0 opacity-80 group-hover:opacity-95 transition-opacity"
                        />
                      )}
                    </div>
                  </div>

                  {/* Details & Actions */}
                  <div className="p-5 sm:p-6 bg-[#FFF8EE]/60 border-t border-[#522C28]/10 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-black text-[#25100E]">{combo.rating}</span>
                        <span className="text-[11px] text-[#522C28]/60 font-semibold">
                          ({combo.reviewsCount} reviews)
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-black uppercase text-[#25100E] leading-snug">
                        {combo.name}
                      </h3>

                      <p className="text-xs font-bold text-[#D73B3A] mt-1">
                        {combo.tagline}
                      </p>

                      <p className="text-xs text-[#522C28]/80 font-medium mt-2 leading-relaxed line-clamp-2">
                        {combo.shortDesc}
                      </p>

                      {/* Included Flavour Pills */}
                      <div className="mt-3.5 pt-3 border-t border-[#522C28]/10 flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#522C28]/70">
                          Inside the Box:
                        </span>
                        {combo.includedFlavours.map((item, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-bold text-[#25100E] flex items-center gap-1"
                          >
                            <span className="text-[#3CA837]">✔</span> {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="mt-5 pt-4 border-t border-[#522C28]/15 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#25100E]">
                            ₹{combo.price}
                          </span>
                          <span className="text-xs text-[#522C28]/50 line-through font-bold">
                            ₹{combo.originalPrice}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#522C28]/70 font-semibold">
                          {combo.packCountText}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleAddToCart({
                            variantId: combo.variantId,
                            slug: combo.slug,
                            name: combo.name,
                            variantLabel: combo.packCountText,
                            price: combo.price,
                            originalPrice: combo.originalPrice,
                            image: combo.packImage,
                          })
                        }
                        className="px-4 py-2.5 rounded-full bg-[#25100E] text-[#FAC537] hover:bg-[#1A0A09] font-black text-xs uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-[#FAC537]/50"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add Box</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: INDIVIDUAL SIGNATURE FLAVOURS (Shown if "all" or "flavours") */}
        {(activeFilter === "all" || activeFilter === "flavours") && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#522C28]/10">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
                  ✦ SIGNATURE POUCHES ✦
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#25100E] mt-0.5">
                  Single Flavours & Packs
                </h2>
              </div>
              <span className="text-xs font-bold text-[#522C28]/70 hidden sm:inline-block">
                Choose single pouch, 3-pack, or 6-pack box
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {sortedProducts.map((product) => (
                <div
                  key={product.slug}
                  className="rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 will-change-transform"
                >
                  {/* Top Badge Strip */}
                  <div className="p-5 pb-0 flex items-start justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#FFF8EE] text-[#25100E] text-[11px] font-black uppercase tracking-wider border border-[#25100E]/15">
                      {product.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>100% ROASTED</span>
                    </span>
                  </div>

                  {/* Packet Showcase Image Stage */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative h-56 sm:h-64 flex items-center justify-center p-4 my-2 cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: product.themeColor }}
                      className="absolute inset-8 rounded-full opacity-15 blur-2xl group-hover:opacity-25 transition-opacity"
                    />
                    <img
                      src={product.packImage}
                      alt={product.name}
                      className="h-44 sm:h-52 w-auto object-contain drop-shadow-xl z-10 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />
                  </Link>

                  {/* Details & Actions */}
                  <div className="p-5 sm:p-6 bg-[#FFF8EE]/60 border-t border-[#522C28]/10 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-black text-[#25100E]">4.9</span>
                        <span className="text-[11px] text-[#522C28]/60 font-semibold">
                          (420+ reviews)
                        </span>
                      </div>

                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-display text-2xl font-black uppercase text-[#25100E] hover:text-[#D73B3A] transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs font-bold text-[#D73B3A] mt-1">
                        {product.tagline}
                      </p>

                      <p className="text-xs text-[#522C28]/80 font-medium mt-2 leading-relaxed line-clamp-2">
                        {product.shortDesc}
                      </p>

                      {/* Health Matrix Tag Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#522C28]/10">
                        {product.keyBenefits.slice(0, 3).map((benefit, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white border border-[#522C28]/10 text-[10px] font-bold text-[#25100E]"
                          >
                            ✦ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-[#522C28]/15">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[#25100E]">
                              ₹{product.pricing.single.price}
                            </span>
                            <span className="text-xs text-[#522C28]/50 line-through font-bold">
                              ₹{product.pricing.single.originalPrice}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#522C28]/70 font-semibold">
                            {product.pricing.single.count} (Or get 3-pack for ₹{product.pricing.trio.price})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleAddToCart({
                              variantId: product.variantIds.single,
                              slug: product.slug,
                              name: product.name,
                              variantLabel: product.pricing.single.label,
                              price: product.pricing.single.price,
                              originalPrice: product.pricing.single.originalPrice,
                              image: product.packImage,
                            })
                          }
                          className="flex-1 py-2.5 rounded-full bg-[#25100E] text-[#FAC537] hover:bg-[#1A0A09] font-black text-xs uppercase tracking-wider shadow-sm hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer ring-2 ring-[#FAC537]/50"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add</span>
                        </button>

                        <Link
                          href={`/product/${product.slug}`}
                          className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8EE] text-[#25100E] border-2 border-[#25100E]/20 hover:border-[#25100E] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            CUSTOM BUNDLE BUILDER TEASER BANNER
            ========================================================================= */}
        <section className="mt-16 sm:mt-24 rounded-3xl bg-[#25100E] text-[#FFF8EE] p-8 sm:p-12 relative overflow-hidden border-4 border-[#FAC537] shadow-xl text-center sm:text-left">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-[#D73B3A] text-white text-[11px] font-black uppercase tracking-widest inline-block mb-3">
              ✦ BUILD YOUR OWN CRUNCH BOX ✦
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#FAC537] leading-tight">
              Want Custom Flavour Ratios?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/85 font-medium mt-2 leading-relaxed">
              Mix and match your favorite pouches. Pick any 6 or 12 packs and get an instant
              20% discount plus free express delivery!
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link
                href="/product/peri-peri"
                className="px-6 py-3 rounded-full bg-[#FAC537] text-[#25100E] font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:bg-white transition-colors"
              >
                <span>Pick Flavours & Save 20%</span>
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/30 transition-colors"
              >
                <span>Back to Homepage</span>
              </Link>
            </div>
          </div>

          {/* Decorative Floaters */}
          <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center gap-3 pointer-events-none opacity-90">
            <img
              src="/packets/peri peri.svg"
              alt=""
              className="h-44 w-auto object-contain drop-shadow-2xl -rotate-6"
            />
            <img
              src="/packets/cheese.svg"
              alt=""
              className="h-52 w-auto object-contain drop-shadow-2xl z-10"
            />
            <img
              src="/packets/pink-salt-pouch.png"
              alt=""
              className="h-48 w-auto object-contain drop-shadow-2xl rotate-3"
            />
            <img
              src="/packets/raw-makhana-pouch.png"
              alt=""
              className="h-44 w-auto object-contain drop-shadow-2xl rotate-6"
            />
          </div>
        </section>

      </main>

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
