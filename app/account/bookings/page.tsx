"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  completed: "rgba(44,44,44,0.35)",
};

export default function AccountBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"all"|"upcoming"|"past">("all");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase
        .from("bookings")
        .select("*, experience:experiences(title, slug, zone, price_from)")
        .eq("customer_email", session.user.email)
        .order("booking_date", { ascending: false });
      setBookings(data ?? []);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const filtered = bookings.filter(b => {
    if (filter === "upcoming") return b.booking_date >= today && b.status !== "cancelled";
    if (filter === "past")     return b.booking_date < today || b.status === "completed";
    return true;
  });

  const FILTERS = [
    { value: "all",      label: "All" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past",     label: "Past" },
  ];

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-[#2C2C2C]/10 flex items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-2">Account</p>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] text-[#2C2C2C] leading-tight">
            <em>Bookings</em>
          </h1>
        </div>
        {/* Filtres */}
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value as any)}
              className="font-sans text-[10px] tracking-[0.35em] uppercase border transition-all duration-200"
              style={{
                padding: "7px 14px",
                background:   filter === f.value ? "#2C2C2C" : "transparent",
                color:        filter === f.value ? "#F5F0E8" : "rgba(44,44,44,0.40)",
                borderColor:  filter === f.value ? "#2C2C2C" : "rgba(44,44,44,0.12)",
                cursor: "pointer",
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "#F8F4EE" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl text-[#2C2C2C]/40 italic mb-6">No bookings here.</p>
          <Link href="/experiences"
            className="group relative inline-flex items-center gap-3 border border-[#6B7C5C] text-[#6B7C5C] font-sans text-[10px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
            style={{ padding: "14px 28px" }}>
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">Explore experiences</span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[#2C2C2C]/08">
          {filtered.map(b => (
            <div key={b.id} className="py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-center">
              <div className="sm:col-span-6">
                <Link href={`/experiences/${b.experience?.slug}`}
                  className="font-serif text-xl text-[#2C2C2C] hover:text-[#6B7C5C] transition-colors duration-200 leading-snug block mb-1">
                  {b.experience?.title ?? "Experience"}
                </Link>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/35" style={{ fontWeight: 300 }}>
                  {b.experience?.zone}
                </p>
              </div>
              <div className="sm:col-span-3">
                <p className="font-sans text-sm text-[#2C2C2C]/70" style={{ fontWeight: 300 }}>
                  {new Date(b.booking_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="font-sans text-xs text-[#2C2C2C]/40 mt-1" style={{ fontWeight: 300 }}>
                  {b.guests} {b.guests === 1 ? "guest" : "guests"}
                </p>
              </div>
              <div className="sm:col-span-2 sm:text-right">
                <p className="font-sans text-base text-[#2C2C2C] mb-1">€{b.amount_total?.toLocaleString("fr-FR")}</p>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase" style={{ color: STATUS_COLOR[b.status], fontWeight: 300 }}>
                  {STATUS_LABEL[b.status]}
                </p>
              </div>
              <div className="sm:col-span-1 sm:text-right">
                <p className="font-sans text-[10px] text-[#2C2C2C]/20" style={{ fontWeight: 300 }}>
                  {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}