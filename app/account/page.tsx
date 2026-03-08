"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser]           = useState<any>(null);
  const [bookings, setBookings]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("bookings")
        .select("*, experience:experiences(title, slug, zone, price_from)")
        .eq("customer_email", session.user.email)
        .order("created_at", { ascending: false });

      setBookings(data ?? []);
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const firstName = user?.user_metadata?.first_name ?? user?.email?.split("@")[0] ?? "there";

  const STATUS_LABEL: Record<string, string> = {
    pending:   "Awaiting confirmation",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
  };
  const STATUS_COLOR: Record<string, string> = {
    pending:   "rgba(44,44,44,0.40)",
    confirmed: "#6B7C5C",
    cancelled: "#C4714F",
    completed: "rgba(44,44,44,0.40)",
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <p className="font-serif italic text-xl text-[#2C2C2C]/40">Loading…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0E8]">

        {/* ── HEADER ── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-5xl mx-auto px-6 sm:px-16 py-16 sm:py-24">
            <div className="flex items-center gap-4 mb-8">
              <span className="block w-6 sm:w-8 h-px bg-[#6B7C5C]" />
              <p className="font-sans text-[11px] sm:text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">
                The Inner Table
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h1 className="font-serif text-[clamp(2.5rem,7vw,4.5rem)] text-[#2C2C2C] leading-[1.05] tracking-tight">
                Welcome back,<br /><em>{firstName}.</em>
              </h1>
              <button
                onClick={handleSignOut}
                className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#2C2C2C]/35 hover:text-[#2C2C2C] transition-colors duration-200 self-start sm:self-end pb-1"
              >
                Sign out →
              </button>
            </div>
          </div>
        </section>

        {/* ── BOOKINGS ── */}
        <section>
          <div className="max-w-5xl mx-auto px-6 sm:px-16 py-16 sm:py-24">

            <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-10">
              Your bookings
            </p>

            {bookings.length === 0 ? (
              <div className="py-16 sm:py-24 text-center border border-[#2C2C2C]/08">
                <p className="font-serif text-2xl sm:text-3xl text-[#2C2C2C] mb-4">
                  No bookings yet.
                </p>
                <p className="font-sans text-lg text-[#2C2C2C]/45 mb-10" style={{ fontWeight: 300 }}>
                  The Provence few travellers ever find is waiting for you.
                </p>
                <Link
                  href="/experiences"
                  className="group relative inline-flex items-center gap-4 border border-[#6B7C5C] text-[#6B7C5C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
                  style={{ padding: "16px 32px" }}
                >
                  <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10">Explore experiences</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#2C2C2C]/08">
                {bookings.map((b) => (
                  <div key={b.id} className="py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start">
                    <div className="sm:col-span-7">
                      <Link
                        href={`/experiences/${b.experience?.slug}`}
                        className="font-serif text-xl sm:text-2xl text-[#2C2C2C] hover:text-[#6B7C5C] transition-colors duration-200 leading-snug block mb-2"
                      >
                        {b.experience?.title ?? "Experience"}
                      </Link>
                      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/40 mb-1" style={{ fontWeight: 300 }}>
                        {b.experience?.zone}
                      </p>
                      <p className="font-sans text-sm text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
                        {new Date(b.booking_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        {" · "}{b.guests} {b.guests === 1 ? "guest" : "guests"}
                      </p>
                    </div>
                    <div className="sm:col-span-3 sm:text-right">
                      <p className="font-sans text-lg text-[#2C2C2C] mb-1">
                        €{b.amount_total?.toLocaleString("fr-FR")}
                      </p>
                      <p className="font-sans text-[11px] tracking-[0.3em] uppercase"
                        style={{ color: STATUS_COLOR[b.status] ?? "rgba(44,44,44,0.40)", fontWeight: 300 }}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </p>
                    </div>
                    <div className="sm:col-span-2 sm:text-right">
                      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/25" style={{ fontWeight: 300 }}>
                        {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}