import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="bg-white rounded-3xl border-2 border-[#522C28]/15 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
              DISPATCH & SUPPORT
            </span>
            <h1 className="font-display text-3xl sm:text-5xl uppercase text-[#25100E] mt-1">
              Shipping & Returns
            </h1>
          </div>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">Fast Dispatch via Shiprocket</h2>
            <p>
              Orders confirmed before 2:00 PM IST ship the same business day from our roasting
              facility via Shiprocket courier partners. Typical delivery takes 2–4 business days in
              metro cities and 4–6 days pan-India. Free shipping applies on orders above ₹299.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">Damaged or Wrong Item Policy</h2>
            <p>
              Because makhana is a consumable food product, opened pouches cannot be returned.
              However, if your box arrives damaged, tampered, or missing a flavour, share an
              unboxing photo via our{" "}
              <Link href="/contact" className="text-[#D73B3A] font-bold underline">
                Contact Page
              </Link>{" "}
              within 48 hours for an immediate replacement or full refund.
            </p>
          </section>
        </div>

        {/* FAQs Anchor */}
        <div id="faqs" className="bg-white rounded-3xl border-2 border-[#522C28]/15 p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl uppercase text-[#25100E]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-2xl bg-[#FFF8EE]">
              <p className="font-black text-[#25100E]">Are Pop Culture makhana snacks fried?</p>
              <p className="mt-1 text-[#522C28]/80">
                Never! Every pouch is slow-roasted for crispness with zero trans fats and zero palm oil.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF8EE]">
              <p className="font-black text-[#25100E]">How do Fox Runner Crunch Points work?</p>
              <p className="mt-1 text-[#522C28]/80">
                Sign in to your account and play Fox Runner on the homepage — every 25m you run
                earns 1 Crunch Point (₹1 value), redeemable right in your Munch Box cart drawer.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
