import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2C2C2C]/10" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-16 sm:py-20">

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-12 mb-8">

          {/* Brand */}
          <div className="sm:col-span-5">
            <p className="font-serif text-2xl text-[#2C2C2C] mb-1">Mas & Table</p>
            <p className="font-serif text-[13px] italic text-[#2C2C2C]/70 mb-6">
              The Provence few travellers ever find.
            </p>
            <p className="font-sans text-base text-[#2C2C2C]/60 leading-relaxed max-w-xs" style={{ fontWeight: 300 }}>
              Handpicked estates, vignerons and tables — for those who travel to truly discover.
            </p>
          </div>

          {/* Explore */}
          <div className="sm:col-span-3 sm:col-start-7">
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] mb-6">
              Explore
            </p>
            <div className="flex flex-col gap-4">
              {[
                { href: "/experiences",                      label: "All Experiences" },
                { href: "/experiences?category=une_journee", label: "Une Journée — A Table" },
                { href: "/experiences?category=un_sejour",   label: "Un Séjour — Among the Vines" },
                { href: "/experiences?category=une_saison",  label: "Une Saison — Lost in Provence" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="font-sans text-sm text-[#2C2C2C]/65 hover:text-[#2C2C2C] transition-colors duration-200"
                  style={{ fontWeight: 300 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="sm:col-span-2">
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#6B7C5C] mb-6">
              Information
            </p>
            <div className="flex flex-col gap-4">
              {[
                { href: "/blog",              label: "Stories from Provence" },
                { href: "/partners",          label: "List your experience" },
                { href: "/terms",             label: "Terms & Conditions" },
                { href: "/privacy",           label: "Privacy Policy" },
                { href: "/mentions-legales",  label: "Mentions Légales" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="font-sans text-sm text-[#2C2C2C]/65 hover:text-[#2C2C2C] transition-colors duration-200"
                  style={{ fontWeight: 300 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-[#2C2C2C]/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-sans text-[11px] text-[#2C2C2C]/80">
            © {new Date().getFullYear()} Mas & Table. All rights reserved.
          </p>
          <p className="font-serif text-sm italic text-[#2C2C2C]/80">
            &ldquo;We say no more than we say yes.&rdquo;
          </p>
        </div>

      </div>
    </footer>
  );
}