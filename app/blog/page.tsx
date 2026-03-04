import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const FALLBACK_POSTS = [
  {
    slug: "provence-november-secret-season",
    title: "Provence in November — The Secret Season",
    excerpt: "When the tourists leave and the truffles arrive, Provence reveals its truest face. November is the month the locals have kept to themselves for centuries.",
    category: "Seasonal Guide",
    cover_image_url: "https://images.unsplash.com/photo-1499363536502-87642509e31b?w=1200&q=85",
    published_at: "2025-10-15",
    read_time: "6 min",
  },
  {
    slug: "bernard-truffle-dog-luberon",
    title: "Bernard and the Dog Who Finds Truffles",
    excerpt: "Forty years of searching the same oak forest. Bernard says the dog leads him now. We spent a morning in the Luberon learning what patience really means.",
    category: "Portrait",
    cover_image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=85",
    published_at: "2025-10-01",
    read_time: "8 min",
  },
  {
    slug: "best-provence-experiences-couples-2025",
    title: "The Best Provence Experiences for Couples",
    excerpt: "Not the places everyone knows. The ones worth travelling for — and the ones your hosts will remember you by long after you've left.",
    category: "Guide",
    cover_image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=85",
    published_at: "2025-09-20",
    read_time: "5 min",
  },
  {
    slug: "weekend-among-the-vines-luberon",
    title: "A Weekend Among the Vines — What Two Days in the Luberon Really Looks Like",
    excerpt: "We asked one of our hosts to plan a perfect weekend. No tourist traps. No compromises. Just Provence, undiluted.",
    category: "Guide",
    cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
    published_at: "2025-09-05",
    read_time: "7 min",
  },
];

async function getPosts() {
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (data && data.length > 0) return data;
  } catch {}
  return FALLBACK_POSTS;
}

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0E8]">

        {/* ── HEADER ── */}
        <section className="pt-[73px] border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-16 py-10 sm:py-20">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <span className="block w-6 sm:w-8 h-px bg-[#6B7C5C]" />
              <p className="font-sans text-[11px] sm:text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C]">
                Stories · Seasons · Secrets
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-end">
              <div className="sm:col-span-7">
                <h1 className="font-serif text-[clamp(2.8rem,10vw,6rem)] text-[#2C2C2C] leading-[1.0] tracking-tight">
                  From Provence
                </h1>
              </div>
              <div className="sm:col-span-5">
                <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                  Stories, seasons and secrets from the South of France — updated each season.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED POST ── */}
        {featured && (
          <section className="border-b border-[#2C2C2C]/10">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 sm:grid-cols-2">

                {/* Photo — plus courte sur mobile */}
                <div className="relative overflow-hidden sm:min-h-[560px]" style={{ minHeight: "60vw" }}>
                  <Image
                    src={featured.cover_image_url}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority
                  />
                </div>

                <div
                  className="flex flex-col justify-center px-6 sm:px-16 py-10 sm:py-24 border-t sm:border-t-0 sm:border-l border-[#2C2C2C]/10"
                  style={{ backgroundColor: "#F8F4EE" }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <span className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C]">{featured.category}</span>
                    <span className="block w-4 h-px bg-[#2C2C2C]/20" />
                    <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/35">{featured.read_time} read</span>
                  </div>
                  <h2 className="font-serif text-[clamp(1.5rem,5vw,3rem)] text-[#2C2C2C] leading-[1.1] mb-5 sm:mb-8 group-hover:text-[#6B7C5C] transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="font-sans text-base sm:text-xl text-[#2C2C2C]/55 leading-relaxed mb-7 sm:mb-10" style={{ fontWeight: 300 }}>
                    {featured.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-3 font-sans text-[12px] tracking-[0.4em] uppercase text-[#6B7C5C] group-hover:text-[#2C2C2C] transition-colors duration-300">
                    <span>Read the story</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </div>
                </div>

              </div>
            </Link>
          </section>
        )}

        {/* ── AUTRES ARTICLES ── */}
        {rest.length > 0 && (
          <section className="bg-[#F8F4EE] border-b border-[#2C2C2C]/10">
            <div className="max-w-7xl mx-auto px-6 sm:px-16 py-12 sm:py-24">

              <p className="font-sans text-[11px] sm:text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-10 sm:mb-16">
                More stories
              </p>

              {/* Mobile : 1 colonne. Desktop : 3 colonnes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-16">
                {rest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden mb-5 sm:mb-7">
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C]">{post.category}</span>
                      <span className="block w-3 h-px bg-[#2C2C2C]/20" />
                      <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#2C2C2C]/35">{post.read_time} read</span>
                    </div>
                    <h2 className="font-serif text-lg sm:text-xl text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-3 sm:mb-4">
                      {post.title}
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-[#2C2C2C]/50 leading-relaxed mb-4 sm:mb-6" style={{ fontWeight: 300 }}>
                      {post.excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] group-hover:text-[#2C2C2C] transition-colors duration-300">
                      <span>Read</span>
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ── CTA EXPERIENCES ── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-16 py-12 sm:py-24">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-10 items-end">
              <div className="sm:col-span-7">
                <p className="font-sans text-[11px] sm:text-[13px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-5 sm:mb-6">Ready to go further?</p>
                <h2 className="font-serif text-[clamp(1.8rem,6vw,3.5rem)] text-[#2C2C2C] leading-tight">
                  The story is one thing.<br /><em>The experience is another.</em>
                </h2>
              </div>
              <div className="sm:col-span-5 space-y-6 sm:space-y-8">
                <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                  Every article on this blog began as a day in the field — searching for the experiences worth your time.
                </p>
                <Link
                  href="/experiences"
                  className="group relative inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-4 border border-[#2C2C2C]/30 text-[#2C2C2C] font-sans text-[12px] tracking-[0.4em] uppercase overflow-hidden hover:border-[#2C2C2C] transition-colors duration-500"
                  style={{ padding: "18px 32px", minHeight: "56px" }}
                >
                  <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 group-hover:text-[#F5F0E8] transition-colors duration-300">Explore experiences</span>
                  <span className="relative z-10 inline-block group-hover:text-[#F5F0E8] group-hover:translate-x-1 transition-all duration-300">→</span>
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