import React from "react";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border-2 border-[#522C28]/15 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
              POP CULTURE SNACKS • LEGAL
            </span>
            <h1 className="font-display text-3xl sm:text-5xl uppercase text-[#25100E] mt-1">
              Terms of Service
            </h1>
            <p className="text-xs font-bold text-[#522C28]/60 mt-1">
              Last Updated: November 2026
            </p>
          </div>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">1. Orders & Pricing</h2>
            <p>
              All prices listed on Pop Culture are in Indian Rupees (INR) inclusive of applicable
              GST unless specified otherwise. Promotional coupons (such as POP10 and FIRST50) and
              Crunch Points discounts are validated server-side before checkout confirmation.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">2. Crunch Club & Fox Runner Rewards</h2>
            <p>
              Crunch Points earned through welcome bonuses, orders, or the Fox Runner game can be
              redeemed for up to 20% off eligible orders in your cart (1 Crunch Point = ₹1). Points
              have no cash value and cannot be transferred between accounts.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">3. Food Safety & Quality</h2>
            <p>
              Our foxnuts (makhana) are slow-roasted in small batches using clean, food-grade
              ingredients. Please inspect packaging seals upon delivery and contact support within 48
              hours for any transit damage.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
