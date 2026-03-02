import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = FALLBACK_POSTS[slug];
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, cover_image_url")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    const source = data ?? post;
    if (!source) return {};

    return {
      title: source.title,
      description: source.excerpt,
      openGraph: {
        title: source.title,
        description: source.excerpt,
        url: `https://masandtable.com/blog/${slug}`,
        images: source.cover_image_url ? [{ url: source.cover_image_url, alt: source.title }] : [],
      },
      alternates: { canonical: `https://masandtable.com/blog/${slug}` },
    };
  } catch {
    if (!post) return {};
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://masandtable.com/blog/${slug}`,
        images: [{ url: post.cover_image_url, alt: post.title }],
      },
      alternates: { canonical: `https://masandtable.com/blog/${slug}` },
    };
  }
}

const FALLBACK_POSTS: Record<string, any> = {
  "provence-november-secret-season": {
    slug: "provence-november-secret-season",
    title: "Provence in November — The Secret Season",
    excerpt: "When the tourists leave and the truffles arrive, Provence reveals its truest face.",
    category: "Seasonal Guide",
    cover_image_url: "https://images.unsplash.com/photo-1499363536502-87642509e31b?w=1600&q=90",
    published_at: "2025-10-15",
    read_time: "6 min",
    content: `November is the month Provence keeps to itself.

The lavender fields are bare. The olive harvest is over. The roads that were gridlocked in July are yours alone. And somewhere in the oak forests of the Luberon, if you know where to walk — and who to walk with — the ground gives up its most secret treasure.

The truffle season begins quietly, usually in mid-November, and it changes everything. Markets that spent the summer selling lavender sachets and ceramic cicadas suddenly smell of earth and woodsmoke. The producers who spent August hiding from tourists are now at their stalls, unhurried, willing to talk.

This is the Provence that doesn't make it onto mood boards.

It is colder, yes. The light arrives later and leaves earlier. But what light it is — low and gold, the kind that makes even a stone wall look like it belongs in a painting. In summer, the light is performative. In November, it is intimate.

We have been visiting Provence in November for three years now. Each time, we find something we didn't expect. A winemaker who only opens his cellar after the season. A mas that takes guests in autumn because "that's when the real conversations happen." A market in Apt where the same four families have been selling the same four things since before anyone can remember.

If you have only ever seen Provence in July, you have only seen half of it.

The half worth keeping is the one that waits for November.`,
    author: "Mas & Table",
  },
  "bernard-truffle-dog-luberon": {
    slug: "bernard-truffle-dog-luberon",
    title: "Bernard and the Dog Who Finds Truffles",
    excerpt: "Forty years of searching the same oak forest. Bernard says the dog leads him now.",
    category: "Portrait",
    cover_image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600&q=90",
    published_at: "2025-10-01",
    read_time: "8 min",
    content: `Bernard Morel has been walking the same stretch of oak forest since 1984. He knows every tree by its silhouette. He knows which roots to avoid and which to follow. He knows, or says he knows, when it is going to rain.

But Filou — the dog — knows where the truffles are.

"I used to pretend I found them myself," Bernard tells me, crouching beside a patch of disturbed earth. "Then my son-in-law filmed us one day and I saw the footage. The dog finds them. I just dig."

He laughs — a full, unhurried laugh that belongs to a man who has made peace with his place in the order of things.

We are forty minutes from the nearest village, in a part of the Luberon that doesn't appear on the tourist maps. Bernard has been doing this long enough that he no longer needs to tell people where he goes. He is the one they come to.

The morning works like this: Filou moves through the undergrowth in wide arcs, nose to the ground, tail low with focus. When he finds something, he stops and looks back at Bernard. Bernard kneels, takes a small iron pick from his jacket pocket, and begins to excavate — slowly, carefully, the way you open something precious.

A good morning yields perhaps eight truffles. Sometimes twelve. Once, years ago, twenty-three. That day is spoken of with reverence.

"People ask me if it's a skill," Bernard says, wrapping a truffle in a cloth and handing it to me. "I tell them: ask the dog."

We spend three hours in the forest. I come out with mud on my boots, a truffle I bought for forty euros, and the particular quiet that settles over you when you have spent a morning doing something that has nothing to do with a screen.

Bernard waves from the tree line as I drive away. Filou is already heading back in.`,
    author: "Mas & Table",
  },
  "best-provence-experiences-couples-2025": {
    slug: "best-provence-experiences-couples-2025",
    title: "The Best Provence Experiences for Couples",
    excerpt: "Not the places everyone knows. The ones worth travelling for.",
    category: "Guide",
    cover_image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=90",
    published_at: "2025-09-20",
    read_time: "5 min",
    content: `There is a version of a Provence trip that looks great on Instagram and feels hollow in person. The lavender field at peak season, four hundred people with their phones raised. The wine tasting at the famous domaine, so rehearsed it feels like a theatre performance. The restaurant where you waited three weeks for a reservation and left wishing you'd gone somewhere smaller.

We are not interested in that version.

The couples who come back to us — and they do come back — are looking for something different. Not luxury for its own sake. Not Instagram content. Something that makes them look at each other across a table and say: this is why we came.

Here is what we have found actually works.

A private tasting with a vigneron who isn't performing. The key word is private. When it's just the two of you and the person who made the wine, something different happens. Conversation becomes possible. The vigneron stops giving the tour and starts telling the truth. These are the afternoons people describe to us years later.

A mas with no other guests. Shared pools and breakfast rooms are fine. But there is a different quality to two days in a place that is, for those two days, entirely yours. The mas owners we work with understand this. They clear the diary and let you settle.

A morning at a market, followed by nothing. Not a cooking class, not a scheduled lunch — just the market, and then time. Provençal markets at their best are slow, sensory experiences. Give them space.

A meal that required almost no planning to find. The best tables in Provence are not the ones with Michelin stars. They are the ones where the chef is also the person who greeted you at the door, and the menu changes depending on what arrived from the farm that morning.

None of these things require you to know the right people. They require only that you stop looking for the obvious answer.`,
    author: "Mas & Table",
  },
  "weekend-among-the-vines-luberon": {
    slug: "weekend-among-the-vines-luberon",
    title: "A Weekend Among the Vines — What Two Days in the Luberon Really Looks Like",
    excerpt: "We asked one of our hosts to plan a perfect weekend. No tourist traps. No compromises.",
    category: "Guide",
    cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=90",
    published_at: "2025-09-05",
    read_time: "7 min",
    content: `We gave Henri a simple brief: plan the weekend you would want if you were visiting Provence for the first time, but already knew it wasn't about the postcard.

He sent back twelve lines. No restaurant names, no opening hours, no links. Just a sequence and a philosophy.

Friday evening. Arrive late afternoon when the light is doing what it does. Don't stop at the village. Come straight to the domaine. We'll open something.

Saturday morning. The market in Apt opens at seven. Get there before eight. Buy bread and olives and whatever looks right. Eat it in the car on the way back. We'll walk the vines before it gets hot.

Saturday afternoon. Sleep. This is not optional.

Saturday evening. I'll cook. Bring what you bought at the market.

Sunday morning. The truffle hunter comes at nine if you want to go. Otherwise, coffee on the terrace until you feel like leaving. Don't set an alarm.

We followed the brief exactly. We didn't take many photos. We talked more than we have in months. On Sunday, we did not feel like leaving.

This is what Henri has understood that most tourism has not: the best weekends are not the ones with the most in them. They are the ones where what's in them is exactly right.

Two days in the Luberon, done this way, is not a weekend. It is a recalibration.`,
    author: "Mas & Table",
  },
};

async function getPost(slug: string) {
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (data) return data;
  } catch {}
  return FALLBACK_POSTS[slug] ?? null;
}

async function getRelatedPosts(slug: string, category: string) {
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, category, cover_image_url, read_time")
      .eq("is_published", true)
      .neq("slug", slug)
      .limit(3);
    if (data && data.length > 0) return data;
  } catch {}
  return Object.values(FALLBACK_POSTS)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.category);
  const paragraphs = post.content?.split("\n\n").filter(Boolean) ?? [];
  const [intro, ...body] = paragraphs;

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0E8]">

        {/* ── HERO IMAGE PLEIN ÉCRAN ── */}
        <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-[#2C2C2C]">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/60 via-[#2C2C2C]/10 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-[89px] left-8 md:left-16">
            <Link href="/blog" className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors">
              ← From Provence
            </Link>
          </div>

          {/* Catégorie */}
          <div className="absolute bottom-8 left-8 md:left-16 flex items-center gap-4">
            <span className="block w-6 h-px bg-[#F5F0E8]/40" />
            <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#F5F0E8]/60">
              {post.category} · {post.read_time} read
            </p>
          </div>
        </section>

        {/* ── TITRE + INTRO ── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-8">
                <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-8">
                  {post.category} · {formatDate(post.published_at)}
                </p>
                <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] text-[#2C2C2C] leading-[1.05] tracking-tight mb-10">
                  {post.title}
                </h1>
                {intro && (
                  <p className="font-serif text-[1.35rem] text-[#2C2C2C]/70 leading-[1.6] italic">
                    {intro}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── CORPS ── */}
        <section className="border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-7 md:col-start-2">
                <div className="space-y-8">
                  {body.map((para: string, i: number) => (
                    <p key={i} className="font-sans text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Signature */}
                <div className="mt-16 pt-10 border-t border-[#2C2C2C]/10 flex items-center gap-4">
                  <span className="block w-8 h-px bg-[#6B7C5C]" />
                  <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40">
                    {post.author} · {formatDate(post.published_at)}
                  </p>
                </div>
              </div>

              {/* Sidebar sticky */}
              <div className="md:col-span-3 md:col-start-10">
                <div className="md:sticky md:top-28 space-y-8">
                  <div className="border-t border-[#2C2C2C]/10 pt-8">
                    <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] mb-6">Ready to experience it?</p>
                    <p className="font-sans text-base text-[#2C2C2C]/55 leading-relaxed mb-8" style={{ fontWeight: 300 }}>
                      Every story on this blog started as an experience we curated for our guests.
                    </p>
                    <Link
                      href="/experiences"
                      className="group relative inline-flex items-center gap-3 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase px-6 py-4 overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
                    >
                      <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10">Explore</span>
                      <span className="relative z-10 inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ARTICLES LIÉS ── */}
        {related.length > 0 && (
          <section style={{ backgroundColor: "#F8F4EE" }}>
            <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
              <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-4">Continue reading</p>
              <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] text-[#2C2C2C] leading-tight mb-14">
                More from Provence
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2C2C2C]/10">
                {related.map((p: any) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group block md:px-10 first:pl-0 last:pr-0 py-8 md:py-0">
                    <div className="relative aspect-[16/10] overflow-hidden mb-6">
                      <Image
                        src={p.cover_image_url}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="33vw"
                      />
                    </div>
                    <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] mb-3">{p.category}</p>
                    <h3 className="font-serif text-xl text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-3">
                      {p.title}
                    </h3>
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

      </main>
      <Footer />
    </>
  );
}