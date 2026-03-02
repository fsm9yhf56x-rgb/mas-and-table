"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#F5F0E8]/100 backdrop-blur-sm shadow-sm py-3" : "bg-[#F5F0E8] border-b border-[#2C2C2C]/10 py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">

        {/* Logo + devise */}
        <Link href="/" className="flex flex-col items-center gap-0.5">
          <span className="font-serif text-3xl tracking-wide text-[#2C2C2C] transition-colors leading-tight">
            Mas & Table
          </span>
          <span className="font-serif text-[15px] italic text-[#2C2C2C]/70 leading-tight tracking-wide">
            The Provence few travellers ever find.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/experiences" className="font-sans text-[13px] tracking-[0.3em] uppercase text-[#2C2C2C] hover:text-[#2C2C2C] transition-colors duration-200">
            Experiences
          </Link>
          <Link href="/blog" className="font-sans text-[13px] tracking-[0.3em] uppercase text-[#2C2C2C] hover:text-[#2C2C2C] transition-colors duration-200">
            From Provence
          </Link>
          <Link href="/experiences" className="group relative font-sans text-[13px] tracking-[0.3em] uppercase border border-[#6B7C5C] text-[#6B7C5C] px-6 py-3 overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500">
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">Explore</span>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
          <span className={`block w-6 h-px bg-[#2C2C2C] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-[#2C2C2C] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-[#2C2C2C] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden transition-all duration-400 overflow-hidden ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="bg-[#F5F0E8] px-8 pb-8 pt-4 flex flex-col gap-6 border-t border-[#2C2C2C]/10">
          <Link href="/experiences" onClick={() => setMenuOpen(false)} className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50">Experiences</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50">From Provence</Link>
          <Link href="/experiences" onClick={() => setMenuOpen(false)} className="font-sans text-[11px] tracking-[0.3em] uppercase bg-[#6B7C5C] text-[#FDFAF5] px-6 py-3 text-center">Explore Experiences</Link>
        </nav>
      </div>
    </header>
  );
}