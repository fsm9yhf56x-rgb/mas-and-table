"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    if (!firstName || !email || !password) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  }

  // ── Confirmation ──────────────────────────────────────────────
  if (done) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <Link href="/" className="font-serif text-[18px] text-[#2C2C2C] tracking-widest uppercase mb-16 block">
          Mas & Table
        </Link>
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-6">
          The Inner Table
        </p>
        <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-[#2C2C2C] leading-tight mb-6 max-w-lg">
          Welcome, <em>{firstName}.</em>
        </h1>
        <p className="font-sans text-lg text-[#2C2C2C]/60 leading-relaxed max-w-sm mb-10" style={{ fontWeight: 300 }}>
          Check your inbox — we&rsquo;ve sent a confirmation link to{" "}
          <span className="text-[#2C2C2C]">{email}</span>.
        </p>
        <p className="font-sans text-sm text-[#2C2C2C]/40 max-w-xs" style={{ fontWeight: 300 }}>
          Once confirmed, you&rsquo;ll have access to your bookings and everything Mas & Table keeps for those who look carefully.
        </p>
        <div className="mt-12 pt-12 border-t border-[#2C2C2C]/10 w-40">
          <Link
            href="/"
            className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-200"
          >
            Back to home →
          </Link>
        </div>
      </div>
    );
  }

  // ── Formulaire ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F5F0E8" }}>

      {/* ── Colonne gauche — éditoriale ── */}
      <div
        className="hidden sm:flex flex-col justify-between w-[45%] px-16 py-16"
        style={{ backgroundColor: "#2C2C2C" }}
      >
        <Link href="/" className="font-serif text-[22px] text-[#F5F0E8] tracking-widest uppercase">
          Mas & Table
        </Link>

        <div>
          <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-6">
            The Inner Table
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-[#F5F0E8] leading-tight mb-8">
            Some places<br />
            <em>you only find</em><br />
            if you know.
          </h2>
          <div className="space-y-4 max-w-xs">
            {[
              "Your bookings, in one place.",
              "Experiences we don't list publicly.",
              "Seasonal dispatches from Provence.",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <span className="text-[#6B7C5C] mt-1 flex-shrink-0">—</span>
                <p className="font-sans text-base text-[#F5F0E8]/60 leading-relaxed" style={{ fontWeight: 300 }}>
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-serif text-sm italic text-[#F5F0E8]/30">
          masandtable.com
        </p>
      </div>

      {/* ── Colonne droite — formulaire ── */}
      <div className="flex flex-col justify-center flex-1 px-6 sm:px-16 py-16">

        {/* Logo mobile */}
        <Link href="/" className="sm:hidden font-serif text-[18px] text-[#2C2C2C] tracking-widest uppercase mb-12 block">
          Mas & Table
        </Link>

        <div className="max-w-sm w-full mx-auto sm:mx-0">

          <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-3">
            The Inner Table
          </p>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] text-[#2C2C2C] leading-tight mb-2">
            Join.
          </h1>
          <p className="font-sans text-base text-[#2C2C2C]/50 mb-10" style={{ fontWeight: 300 }}>
            It takes less than a minute.
          </p>

          <div className="space-y-5">

            <div>
              <label className="block font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50 mb-2">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sarah"
                className="w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200"
                style={{ fontWeight: 300 }}
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200"
                style={{ fontWeight: 300 }}
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                placeholder="8 characters minimum"
                className="w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200"
                style={{ fontWeight: 300 }}
              />
            </div>

            {error && (
              <p className="font-sans text-sm text-red-500/80" style={{ fontWeight: 300 }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSignup}
              disabled={loading || !firstName || !email || !password}
              className="group relative w-full border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[12px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#FDFAF5] transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ padding: "18px 32px" }}
            >
              <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">
                {loading ? "Creating your account…" : "Join The Inner Table"}
              </span>
            </button>

          </div>

          <div className="mt-8 pt-8 border-t border-[#2C2C2C]/10">
            <p className="font-sans text-sm text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              Already a member?{" "}
              <Link href="/login" className="text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-200 underline underline-offset-2">
                Sign in
              </Link>
            </p>
            <p className="font-sans text-xs text-[#2C2C2C]/30 mt-4 leading-relaxed" style={{ fontWeight: 300 }}>
              By joining, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[#6B7C5C] transition-colors">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#6B7C5C] transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}