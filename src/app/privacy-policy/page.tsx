import React from "react";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xs font-bold text-[#522C28]/60 mt-1">
              Last Updated: November 2026
            </p>
          </div>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">1. Information We Collect</h2>
            <p>
              When you shop with Pop Culture or join the Crunch Club, we collect your name, email
              address, phone number, and delivery address solely to process orders via Shiprocket
              Checkout, send transactional Gmail order notifications, and maintain your Crunch
              Points & Fox Runner leaderboard scores.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">2. Payments & Checkout Security</h2>
            <p>
              All online payments (UPI, Cards, NetBanking) are processed securely through Shiprocket
              Fastrr Checkout and its PCI-DSS compliant payment gateway partners. Pop Culture never
              stores your card or UPI PIN details.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed">
            <h2 className="font-display text-xl uppercase text-[#25100E]">3. Data Storage & Contact</h2>
            <p>
              Account data, order summaries, and saved preferences are stored securely using encrypted
              HTTP-only sessions and Postgres storage. To request data deletion or correction, reach
              out through our{" "}
              <a href="/contact" className="text-[#D73B3A] font-bold underline">Contact Us</a> page,
              email <a href="mailto:contact@snackpopculture.com" className="text-[#D73B3A] font-bold underline">contact@snackpopculture.com</a>,
              or call <a href="tel:+919002388080" className="font-bold text-[#25100E]">+91 9002388080</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
