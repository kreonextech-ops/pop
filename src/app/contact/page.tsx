"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, Mail, Phone, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("Order Support");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({ ok: true, text: data.message });
        setMessage("");
      } else {
        setStatus({ ok: false, text: data.error || "Unable to send message." });
      }
    } catch {
      setStatus({ ok: false, text: "Network error sending message." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#D73B3A]">
            ✦ SAY HELLO ✦
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-[#25100E] mt-1">
            Contact Pop Culture
          </h1>
          <p className="text-sm font-semibold text-[#522C28]/75 mt-2 max-w-lg mx-auto">
            Questions about your snack order, bulk corporate hampers, or wholesale distribution? Drop
            us a line — it routes straight to our Gmail inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#522C28]/15 p-5 shadow-xs flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#D73B3A] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-sm text-[#25100E]">Email Support</h3>
                <a
                  href="mailto:contact@snackpopculture.com"
                  className="text-xs font-semibold text-[#D73B3A] hover:underline mt-0.5 block"
                >
                  contact@snackpopculture.com
                </a>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[#522C28]/15 p-5 shadow-xs flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#D73B3A] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-sm text-[#25100E]">Phone / WhatsApp</h3>
                <a
                  href="tel:+919002388080"
                  className="text-xs font-semibold text-[#522C28]/85 hover:text-[#D73B3A] mt-0.5 block"
                >
                  +91 90023 88080
                </a>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[#522C28]/15 p-5 shadow-xs flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#D73B3A] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-sm text-[#25100E]">Response Window</h3>
                <p className="text-xs font-semibold text-[#522C28]/75 mt-0.5">
                  Mon–Sat, 10 AM – 6 PM IST
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[#522C28]/15 p-5 shadow-xs flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D73B3A] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-sm text-[#25100E]">Roastery Studio</h3>
                <p className="text-xs font-semibold text-[#522C28]/75 mt-0.5">
                  Mumbai, Maharashtra, India
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 bg-white rounded-3xl border-2 border-[#522C28]/15 p-6 sm:p-8 shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Riya Kapoor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="riya@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              >
                <option value="Order Support">Order Support & Tracking</option>
                <option value="Bulk Gifting">Corporate & Bulk Gifting</option>
                <option value="Wholesale">Wholesale / Retail Partnership</option>
                <option value="Feedback">Flavour Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-[#522C28]/70 mb-1">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EE] border border-[#522C28]/20 text-sm font-semibold"
              />
            </div>

            {status && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  status.ok
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {status.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : null}
                <span>{status.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 rounded-full bg-[#D73B3A] hover:bg-[#FB0008] text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
