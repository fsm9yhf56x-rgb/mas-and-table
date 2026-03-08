"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [done, setDone]             = useState(false);
  const [validSession, setValidSession] = useState(false);

  // Supabase envoie le token dans le hash — on attend que la session soit établie
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
  }, []);

  async function handleReset() {
    if (!password || !confirm) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/"), 3000);
    }
  }

  // ── Succès ──
  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "#F5F0E8" }}>
        <Link href="/" className="font-serif text-[18px] text-[#2C2C2C] tracking-widest uppercase mb-16 block">
          Mas & Table
        </Link>
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-6">
          All done
        </p>
        <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-[#2C2C2C] leading-tight mb-6 max-w-md">
          Your password<br /><em>has been updated.</em>
        </h1>
        <p className="font-sans text-lg text-[#2C2C2C]/50 leading-relaxed max-w-sm" style={{ fontWeight: 300 }}>
          Redirecting you to the homepage…
        </p>
      </div>
    );
  }

  // ── Session invalide (lien expiré) ──
  if (!validSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "#F5F0E8" }}>
        <Link href="/" className="font-serif text-[18px] text-[#2C2C2C] tracking-widest uppercase mb-16 block">
          Mas & Table
        </Link>
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] text-[#2C2C2C] leading-tight mb-6 max-w-md">
          This link<br /><em>has expired.</em>
        </h1>
        <p className="font-sans text-lg text-[#2C2C2C]/50 leading-relaxed max-w-sm mb-10" style={{ fontWeight: 300 }}>
          Password reset links are valid for 1 hour. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="group relative inline-flex items-center gap-4 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
          style={{ padding: "16px 32px" }}
        >
          <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">Request a new link</span>
        </Link>
      </div>
    );
  }

  // ── Formulaire ──
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F5F0E8" }}>

      {/* Colonne gauche */}
      <div className="hidden sm:flex flex-col justify-between w-[45%] px-16 py-16" style={{ backgroundColor: "#2C2C2C" }}>
        <Link href="/" className="font-serif text-[22px] text-[#F5F0E8] tracking-widest uppercase">
          Mas & Table
        </Link>
        <div>
          <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-6">
            Almost there
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-[#F5F0E8] leading-tight">
            A new key<br />
            <em>to the same</em><br />
            Provence.
          </h2>
        </div>
        <p className="font-serif text-sm italic text-[#F5F0E8]/30">masandtable.com</p>
      </div>

      {/* Colonne droite */}
      <div className="flex flex-col justify-center flex-1 px-6 sm:px-16 py-16">

        <Link href="/" className="sm:hidden font-serif text-[18px] text-[#2C2C2C] tracking-widest uppercase mb-12 block">
          Mas & Table
        </Link>

        <div className="max-w-sm w-full mx-auto sm:mx-0">
          <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-3">
            Reset password
          </p>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] text-[#2C2C2C] leading-tight mb-2">
            Choose a new<br /><em>password.</em>
          </h1>
          <p className="font-sans text-base text-[#2C2C2C]/50 mb-10" style={{ fontWeight: 300 }}>
            At least 8 characters.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50 mb-2">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200"
                style={{ fontWeight: 300 }}
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/50 mb-2">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                placeholder="••••••••"
                className="w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200"
                style={{ fontWeight: 300 }}
              />
            </div>

            {error && (
              <p className="font-sans text-sm text-red-500/80" style={{ fontWeight: 300 }}>{error}</p>
            )}

            <button
              onClick={handleReset}
              disabled={loading || !password || !confirm}
              className="group relative w-full border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[12px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#FDFAF5] transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ padding: "18px 32px" }}
            >
              <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">{loading ? "Updating…" : "Update password"}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}