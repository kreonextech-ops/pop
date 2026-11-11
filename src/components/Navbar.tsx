"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  Package,
  UserCircle2,
  LayoutDashboard,
  Gamepad2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { startGoogleOAuth } from "@/lib/supabaseBrowser";

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

const CRYSTAL_NAV = {
  header:
    "bg-gradient-to-b from-white/85 via-[#FFF8EE]/76 to-[#F5E7DA]/74 backdrop-blur-md border-b border-[#D73B3A]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_24px_rgba(82,44,40,0.09)]",
  glossOverlay:
    "bg-gradient-to-b from-white/60 via-white/15 to-transparent",
  logoWrap: "",
  navText: "text-[#522C28]",
  navHover: "hover:text-[#D73B3A]",
  navActive: "text-[#D73B3A] underline decoration-[#FAC537] decoration-2 underline-offset-4",
  iconBtn:
    "bg-white/60 hover:bg-white/90 border-white/80 text-[#522C28] hover:text-[#D73B3A]",
  pillIdle:
    "bg-white/65 hover:bg-white/95 border-[#522C28]/15 text-[#522C28] hover:border-[#D73B3A]",
  pillActive: "bg-[#25100E] text-[#FAC537] border-[#25100E]",
  cartBtn: "bg-[#D73B3A] hover:bg-[#FB0008] text-white",
  cartBadge: "bg-[#FAC537] text-[#522C28] border-[#522C28]",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount, openCart } = useCart();
  const { user, loading, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchProduct[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  const t = CRYSTAL_NAV;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
    setIsNavVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollYRef.current = Math.max(0, window.scrollY || 0);
    let rafId: number | null = null;

    const updateVisibility = () => {
      rafId = null;
      const currentY = Math.max(0, window.scrollY || 0);
      if (currentY <= 40) {
        setIsNavVisible((prev) => (prev ? prev : true));
        lastScrollYRef.current = currentY;
        return;
      }

      const diff = currentY - lastScrollYRef.current;
      if (Math.abs(diff) < 6) return;

      if (diff > 0 && currentY > 72) {
        setIsNavVisible((prev) => (prev ? false : prev));
      } else if (diff < 0) {
        setIsNavVisible((prev) => (prev ? prev : true));
      }
      lastScrollYRef.current = currentY;
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [accountOpen]);

  const handleCornerGoogleLogin = async () => {
    setMenuError(null);
    setGoogleBusy(true);
    try {
      const res = await startGoogleOAuth(pathname && pathname !== "/login" ? pathname : "/account");
      if (!res.ok) {
        setMenuError(res.error || "Unable to start Google Sign-In.");
        setGoogleBusy(false);
      } else if (!res.navigated) {
        setGoogleBusy(false);
      }
    } catch {
      setMenuError("Failed launching Google Sign-In.");
      setGoogleBusy(false);
    }
  };

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

  const showNavbar = isNavVisible || mobileOpen || searchOpen || accountOpen;

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-[transform,opacity] duration-300 ease-out will-change-transform ${t.header} ${
        showNavbar
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
        {/* Top half glossy specular sheen */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 ${t.glossOverlay}`}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Mobile hamburger + Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 md:flex-initial overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden p-1.5 sm:p-2 rounded-xl border shrink-0 transition-colors ${t.iconBtn}`}
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <Link
              href="/"
              className={`flex items-center group min-w-0 max-w-full transition-transform hover:scale-[1.03] ${t.logoWrap}`}
            >
              <img
                src="/pop-culture-logo.svg"
                alt="Pop Culture"
                className="w-[84px] min-[360px]:w-[104px] sm:w-auto sm:h-9 md:h-10 h-auto max-w-full object-contain object-left"
              />
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav
            className={`hidden md:flex items-center space-x-6 lg:space-x-7 font-bold text-xs lg:text-sm ${t.navText}`}
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors whitespace-nowrap ${
                  isActive(item.href) ? t.navActive : t.navHover
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search, Account / Login, Admin, Cart */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Live Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={`p-1.5 sm:p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-2xs ${t.iconBtn}`}
              aria-label="Search Products"
              title="Search flavours & combos"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            {/* Top-Right Corner Customer Profile & Login Menu */}
            <div className="relative" ref={accountMenuRef}>
              {!loading && user ? (
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen((v) => !v);
                    setMenuError(null);
                  }}
                  className={`inline-flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                    accountOpen || pathname === "/account" ? t.pillActive : t.pillIdle
                  }`}
                  title="Open Profile & Orders Menu"
                  aria-expanded={accountOpen}
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FAC537] text-[#522C28] font-black text-[10px] sm:text-[11px] flex items-center justify-center uppercase border border-[#522C28]/20">
                    {(user.fullName || user.email).charAt(0)}
                  </span>
                  <span className="hidden sm:inline text-xs font-extrabold max-w-[96px] truncate">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-0.5 bg-[#FFF8EE] text-[#D73B3A] px-1.5 py-0.5 rounded-full text-[10px] font-black border border-[#FAC537]">
                    <Coins className="w-3 h-3" />
                    {user.loyaltyPoints}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen((v) => !v);
                    setMenuError(null);
                  }}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border backdrop-blur-md text-xs font-extrabold transition-all shadow-xs cursor-pointer ${
                    accountOpen ? t.pillActive : t.pillIdle
                  }`}
                  title="Customer Sign In & Profile"
                  aria-expanded={accountOpen}
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.3]" />
                  <span className="hidden sm:inline">Sign In</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>
              )}

            {/* Floating Corner Dropdown */}
            {accountOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white/85 backdrop-blur-xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#522C28]/15 shadow-[0_16px_40px_rgba(82,44,40,0.18)] overflow-hidden z-[60]">
                {user ? (
                  <>
                    <div className="px-4 py-3.5 bg-[#FFF8EE]/75 border-b border-[#522C28]/10">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#D73B3A] truncate">
                        {user.email || user.fullName}
                      </p>
                      <p className="text-sm font-black text-[#25100E] truncate mt-0.5">
                        {user.fullName}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAC537]/30 border border-[#FAC537] text-[11px] font-black text-[#522C28]">
                        <Coins className="w-3.5 h-3.5 text-[#D73B3A]" />
                        <span>{user.loyaltyPoints} Crunch Points (₹{user.loyaltyPoints})</span>
                      </div>
                    </div>

                    <div className="py-1.5 text-xs font-bold text-[#522C28]">
                      <Link
                        href="/account?tab=overview"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FFF8EE] hover:text-[#D73B3A] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D73B3A]" />
                        <span>Customer Dashboard</span>
                      </Link>
                      <Link
                        href="/account?tab=profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FFF8EE] hover:text-[#D73B3A] transition-colors"
                      >
                        <UserCircle2 className="w-4 h-4 text-[#D73B3A]" />
                        <span>Profile Details</span>
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FFF8EE] hover:text-[#D73B3A] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#D73B3A]" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/account?tab=rewards"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FFF8EE] hover:text-[#D73B3A] transition-colors"
                      >
                        <Gamepad2 className="w-4 h-4 text-[#D73B3A]" />
                        <span>Fox Runner &amp; Points</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#522C28]/10 p-2">
                      <button
                        type="button"
                        onClick={async () => {
                          setAccountOpen(false);
                          await logout();
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-[#D73B3A] hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#D73B3A]">
                        ✦ Crunch Club Account
                      </p>
                      <p className="text-sm font-black text-[#25100E] mt-0.5">
                        Sign in to track orders &amp; rewards
                      </p>
                      <p className="text-[11px] font-semibold text-[#522C28]/70">
                        Get 50 welcome Crunch Points on signup.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCornerGoogleLogin}
                      disabled={googleBusy}
                      className="w-full py-2.5 px-3 rounded-full bg-white hover:bg-[#FFF8EE] text-[#25100E] border-2 border-[#522C28]/15 hover:border-[#D73B3A] font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      {googleBusy ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D73B3A]" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                          />
                        </svg>
                      )}
                      <span>{googleBusy ? "Connecting..." : "Continue with Google"}</span>
                    </button>

                    {menuError && (
                      <p className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl p-2">
                        {menuError}
                      </p>
                    )}

                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="w-full py-2.5 px-3 rounded-full bg-[#D73B3A] hover:bg-[#FB0008] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Email Sign In / Register</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin Console shortcut (hidden on < sm; available in mobile drawer) */}
          <Link
            href="/admin"
            title={user?.role === "admin" ? "Store Admin Console" : "Admin Login"}
            className={`hidden sm:inline-flex p-2 rounded-full border transition-colors ${
              pathname === "/admin" ? t.pillActive : t.iconBtn
            }`}
            aria-label="Admin Panel"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.3]" />
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className={`relative px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5 ${t.cartBtn}`}
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline text-[11px] font-black uppercase tracking-wide">
              Cart
            </span>
            <span
              className={`min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center border ${t.cartBadge}`}
            >
              {totalCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar & Live Results */}
      {searchOpen && (
        <div className="relative z-20 border-t border-[#522C28]/10 bg-white/90 backdrop-blur-xl text-[#522C28] shadow-lg">
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
        <div className="md:hidden relative z-20 border-t border-[#522C28]/10 bg-[#FFF8EE]/95 backdrop-blur-xl text-[#522C28] px-4 py-4 space-y-2 shadow-lg">
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
                  {user.fullName} — My Dashboard
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
