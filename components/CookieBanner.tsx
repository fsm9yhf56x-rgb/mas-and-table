"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Consent = "accepted" | "declined" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent") as Consent;
    if (stored) {
      setConsent(stored);
      applyConsent(stored);
    } else {
      // Délai court pour ne pas sauter à la figure au chargement
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function applyConsent(value: Consent) {
    if (value === "accepted") {
      // Active Google Analytics / Pinterest si présents
      if (typeof window !== "undefined") {
        (window as any).cookieConsent = true;
      }
    }
  }

  function handleAccept() {
    localStorage.setItem("cookie_consent", "accepted");
    setConsent("accepted");
    applyConsent("accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie_consent", "declined");
    setConsent("declined");
    setVisible(false);
  }

  if (!visible || consent !== null) return null;

  return (
    <>
      {/* Backdrop très léger */}
      <div
        className="fixed inset-0 z-[90] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(44,44,44,0.15) 0%, transparent 40%)" }}
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100]"
        style={{
          backgroundColor: "#2C2C2C",
          borderTop: "1px solid rgba(245,240,232,0.08)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-16 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Texte */}
            <div className="flex-1 max-w-2xl">
              <p className="font-serif text-base sm:text-lg text-[#F5F0E8] leading-relaxed mb-1">
                A few cookies, like in Provence.
              </p>
              <p className="font-sans text-sm text-[#F5F0E8]/45 leading-relaxed" style={{ fontWeight: 300 }}>
                We use essential cookies to keep the site running, and optional analytics cookies to understand how people discover Provence with us. No advertising cookies without your consent.{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 text-[#6B7C5C] hover:text-[#F5F0E8] transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDecline}
                className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#F5F0E8]/35 hover:text-[#F5F0E8]/60 transition-colors duration-200"
                style={{ padding: "12px 0", minHeight: "44px" }}
              >
                Essentials only
              </button>

              <button
                onClick={handleAccept}
                className="group relative overflow-hidden border border-[#6B7C5C] font-sans text-[11px] tracking-[0.35em] uppercase text-[#6B7C5C] hover:text-[#F5F0E8] transition-colors duration-400"
                style={{ padding: "12px 24px", minHeight: "44px" }}
              >
                <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                <span className="relative z-10">Accept all</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}