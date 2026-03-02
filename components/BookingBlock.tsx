"use client";

import { useState } from "react";
import { Experience } from "@/types";
import { formatPrice } from "@/lib/utils";

interface BookingBlockProps {
  experience: Experience;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon=0
}

function toDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

export default function BookingBlock({ experience }: BookingBlockProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [calOpen, setCalOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const total = experience.price_from * guests;
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    const selected = new Date(viewYear, viewMonth, day);
    if (selected < today) return;
    setDate(toDateString(selected));
    setCalOpen(false);
  }

  function isPast(day: number) {
    return new Date(viewYear, viewMonth, day) < today;
  }

  function isSelected(day: number) {
    return date === toDateString(new Date(viewYear, viewMonth, day));
  }

  function isToday(day: number) {
    return toDateString(new Date(viewYear, viewMonth, day)) === toDateString(today);
  }

  // Build calendar grid (blanks + days)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="border border-[#2C2C2C]/15 p-8" style={{ backgroundColor: "#F8F4EE" }}>

      {/* Price */}
      <div className="mb-10 pb-8 border-b border-[#2C2C2C]/10">
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 mb-2">From</p>
        <p className="font-serif text-[clamp(2rem,3.5vw,3rem)] text-[#2C2C2C] leading-none">
          {formatPrice(experience.price_from)}
          <span className="font-sans text-base text-[#2C2C2C]/40 ml-2" style={{ fontWeight: 300 }}>/ person</span>
        </p>
      </div>

      {/* Date picker */}
      <div className="mb-5 relative">
        <label className="block font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 mb-3">Date</label>

        {/* Trigger */}
        <button
          onClick={() => setCalOpen(!calOpen)}
          className="w-full flex items-center justify-between border border-[#2C2C2C]/15 px-4 py-3 font-sans text-sm text-[#2C2C2C] focus:outline-none focus:border-[#6B7C5C] transition-colors text-left"
          style={{ backgroundColor: "#F5F0E8" }}
        >
          <span className={date ? "text-[#2C2C2C]" : "text-[#2C2C2C]/30"}>
            {date ? formatDisplay(date) : "Select a date"}
          </span>
          <span className="text-[#2C2C2C]/40 text-xs">
            {calOpen ? "▲" : "▼"}
          </span>
        </button>

        {/* Calendar dropdown */}
        {calOpen && (
          <div
            className="absolute top-full left-0 right-0 z-50 border border-[#2C2C2C]/15 p-5 mt-1"
            style={{ backgroundColor: "#F8F4EE" }}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors font-light"
              >
                ←
              </button>
              <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]">
                {MONTHS[viewMonth]} {viewYear}
              </p>
              <button
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors font-light"
              >
                →
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center font-sans text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/35 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, i) => (
                <div key={i} className="flex items-center justify-center">
                  {day === null ? null : (
                    <button
                      onClick={() => selectDay(day)}
                      disabled={isPast(day)}
                      className={`w-8 h-8 font-sans text-sm transition-all duration-150
                        ${isPast(day)
                          ? "text-[#2C2C2C]/20 cursor-not-allowed"
                          : isSelected(day)
                          ? "bg-[#2C2C2C] text-[#F5F0E8]"
                          : isToday(day)
                          ? "border border-[#6B7C5C] text-[#6B7C5C] hover:bg-[#6B7C5C] hover:text-[#F5F0E8]"
                          : "text-[#2C2C2C] hover:bg-[#2C2C2C]/08"
                        }`}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Clear */}
            {date && (
              <div className="mt-4 pt-4 border-t border-[#2C2C2C]/10 text-center">
                <button
                  onClick={() => { setDate(""); setCalOpen(false); }}
                  className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="mb-8">
        <label className="block font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 mb-3">Guests</label>
        <div className="flex items-center gap-4 border border-[#2C2C2C]/15 px-4 py-3" style={{ backgroundColor: "#F5F0E8" }}>
          <button
            onClick={() => setGuests(Math.max(experience.group_min, guests - 1))}
            className="w-6 h-6 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors text-lg"
          >−</button>
          <span className="flex-1 text-center font-sans text-sm text-[#2C2C2C]">
            {guests} {guests === 1 ? "guest" : "guests"}
          </span>
          <button
            onClick={() => setGuests(Math.min(experience.group_max, guests + 1))}
            className="w-6 h-6 flex items-center justify-center text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors text-lg"
          >+</button>
        </div>
        <p className="font-sans text-[11px] text-[#2C2C2C]/35 mt-2" style={{ fontWeight: 300 }}>
          {experience.group_min} to {experience.group_max} guests
        </p>
      </div>

      {/* Total */}
      <div className="border-t border-[#2C2C2C]/10 pt-6 mb-8">
        <div className="flex justify-between items-center">
          <p className="font-sans text-sm text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
            {formatPrice(experience.price_from)} × {guests} guests
          </p>
          <p className="font-serif text-2xl text-[#2C2C2C]">{formatPrice(total)}</p>
        </div>
      </div>

      {/* CTA */}
      <a
        href={date ? `/book/${experience.slug}?date=${date}&guests=${guests}` : "#"}
        onClick={(e) => { if (!date) e.preventDefault(); }}
        className={`group relative block w-full text-center font-sans text-[11px] tracking-[0.4em] uppercase py-5 overflow-hidden transition-colors duration-500 ${
          date
            ? "border border-[#2C2C2C] text-[#2C2C2C] hover:text-[#F5F0E8]"
            : "border border-[#2C2C2C]/20 text-[#2C2C2C]/30 cursor-not-allowed"
        }`}
      >
        {date && <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />}
        <span className="relative z-10">Reserve</span>
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