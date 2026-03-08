"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "Publisher",
    content: [
      "Mas & Table SASU",
      "Share capital: €1000",
      "SIREN: [TO BE COMPLETED]",
      "Registered office: 110 Cours Lieutaud, 13006 Marseille, France",
      "Email: hello@masandtable.com",
      "Publication director: [First name Last name]",
    ],
  },
  {
    title: "Hosting",
    content: [
      "Vercel Inc.",
      "440 N Barranca Ave #4133",
      "Covina, CA 91723, USA",
      "vercel.com",
    ],
  },
  {
    title: "Database",
    content: [
      "Supabase Inc.",
      "970 Toa Payoh North, Singapore",
      "supabase.com",
    ],
  },
  {
    title: "Payments",
    content: [
      "Stripe Payments Europe Ltd.",
      "1 Grand Canal Street Lower, Dublin 2, Ireland",
      "stripe.com",
      "Licensed payment service provider, authorised by the Central Bank of Ireland.",
    ],
  },
  {
    title: "Intellectual property",
    content: [
      "All content on masandtable.com — including texts, photographs, and design — is the exclusive property of Mas & Table SASU or its partners, and is protected under French and international intellectual property law.",
      "Any unauthorised reproduction, representation, modification or use of any part of this site is strictly prohibited.",
    ],
  },
  {
    title: "Personal data",
    content: [
      "In accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have the right to access, rectify and delete your personal data at any time.",
      "To exercise these rights, contact us at hello@masandtable.com.",
      "You may also lodge a complaint with the CNIL (cnil.fr).",
    ],
  },
  {
    title: "Cookies",
    content: [
      "This site uses cookies strictly necessary for its operation (authentication, session management). No advertising cookies are placed without your prior consent.",
      "For more information, please read our Privacy Policy.",
    ],
  },
  {
    title: "Governing law",
    content: [
      "This site and its terms of use are governed by French law. Any dispute shall be submitted to the competent courts of France.",
    ],
  },
];

export default function MentionsLegalesPage() {
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
              Legal<br /><em>Notice</em>
            </h1>
            <p className="font-sans text-base text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              In accordance with French Law n° 2004-575 of 21 June 2004 on confidence in the digital economy (LCEN).
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
                  <div className="sm:col-span-8 space-y-2">
                    {s.content.map((line, i) => (
                      <p key={i} className="font-sans text-base sm:text-lg text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 sm:mt-24 pt-12 border-t border-[#2C2C2C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex gap-6">
                <Link href="/terms" className="font-sans text-sm text-[#6B7C5C] underline underline-offset-2 hover:text-[#2C2C2C] transition-colors duration-200" style={{ fontWeight: 300 }}>
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="font-sans text-sm text-[#6B7C5C] underline underline-offset-2 hover:text-[#2C2C2C] transition-colors duration-200" style={{ fontWeight: 300 }}>
                  Privacy Policy
                </Link>
              </div>
              <Link href="/" className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-200">
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