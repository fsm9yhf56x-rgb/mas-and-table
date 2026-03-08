"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "1. Data we collect",
    content: `When you make a booking, we collect your first name, last name, email address, and optionally your phone number and notes for the host. We do not store your payment details — all transactions are handled directly by Stripe, which is PCI-DSS compliant.`,
  },
  {
    title: "2. How we use your data",
    content: `Your data is used solely to process and manage your booking, send you confirmation and pre-experience emails, and improve the Mas & Table experience. We do not sell, rent, or share your personal data with third parties outside of what is strictly necessary to deliver your experience.`,
  },
  {
    title: "3. Who sees your data",
    content: `Your first name, number of guests, and any notes you provide are shared with the relevant host to prepare your experience. Your email is used only by Mas & Table for booking-related communications. We use Resend to send transactional emails and Supabase to store booking data — both are GDPR-compliant.`,
  },
  {
    title: "4. Cookies",
    content: `We use a minimal number of cookies necessary for the site to function — primarily for authentication (Supabase session cookie) and basic analytics. We do not use advertising cookies or third-party tracking pixels.`,
  },
  {
    title: "5. Your rights",
    content: `Under GDPR, you have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at hello@masandtable.com. We will respond within 30 days.`,
  },
  {
    title: "6. Data retention",
    content: `Booking data is retained for a period of 5 years for accounting and legal compliance purposes, then permanently deleted. Account data is deleted upon request or after 3 years of inactivity.`,
  },
  {
    title: "7. Security",
    content: `We take data security seriously. All data is encrypted in transit (HTTPS) and at rest. Access to personal data is strictly limited to the Mas & Table team.`,
  },
  {
    title: "8. Contact",
    content: `For any questions regarding your privacy or personal data, contact us at hello@masandtable.com. You may also lodge a complaint with the CNIL (Commission Nationale de l'Informatique et des Libertés) at cnil.fr.`,
  },
];

export default function PrivacyPage() {
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
              Privacy<br /><em>Policy</em>
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

            {/* Séparateur + lien Terms */}
            <div className="mt-16 sm:mt-24 pt-12 border-t border-[#2C2C2C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <p className="font-sans text-sm text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
                See also our{" "}
                <Link href="/terms" className="text-[#6B7C5C] underline underline-offset-2 hover:text-[#2C2C2C] transition-colors duration-200">
                  Terms & Conditions
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