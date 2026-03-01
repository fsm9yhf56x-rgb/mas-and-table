import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Experience } from "@/types";
import { formatPrice } from "@/lib/utils";

// Fetch featured experiences (3 most recent published)
async function getFeaturedExperiences(): Promise<Experience[]> {
  const { data } = await supabase
    .from("experiences")
    .select("*, images:experience_images(*), partner:partners(host_firstname, host_lastname)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return data ?? [];
}

export default async function HomePage() {
  const featured = await getFeaturedExperiences();

  return (
    <>
      <Navbar />
      <main>
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-dark">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1523540451793-1a1e3e1d1c54?w=1800&q=85"
              alt="Provence landscape at golden hour"
              fill
              className="object-cover opacity-60 animate-slow-zoom"
              priority
              sizes="100vw"
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 md:pb-28 w-full">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <p
                className="font-sans text-xs tracking-[0.3em] uppercase text-cream/60 mb-8 opacity-0 animate-fade-up animate-delay-200"
                style={{ animationFillMode: "forwards" }}
              >
                Provence, France
              </p>

              {/* Title */}
              <h1
                className="font-serif text-display-xl text-cream mb-8 opacity-0 animate-fade-up animate-delay-300"
                style={{ animationFillMode: "forwards" }}
              >
                The Provence few
                <br />
                <em>travellers ever find.</em>
              </h1>

              {/* Subtitle */}
              <p
                className="font-sans text-lg md:text-xl font-light text-cream/75 mb-12 max-w-xl leading-relaxed opacity-0 animate-fade-up animate-delay-400"
                style={{ animationFillMode: "forwards" }}
              >
                Handpicked estates, vignerons and tables — for those who
                travel to truly discover.
              </p>

              {/* CTA */}
              <div
                className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up animate-delay-500"
                style={{ animationFillMode: "forwards" }}
              >
                <Link
                  href="/experiences"
                  className="inline-block bg-cream text-dark font-sans text-sm tracking-widest uppercase px-10 py-4 hover:bg-olive hover:text-cream transition-all duration-300"
                >
                  Explore experiences
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-3 opacity-40">
            <span className="font-sans text-xs tracking-widest uppercase text-cream rotate-90 origin-center">
              Scroll
            </span>
            <div className="w-px h-12 bg-cream/50 animate-pulse" />
          </div>
        </section>

        {/* ─── CATEGORIES ────────────────────────────────────────────────── */}
        <section className="py-section bg-beige">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-olive mb-5">
                How to experience Provence
              </p>
              <h2 className="font-serif text-display-md text-dark">
                How would you like to experience Provence?
              </h2>
            </div>

            {/* 3 categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-beige-dark">
              {/* Une Journée */}
              <Link
                href="/experiences?category=une_journee"
                className="group bg-cream p-10 md:p-12 hover:bg-dark transition-all duration-500 flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-dark-muted group-hover:text-cream/50 transition-colors mb-6">
                    Une Journée
                  </p>
                  <h3 className="font-serif text-4xl text-dark group-hover:text-cream transition-colors mb-5">
                    <em>A Table</em>
                  </h3>
                  <p className="font-sans text-sm font-light text-dark-muted group-hover:text-cream/70 transition-colors leading-relaxed max-w-xs">
                    A single day that changes how you understand food, wine,
                    and what Provence truly means.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-10">
                  <span className="font-sans text-xs text-dark-muted group-hover:text-cream/50 transition-colors">
                    From €150 per person
                  </span>
                  <span className="font-sans text-xs tracking-widest uppercase text-olive group-hover:text-terracotta transition-colors flex items-center gap-2">
                    Explore
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Un Séjour */}
              <Link
                href="/experiences?category=un_sejour"
                className="group bg-olive p-10 md:p-12 hover:bg-dark transition-all duration-500 flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-cream/50 mb-6">
                    Un Séjour
                  </p>
                  <h3 className="font-serif text-4xl text-cream mb-5">
                    <em>Among the Vines</em>
                  </h3>
                  <p className="font-sans text-sm font-light text-cream/75 leading-relaxed max-w-xs">
                    A weekend immersed in a domaine — where the rosé is poured
                    by the hand that grew it.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-10">
                  <span className="font-sans text-xs text-cream/50">
                    From €800 per person
                  </span>
                  <span className="font-sans text-xs tracking-widest uppercase text-cream/80 group-hover:text-terracotta transition-colors flex items-center gap-2">
                    Explore
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Une Saison */}
              <Link
                href="/experiences?category=une_saison"
                className="group bg-cream p-10 md:p-12 hover:bg-dark transition-all duration-500 flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-dark-muted group-hover:text-cream/50 transition-colors mb-6">
                    Une Saison
                  </p>
                  <h3 className="font-serif text-4xl text-dark group-hover:text-cream transition-colors mb-5">
                    <em>Lost in Provence</em>
                  </h3>
                  <p className="font-sans text-sm font-light text-dark-muted group-hover:text-cream/70 transition-colors leading-relaxed max-w-xs">
                    A full week. A mas, a table, a season of Provence that will
                    mark you for years.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-10">
                  <span className="font-sans text-xs text-dark-muted group-hover:text-cream/50 transition-colors">
                    From €2,000 per person
                  </span>
                  <span className="font-sans text-xs tracking-widest uppercase text-olive group-hover:text-terracotta transition-colors flex items-center gap-2">
                    Explore
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FEATURED EXPERIENCES ──────────────────────────────────────── */}
        <section className="py-section bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-olive mb-5">
                  Curated for this season
                </p>
                <h2 className="font-serif text-display-md text-dark max-w-md">
                  This season&rsquo;s most sought-after experiences
                </h2>
              </div>
              <p className="font-sans text-sm font-light text-dark-muted max-w-xs leading-relaxed">
                Each one chosen by hand. Each one unrepeatable.
              </p>
            </div>

            {/* Experience grid */}
            {featured.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featured.map((exp, i) => {
                  const cover = exp.images?.find((img) => img.is_cover) ?? exp.images?.[0];
                  return (
                    <Link
                      key={exp.id}
                      href={`/experiences/${exp.slug}`}
                      className="group block"
                    >
                      <div className="img-zoom relative aspect-[4/5] mb-5 overflow-hidden bg-beige">
                        {cover ? (
                          <Image
                            src={cover.url}
                            alt={cover.alt || exp.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority={i === 0}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-beige-dark" />
                        )}
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-cream/90 backdrop-blur-sm font-sans text-xs tracking-widest uppercase px-3 py-1.5 text-dark">
                            {exp.zone}
                          </span>
                        </div>
                      </div>
                      <p className="font-sans text-xs tracking-widest uppercase text-dark-muted mb-2">
                        {exp.zone}
                      </p>
                      <h3 className="font-serif text-xl text-dark group-hover:text-olive transition-colors mb-2 leading-snug">
                        {exp.title}
                      </h3>
                      <p className="font-sans text-sm font-light text-dark-muted">
                        From {formatPrice(exp.price_from)} per person
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Placeholder cards when no data yet */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "An Afternoon Among Ancient Vines",
                    zone: "Luberon",
                    price: "€320",
                    cat: "Une Journée",
                  },
                  {
                    title: "A Weekend at the Heart of a Family Domaine",
                    zone: "Alpilles",
                    price: "€1,200",
                    cat: "Un Séjour",
                  },
                  {
                    title: "Seven Days, Seven Tables, One Provence",
                    zone: "Var & Luberon",
                    price: "€3,400",
                    cat: "Une Saison",
                  },
                ].map((item, i) => (
                  <div key={i} className="group block cursor-pointer">
                    <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-beige">
                      <Image
                        src={`https://images.unsplash.com/photo-${
                          ["1558618666-fcd25c85cd64", "1506905925346-21bda4d32df4", "1464822759023-fed622ff2c3b"][i]
                        }?w=800&q=80`}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-cream/90 backdrop-blur-sm font-sans text-xs tracking-widest uppercase px-3 py-1.5 text-dark">
                          {item.cat}
                        </span>
                      </div>
                    </div>
                    <p className="font-sans text-xs tracking-widest uppercase text-dark-muted mb-2">
                      {item.zone}
                    </p>
                    <h3 className="font-serif text-xl text-dark group-hover:text-olive transition-colors mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm font-light text-dark-muted">
                      From {item.price} per person
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Link to all */}
            <div className="text-center mt-16">
              <Link
                href="/experiences"
                className="inline-block font-sans text-sm tracking-widest uppercase border border-dark text-dark px-10 py-4 hover:bg-dark hover:text-cream transition-all duration-300"
              >
                View all experiences
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CURATION STATEMENT ────────────────────────────────────────── */}
        <section className="py-section bg-dark relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
              alt="Provence vineyard"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-cream/40 mb-10">
              Our philosophy
            </p>
            <h2 className="font-serif text-display-lg text-cream mb-10 leading-tight">
              &ldquo;We say no more
              <br />
              <em>than we say yes.&rdquo;</em>
            </h2>
            <p className="font-sans text-base md:text-lg font-light text-cream/65 max-w-2xl mx-auto leading-relaxed">
              Every estate, every table, every vigneron on Mas & Table has been
              visited, tasted, and chosen by hand. We do not list what cannot
              move us. We do not publish what cannot move you. There are no
              exceptions — only experiences that pass the test of wonder.
            </p>
          </div>
        </section>

        {/* ─── TRUST SIGNALS ─────────────────────────────────────────────── */}
        <section className="py-16 bg-beige border-y border-beige-dark">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-beige-dark">
              <div className="bg-beige px-10 py-10 text-center">
                <p className="font-serif text-5xl text-olive mb-3">47</p>
                <p className="font-sans text-sm font-light tracking-widest uppercase text-dark-muted">
                  Curated experiences
                </p>
              </div>
              <div className="bg-beige px-10 py-10 text-center">
                <p className="font-serif text-5xl text-olive mb-3">12</p>
                <p className="font-sans text-sm font-light tracking-widest uppercase text-dark-muted">
                  Countries represented
                </p>
              </div>
              <div className="bg-beige px-10 py-10 text-center">
                <p className="font-serif text-4xl text-olive mb-3">100%</p>
                <p className="font-sans text-sm font-light tracking-widest uppercase text-dark-muted">
                  English guidance included
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIAL ───────────────────────────────────────────────── */}
        <section className="py-section bg-cream">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-olive">
                A word from a traveller
              </p>
            </div>

            <figure className="text-center">
              <blockquote>
                <p className="font-serif text-2xl md:text-3xl italic text-dark leading-relaxed mb-12">
                  &ldquo;We had been to Provence three times before. We thought
                  we knew it — the lavender fields, the markets, the rosé. Then
                  Mas & Table sent us to Henri. A man who speaks almost no
                  English, who has tended the same vines for forty years. We
                  spent an afternoon with him in absolute silence, just tasting,
                  just listening to the wind. My husband cried. I did too.
                  That&rsquo;s what Provence actually is. We didn&rsquo;t know
                  until that afternoon.&rdquo;
                </p>
              </blockquote>
              <figcaption>
                <p className="font-sans text-sm font-light tracking-widest uppercase text-dark-muted">
                  Sarah B. — London
                </p>
                <p className="font-sans text-xs text-dark-muted/50 mt-1">
                  A Table experience · Luberon · Spring 2024
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ─── BLOG TEASER ───────────────────────────────────────────────── */}
        <section className="py-section bg-beige">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-olive mb-5">
                  From the South of France
                </p>
                <h2 className="font-serif text-display-md text-dark">
                  Stories, seasons and secrets
                </h2>
              </div>
              <Link
                href="/blog"
                className="font-sans text-sm tracking-widest uppercase text-dark-muted hover:text-dark transition-colors flex items-center gap-2 self-start md:self-auto"
              >
                All stories
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  tag: "Seasonal Guide",
                  title: "Provence in November — The Secret Season",
                  excerpt:
                    "When the tourists leave and the truffles arrive, Provence reveals its truest face to those who stayed.",
                  slug: "provence-november-secret-season",
                },
                {
                  tag: "Portrait",
                  title: "Bernard and the Dog Who Finds Truffles",
                  excerpt:
                    "Forty years of searching the same oak forest. Bernard says he no longer leads the dog — the dog leads him.",
                  slug: "bernard-truffle-dog-luberon",
                },
                {
                  tag: "Guide",
                  title: "Best Provence Experiences for Couples 2025",
                  excerpt:
                    "Not the places everyone knows. The ones worth travelling for — curated for two people who want to remember.",
                  slug: "best-provence-experiences-couples-2025",
                },
              ].map((post, i) => (
                <Link
                  key={i}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] mb-5 overflow-hidden bg-dark">
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        ["1499363536502-87642509e31b", "1540979388789-6cee28a1cdc9", "1518998053901-5348d3961a04"][i]
                      }?w=700&q=80`}
                      alt={post.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="font-sans text-xs tracking-widest uppercase text-olive mb-2">
                    {post.tag}
                  </p>
                  <h3 className="font-serif text-lg text-dark group-hover:text-olive transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <p className="font-sans text-sm font-light text-dark-muted leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="relative py-section overflow-hidden bg-olive">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
              alt="Provençal countryside"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-cream/50 mb-8">
              Your next chapter
            </p>
            <h2 className="font-serif text-display-lg text-cream mb-8 leading-tight">
              Your Provence is waiting.
            </h2>
            <p className="font-sans text-base md:text-lg font-light text-cream/75 mb-12 leading-relaxed">
              The one that isn&rsquo;t in any guidebook. The one you&rsquo;ll
              still be talking about in ten years.
            </p>
            <Link
              href="/experiences"
              className="inline-block bg-cream text-dark font-sans text-sm tracking-widest uppercase px-12 py-5 hover:bg-dark hover:text-cream transition-all duration-300"
            >
              Find your experience
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}