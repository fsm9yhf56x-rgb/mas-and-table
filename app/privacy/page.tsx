import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Mas & Table",
  description: "How Mas & Table collects, uses and protects your personal data — GDPR compliant.",
  alternates: { canonical: "https://masandtable.com/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#2C2C2C]/10 py-10 sm:py-14">
      <h2 className="font-serif text-[clamp(1.3rem,3vw,1.8rem)] text-[#2C2C2C] leading-tight mb-6">
        {title}
      </h2>
      <div className="space-y-4 font-sans text-base text-[#2C2C2C]/70 leading-relaxed" style={{ fontWeight: 300 }}>
        {children}
      </div>
    </div>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] pt-4 pb-1">
      {children}
    </h3>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#6B7C5C] flex-shrink-0 mt-1">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function UsageTable() {
  const rows = [
    ["Process and confirm your booking", "Name, email, booking details", "Contract performance"],
    ["Send confirmation & welcome guide", "Name, email, booking details", "Contract performance"],
    ["Send day-before reminder", "Name, email, booking date", "Contract performance"],
    ["Share details with your Partner", "Name, guests, host notes", "Contract performance"],
    ["Process payment via Stripe", "Booking total, email", "Contract performance"],
    ["Send review request (J+1)", "Name, email", "Legitimate interest"],
    ["Improve the platform (analytics)", "Usage data, anonymised", "Legitimate interest"],
    ["Comply with legal obligations", "Booking & payment records", "Legal obligation"],
  ];
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: "#6B7C5C" }}>
            {["Purpose", "Data used", "Legal basis"].map((h) => (
              <th key={h} className="text-left text-white font-sans font-normal tracking-wide px-4 py-3 text-[11px] uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8F4EE" }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#2C2C2C]/70 font-sans align-top text-sm" style={{ fontWeight: 300 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CookieTable() {
  const rows = [
    ["Session cookie", "Strictly necessary", "Maintain booking session", "Session only"],
    ["Stripe cookie", "Strictly necessary", "Payment fraud prevention", "Session only"],
    ["Analytics (anonymised)", "Performance", "Understand page usage — no personal data", "12 months"],
  ];
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: "#6B7C5C" }}>
            {["Cookie", "Type", "Purpose", "Duration"].map((h) => (
              <th key={h} className="text-left text-white font-sans font-normal tracking-wide px-4 py-3 text-[11px] uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8F4EE" }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#2C2C2C]/70 font-sans align-top text-sm" style={{ fontWeight: 300 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0E8]">

        <section className="pt-[73px] border-b border-[#2C2C2C]/10">
          <div className="max-w-4xl mx-auto px-6 sm:px-16 py-12 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="block w-6 h-px bg-[#6B7C5C]" />
              <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C]">Legal</p>
            </div>
            <h1 className="font-serif text-[clamp(2rem,6vw,3.5rem)] text-[#2C2C2C] leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="font-sans text-base text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              Effective date: March 2026 · GDPR compliant · We never sell your data.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 sm:px-16 pb-20">

          <Section title="1. Who We Are">
            <p>Mas & Table SASU ("Mas & Table", "we", "us") operates the platform masandtable.com. We are the data controller for all personal data collected through this platform.</p>
            <p>This Privacy Policy explains how we collect, use, store, and protect your personal data when you visit our website or make a booking.</p>
          </Section>

          <Section title="2. Data We Collect">
            <H3>2.1 Data you provide directly</H3>
            <Ul items={[
              "Booking information: first name, last name, email address, phone number (optional), notes to your host (optional).",
              "Payment information: processed directly by Stripe — Mas & Table never sees or stores your full card details.",
              "Reviews: your first name and review content, if you choose to submit one.",
              "Contact messages: any message you send via email or contact form.",
            ]} />
            <H3>2.2 Data collected automatically</H3>
            <Ul items={[
              "Usage data: pages visited, time spent, browser type, device type, referring URL.",
              "IP address and approximate location (country/city level).",
              "Cookies: see Section 6.",
            ]} />
            <H3>2.3 Data we do not collect</H3>
            <Ul items={[
              "Sensitive personal data (health, religion, political opinions, ethnicity).",
              "Your full payment card details — Stripe handles this entirely.",
              "We do not sell your personal data to third parties. Ever.",
            ]} />
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We only use your data for the purposes listed below, with a clear legal basis for each:</p>
            <UsageTable />
          </Section>

          <Section title="4. Data Sharing">
            <Ul items={[
              "With your Partner: we share your first name, number of guests, experience date, and any notes for your host. We do not share your email, phone, or payment details with Partners.",
              "With Stripe: for secure payment processing. Stripe is PCI-DSS Level 1 certified. See stripe.com/privacy.",
              "With Vercel and Supabase: for platform hosting and data storage. Both are GDPR-compliant processors.",
              "With Resend: for transactional emails only. No marketing data is shared.",
            ]} />
            <p>We never sell, rent, or share your personal data with advertisers, data brokers, or any third party for commercial purposes.</p>
          </Section>

          <Section title="5. Data Retention">
            <Ul items={[
              "Booking data: retained for 5 years to comply with French accounting law (Article L123-22 of the French Commercial Code).",
              "Email communications: retained for 3 years from the date of last contact.",
              "Analytics data: anonymised and aggregated — no retention limit applies.",
              "You may request deletion at any time (see Section 7), subject to legal retention obligations.",
            ]} />
          </Section>

          <Section title="6. Cookies">
            <p>We use a minimal set of cookies to operate the platform:</p>
            <CookieTable />
            <p>We do not use advertising cookies, tracking pixels, or third-party marketing cookies.</p>
          </Section>

          <Section title="7. Your Rights (GDPR)">
            <p>As a data subject under GDPR (EU 2016/679), you have the following rights:</p>
            <Ul items={[
              "Right of access: request a copy of all personal data we hold about you.",
              "Right to rectification: request correction of inaccurate or incomplete data.",
              "Right to erasure ('right to be forgotten'): request deletion of your data.",
              "Right to restriction: request that we limit how we use your data.",
              "Right to data portability: receive your data in a structured, machine-readable format.",
              "Right to object: object to processing based on legitimate interest.",
              "Right to withdraw consent: where processing is based on consent, withdraw it at any time.",
            ]} />
            <p>To exercise any of these rights, email: <a href="mailto:privacy@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">privacy@masandtable.com</a></p>
            <p>We will respond within 30 days. You also have the right to lodge a complaint with the CNIL at <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#6B7C5C] underline underline-offset-2">cnil.fr</a>.</p>
          </Section>

          <Section title="8. Data Security">
            <Ul items={[
              "HTTPS encryption on all pages of masandtable.com.",
              "Payment data handled exclusively by Stripe (PCI-DSS Level 1 certified).",
              "Database access restricted to authorised personnel only.",
              "Regular security reviews of our infrastructure.",
            ]} />
            <p>No method of transmission over the internet is 100% secure. While we implement strong protections, we cannot guarantee absolute security.</p>
          </Section>

          <Section title="9. International Data Transfers">
            <p>Our platform infrastructure is hosted on Vercel (US) and Supabase (EU). Vercel operates under the EU-US Data Privacy Framework. Stripe processes data in the US and EU under standard contractual clauses approved by the European Commission.</p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>Our platform is not intended for children under 18. We do not knowingly collect personal data from minors. If you believe a child has provided us with personal data, contact us at <a href="mailto:privacy@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">privacy@masandtable.com</a>.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Material changes will be communicated by email or by a prominent notice on the platform at least 14 days before they take effect.</p>
          </Section>

          <Section title="12. Contact">
            <p>Mas & Table SASU — Data Controller</p>
            <p>Email: <a href="mailto:privacy@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">privacy@masandtable.com</a></p>
            <p>Website: masandtable.com</p>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}