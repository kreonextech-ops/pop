import Link from "next/link";
import {
  ShoppingBasket,
  HelpCircle,
  Store,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
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
            <p className="text-xs md:text-[13px] text-[#522C28] font-medium leading-relaxed mt-2.5 uppercase">
              THE COOLEST WAY TO SNACK BETTER
            </p>
            {/* Playful Yellow Curved Stroke */}
            <svg className="w-16 h-2.5 mt-2" viewBox="0 0 70 8" fill="none">
              <path
                d="M2 6C22 1.5 48 1.5 68 6"
                stroke="#F2994A"
                strokeWidth="3"
                strokeLinecap="round"
              />
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
                <li>
                  <Link href="/shop" className="hover:text-[#A5151C] transition-colors">
                    All Snacks
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-[#A5151C] transition-colors">
                    Build a Box
                  </Link>
                </li>
                <li>
                  <Link href="/shop#combos" className="hover:text-[#A5151C] transition-colors">
                    Gift Combos
                  </Link>
                </li>
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
                <li>
                  <Link href="/shipping-returns#faqs" className="hover:text-[#A5151C] transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="hover:text-[#A5151C] transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#A5151C] transition-colors">
                    Contact Us
                  </Link>
                </li>
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
                <li>
                  <Link href="/#flavours" className="hover:text-[#A5151C] transition-colors">
                    Our Flavours
                  </Link>
                </li>
                <li>
                  <Link href="/#discover" className="hover:text-[#A5151C] transition-colors">
                    Play & Earn
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-[#A5151C] transition-colors">
                    Crunch Club Rewards
                  </Link>
                </li>
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
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          MOBILE / TABLET FOOTER (< lg) - Optimized layout
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
              <p className="text-xs text-[#522C28] font-semibold leading-tight mt-1.5 uppercase">
                THE COOLEST WAY TO SNACK BETTER
              </p>
              {/* Playful Yellow Curved Stroke */}
              <svg className="w-14 h-2 mt-1" viewBox="0 0 70 8" fill="none">
                <path
                  d="M2 6C22 1.5 48 1.5 68 6"
                  stroke="#F2994A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 2. Right: Fox Mascot (Raised Up) + Social Icons Directly Below */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <img
                src="/footer/fox-in-bowl.png"
                alt="Relaxed Fox in Snack Bowl"
                className="w-32 sm:w-40 h-auto object-contain drop-shadow-sm select-none"
              />

              {/* Social Icons directly below Fox */}
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

          {/* Middle Row: SHOP | HELP | COMPANY */}
          <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-[#522C28]/15 pb-2">
            {/* Shop Column */}
            <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-[11px] sm:text-xs font-black tracking-wide">
                <ShoppingBasket className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>SHOP</span>
              </div>
              <ul className="space-y-1 text-xs font-semibold text-[#522C28]">
                <li>
                  <Link href="/shop" className="hover:text-[#A5151C] transition-colors">
                    All Snacks
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-[#A5151C] transition-colors">
                    Build a Box
                  </Link>
                </li>
                <li>
                  <Link href="/shop#combos" className="hover:text-[#A5151C] transition-colors">
                    Gift Combos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Column */}
            <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left border-l border-[#522C28]/10 pl-2 sm:pl-3">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-[11px] sm:text-xs font-black tracking-wide">
                <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>HELP</span>
              </div>
              <ul className="space-y-1 text-xs font-semibold text-[#522C28]">
                <li>
                  <Link href="/shipping-returns#faqs" className="hover:text-[#A5151C] transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="hover:text-[#A5151C] transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#A5151C] transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left border-l border-[#522C28]/10 pl-2 sm:pl-3">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#A5151C] text-[11px] sm:text-xs font-black tracking-wide">
                <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>COMPANY</span>
              </div>
              <ul className="space-y-1 text-xs font-semibold text-[#522C28]">
                <li>
                  <Link href="/#flavours" className="hover:text-[#A5151C] transition-colors">
                    Our Flavours
                  </Link>
                </li>
                <li>
                  <Link href="/#discover" className="hover:text-[#A5151C] transition-colors">
                    Play & Earn
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-[#A5151C] transition-colors">
                    Crunch Rewards
                  </Link>
                </li>
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
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
