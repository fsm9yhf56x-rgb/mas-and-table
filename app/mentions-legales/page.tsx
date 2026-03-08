"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "Éditeur du site",
    content: [
      "Mas & Table SASU",
      "Capital social : 1 €",
      "SIREN : [À COMPLÉTER]",
      "Siège social : [À COMPLÉTER], France",
      "Email : hello@masandtable.com",
      "Directeur de la publication : [Prénom Nom]",
    ],
  },
  {
    title: "Hébergeur",
    content: [
      "Vercel Inc.",
      "440 N Barranca Ave #4133",
      "Covina, CA 91723, USA",
      "vercel.com",
    ],
  },
  {
    title: "Base de données",
    content: [
      "Supabase Inc.",
      "970 Toa Payoh North, Singapore",
      "supabase.com",
    ],
  },
  {
    title: "Paiements",
    content: [
      "Stripe Payments Europe Ltd.",
      "1 Grand Canal Street Lower, Dublin 2, Ireland",
      "stripe.com",
      "Prestataire de services de paiement agréé par la Banque Centrale d'Irlande.",
    ],
  },
  {
    title: "Propriété intellectuelle",
    content: [
      "L'ensemble du contenu de ce site (textes, photographies, design, logo) est la propriété exclusive de Mas & Table SASU ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.",
      "Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie du site est strictement interdite.",
    ],
  },
  {
    title: "Données personnelles",
    content: [
      "Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
      "Pour exercer ces droits, contactez-nous à hello@masandtable.com.",
      "Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).",
    ],
  },
  {
    title: "Cookies",
    content: [
      "Ce site utilise des cookies strictement nécessaires à son fonctionnement (authentification, session). Aucun cookie publicitaire n'est déposé sans votre consentement préalable.",
      "Pour en savoir plus, consultez notre Politique de Confidentialité.",
    ],
  },
  {
    title: "Droit applicable",
    content: [
      "Le présent site et ses conditions d'utilisation sont régis par le droit français. Tout litige sera soumis aux tribunaux compétents de France.",
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
                Légal
              </p>
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,7vw,4.5rem)] text-[#2C2C2C] leading-[1.05] tracking-tight mb-6">
              Mentions<br /><em>Légales</em>
            </h1>
            <p className="font-sans text-base text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
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