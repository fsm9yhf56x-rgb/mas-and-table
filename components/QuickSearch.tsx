"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const SEASONS = [
  { value: "",        label: "Any season" },
  { value: "spring",  label: "Spring — March to May" },
  { value: "summer",  label: "Summer — June to August" },
  { value: "autumn",  label: "Autumn — September to November" },
];

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
  const [season,   setSeason]   = useState("");
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
    if (season)   params.set("season",   season);
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
        {/* Accroche gauche */}
        <div className="shrink-0 border-r border-[#2C2C2C]/10 pr-8">
          <p className="font-serif italic" style={{ fontSize: "15px", color: "#2C2C2C", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
            Your Provence
          </p>
          <p className="font-sans" style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B7C5C", marginTop: "3px" }}>
            is waiting
          </p>
        </div>
        <div className="flex-1 flex items-stretch"
          style={{ backgroundColor: "#FDFAF5", boxShadow: "0 4px 24px rgba(44,44,44,0.07)" }}>
          <SelectField label="When"      value={season}   onChange={setSeason}   options={SEASONS}     bordered />
          <SelectField label="How many"  value={guests}   onChange={setGuests}   options={GUESTS}      bordered />
          <SelectField label="What kind" value={category} onChange={setCategory} options={CATEGORIES}  bordered={false} />
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