"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "1. Who we are",
    content: `Mas & Table is a curated platform connecting travellers with handpicked gastronomic and wellness experiences in Provence, operated by Mas & Table SASU, registered in France. By using masandtable.com, you agree to these terms.`,
  },
  {
    title: "2. Bookings & payments",
    content: `All bookings are processed securely via Stripe. Your card is not charged until your host confirms the reservation — usually within 24 hours. Prices displayed are inclusive of all taxes. The commission charged to partners (15%) is never passed on to the client.`,
  },
  {
    title: "3. Cancellation policy",
    content: `Free cancellation up to 14 days before your experience. A 50% refund applies for cancellations made between 7 and 14 days before the experience date. No refund is available within 7 days of the experience. If the host cancels for any reason, you will receive a full refund and we will work to find you an alternative.`,
  },
  {
    title: "4. Our role",
    content: `Mas & Table acts as an intermediary between travellers and experience hosts. We curate and present experiences in good faith, but the experience itself is delivered by the host. We are not liable for events beyond our control, including changes in weather, force majeure, or circumstances specific to the host property.`,
  },
  {
    title: "5. Intellectual property",
    content: `All content on masandtable.com — including texts, photographs, and design — is the property of Mas & Table or its partners and may not be reproduced without prior written consent.`,
  },
  {
    title: "6. Governing law",
    content: `These terms are governed by French law. Any dispute shall be submitted to the competent courts of France.`,
  },
  {
    title: "7. Contact",
    content: `For any questions regarding these terms, please contact us at hello@masandtable.com.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0E8]">

        {/* ── HEADER ── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-4xl mx-auto px-6 sm:px-16 py-16 sm:py-24">
            <div className="flex items-center gap-4 mb-8">
              <span className="block w-6 sm:w-8 h-px bg-[#6B7C5C]" />
              <p className="font-sans text-[11px] sm:text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">
                Legal
              </p>
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,7vw,4.5rem)] text-[#2C2C2C] leading-[1.05] tracking-tight mb-6">
              Terms &<br /><em>Conditions</em>
            </h1>
            <p className="font-sans text-base text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              Last updated — March 2025
            </p>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section>
          <div className="max-w-4xl mx-auto px-6 sm:px-16 py-16 sm:py-24">
            <div className="space-y-12 sm:space-y-16">
              {SECTIONS.map((s) => (
                <div key={s.title} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-12">
                  <div className="sm:col-span-4">
                    <h2 className="font-serif text-lg sm:text-xl text-[#2C2C2C] leading-snug">
                      {s.title}
                    </h2>
                  </div>
                  <div className="sm:col-span-8">
                    <p className="font-sans text-base sm:text-lg text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                      {s.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Séparateur + lien Privacy */}
            <div className="mt-16 sm:mt-24 pt-12 border-t border-[#2C2C2C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <p className="font-sans text-sm text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
                See also our{" "}
                <Link href="/privacy" className="text-[#6B7C5C] underline underline-offset-2 hover:text-[#2C2C2C] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </p>
              <Link
                href="/"
                className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-200"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}