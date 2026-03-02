"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "une_journee", label: "Une Journée" },
  { value: "un_sejour", label: "Un Séjour" },
  { value: "une_saison", label: "Une Saison" },
];

const TYPES = [
  { value: "all", label: "All types" },
  { value: "gastronomy", label: "Gastronomy" },
  { value: "wine_vines", label: "Wine & Vines" },
  { value: "farm_terroir", label: "Farm & Terroir" },
];

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("experiences")
          .select("*, images:experience_images(*)")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        setExperiences(data ?? []);
      } catch {
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = experiences.filter((exp) => {
    const catOk = activeCategory === "all" || exp.category === activeCategory;
    const typeOk = activeType === "all" || exp.experience_type === activeType;
    return catOk && typeOk;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0E8]">

        {/* ── HEADER ── */}
        <section className="pt-[73px] border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-14 md:py-20">
            <div className="flex items-center gap-4 mb-10">
              <span className="block w-8 h-px bg-[#6B7C5C]" />
              <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">
                Provence · South of France
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-7">
                <h1 className="font-serif text-[clamp(3rem,7vw,5rem)] text-[#2C2C2C] leading-[1.0] tracking-tight">
                  Experiences
                </h1>
              </div>
              <div className="md:col-span-5">
                <p className="font-sans text-xl text-[#2C2C2C]/80 leading-relaxed" style={{ fontWeight: 300 }}>
                  Handpicked across Provence. Updated each season.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTERS ── */}
        <div
          className="sticky top-[73px] z-40 border-b border-[#2C2C2C]/10"
          style={{ backgroundColor: "#F8F4EE" }}
        >
          <div className="max-w-7xl mx-auto px-8 md:px-30 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className="font-sans text-[12px] tracking-[0.4em] uppercase px-2 py-2 border transition-colors duration-200"
                  style={{
                    backgroundColor: activeCategory === cat.value ? "#2C2C2C" : "transparent",
                    color: activeCategory === cat.value ? "#F8F4EE" : "rgba(44,44,44,0.5)",
                    borderColor: activeCategory === cat.value ? "#2C2C2C" : "rgba(44,44,44,0.15)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActiveType(type.value)}
                  className="font-sans text-[11px] tracking-[0.4em] uppercase px-5 py-2.5 border transition-colors duration-200"
                  style={{
                    backgroundColor: activeType === type.value ? "#6B7C5C" : "transparent",
                    color: activeType === type.value ? "#F8F4EE" : "rgba(44,44,44,0.5)",
                    borderColor: activeType === type.value ? "#6B7C5C" : "rgba(44,44,44,0.15)",
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-[#F8F4EE] mb-6" />
                    <div className="h-3 bg-[#F8F4EE] w-1/3 mb-3" />
                    <div className="h-5 bg-[#F8F4EE] w-3/4 mb-2" />
                    <div className="h-3 bg-[#F8F4EE] w-1/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32">
                <p className="font-serif text-3xl text-[#2C2C2C] mb-4">No experiences found.</p>
                <p className="font-sans text-xl text-[#2C2C2C]/50 mb-10" style={{ fontWeight: 300 }}>
                  Try adjusting your filters.
                </p>
                <button
                  onClick={() => { setActiveCategory("all"); setActiveType("all"); }}
                  className="group relative inline-flex items-center gap-4 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase px-10 py-4 overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
                >
                  <span className="absolute inset-0 bg-[#2C2C2C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10">Clear filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                {filtered.map((exp, i) => {
                  const cover = exp.images?.find((img: any) => img.is_cover) ?? exp.images?.[0];
                  const imgSrc = cover?.url ?? `https://images.unsplash.com/photo-1567072629554-20e689de2400?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;

                  return (
                    <Link key={exp.id ?? i} href={`/experiences/${exp.slug}`} className="group block">
                      <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-[#F8F4EE]">
                        <Image
                          src={imgSrc}
                          alt={exp.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute bottom-4 left-4">
                          <span className="font-sans text-[10px] tracking-[0.4em] uppercase px-3 py-1.5 bg-[#F5F0E8]/90 text-[#2C2C2C]">
                            {CATEGORIES.find(c => c.value === exp.category)?.label ?? exp.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40">{exp.zone}</p>
                        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C]">
                          {exp.category === "une_journee" ? "Une Journée" : exp.category === "un_sejour" ? "Un Séjour" : "Une Saison"}
                        </p>
                      </div>
                      <h2 className="font-serif text-2xl text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-3">
                        {exp.title}
                      </h2>
                      <p className="font-sans text-base text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
                        From {formatPrice(exp.price_from)} per person
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bg-[#F8F4EE] border-t border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-7">
                <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-6">Bespoke</p>
                <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] text-[#2C2C2C] leading-tight">
                  Can&rsquo;t find what<br /><em>you&rsquo;re looking for?</em>
                </h2>
              </div>
              <div className="md:col-span-5 space-y-6">
                <p className="font-sans text-xl text-[#2C2C2C]/55 leading-relaxed" style={{ fontWeight: 300 }}>
                  Tell us what you have in mind — we&rsquo;ll find it for you.
                </p>
                <Link
                  href="mailto:hello@masandtable.com"
                  className="group relative inline-flex items-center gap-4 border border-[#2C2C2C]/30 text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase px-10 py-5 overflow-hidden hover:border-[#2C2C2C] transition-colors duration-500"
                >
                  <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 group-hover:text-[#F8F4EE] transition-colors duration-300">Get in touch</span>
                  <span className="relative z-10 inline-block group-hover:text-[#F8F4EE] group-hover:translate-x-1 transition-all duration-300">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}