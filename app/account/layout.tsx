"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/account",            label: "Overview"    },
  { href: "/account/bookings",   label: "Bookings"    },
  { href: "/account/wishlist",   label: "Wishlist"    },
  { href: "/account/gift-cards", label: "Gift Cards"  },
  { href: "/account/profile",    label: "Profile"     },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]           = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
      setFirstName(session.user.user_metadata?.first_name ?? session.user.email?.split("@")[0] ?? "");
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <p className="font-serif italic text-xl text-[#2C2C2C]/30">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-16 py-12 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-16">

            <aside className="sm:col-span-3">
              <div className="mb-10 pb-8 border-b border-[#2C2C2C]/10">
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#6B7C5C] mb-2">
                  The Inner Table
                </p>
                <p className="font-serif text-2xl text-[#2C2C2C]">
                  <em>{firstName}</em>
                </p>
                <p
                  className="font-sans text-xs text-[#2C2C2C]/35 mt-1 truncate"
                  style={{ fontWeight: 300 }}
                >
                  {user?.email}
                </p>
              </div>

              <nav className="flex flex-col gap-1 mb-10">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        padding: "10px 12px",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase" as const,
                        color: active ? "#2C2C2C" : "rgba(44,44,44,0.40)",
                        backgroundColor: active ? "rgba(44,44,44,0.04)" : "transparent",
                        borderLeft: active ? "2px solid #6B7C5C" : "2px solid transparent",
                        display: "block",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleSignOut}
                className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#2C2C2C]/25 hover:text-[#2C2C2C]/50 transition-colors duration-200"
              >
                Sign out
              </button>
            </aside>

            <div className="sm:col-span-9">
              {children}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}