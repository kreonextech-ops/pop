"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Coins,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

interface SearchProduct {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  badge: string;
  emoji: string;
  image: string;
  isCombo: boolean;
  variants: { price: string }[];
}

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const { user, loading } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchProduct[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => searchInputRef.current?.focus(), 40);
    if (catalog.length === 0) {
      fetch("/api/catalog")
        .then((r) => r.json())
        .then((d) => {
          if (d.ok && Array.isArray(d.products)) {
            setCatalog(d.products);
          }
        })
        .catch(() => {});
    }
  }, [searchOpen, catalog.length]);

  const filteredProducts = searchQuery.trim()
    ? catalog.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.badge.toLowerCase().includes(q)
        );
      })
    : catalog.slice(0, 6);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#flavours", label: "Flavours" },
    { href: "/shop", label: "Shop All" },
    { href: "/#discover", label: "Play & Earn" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="w-full bg-[#FFF8EE]/95 sticky top-0 z-50 backdrop-blur-md border-b border-[#522C28]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Brand Logo */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-[#522C28] hover:bg-[#522C28]/5 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center group shrink-0">
            <img
              src="/pop-culture-logo.svg"
              alt="Pop Culture"
              className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-7 font-bold text-xs lg:text-sm text-[#522C28]">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors whitespace-nowrap ${
                isActive(item.href)
                  ? "text-[#D73B3A] underline decoration-[#FAC537] decoration-2 underline-offset-4"
                  : "hover:text-[#D73B3A]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search, Account / Login, Admin, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 text-[#522C28]">
          {/* Live Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-[#522C28]/5 hover:text-[#D73B3A] transition-colors cursor-pointer"
            aria-label="Search Products"
            title="Search flavours & combos"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Customer Account / Login */}
          {!loading && user ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-[#522C28]/15 hover:border-[#D73B3A] shadow-xs transition-all"
              title="My Account & Crunch Points"
            >
              <span className="w-5 h-5 rounded-full bg-[#FAC537] text-[#522C28] font-black text-[10px] flex items-center justify-center uppercase">
                {(user.fullName || user.email).charAt(0)}
              </span>
              <span className="hidden sm:inline text-xs font-extrabold max-w-[84px] truncate">
                {user.fullName.split(" ")[0]}
              </span>
              <span className="inline-flex items-center gap-0.5 bg-[#FFF8EE] text-[#D73B3A] px-1.5 py-0.5 rounded-full text-[10px] font-black border border-[#FAC537]">
                <Coins className="w-3 h-3" />
                {user.loyaltyPoints}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#522C28]/15 hover:border-[#D73B3A] hover:text-[#D73B3A] text-xs font-extrabold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Admin Console shortcut */}
          <Link
            href="/admin"
            title={user?.role === "admin" ? "Store Admin Console" : "Admin Login"}
            className={`p-2 rounded-full transition-colors ${
              pathname === "/admin"
                ? "bg-[#522C28] text-[#FAC537]"
                : "hover:bg-[#522C28]/5 text-[#522C28]/70 hover:text-[#D73B3A]"
            }`}
            aria-label="Admin Panel"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.3]" />
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative px-3 py-2 rounded-full bg-[#D73B3A] text-white hover:bg-[#FB0008] transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline text-[11px] font-black uppercase tracking-wide">
              Cart
            </span>
            <span className="min-w-[18px] h-[18px] px-1 bg-[#FAC537] text-[#522C28] text-[10px] font-black rounded-full flex items-center justify-center border border-[#522C28]">
              {totalCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar & Live Results */}
      {searchOpen && (
        <div className="border-t border-[#522C28]/10 bg-white/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 py-3.5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#522C28]/50 absolute left-3.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Peri Peri, Cheddar Cheese, Combo Boxes..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold text-[#522C28] focus:outline-none focus:border-[#D73B3A]"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 text-[#522C28]/50 hover:text-[#D73B3A]"
                aria-label="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {filteredProducts.map((p) => {
                  const price = p.variants?.[0]?.price || "40";
                  const dest = p.isCombo ? "/shop#combos" : `/product/${p.slug}`;
                  return (
                    <Link
                      key={p.id}
                      href={dest}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FFF8EE] border border-transparent hover:border-[#FAC537] transition-all"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-11 h-11 object-contain rounded-lg bg-[#FFF8EE] p-1 border border-[#522C28]/10"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-xs text-[#522C28] truncate">
                          {p.emoji} {p.title}
                        </p>
                        <p className="text-[11px] text-[#522C28]/65 truncate">{p.tagline}</p>
                      </div>
                      <span className="text-xs font-black text-[#D73B3A] shrink-0">
                        ₹{price}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-bold text-[#522C28]/60 mt-3 text-center py-2">
                No flavours matched &ldquo;{searchQuery}&rdquo;. Try{" "}
                <Link href="/shop" className="text-[#D73B3A] underline">
                  browsing all snacks
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#522C28]/10 bg-[#FFF8EE] px-4 py-4 space-y-2 shadow-lg">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-black ${
                isActive(item.href)
                  ? "bg-[#D73B3A] text-white"
                  : "text-[#522C28] hover:bg-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-[#522C28]/10 flex flex-col gap-2">
            {user ? (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white border border-[#FAC537] text-[#522C28]"
              >
                <span className="flex items-center gap-2 text-xs font-black">
                  <User className="w-4 h-4 text-[#D73B3A]" />
                  {user.fullName}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-[#D73B3A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {user.loyaltyPoints} pts
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#FAC537] text-[#522C28] text-xs font-black uppercase"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Join Crunch Club
              </Link>
            )}

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#522C28]/70 hover:bg-white"
            >
              <ShieldCheck className="w-4 h-4" />
              Store Admin Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
