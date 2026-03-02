import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Experience } from "@/types";
import { formatPrice } from "@/lib/utils";

async function getFeaturedExperiences(): Promise<Experience[]> {
  try {
    const { data } = await supabase
      .from("experiences")
      .select("*, images:experience_images(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedExperiences();

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0E8]">

        {/* ─────────────────────────────────────────
            HERO — Titre gauche + photo droite
        ───────────────────────────────────────── */}
        <section className="pt-[73px] border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16">

            <div className="flex items-center gap-4 pt-14 md:pt-20 mb-12">
              <span className="block w-8 h-px bg-[#6B7C5C]" />
              <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">
                Provence · South of France · Est. 2025
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

              <div className="md:col-span-7 flex flex-col justify-between pb-16">
                <h1 className="font-serif text-[clamp(3.5rem,9vw,7rem)] text-[#2C2C2C] leading-[1.0] tracking-tight mb-12">
                  The Provence<br />
                  few travellers<br />
                  <em>ever find.</em>
                </h1>
                <div className="border-t border-[#2C2C2C]/10 pt-10 flex flex-col sm:flex-row sm:items-center gap-6">
                  <p className="font-sans text-xl text-[#2C2C2C]/70 leading-relaxed max-w-sm" style={{ fontWeight: 300 }}>
                    Handpicked domaines, vignerons and hidden tables — for those who travel to truly discover.
                  </p>
                  <Link
                    href="/experiences"
                    className="group relative inline-flex items-center gap-4 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[12px] tracking-[0.4em] uppercase px-10 py-5 overflow-hidden flex-shrink-0 hover:text-[#FDFAF5] transition-colors duration-500"
                  >
                    <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10">Explore</span>
                    <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="hidden md:block md:col-span-5 relative overflow-hidden" style={{ minHeight: "420px" }}>
                <Image
                  src="https://images.unsplash.com/photo-1592651563903-4b13924f3c06?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Vignes en Provence, Luberon"
                  fill
                  className="object-cover"
                  priority
                  sizes="40vw"
                />
                <div className="absolute bottom-4 right-4">
                  <p className="font-sans text-[14px] tracking-[0.25em] uppercase text-[#FDFAF5]">Luberon</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            CATÉGORIES — 3 cards, fond alterné, bordure accentuée
        ───────────────────────────────────────── */}
        <section className="bg-[#F8F4EE] border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">

            <p className="font-sans text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-16">
              How would you like to experience Provence?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  href: "/experiences?category=une_journee",
                  num: "01", label: "Une Journée", title: "A Table",
                  hook: "An afternoon among ancient vines, where a fourth-generation vigneron uncorks the secrets of Provence rosé.",
                  price: "From €150 / person",
                  bg: "#F5F0E8",
                },
                {
                  href: "/experiences?category=un_sejour",
                  num: "02", label: "Un Séjour", title: "Among the Vines",
                  hook: "Two days at a private domaine — where the rosé is poured by the hand that grew it and dinner begins at sundown.",
                  price: "From €800 / person",
                  bg: "#F5F0E8",
                },
                {
                  href: "/experiences?category=une_saison",
                  num: "03", label: "Une Saison", title: "Lost in Provence",
                  hook: "A full week. A mas, a market, a table. The Provence that takes years to forget.",
                  price: "From €2,000 / person",
                  bg: "#F5F0E8",
                },
              ].map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  style={{ backgroundColor: cat.bg }}
                  className="group flex flex-col justify-between border border-[#2C2C2C]/20 p-10 md:p-14 min-h-[500px] hover:border-[#6B7C5C] transition-all duration-400"
                >
                  <div>
                    <div className="flex items-center justify-between mb-12">
                      <span className="font-serif text-5xl text-[#2C2C2C]/08 leading-none select-none">{cat.num}</span>
                      <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C]">{cat.label}</span>
                    </div>
                    <h3 className="font-serif text-[clamp(2.25rem,4vw,3.75rem)] text-[#2C2C2C] leading-[1.0] mb-8 group-hover:text-[#6B7C5C] transition-colors duration-300">
                      <em>{cat.title}</em>
                    </h3>
                    <p className="font-sans text-lg text-[#2C2C2C]/50 leading-relaxed" style={{ fontWeight: 300 }}>
                      {cat.hook}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-8 mt-10 border-t border-[#2C2C2C]/12 group-hover:border-[#6B7C5C]/30 transition-colors duration-300">
                    <span className="font-sans text-base text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>{cat.price}</span>
                    <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/30 inline-block transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#6B7C5C]">
                      Discover →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────
            PROMESSE
        ───────────────────────────────────────── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-7">
                <p className="font-sans text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-8">Our curation promise</p>
                <h2 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] text-[#2C2C2C] leading-tight">
                  &ldquo;We say no more<br /><em>than we say yes.&rdquo;</em>
                </h2>
              </div>
              <div className="md:col-span-5 space-y-5">
                <p className="font-sans text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                  Every experience on Mas & Table has been visited in person, tasted, and chosen by hand. No listing fees. No open applications.
                </p>
                <p className="font-sans text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                  You find the Provence few travellers ever find — because we said no to everything else.
                </p>
                <Link href="/experiences" className="group inline-flex items-center gap-3 font-sans text-[12px] tracking-[0.4em] uppercase text-[#6B7C5C] hover:text-[#2C2C2C] transition-colors duration-300 pt-2">
                  <span>See what made the cut</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            FEATURED EXPERIENCES
        ───────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="bg-[#F8F4EE] border-b border-[#2C2C2C]/10">
            <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">

              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="font-sans text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-4">This season</p>
                  <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] text-[#2C2C2C] leading-tight">
                    Most sought-after<br />experiences
                  </h2>
                </div>
                <Link href="/experiences" className="group hidden md:inline-flex items-center gap-2 font-sans text-[13px] tracking-[0.4em] uppercase text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors duration-300">
                  <span>View all</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2C2C2C]/10">
                {featured.map((exp) => {
                  const cover = exp.images?.find((img: any) => img.is_cover) ?? exp.images?.[0];
                  return (
                    <Link key={exp.id} href={`/experiences/${exp.slug}`} className="group block md:px-10 first:pl-0 last:pr-0 py-8 md:py-0">
                      {cover && (
                        <div className="relative aspect-[3/2] overflow-hidden mb-7">
                          <Image
                            src={cover.url}
                            alt={cover.alt || exp.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40">{exp.zone}</p>
                        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C]">
                          {exp.category === "une_journee" ? "Une Journée" : exp.category === "un_sejour" ? "Un Séjour" : "Une Saison"}
                        </p>
                      </div>
                      <h3 className="font-serif text-2xl text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-3">
                        {exp.title}
                      </h3>
                      <p className="font-sans text-base text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
                        From {formatPrice(exp.price_from)} per person
                      </p>
                    </Link>
                  );
                })}
              </div>

            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────
            TÉMOIGNAGE
        ───────────────────────────────────────── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="relative min-h-[400px] md:min-h-[560px]">
              <Image
                src="https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=1000&q=85"
                alt="Lavande, Haute-Provence"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-6 left-8">
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#FDFAF5]/40">Haute-Provence</p>
              </div>
            </div>

            <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24 border-l border-[#2C2C2C]/10">
              <span className="font-sans text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-10 block">
                A word from a traveller
              </span>
              <blockquote className="font-serif text-[1.85rem] md:text-[2.1rem] text-[#2C2C2C] leading-[1.4] mb-10">
                &ldquo;We had been to Provence three times before. We thought we knew it. Then Henri — a man who has tended the same vines for forty years — poured us a glass and said nothing. We spent the afternoon in silence, just tasting, just listening.&rdquo;
              </blockquote>
              <div className="pt-8 border-t border-[#2C2C2C]/10">
                <p className="font-sans text-sm tracking-[0.3em] uppercase text-[#2C2C2C]">Sarah B.</p>
                <p className="font-sans text-sm text-[#2C2C2C]/40 mt-1" style={{ fontWeight: 300 }}>
                  London · A Table experience · Luberon · Spring 2024
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────
            CHIFFRES
        ───────────────────────────────────────── */}
        <section className="bg-[#F8F4EE] border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-3 divide-x divide-[#2C2C2C]/10 py-16">
              {[
                { n: "47", l: "Curated experiences" },
                { n: "12+", l: "Countries represented" },
                { n: "100%", l: "English guidance included" },
              ].map((item) => (
                <div key={item.l} className="text-center px-4 md:px-12 py-4">
                  <p className="font-serif text-[clamp(3rem,7vw,6rem)] text-[#2C2C2C] mb-2 leading-none">{item.n}</p>
                  <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/60">{item.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            BLOG
        ───────────────────────────────────────── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">

            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="font-sans text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-4">From Provence</p>
                <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] text-[#2C2C2C] leading-tight">
                  Stories, seasons<br />and secrets
                </h2>
              </div>
              <Link href="/blog" className="group hidden md:inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.4em] uppercase text-[#2C2C2C]/65 hover:text-[#2C2C2C] transition-colors duration-300">
                <span>All stories</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2C2C2C]/10">
              {[
                { tag: "Seasonal Guide", title: "Provence in November — The Secret Season", excerpt: "When the tourists leave and the truffles arrive, Provence reveals its truest face.", slug: "provence-november-secret-season", photo: "1499363536502-87642509e31b" },
                { tag: "Portrait", title: "Bernard and the Dog Who Finds Truffles", excerpt: "Forty years of searching the same oak forest. Bernard says the dog leads him now.", slug: "bernard-truffle-dog-luberon", photo: "1474979266404-7eaacbcd87c5" },
                { tag: "Guide", title: "The Best Provence Experiences for Couples", excerpt: "Not the places everyone knows. The ones worth travelling for.", slug: "best-provence-experiences-couples-2025", photo: "1510812431401-41d2bd2722f3" },
              ].map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block md:px-10 first:pl-0 last:pr-0 py-8 md:py-0">
                  <div className="relative aspect-[16/10] overflow-hidden mb-7">
                    <Image
                      src={`https://images.unsplash.com/photo-${post.photo}?w=700&q=80`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] mb-4">{post.tag}</p>
                  <h3 className="font-serif text-xl text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-3">{post.title}</h3>
                  <p className="font-sans text-lg text-[#2C2C2C]/50 leading-relaxed" style={{ fontWeight: 300 }}>{post.excerpt}</p>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────
            CTA FINAL
        ───────────────────────────────────────── */}
        <section className="bg-[#F8F4EE]">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-32">

            <div className="flex items-center gap-6 mb-16">
              <span className="block h-px flex-1 bg-[#2C2C2C]/10" />
              <p className="font-sans text-[13px] tracking-[0.5em] uppercase text-[#2C2C2C]/60">Your next chapter</p>
              <span className="block h-px flex-1 bg-[#2C2C2C]/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-8">
                <h2 className="font-serif text-[clamp(3rem,7vw,6rem)] text-[#2C2C2C] leading-[1.0]">
                  Your Provence<br /><em>is waiting.</em>
                </h2>
              </div>
              <div className="md:col-span-4 space-y-8">
                <p className="font-sans text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                  The one that isn&rsquo;t in any guidebook. The one you&rsquo;ll still be talking about in ten years.
                </p>
                <Link
                  href="/experiences"
                  className="group relative inline-flex items-center gap-4 border border-[#2C2C2C]/30 text-[#2C2C2C] font-sans text-[12px] tracking-[0.4em] uppercase px-10 py-5 overflow-hidden hover:border-[#2C2C2C] transition-colors duration-500"
                >
                  <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 group-hover:text-[#F8F4EE] transition-colors duration-300">Find your experience</span>
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