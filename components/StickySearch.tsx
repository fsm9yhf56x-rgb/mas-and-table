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
  { value: "une_journee", label: "Une Journée" },
  { value: "un_sejour",   label: "Un Séjour" },
  { value: "une_saison",  label: "Une Saison" },
];

export default function StickySearch() {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [season,   setSeason]   = useState("");
  const [guests,   setGuests]   = useState("");
  const [category, setCategory] = useState("");

  // Apparaît après 300px de scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme au clic dehors
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const el = document.getElementById("sticky-search");
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (season)   params.set("season",   season);
    if (guests)   params.set("guests",   guests);
    router.push(`/experiences${params.toString() ? `?${params}` : ""}`);
    setOpen(false);
  }

  return (
    <div
      id="sticky-search"
      className="fixed z-40 hidden sm:flex flex-col items-end"
      style={{
        right: 0,
        top: "calc(50% + 20px)",
        transform: "translateY(-50%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
    >

      {/* ── Card ouverte ── */}
      <div
        style={{
          backgroundColor: "#FDFAF5",
          boxShadow: "-4px 0 40px rgba(44,44,44,0.12), 0 8px 32px rgba(44,44,44,0.08)",
          borderLeft: "1px solid rgba(44,44,44,0.08)",
          width: "260px",
          overflow: "hidden",
          maxHeight: open ? "500px" : "0px",
          opacity: open ? 1 : 0,
          transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
          marginBottom: "0px",
        }}
      >
        <div style={{ padding: "24px 24px 0" }}>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#6B7C5C",
            marginBottom: "20px",
          }}>
            Find your Provence
          </p>

          {[
            { label: "When",      value: season,   onChange: setSeason,   options: SEASONS },
            { label: "How many",  value: guests,   onChange: setGuests,   options: GUESTS },
            { label: "What kind", value: category, onChange: setCategory, options: CATEGORIES },
          ].map((field, i, arr) => (
            <div key={field.label}
              style={{
                paddingBottom: "16px",
                marginBottom: "16px",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(44,44,44,0.07)" : "none",
              }}
            >
              <span style={{
                display: "block",
                fontFamily: "Inter, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(44,44,44,0.35)",
                marginBottom: "6px",
              }}>
                {field.label}
              </span>
              <div style={{ position: "relative" }}>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: field.value ? "#2C2C2C" : "rgba(44,44,44,0.38)",
                    paddingRight: "16px",
                  }}
                >
                  {field.options.map(o => (
                    <option key={o.value} value={o.value}
                      style={{ fontStyle: "normal", fontFamily: "Inter, sans-serif", color: "#2C2C2C" }}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#6B7C5C", fontSize: "10px", pointerEvents: "none" }}>↓</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleSearch}
          className="group relative w-full overflow-hidden flex items-center justify-center gap-3"
          style={{
            backgroundColor: "#2C2C2C",
            padding: "18px 24px",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#F5F0E8",
            marginTop: "4px",
          }}
        >
          <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">Show me</span>
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* ── Tab collapsed — toujours visible quand scrollé ── */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3"
        style={{
          backgroundColor: open ? "#2C2C2C" : "#6B7C5C",
          padding: "14px 16px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
        }}
        aria-label="Find your Provence"
      >
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "#F5F0E8",
          whiteSpace: "nowrap",
        }}>
          {open ? "Close" : "Find your Provence"}
        </span>
        <span style={{
          color: "rgba(253,250,245,0.6)",
          fontSize: "11px",
          transform: open ? "rotate(90deg)" : "rotate(-90deg)",
          transition: "transform 0.3s ease",
          display: "inline-block",
        }}>
          →
        </span>
      </button>

    </div>
  );
}