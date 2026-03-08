"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDate(d: string) {
  const date = new Date(d);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function AccountOverview() {
  const [stats, setStats]       = useState({ bookings: 0, wishlist: 0, giftCards: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const email = session.user.email!;
      const uid   = session.user.id;
      setFirstName(session.user.user_metadata?.first_name ?? "");

      const [{ count: bCount }, { count: wCount }, { count: gCount }, { data: upcomingData }] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("customer_email", email),
        supabase.from("wishlists").select("*", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("gift_cards").select("*", { count: "exact", head: true }).eq("buyer_email", email).eq("status", "active"),
        supabase.from("bookings")
          .select("id, booking_date, guests, amount_total, experience:experiences(title, slug, zone)")
          .eq("customer_email", email)
          .in("status", ["confirmed", "pending"])
          .gte("booking_date", new Date().toISOString().split("T")[0])
          .order("booking_date", { ascending: true })
          .limit(3),
      ]);

      setStats({ bookings: bCount ?? 0, wishlist: wCount ?? 0, giftCards: gCount ?? 0 });
      setUpcoming(upcomingData ?? []);
      setLoaded(true);
    });
  }, []);

  return (
    <div>

      {/* Hero greeting */}
      <div className="mb-14 pb-12 border-b border-[#2C2C2C]/10">
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-5 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-[#6B7C5C]" />
          The Inner Table
        </p>
        <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] text-[#2C2C2C] leading-[1.1]">
          Welcome back,<br />
          <em>{firstName || "traveller"}.</em>
        </h1>
        <p className="font-sans text-base text-[#2C2C2C]/40 mt-4" style={{ fontWeight: 300, maxWidth: "420px" }}>
          Your Provence, in one place. Everything you&apos;ve saved, booked, and yet to discover.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px mb-14" style={{ backgroundColor: "rgba(44,44,44,0.08)" }}>
        {[
          { label: "Experiences booked", value: stats.bookings,  href: "/account/bookings"   },
          { label: "Saved to wishlist",   value: stats.wishlist,  href: "/account/wishlist"   },
          { label: "Gift cards active",   value: stats.giftCards, href: "/account/gift-cards" },
        ].map((t) => (
          <Link key={t.href} href={t.href}
            className="group flex flex-col justify-between p-6 sm:p-8 hover:bg-[#EDE8DF] transition-colors duration-300"
            style={{ backgroundColor: "#F5F0E8" }}>
            <span
              className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-[#2C2C2C] leading-none mb-4"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            >
              {t.value}
            </span>
            <div>
              <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#2C2C2C]/40 mb-2" style={{ fontWeight: 300 }}>
                {t.label}
              </p>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#6B7C5C] translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                View →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div className="mb-14">
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/30 mb-8">
          Your bookings
        </p>

        {!loaded ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "#F0EBE1" }} />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="py-16 px-10 border border-[#2C2C2C]/08 flex flex-col items-center text-center" style={{ backgroundColor: "#FDFAF5" }}>
            <p className="font-serif text-2xl text-[#2C2C2C] italic mb-2">No bookings yet.</p>
            <p className="font-sans text-sm text-[#2C2C2C]/35 mb-8" style={{ fontWeight: 300 }}>
              The Provence few travellers ever find is waiting for you.
            </p>
            <Link href="/experiences"
              className="group relative inline-flex items-center border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[10px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
              style={{ padding: "14px 32px" }}>
              <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Explore experiences</span>
            </Link>
          </div>
        ) : (
          <div className="border border-[#2C2C2C]/08 divide-y divide-[#2C2C2C]/06" style={{ backgroundColor: "#FDFAF5" }}>
            {upcoming.map((b) => (
              <div key={b.id} className="px-8 py-6 flex items-center justify-between gap-6 hover:bg-[#F5F0E8] transition-colors duration-200">
                <div className="min-w-0">
                  <Link href={`/experiences/${b.experience?.slug}`}
                    className="font-serif text-lg text-[#2C2C2C] hover:text-[#6B7C5C] transition-colors duration-200 block truncate">
                    {b.experience?.title}
                  </Link>
                  <p className="font-sans text-[11px] text-[#2C2C2C]/40 mt-1 flex items-center gap-3" style={{ fontWeight: 300 }}>
                    <span>{formatDate(b.booking_date)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#2C2C2C]/20 inline-block" />
                    <span>{b.guests} {b.guests === 1 ? "guest" : "guests"}</span>
                    <span className="w-1 h-1 rounded-full bg-[#2C2C2C]/20 inline-block" />
                    <span>{b.experience?.zone}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block font-sans text-[9px] tracking-[0.35em] uppercase px-3 py-1.5 text-[#6B7C5C]"
                    style={{ border: "1px solid rgba(107,124,92,0.3)", backgroundColor: "rgba(107,124,92,0.06)" }}>
                    Confirmed
                  </span>
                  <p className="font-sans text-xs text-[#2C2C2C]/35 mt-2" style={{ fontWeight: 300 }}>
                    {(b.amount_total / 100).toLocaleString("en-GB", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
              </div>
            ))}
            <div className="px-8 py-4">
              <Link href="/account/bookings"
                className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-200">
                View all bookings →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Discover strip */}
      <div className="flex items-center justify-between py-8 px-8 border border-[#2C2C2C]/08"
        style={{ backgroundColor: "#FDFAF5" }}>
        <div>
          <p className="font-serif text-xl text-[#2C2C2C] italic mb-1">Ready for your next experience?</p>
          <p className="font-sans text-sm text-[#2C2C2C]/35" style={{ fontWeight: 300 }}>
            New estates and tables added every season.
          </p>
        </div>
        <Link href="/experiences"
          className="group relative inline-flex items-center border border-[#6B7C5C] text-[#6B7C5C] font-sans text-[10px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 shrink-0 ml-6"
          style={{ padding: "12px 24px" }}>
          <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">Explore</span>
        </Link>
      </div>

    </div>
  );
}