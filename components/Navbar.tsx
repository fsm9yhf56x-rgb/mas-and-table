"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [authOpen, setAuthOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser]               = useState<any>(null);
  const [firstName, setFirstName]     = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setFirstName(session?.user?.user_metadata?.first_name ?? "");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setFirstName(session?.user?.user_metadata?.first_name ?? "");
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthOpen(false);
    router.push("/");
  }

  // Expose la vraie hauteur navbar → CSS var --navbar-h (utilisée par les sticky bars)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => document.documentElement.style.setProperty("--navbar-h", `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Ferme authOpen au clic dehors
  useEffect(() => {
    if (!authOpen) return;
    const handler = () => setAuthOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [authOpen]);

  // Ferme dropdown au clic dehors
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const categories = [
    { href: "/experiences?category=une_journee", label: "Une Journée", sub: "A Table — from €150" },
    { href: "/experiences?category=un_sejour",   label: "Un Séjour",   sub: "Among the Vines — from €800" },
    { href: "/experiences?category=une_saison",  label: "Une Saison",  sub: "Lost in Provence — from €2,000" },
  ];

  const mobileLinks = [
    { href: "/experiences",                      label: "All Experiences" },
    { href: "/experiences?category=une_journee", label: "Une Journée"    },
    { href: "/experiences?category=un_sejour",   label: "Un Séjour"      },
    { href: "/experiences?category=une_saison",  label: "Une Saison"     },
    { href: "/blog",                             label: "Stories"         },
  ];

  const BEIGE = "#F5F0E8";
  const DARK  = "#2C2C2C";
  const OLIVE = "#6B7C5C";

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: menuOpen ? DARK : BEIGE,
          boxShadow: scrolled && !menuOpen ? "0 1px 0 rgba(44,44,44,0.10)" : "none",
          transition: "background-color 0.4s ease, box-shadow 0.3s ease",
        }}
      >

        {/* ── DESKTOP LIGNE 1 — tagline · logo · auth ── */}
        <div
          className="hidden sm:grid grid-cols-3 items-center"
          style={{ padding: "18px 48px", borderBottom: "1px solid rgba(44,44,44,0.08)" }}
        >
          <p className="font-serif italic" style={{ fontSize: "15px", color: "rgba(44,44,44,0.35)", letterSpacing: "0.08em" }}>
            Curated experiences · South of France
          </p>

          <div className="flex justify-center">
            <Link href="/" className="flex flex-col items-center gap-[5px]">
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "46px", color: DARK, fontWeight: 400, letterSpacing: "0em", lineHeight: 1, textTransform: "uppercase" }}>
                Mas <span style={{ color: OLIVE, fontStyle: "italic", letterSpacing: 0 }}>&</span> Table
              </span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "17px", color: "rgba(44,44,44,0.45)", letterSpacing: "0.12em", fontStyle: "italic", lineHeight: 1, marginTop: "4px" }}>
                The Provence few travellers ever find.
              </span>
            </Link>
          </div>

          <div className="flex justify-end items-center gap-5">
            {user ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setAuthOpen(!authOpen)}
                  className="flex items-center gap-2"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,44,44,0.55)" }}
                >
                  <span>{firstName || "My account"}</span>
                  <span style={{ fontSize: "8px", color: OLIVE }}>▾</span>
                </button>
                {authOpen && (
                  <div className="absolute right-0 top-full mt-3 min-w-[180px]"
                    style={{ backgroundColor: BEIGE, boxShadow: "0 8px 32px rgba(44,44,44,0.10)", border: "1px solid rgba(44,44,44,0.08)" }}>
                    <button onClick={handleSignOut}
                      className="w-full text-left px-5 py-4 hover:bg-[#EDE8DF] transition-colors duration-200"
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,44,44,0.55)" }}>
                      Sign out →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,44,44,0.50)" }}
                  className="hover:text-[#2C2C2C] transition-colors duration-200">
                  Sign in
                </Link>
                <Link href="/signup"
                  className="group relative overflow-hidden border"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: OLIVE, borderColor: OLIVE, padding: "8px 18px" }}>
                  <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                  <span className="relative z-10 group-hover:text-[#F5F0E8] transition-colors duration-300">Join</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ── DESKTOP LIGNE 2 — Experiences ▾ · Stories · | · [Explore] ── */}
        <div className="hidden sm:flex items-center justify-center gap-10 xl:gap-14" style={{ padding: "14px 48px" }}>

          {/* Experiences avec dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 relative group"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.4em", textTransform: "uppercase", color: dropdownOpen ? DARK : "rgba(44,44,44,0.50)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span className="group-hover:text-[#2C2C2C] transition-colors duration-200">Experiences</span>
              <span style={{ fontSize: "8px", color: OLIVE, transition: "transform 0.3s ease", display: "inline-block", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
              <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full transition-all duration-300 h-px" style={{ backgroundColor: OLIVE }} />
            </button>

            {/* Dropdown panel */}
            <div
              className="absolute top-full left-1/2 mt-4"
              style={{
                transform: dropdownOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-8px)",
                backgroundColor: BEIGE,
                boxShadow: "0 16px 48px rgba(44,44,44,0.12), 0 1px 0 rgba(44,44,44,0.08)",
                border: "1px solid rgba(44,44,44,0.08)",
                minWidth: "280px",
                opacity: dropdownOpen ? 1 : 0,
                pointerEvents: dropdownOpen ? "auto" : "none",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
            >
              {/* Lien "All experiences" en haut */}
              <Link
                href="/experiences"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#EDE8DF] transition-colors duration-200 border-b border-[#2C2C2C]/08"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(44,44,44,0.40)" }}
              >
                <span>All experiences</span>
                <span>→</span>
              </Link>

              {/* 3 catégories */}
              {categories.map((cat, i) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-start justify-between px-6 py-5 hover:bg-[#EDE8DF] transition-colors duration-200 group"
                  style={{ borderBottom: i < categories.length - 1 ? "1px solid rgba(44,44,44,0.06)" : "none" }}
                >
                  <div>
                    <p className="font-serif" style={{ fontSize: "17px", color: DARK, fontStyle: "italic", lineHeight: 1.2, marginBottom: "4px" }}>
                      {cat.label}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(44,44,44,0.40)", textTransform: "uppercase" }}>
                      {cat.sub}
                    </p>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1" style={{ color: OLIVE, fontSize: "12px" }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stories */}
          <Link href="/blog"
            className="relative group"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(44,44,44,0.50)" }}>
            <span className="group-hover:text-[#2C2C2C] transition-colors duration-200">Stories</span>
            <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full transition-all duration-300 h-px" style={{ backgroundColor: OLIVE }} />
          </Link>

          <span className="w-px h-3 bg-[#2C2C2C]/15" />

          {/* Explore CTA */}
          <Link href="/experiences"
            className="group relative overflow-hidden border border-[#6B7C5C] text-[#6B7C5C] hover:text-[#F5F0E8] transition-colors duration-400"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", padding: "10px 20px" }}>
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
            <span className="relative z-10">Explore</span>
          </Link>
        </div>

        {/* ── MOBILE ── */}
        <div className="sm:hidden flex items-center justify-between px-6" style={{ height: "64px" }}>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ minWidth: "44px", minHeight: "44px", marginLeft: "-8px" }}
            className="flex items-center justify-center" aria-label="Menu">
            <div className="flex flex-col justify-between" style={{ width: "20px", height: "14px" }}>
              {[0,1,2].map((i) => (
                <span key={i} className="block h-px transition-all duration-400" style={{
                  backgroundColor: menuOpen ? "#F5F0E8" : DARK,
                  transformOrigin: "center",
                  transform: menuOpen ? (i===0 ? "translateY(6px) rotate(45deg)" : i===1 ? "scaleX(0)" : "translateY(-6px) rotate(-45deg)") : "none",
                  opacity: menuOpen && i===1 ? 0 : 1,
                }} />
              ))}
            </div>
          </button>

          <Link href="/" onClick={() => setMenuOpen(false)}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: menuOpen ? "#F5F0E8" : DARK, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Mas <span style={{ color: OLIVE, fontStyle: "italic" }}>&</span> Table
            </span>
          </Link>

          <Link href={user ? "/account" : "/login"} className="flex items-center justify-center" style={{ minWidth: "44px", minHeight: "44px", marginRight: "-8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={menuOpen ? "#F5F0E8" : DARK} strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Overlay mobile ── */}
      <div className="fixed inset-0 z-40 sm:hidden flex flex-col"
        style={{ backgroundColor: DARK, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transform: menuOpen ? "translateY(0)" : "translateY(-8px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
        <div style={{ height: "64px" }} className="shrink-0" />
        <nav className="flex-1 flex flex-col justify-between px-8 py-10 overflow-y-auto">
          <div className="flex flex-col">
            {mobileLinks.map((link, i) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b py-6"
                style={{ borderColor: "rgba(245,240,232,0.08)", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(12px)", transition: `opacity 0.4s ease ${0.08+i*0.06}s, transform 0.4s ease ${0.08+i*0.06}s` }}>
                <span className="font-serif group-hover:text-[#6B7C5C] transition-colors duration-200"
                  style={{ fontSize: "clamp(1.6rem,7vw,2.1rem)", color: i === 0 ? "rgba(245,240,232,0.45)" : "#F5F0E8", letterSpacing: "0.02em", lineHeight: 1.1, fontStyle: i === 0 ? "normal" : "italic" }}>
                  {link.label}
                </span>
                <span style={{ color: "rgba(245,240,232,0.2)", fontSize: "12px" }}>→</span>
              </Link>
            ))}
          </div>
          <div className="pt-8 flex flex-col gap-4"
            style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.4s ease 0.4s, transform 0.4s ease 0.4s" }}>
            {user ? (
              <button onClick={handleSignOut} className="w-full flex items-center justify-center border"
                style={{ borderColor: "rgba(107,124,92,0.4)", minHeight: "52px", fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: OLIVE }}>
                Sign out
              </button>
            ) : (
              <>
                <Link href="/signup" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center border"
                  style={{ borderColor: OLIVE, minHeight: "52px", fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: OLIVE }}>
                  Join — The Inner Table
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center"
                  style={{ minHeight: "44px", fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Spacer */}
      <div className="hidden sm:block" style={{ height: "var(--navbar-h, 168px)" }} />
      <div className="sm:hidden" style={{ height: "64px" }} />
    </>
  );
}