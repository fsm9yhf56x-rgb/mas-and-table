"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Experience } from "@/types";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface BookingBlockProps {
  experience: Experience;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDayOfMonth(y: number, m: number) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function toDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function formatDisplay(s: string) {
  const [y,m,d] = s.split("-");
  return `${d} ${MONTHS[parseInt(m)-1].slice(0,3)} ${y}`;
}
function addDays(s: string, n: number) {
  const d = new Date(s); d.setDate(d.getDate() + n); return toDateString(d);
}
function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
function isBetween(d: string, a: string, b: string) {
  return d > a && d < b;
}

export default function BookingBlock({ experience }: BookingBlockProps) {
  const today = toDateString(new Date());

  // Range selection
  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hoverDate, setHoverDate] = useState("");
  const [selecting, setSelecting] = useState<"in"|"out"|null>(null);

  // Calendar navigation
  const [calOpen, setCalOpen]   = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  // Guests
  const [guests, setGuests] = useState(experience.group_min || 2);

  // Blocked dates
  const [blocked, setBlocked] = useState<{from: string; to: string}[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  // Refs
  const calRef = useRef<HTMLDivElement>(null);

  // Fetch blocked dates from Supabase
  useEffect(() => {
    if (!experience.id) return;
    setLoadingDates(true);
    supabase
      .from("availability_blocks")
      .select("date_from, date_to")
      .eq("experience_id", experience.id)
      .then(({ data }) => {
        // Also fetch confirmed bookings
        supabase
          .from("bookings")
          .select("booking_date")
          .eq("experience_id", experience.id)
          .in("status", ["confirmed", "pending"])
          .then(({ data: bookings }) => {
            const blocks = (data || []).map((b: any) => ({
              from: b.date_from,
              to: b.date_to
            }));
            const bookingBlocks = (bookings || []).map((b: any) => ({
              from: b.booking_date,
              to: b.booking_date
            }));
            setBlocked([...blocks, ...bookingBlocks]);
            setLoadingDates(false);
          });
      });
  }, [experience.id]);

  // Close on outside click
  useEffect(() => {
    if (!calOpen) return;
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
        setSelecting(null);
        setHoverDate("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calOpen]);

  // Check if a date is blocked
  const isBlocked = useCallback((dateStr: string) => {
    return blocked.some(b => dateStr >= b.from && dateStr <= b.to);
  }, [blocked]);

  // Check if range contains any blocked date
  const rangeHasBlocked = useCallback((from: string, to: string) => {
    if (!from || !to) return false;
    let d = from;
    while (d <= to) {
      if (isBlocked(d)) return true;
      d = addDays(d, 1);
    }
    return false;
  }, [isBlocked]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    const dateStr = toDateString(new Date(viewYear, viewMonth, day));
    if (dateStr < today || isBlocked(dateStr)) return;

    if (!selecting || selecting === "in") {
      // First click: set check-in, start selecting check-out
      setCheckIn(dateStr);
      setCheckOut("");
      setSelecting("out");
    } else {
      // Second click: set check-out
      if (dateStr <= checkIn) {
        // Clicked before check-in → reset and start over
        setCheckIn(dateStr);
        setCheckOut("");
        setSelecting("out");
        return;
      }
      if (rangeHasBlocked(checkIn, dateStr)) {
        // Range crosses blocked date → reset
        setCheckIn(dateStr);
        setCheckOut("");
        setSelecting("out");
        return;
      }
      setCheckOut(dateStr);
      setSelecting(null);
      // Keep calendar open briefly then close
      setTimeout(() => setCalOpen(false), 300);
    }
  }

  function handleMouseEnter(day: number) {
    if (selecting !== "out") return;
    setHoverDate(toDateString(new Date(viewYear, viewMonth, day)));
  }

  function clearDates() {
    setCheckIn("");
    setCheckOut("");
    setSelecting(null);
    setHoverDate("");
  }

  function isPast(day: number) {
    return toDateString(new Date(viewYear, viewMonth, day)) < today;
  }

  function getDateStr(day: number) {
    return toDateString(new Date(viewYear, viewMonth, day));
  }

  // Visual state for each day
  function getDayState(day: number): "past"|"blocked"|"checkIn"|"checkOut"|"inRange"|"hoverRange"|"hoverEnd"|"today"|"normal" {
    const d = getDateStr(day);
    if (isPast(day)) return "past";
    if (isBlocked(d)) return "blocked";
    if (d === checkIn) return "checkIn";
    if (d === checkOut) return "checkOut";
    if (checkIn && checkOut && isBetween(d, checkIn, checkOut)) return "inRange";
    // Hover preview
    if (selecting === "out" && checkIn && hoverDate > checkIn) {
      if (d === hoverDate) return "hoverEnd";
      if (isBetween(d, checkIn, hoverDate) && !isBlocked(d)) return "hoverRange";
    }
    if (toDateString(new Date()) === d) return "today";
    return "normal";
  }

  // Night count
  const nights = checkIn && checkOut ? daysBetween(checkIn, checkOut) : 0;
  const total   = experience.price_from * guests * (nights || 1);
  const canBook = checkIn && checkOut && nights > 0;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Label on top of calendar
  const calLabel = !selecting && !checkIn
    ? "Select your arrival date"
    : selecting === "out"
    ? "Now select your departure date"
    : checkIn && checkOut
    ? `${formatDisplay(checkIn)} → ${formatDisplay(checkOut)}`
    : "Select your arrival date";

  return (
    <div className="border border-[#2C2C2C]/15 p-8" style={{ backgroundColor: "#F8F4EE" }}>

      {/* Price */}
      <div className="mb-8 pb-8 border-b border-[#2C2C2C]/10">
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 mb-2">From</p>
        <p className="font-serif text-[clamp(2rem,3.5vw,3rem)] text-[#2C2C2C] leading-none">
          {formatPrice(experience.price_from)}
          <span className="font-sans text-base text-[#2C2C2C]/40 ml-2" style={{ fontWeight: 300 }}>/ person / night</span>
        </p>
      </div>

      {/* Date range trigger */}
      <div className="mb-5 relative" ref={calRef}>
        <label className="block font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 mb-3">
          Dates
        </label>

        {/* Two-field display */}
        <div className="grid grid-cols-2 gap-px mb-1" style={{ backgroundColor: "rgba(44,44,44,0.12)" }}>
          <button
            onClick={() => { setCalOpen(true); setSelecting("in"); }}
            className="flex flex-col px-4 py-3 text-left focus:outline-none transition-colors duration-200"
            style={{ backgroundColor: calOpen && selecting === "in" ? "#EDE8DF" : "#F5F0E8" }}
          >
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#2C2C2C]/40 mb-1">Arrival</span>
            <span className={`font-sans text-sm ${checkIn ? "text-[#2C2C2C]" : "text-[#2C2C2C]/30"}`}>
              {checkIn ? formatDisplay(checkIn) : "Add date"}
            </span>
          </button>
          <button
            onClick={() => { if (checkIn) { setCalOpen(true); setSelecting("out"); } else { setCalOpen(true); setSelecting("in"); } }}
            className="flex flex-col px-4 py-3 text-left focus:outline-none transition-colors duration-200"
            style={{ backgroundColor: calOpen && selecting === "out" ? "#EDE8DF" : "#F5F0E8" }}
          >
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#2C2C2C]/40 mb-1">Departure</span>
            <span className={`font-sans text-sm ${checkOut ? "text-[#2C2C2C]" : "text-[#2C2C2C]/30"}`}>
              {checkOut ? formatDisplay(checkOut) : "Add date"}
            </span>
          </button>
        </div>

        {nights > 0 && (
          <p className="font-sans text-[11px] text-[#6B7C5C] mt-1" style={{ fontWeight: 300 }}>
            {nights} {nights === 1 ? "night" : "nights"} selected
          </p>
        )}

        {/* Calendar dropdown */}
        <div
          className="absolute top-full left-0 right-0 z-50 border border-[#2C2C2C]/15 mt-1 overflow-hidden"
          style={{
            backgroundColor: "#F8F4EE",
            maxHeight: calOpen ? "420px" : "0px",
            opacity: calOpen ? 1 : 0,
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
            pointerEvents: calOpen ? "auto" : "none",
          }}
        >
          {/* Calendar header */}
          <div className="px-5 pt-5 pb-3">
            <p
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-center mb-4 transition-all duration-300"
              style={{ color: selecting === "out" ? "#6B7C5C" : "rgba(44,44,44,0.45)" }}
            >
              {calLabel}
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors"
              >←</button>
              <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]">
                {MONTHS[viewMonth]} {viewYear}
              </p>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors"
              >→</button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-4 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center font-sans text-[9px] tracking-[0.2em] uppercase text-[#2C2C2C]/30 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 px-3 pb-3">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const state = getDayState(day);
              const d = getDateStr(day);

              const isRangeStart = state === "checkIn";
              const isRangeEnd   = state === "checkOut" || state === "hoverEnd";
              const isMiddle     = state === "inRange" || state === "hoverRange";
              const isDisabled   = state === "past" || state === "blocked";

              return (
                <div
                  key={i}
                  className="relative flex items-center justify-center h-9"
                  style={{
                    backgroundColor: isMiddle
                      ? state === "inRange" ? "rgba(44,44,44,0.07)" : "rgba(107,124,92,0.08)"
                      : "transparent"
                  }}
                >
                  {/* Range left half for end day */}
                  {isRangeEnd && checkIn && (
                    <div className="absolute inset-y-0 left-0 w-1/2"
                      style={{ backgroundColor: "rgba(44,44,44,0.07)" }} />
                  )}
                  {/* Range right half for start day */}
                  {isRangeStart && (checkOut || (selecting === "out" && hoverDate > d)) && (
                    <div className="absolute inset-y-0 right-0 w-1/2"
                      style={{ backgroundColor: selecting === "out" ? "rgba(107,124,92,0.08)" : "rgba(44,44,44,0.07)" }} />
                  )}

                  <button
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseLeave={() => setHoverDate("")}
                    onClick={() => selectDay(day)}
                    disabled={isDisabled}
                    className="relative z-10 w-8 h-8 font-sans text-sm transition-all duration-100"
                    style={{
                      backgroundColor:
                        isRangeStart || isRangeEnd
                          ? "#2C2C2C"
                          : state === "today"
                          ? "transparent"
                          : "transparent",
                      color:
                        isDisabled
                          ? state === "blocked" ? "#C4714F" : "rgba(44,44,44,0.2)"
                          : isRangeStart || isRangeEnd
                          ? "#F5F0E8"
                          : state === "today"
                          ? "#6B7C5C"
                          : "#2C2C2C",
                      border:
                        state === "today" && !isRangeStart && !isRangeEnd
                          ? "1px solid rgba(107,124,92,0.5)"
                          : "1px solid transparent",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      textDecoration: state === "blocked" ? "line-through" : "none",
                      opacity: state === "blocked" ? 0.5 : 1,
                      borderRadius: 0,
                    }}
                    title={state === "blocked" ? "Unavailable" : undefined}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Legend + clear */}
          <div className="px-5 pb-4 flex items-center justify-between border-t border-[#2C2C2C]/08 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3" style={{ backgroundColor: "#2C2C2C" }} />
                <span className="font-sans text-[9px] text-[#2C2C2C]/40 uppercase tracking-wider">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 border border-[#C4714F]/50" style={{ backgroundColor: "rgba(196,113,79,0.1)" }} />
                <span className="font-sans text-[9px] text-[#2C2C2C]/40 uppercase tracking-wider">Unavailable</span>
              </div>
            </div>
            {(checkIn || checkOut) && (
              <button
                onClick={clearDates}
                className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#2C2C2C]/35 hover:text-[#2C2C2C] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="mb-8">
        <label className="block font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 mb-3">Guests</label>
        <div className="flex items-center gap-4 border border-[#2C2C2C]/15 px-4 py-3" style={{ backgroundColor: "#F5F0E8" }}>
          <button
            onClick={() => setGuests(Math.max(experience.group_min || 1, guests - 1))}
            className="w-6 h-6 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors text-lg"
          >−</button>
          <span className="flex-1 text-center font-sans text-sm text-[#2C2C2C]">
            {guests} {guests === 1 ? "guest" : "guests"}
          </span>
          <button
            onClick={() => setGuests(Math.min(experience.group_max || 20, guests + 1))}
            className="w-6 h-6 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors text-lg"
          >+</button>
        </div>
        <p className="font-sans text-[11px] text-[#2C2C2C]/35 mt-2" style={{ fontWeight: 300 }}>
          {experience.group_min || 1} to {experience.group_max || 20} guests
        </p>
      </div>

      {/* Total */}
      <div className="border-t border-[#2C2C2C]/10 pt-6 mb-8">
        {nights > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-sans text-sm text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
                {formatPrice(experience.price_from)} × {guests} guests × {nights} {nights === 1 ? "night" : "nights"}
              </p>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#2C2C2C]/08">
              <p className="font-sans text-sm text-[#2C2C2C]/60" style={{ fontWeight: 300 }}>Total</p>
              <p className="font-serif text-2xl text-[#2C2C2C]">{formatPrice(total)}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="font-sans text-sm text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
              {formatPrice(experience.price_from)} × {guests} guests
            </p>
            <p className="font-serif text-2xl text-[#2C2C2C]/30">{formatPrice(experience.price_from * guests)}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href={canBook ? `/book/${experience.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&nights=${nights}` : "#"}
        onClick={(e) => { if (!canBook) e.preventDefault(); }}
        className={`group relative block w-full text-center font-sans text-[11px] tracking-[0.4em] uppercase py-5 overflow-hidden transition-colors duration-500 ${
          canBook
            ? "border border-[#2C2C2C] text-[#2C2C2C] hover:text-[#F5F0E8] cursor-pointer"
            : "border border-[#2C2C2C]/20 text-[#2C2C2C]/30 cursor-not-allowed"
        }`}
      >
        {canBook && (
          <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        )}
        <span className="relative z-10">
          {!checkIn ? "Select dates to reserve" : !checkOut ? "Select departure date" : "Reserve"}
        </span>
      </a>

      <p className="font-sans text-[11px] text-[#2C2C2C]/40 text-center mt-4 leading-relaxed" style={{ fontWeight: 300 }}>
        You won&rsquo;t be charged until your host confirms — usually within 24 hours.
      </p>

      {/* Cancellation */}
      <div className="mt-8 border-t border-[#2C2C2C]/10 pt-6">
        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-3">Cancellation policy</p>
        <p className="font-sans text-[11px] text-[#2C2C2C]/40 leading-relaxed" style={{ fontWeight: 300 }}>
          Free cancellation up to 14 days before. 50% refund between 7–14 days. No refund within 7 days.
        </p>
      </div>

    </div>
  );
}