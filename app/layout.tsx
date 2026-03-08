import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import QuickSearch from "@/components/QuickSearch";
import StickySearch from "@/components/StickySearch";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://masandtable.com"),
  title: {
    default: "Mas & Table — The Provence few travellers ever find",
    template: "%s | Mas & Table",
  },
  description:
    "Handpicked domaines, vignerons and hidden tables in Provence — for those who travel to truly discover. Curated experiences from €150 per person.",
  keywords: [
    "luxury Provence experience",
    "wine tasting Provence",
    "cooking retreat South of France",
    "wine weekend Luberon",
    "exclusive Provence retreat",
    "farm to table Provence",
    "private wine tasting Provence",
    "Provence experiences for couples",
  ],
  authors: [{ name: "Mas & Table" }],
  creator: "Mas & Table",
  publisher: "Mas & Table",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://masandtable.com",
    siteName: "Mas & Table",
    title: "Mas & Table — The Provence few travellers ever find",
    description:
      "Handpicked domaines, vignerons and hidden tables in Provence — for those who travel to truly discover.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mas & Table — Curated Provence experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mas & Table — The Provence few travellers ever find",
    description:
      "Handpicked domaines, vignerons and hidden tables in Provence — for those who travel to truly discover.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://masandtable.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <QuickSearch />
        <StickySearch />
        <CookieBanner />
      </body>
    </html>
  );
}