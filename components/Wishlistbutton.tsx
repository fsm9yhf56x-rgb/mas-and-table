"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface WishlistButtonProps {
  experienceId: string;
  className?: string;
}

export default function WishlistButton({ experienceId, className = "" }: WishlistButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data } = await supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", uid)
          .eq("experience_id", experienceId)
          .maybeSingle();
        if (data) {
          setSaved(true);
          setWishlistId(data.id);
        }
      }
      setLoading(false);
    }
    init();
  }, [experienceId]);

  async function toggle() {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (loading) return;
    setLoading(true);
    if (saved && wishlistId) {
      await supabase.from("wishlists").delete().eq("id", wishlistId);
      setSaved(false);
      setWishlistId(null);
    } else {
      const { data } = await supabase
        .from("wishlists")
        .insert({ user_id: userId, experience_id: experienceId })
        .select("id")
        .single();
      if (data) {
        setSaved(true);
        setWishlistId(data.id);
      }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`group flex items-center gap-2 transition-all duration-300 ${className}`}
      style={{ minHeight: "44px", minWidth: "44px" }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={saved ? "#C4714F" : "none"}
        stroke={saved ? "#C4714F" : "rgba(44,44,44,0.35)"}
        strokeWidth="1.5"
        style={{ transition: "all 0.25s ease", transform: loading ? "scale(0.9)" : "scale(1)" }}
        className="group-hover:stroke-[#C4714F] transition-colors duration-200"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span
        className="hidden sm:block font-sans text-[11px] tracking-[0.3em] uppercase transition-colors duration-200"
        style={{ color: saved ? "#C4714F" : "rgba(44,44,44,0.35)", fontWeight: 300 }}
      >
        {saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}