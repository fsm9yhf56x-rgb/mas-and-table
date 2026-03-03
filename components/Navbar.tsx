"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Logo({ inverted = false }: { inverted?: boolean }) {
  const nameColor = inverted ? "#F5F0E8" : "#2C2C2C";
  const ampColor = "#6B7C5C";
  const tagColor = inverted ? "rgba(245,240,232,0.38)" : "rgba(44,44,44,0.38)";
  return (
    <Link href="/" className="flex flex-col items-center gap-[4px]">
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", color: nameColor, fontWeight: 400, letterSpacing: "0.18em", lineHeight: 1, textTransform: "uppercase" as const }}>
        Mas{" "}
        <span style={{ color: ampColor, fontStyle: "italic", fontSize: "26px", fontFamily: "'Playfair Display', Georgia, serif", textTransform: "none" as const, letterSpacing: 0 }}>&</span>
        {" "}Table
      </span>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "11px", color: tagColor, letterSpacing: "0.2em", fontWeight: 300, fontStyle: "italic", lineHeight: 1 }}>
        The Provence few travellers ever find.
      </span>
    </Link>
  );
}

function BurgerIcon({ open, inverted }: { open: boolean; inverted: boolean }) {
  const color = inverted ? "#F5F0E8" : "#2C2C2C";
  return (
    <div className="flex flex-col justify-between" style={{ width: "20px", height: "14px" }}>
      <span className="block h-px transition-all duration-400 ease-in-out" style={{ backgroundColor: color, transformOrigin: "center", transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
      <span className="block h-px transition-all duration-300" style={{ backgroundColor: color, opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }} />
      <span className="block h-px transition-all duration-400 ease-in-out" style={{ backgroundColor: color, transformOrigin: "center", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const mobileLinks = [
    { href: "/experiences", label: "Experiences", sub: "All curated stays & tables" },
    { href: "/blog", label: "From Provence", sub: "Stories, seasons & secrets" },
  ];

  return (
    <>
      {/* ── Barre fixe ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled && !menuOpen ? "shadow-sm py-3" : "py-5"
        } ${menuOpen ? "" : "border-b border-[#2C2C2C]/10"}`}
        style={{
          backgroundColor: menuOpen ? "#2C2C2C" : "#F5F0E8",
          transition: "background-color 0.5s ease, padding 0.5s ease",
        }}
      >
        {/* ── MOBILE (< 640px) : burger gauche · logo centré · spacer droit ── */}
        <div className="sm:hidden max-w-7xl mx-auto px-6 flex items-center">
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center"
              style={{ minWidth: "44px", minHeight: "44px", marginLeft: "-10px" }}
              aria-label={menuOpen ? "Fermer" : "Menu"}
            >
              <BurgerIcon open={menuOpen} inverted={menuOpen} />
            </button>
          </div>
          <div className="flex-shrink-0">
            <Logo inverted={menuOpen} />
          </div>
          <div className="flex-1" style={{ minWidth: "44px" }} />
        </div>

        {/* ── DESKTOP (≥ 640px) : logo gauche · nav droite ── */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-8 lg:gap-10">
            <Link href="/experiences" className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors duration-300 whitespace-nowrap">
              Experiences
            </Link>
            <Link href="/blog" className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors duration-300 whitespace-nowrap">
              From Provence
            </Link>
            <Link
              href="/experiences"
              className="group relative font-sans text-[11px] tracking-[0.4em] uppercase border border-[#6B7C5C] text-[#6B7C5C] px-5 lg:px-6 py-3 overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 whitespace-nowrap"
            >
              <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Explore</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Overlay plein écran — téléphone uniquement ── */}
      <div
        className="fixed inset-0 z-40 sm:hidden flex flex-col"
        style={{
          backgroundColor: "#2C2C2C",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="shrink-0" style={{ height: "73px" }} />

        <div className="flex-1 flex flex-col justify-between px-8 py-10 overflow-y-auto">
          <nav className="flex flex-col">
            {mobileLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="group flex flex-col border-b py-8"
                style={{
                  borderColor: "rgba(245,240,232,0.08)",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`,
                }}
              >
                <span
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 9vw, 2.5rem)", fontWeight: 400, color: "#F5F0E8", letterSpacing: "0.03em", lineHeight: 1.1, transition: "color 0.3s" }}
                  className="group-hover:text-[#6B7C5C]"
                >
                  {link.label}
                </span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "11px", fontStyle: "italic", color: "rgba(245,240,232,0.32)", letterSpacing: "0.12em", marginTop: "6px" }}>
                  {link.sub}
                </span>
              </Link>
            ))}
          </nav>

          <div
            className="flex flex-col gap-6 pt-8"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
            }}
          >
            <Link
              href="/experiences"
              onClick={close}
              className="group relative flex items-center justify-center border overflow-hidden"
              style={{ borderColor: "#6B7C5C", minHeight: "56px", fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.45em", textTransform: "uppercase" as const, color: "#6B7C5C" }}
            >
              <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 group-hover:text-[#2C2C2C] transition-colors duration-300">
                Explore all experiences
              </span>
            </Link>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "10px", fontStyle: "italic", color: "rgba(245,240,232,0.18)", letterSpacing: "0.18em", textAlign: "center" as const }}>
              The Provence few travellers ever find.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}