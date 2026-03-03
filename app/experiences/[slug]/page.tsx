import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingBlock from "@/components/BookingBlock";
import { supabase } from "@/lib/supabase";
import { Experience } from "@/types";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await supabase
      .from("experiences")
      .select("title, tagline, zone, price_from, images:experience_images(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (!data) return {};
    const cover = data.images?.find((img: any) => img.is_cover) ?? data.images?.[0];
    const title = `${data.title} — Provence Experience`;
    const description = data.tagline ?? `A curated experience in ${data.zone}, Provence. From €${data.price_from} per person.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://masandtable.com/experiences/${slug}`,
        images: cover ? [{ url: cover.url, alt: data.title }] : [],
      },
      alternates: { canonical: `https://masandtable.com/experiences/${slug}` },
    };
  } catch {
    return {};
  }
}

async function getExperience(slug: string): Promise<Experience | null> {
  try {
    const { data } = await supabase
      .from("experiences")
      .select("*, images:experience_images(*), partner:partners(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getSimilar(currentId: string, category: string): Promise<Experience[]> {
  try {
    const { data } = await supabase
      .from("experiences")
      .select("*, images:experience_images(*)")
      .eq("is_published", true)
      .eq("category", category)
      .neq("id", currentId)
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

const PLACEHOLDER: Experience = {
  id: "placeholder",
  slug: "afternoon-among-ancient-vines",
  title: "An Afternoon Among Ancient Vines",
  tagline: "A fourth-generation vigneron. Forty-year-old rosé vines. An afternoon that redefines what Provence tastes like.",
  description: `You arrive at the domaine just as the morning mist is lifting off the vines. Henri is already there — boots muddy, hands stained with earth, a smile that tells you he has been doing this since before you were born. He does not speak much English. He does not need to.\n\nYou walk the rows together, slow and unhurried, as he tells you — through gesture, through taste, through the way he cups a grape in his palm — what four generations of winemaking actually looks like. This is not a tour. This is a transmission.\n\nIn the shade of an ancient stone cellar, you taste five wines poured directly from the barrel. Henri watches your face as you drink. He is not performing. He is sharing something he loves, and hoping you will love it too. Most people do.\n\nYou leave in the late afternoon with a bottle tucked under your arm and the kind of knowledge that does not come from guidebooks. You will open that bottle at home, months from now, and remember every second of this afternoon.`,
  whats_included: "A walk through the estate's oldest vine parcels with Henri. A private tasting of five wines — including two unreleased vintages — poured directly from the barrel. A curated selection of local charcuterie and cheese. One bottle of your choice to take home. Full English guidance throughout.",
  category: "une_journee",
  experience_type: "wine_vines",
  zone: "Luberon, Provence",
  price_from: 320,
  duration: "Half day — approximately 4 hours",
  group_min: 2,
  group_max: 8,
  season: "April to November",
  language_note: "Henri speaks little English — and that's exactly why you'll remember this afternoon forever.",
  is_published: true,
  partner_id: "placeholder",
  partner: {
    id: "placeholder",
    name: "Domaine des Vieux Chênes",
    host_firstname: "Henri",
    host_lastname: "Bonnard",
    host_bio: "Henri has tended the same vines since 1987. He inherited the domaine from his father, who inherited it from his. He makes wine the way his family always has — slowly, stubbornly, and with absolute devotion.",
    email: "henri@domainebonnard.fr",
    phone: "",
    address: "Luberon, Provence",
    zone: "Luberon",
    stripe_account_id: "",
    commission_rate: 15,
    is_active: true,
    created_at: "",
  },
  images: [
    { id: "1", experience_id: "placeholder", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85", alt: "Ancient vines in the Luberon", position: 0, is_cover: true, created_at: "" },
    { id: "2", experience_id: "placeholder", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85", alt: "The domaine at golden hour", position: 1, is_cover: false, created_at: "" },
    { id: "3", experience_id: "placeholder", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85", alt: "Tasting in the cellar", position: 2, is_cover: false, created_at: "" },
  ],
  created_at: "",
};

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let experience = await getExperience(slug);

  if (!experience) {
    if (slug === PLACEHOLDER.slug) {
      experience = PLACEHOLDER;
    } else {
      notFound();
    }
  }

  const similar = await getSimilar(experience.id, experience.category);
  const images = experience.images ?? [];
  const cover = images.find((img) => img.is_cover) ?? images[0];
  const extraImages = images.filter((img) => !img.is_cover).slice(0, 2);
  const partner = experience.partner;
  const categoryLabel = experience.category === "une_journee" ? "Une Journée"
    : experience.category === "un_sejour" ? "Un Séjour" : "Une Saison";

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0E8]">

        {/* ── HEADER ── */}
        <section className="pt-[73px] border-b border-[#2C2C2C]/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-16">

            {/* Breadcrumb */}
            <div className="flex items-center gap-3 pt-8 sm:pt-10 mb-8 sm:mb-12">
              <Link href="/experiences" className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#2C2C2C]/40 hover:text-[#6B7C5C] transition-colors">
                ← Experiences
              </Link>
              <span className="block w-4 h-px bg-[#2C2C2C]/20" />
              <span className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C]">{categoryLabel}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pb-10 sm:pb-14">

              <div className="sm:col-span-7 space-y-4 sm:space-y-6">
                <p className="font-sans text-[11px] sm:text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">
                  {categoryLabel} · {experience.zone}
                </p>
                <h1 className="font-serif text-[clamp(2.2rem,7vw,4.5rem)] text-[#2C2C2C] leading-[1.05] tracking-tight">
                  {experience.title}
                </h1>
                <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/55 leading-relaxed" style={{ fontWeight: 300 }}>
                  {experience.tagline}
                </p>
              </div>

              {/* Image header — plein largeur mobile, colonne droite desktop */}
              <div className="sm:col-span-5 relative overflow-hidden" style={{ height: "56vw", maxHeight: "320px", minHeight: "200px" }}>
                {cover ? (
                  <img src={cover.url} alt={cover.alt || experience.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#F8F4EE" }}>
                    <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/30">No image</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ── CONTENU ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-16 py-10 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_380px] gap-10 sm:gap-24">

            {/* GAUCHE — storytelling */}
            <div>

              {/* Détails rapides — 2 colonnes mobile, 4 desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pb-10 sm:pb-12 mb-10 sm:mb-12 border-b border-[#2C2C2C]/10">
                {[
                  { label: "Duration", value: experience.duration },
                  { label: "Group size", value: `${experience.group_min}–${experience.group_max} guests` },
                  { label: "Season", value: experience.season || "Year-round" },
                  { label: "Location", value: experience.zone },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#2C2C2C]/35 mb-2">{item.label}</p>
                    <p className="font-sans text-sm text-[#2C2C2C]" style={{ fontWeight: 300 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Storytelling */}
              <div className="mb-12 sm:mb-16">
                {experience.description.split("\n\n").map((para, i) => (
                  <p key={i} className="font-sans text-lg sm:text-xl text-[#2C2C2C]/70 leading-relaxed mb-6 sm:mb-7" style={{ fontWeight: 300 }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Photos secondaires */}
              {extraImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-12 sm:mb-16">
                  {extraImages.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] overflow-hidden">
                      <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Ce qui est inclus */}
              {experience.whats_included && (
                <div className="border-t border-[#2C2C2C]/10 pt-10 sm:pt-12 mb-12 sm:mb-16">
                  <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-5 sm:mb-6">What&rsquo;s included</p>
                  <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
                    {experience.whats_included}
                  </p>
                </div>
              )}

              {/* Hôte */}
              {partner && (
                <div className="border-t border-[#2C2C2C]/10 pt-10 sm:pt-12">
                  <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-6 sm:mb-8">Your host</p>
                  <div className="flex gap-5 sm:gap-6 items-start">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center border border-[#2C2C2C]/15" style={{ backgroundColor: "#F8F4EE" }}>
                      <span className="font-serif text-2xl text-[#2C2C2C]/40">{partner.host_firstname?.[0]}</span>
                    </div>
                    <div>
                      <p className="font-serif text-xl sm:text-2xl text-[#2C2C2C] mb-2 sm:mb-3">{partner.host_firstname} {partner.host_lastname}</p>
                      <p className="font-sans text-base text-[#2C2C2C]/60 leading-relaxed mb-3 sm:mb-4" style={{ fontWeight: 300 }}>{partner.host_bio}</p>
                      {experience.language_note && (
                        <p className="font-serif text-base italic text-[#2C2C2C]/40">&ldquo;{experience.language_note}&rdquo;</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* DROITE — booking
                Desktop : sticky sidebar
                Mobile  : affiché APRÈS le contenu (order CSS) */}
            <div className="sm:block">
              <div className="sm:sticky sm:top-28">
                <BookingBlock experience={experience} />
              </div>
            </div>

          </div>
        </div>

        {/* ── SIMILAIRES ── */}
        {similar.length > 0 && (
          <section style={{ backgroundColor: "#F8F4EE" }} className="border-t border-[#2C2C2C]/10">
            <div className="max-w-7xl mx-auto px-6 sm:px-16 py-12 sm:py-24">
              <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-3 sm:mb-4">Continue exploring</p>
              <h2 className="font-serif text-[clamp(1.8rem,5vw,3.5rem)] text-[#2C2C2C] leading-tight mb-10 sm:mb-14">You might also love</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2C2C2C]/10">
                {similar.map((exp) => {
                  const c = exp.images?.find((i: any) => i.is_cover) ?? exp.images?.[0];
                  return (
                    <Link key={exp.id} href={`/experiences/${exp.slug}`} className="group block sm:px-10 first:pl-0 last:pr-0 py-8 sm:py-0">
                      {c && (
                        <div className="relative aspect-[3/2] overflow-hidden mb-5 sm:mb-6">
                          <img src={c.url} alt={c.alt || exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40">{exp.zone}</p>
                        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C]">
                          {exp.category === "une_journee" ? "Une Journée" : exp.category === "un_sejour" ? "Un Séjour" : "Une Saison"}
                        </p>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-2 sm:mb-3">{exp.title}</h3>
                      <p className="font-sans text-sm sm:text-base text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>From {formatPrice(exp.price_from)} per person</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}