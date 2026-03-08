"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/");
    }
  }

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
            The Provence<br />
            <em>few travellers</em><br />
            ever find.
          </h2>
          <p className="font-sans text-base text-[#F5F0E8]/50 leading-relaxed max-w-xs" style={{ fontWeight: 300 }}>
            Your account gives you access to your bookings, your history, and the experiences we reserve for those who know where to look.
          </p>
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
          <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] text-[#2C2C2C] leading-tight mb-10">
            Welcome back.
          </h1>

          <div className="space-y-5">

            <div>
              <label className="block font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
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
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="group relative w-full border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[12px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#FDFAF5] transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ padding: "18px 32px" }}
            >
              <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">
                {loading ? "Signing in…" : "Sign in"}
              </span>
            </button>

          </div>

          <div className="mt-8 pt-8 border-t border-[#2C2C2C]/10 flex flex-col gap-3">
            <p className="font-sans text-sm text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              Not yet a member?{" "}
              <Link href="/signup" className="text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-200 underline underline-offset-2">
                Join The Inner Table
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="font-sans text-sm text-[#2C2C2C]/30 hover:text-[#2C2C2C]/60 transition-colors duration-200"
              style={{ fontWeight: 300 }}
            >
              Forgot your password?
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}