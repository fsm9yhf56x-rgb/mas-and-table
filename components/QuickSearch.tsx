"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const GUESTS = [
  { value: "",    label: "Any group size" },
  { value: "2",   label: "2 guests" },
  { value: "4",   label: "3–4 guests" },
  { value: "8",   label: "5–8 guests" },
  { value: "20",  label: "9–20 guests" },
];

const CATEGORIES = [
  { value: "",            label: "Any experience" },
  { value: "une_journee", label: "Une Journée — A Table" },
  { value: "un_sejour",   label: "Un Séjour — Among the Vines" },
  { value: "une_saison",  label: "Une Saison — Lost in Provence" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function CalendarDropdown({
  value, onChange, onClose,
}: {
  value: string; onChange: (v: string) => void; onClose: () => void;
}) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(value ? parseInt(value.split("-")[0]) : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.split("-")[1]) - 1 : today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Jours du mois — commence lundi
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);   // offset pour lundi
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Compléter pour avoir des rangées complètes
  while (cells.length % 7 !== 0) cells.push(null);

  function selectDay(day: number) {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    onClose();
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  }

  function isSelected(day: number) {
    if (!value) return false;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return value === `${viewYear}-${mm}-${dd}`;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        left: 0,
        zIndex: 100,
        backgroundColor: "#FDFAF5",
        border: "1px solid rgba(44,44,44,0.10)",
        boxShadow: "0 16px 48px rgba(44,44,44,0.12)",
        padding: "24px",
        minWidth: "300px",
      }}
    >
      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth}
          style={{ color: "rgba(44,44,44,0.35)", fontSize: "14px", cursor: "pointer", background: "none", border: "none", padding: "4px 8px" }}
          className="hover:text-[#2C2C2C] transition-colors duration-200">
          ←
        </button>
        <p className="font-serif"
          style={{ fontSize: "16px", color: "#2C2C2C", letterSpacing: "0.04em" }}>
          <em>{MONTHS[viewMonth]}</em> {viewYear}
        </p>
        <button onClick={nextMonth}
          style={{ color: "rgba(44,44,44,0.35)", fontSize: "14px", cursor: "pointer", background: "none", border: "none", padding: "4px 8px" }}
          className="hover:text-[#2C2C2C] transition-colors duration-200">
          →
        </button>
      </div>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="flex items-center justify-center"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,44,44,0.35)", paddingBottom: "8px" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grille jours */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const past     = isPast(day);
          const selected = isSelected(day);
          return (
            <button
              key={i}
              onClick={() => !past && selectDay(day)}
              disabled={past}
              style={{
                height: "36px",
                width: "36px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: selected ? 500 : 300,
                color: selected ? "#FDFAF5" : past ? "rgba(44,44,44,0.18)" : "#2C2C2C",
                backgroundColor: selected ? "#6B7C5C" : "transparent",
                border: "none",
                cursor: past ? "not-allowed" : "pointer",
                transition: "background-color 0.15s ease, color 0.15s ease",
              }}
              className={!past && !selected ? "hover:bg-[#F5F0E8]" : ""}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Clear */}
      {value && (
        <div className="mt-4 pt-4 border-t border-[#2C2C2C]/08 text-center">
          <button
            onClick={() => { onChange(""); onClose(); }}
            style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,44,44,0.35)", background: "none", border: "none", cursor: "pointer" }}
            className="hover:text-[#2C2C2C] transition-colors duration-200"
          >
            Clear date
          </button>
        </div>
      )}
    </div>
  );
}

function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const displayValue = value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div ref={ref} className="flex-1 flex flex-col py-4 px-7 relative cursor-pointer select-none"
      style={{ borderRight: "1px solid rgba(44,44,44,0.09)" }}
      onClick={() => setOpen(o => !o)}
    >
      <span className="font-sans mb-2 block"
        style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(44,44,44,0.55)", fontWeight: 500 }}>
        When
      </span>
      <div className="flex items-center">
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "15px",
          fontStyle: "italic",
          color: value ? "#2C2C2C" : "rgba(44,44,44,0.65)",
          flex: 1,
        }}>
          {displayValue ?? "Any date"}
        </span>
        <span style={{ color: "#6B7C5C", fontSize: "10px" }}>↓</span>
      </div>

      {open && (
        <CalendarDropdown value={value} onChange={onChange} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

function SelectField({
  label, value, onChange, options, bordered = true,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; bordered?: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col py-4 px-7"
      style={{ borderRight: bordered ? "1px solid rgba(44,44,44,0.09)" : "none" }}>
      <span className="font-sans mb-2 block"
        style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(44,44,44,0.55)", fontWeight: 500 }}>
        {label}
      </span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none outline-none cursor-pointer appearance-none pr-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "15px", fontStyle: "italic", color: value ? "#2C2C2C" : "rgba(44,44,44,0.65)" }}>
          {options.map((o) => (
            <option key={o.value} value={o.value}
              style={{ fontStyle: "normal", fontFamily: "Inter, sans-serif", color: "#2C2C2C" }}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
          style={{ color: "#6B7C5C", fontSize: "10px" }}>↓</span>
      </div>
    </div>
  );
}

export default function QuickSearch() {
  const router   = useRouter();
  const [date,     setDate]     = useState("");
  const [guests,   setGuests]   = useState("");
  const [category, setCategory] = useState("");
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (date)     params.set("date",     date);
    if (guests)   params.set("guests",   guests);
    router.push(`/experiences${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div
      className="hidden sm:block fixed left-0 right-0 z-40"
      id="quicksearch-sticky"
      style={{
        top: "155px",
        backgroundColor: "#F8F4EE",
        borderBottom: "1px solid rgba(44,44,44,0.10)",
        boxShadow: "0 4px 20px rgba(44,44,44,0.08)",
        paddingTop: "2px",
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-16 py-3 flex items-center gap-8">
        <div className="shrink-0 border-r border-[#2C2C2C]/10 pr-8">
          <p className="font-serif italic" style={{ fontSize: "15px", color: "#2C2C2C", whiteSpace: "nowrap" }}>
            Your Provence
          </p>
          <p className="font-sans" style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B7C5C", marginTop: "3px" }}>
            is waiting
          </p>
        </div>

        <div className="flex-1 flex items-stretch"
          style={{ backgroundColor: "#FDFAF5", boxShadow: "0 4px 24px rgba(44,44,44,0.07)" }}>
          <DateField   value={date}     onChange={setDate} />
          <SelectField label="How many"  value={guests}   onChange={setGuests}   options={GUESTS}     bordered />
          <SelectField label="What kind" value={category} onChange={setCategory} options={CATEGORIES} bordered={false} />
          <button onClick={handleSearch}
            className="group relative flex items-center gap-4 overflow-hidden shrink-0"
            style={{ backgroundColor: "#6B7C5C", padding: "0 36px", fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#FDFAF5", border: "none", minWidth: "160px", justifyContent: "center", cursor: "pointer" }}>
            <span className="absolute inset-0 bg-[#2C2C2C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">Show me</span>
            <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}