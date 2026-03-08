"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  une_journee: "Une Journee",
  un_sejour: "Un Sejour",
  une_saison: "Une Saison",
};

export default function AccountWishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase
        .from("wishlists")
        .select(
          "id, experience_id, created_at, experience:experiences(id, slug, title, zone, price_from, category, images:experience_images(url, is_cover))"
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  async function removeFromWishlist(id: string) {
    await supabase.from("wishlists").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-[#2C2C2C]/10">
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-2">
          Account
        </p>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] text-[#2C2C2C] leading-tight">
          <em>Wishlist</em>
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse"
              style={{ backgroundColor: "#F8F4EE" }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl text-[#2C2C2C]/40 italic mb-6">
            Nothing saved yet.
          </p>
          <p
            className="font-sans text-base text-[#2C2C2C]/40 mb-8"
            style={{ fontWeight: 300 }}
          >
            Save experiences you love by clicking the heart on any experience
            page.
          </p>
          <Link
            href="/experiences"
            className="group relative inline-flex items-center gap-3 border border-[#6B7C5C] text-[#6B7C5C] font-sans text-[10px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
            style={{ padding: "14px 28px" }}
          >
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">Explore experiences</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
          {items.map((item) => {
            const exp = item.experience;
            const cover =
              exp?.images?.find((i: any) => i.is_cover) ?? exp?.images?.[0];
            const imgSrc =
              cover?.url ??
              "https://images.unsplash.com/photo-1567072629554-20e689de2400?q=80&w=774";
            return (
              <div key={item.id} className="group relative">
                <Link href={`/experiences/${exp?.slug}`} className="block">
                  <div
                    className="relative aspect-[4/5] mb-4 overflow-hidden"
                    style={{ backgroundColor: "#F8F4EE" }}
                  >
                    <Image
                      src={imgSrc}
                      alt={exp?.title ?? ""}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="font-sans text-[9px] tracking-[0.4em] uppercase px-2 py-1 bg-[#F5F0E8]/90 text-[#2C2C2C]">
                        {CATEGORY_LABEL[exp?.category] ?? exp?.category}
                      </span>
                    </div>
                  </div>
                  <p
                    className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/40 mb-1"
                    style={{ fontWeight: 300 }}
                  >
                    {exp?.zone}
                  </p>
                  <h3 className="font-serif text-lg text-[#2C2C2C] group-hover:text-[#6B7C5C] transition-colors duration-300 leading-snug mb-1">
                    {exp?.title}
                  </h3>
                  <p
                    className="font-sans text-sm text-[#2C2C2C]/40"
                    style={{ fontWeight: 300 }}
                  >
                    From {formatPrice(exp?.price_from)}
                  </p>
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#FDFAF5]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove from wishlist"
                >
                  <span style={{ fontSize: "14px", color: "#C4714F" }}>
                    &hearts;
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}