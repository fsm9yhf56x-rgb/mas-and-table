import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Mas & Table",
  description: "General Terms of Service for Mas & Table — masandtable.com",
  alternates: { canonical: "https://masandtable.com/terms" },
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

function CancellationTable() {
  const rows = [
    { when: "14 days or more before", refund: "100% — full refund", note: "5–7 business days" },
    { when: "7 to 13 days before", refund: "50% refund", note: "5–7 business days" },
    { when: "Less than 7 days before", refund: "No refund", note: "—" },
    { when: "Partner cancels", refund: "100% — full refund", note: "5–7 business days" },
  ];
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: "#6B7C5C" }}>
            {["When you cancel", "Refund to you", "Processing time"].map((h) => (
              <th key={h} className="text-left text-white font-sans font-normal tracking-wide px-4 py-3 text-[11px] uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8F4EE" }}>
              <td className="px-4 py-3 text-[#2C2C2C]/70 font-sans text-sm" style={{ fontWeight: 300 }}>{row.when}</td>
              <td className="px-4 py-3 text-[#2C2C2C] font-sans font-medium text-sm">{row.refund}</td>
              <td className="px-4 py-3 text-[#2C2C2C]/50 font-sans text-sm" style={{ fontWeight: 300 }}>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p className="font-sans text-base text-[#2C2C2C]/50" style={{ fontWeight: 300 }}>
              Effective date: March 2026 · Governed by French law
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 sm:px-16 pb-20">

          <Section title="1. About Mas & Table">
            <p>Mas & Table (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an online platform operated by Mas & Table SASU, a French simplified joint-stock company registered in Marseille, France. We connect international travellers with carefully selected experience providers (&quot;Partners&quot;) across Provence and the PACA region.</p>
            <p>Mas & Table acts as an intermediary. We are not the provider of the experiences listed on our platform. Each experience is delivered by an independent Partner who remains solely responsible for its execution.</p>
          </Section>

          <Section title="2. Acceptance of Terms">
            <p>By accessing masandtable.com, creating a booking, or completing a payment, you agree to be bound by these Terms & Conditions in full. If you do not agree with any part of these terms, you must not use our platform.</p>
          </Section>

          <Section title="3. The Booking Process">
            <H3>3.1 How bookings work</H3>
            <p>All bookings follow a request-and-confirm model:</p>
            <Ul items={[
              "You submit a booking request by selecting a date, number of guests, and completing the payment form.",
              "Your card is authorised but not charged until your Partner confirms availability — usually within 24 hours.",
              "You will receive a confirmation email once the Partner has accepted your request.",
              "If the Partner cannot accommodate your request, your payment authorisation is immediately released.",
            ]} />
            <div className="mt-4 px-5 py-4 border-l-2 border-[#6B7C5C] bg-[#F8F4EE] font-serif italic text-[#2C2C2C]/60">
              &ldquo;You won&apos;t be charged until your host confirms — usually within 24 hours.&rdquo;
            </div>
            <H3>3.2 What you&apos;re booking</H3>
            <p>Each listing describes a specific experience, at a specific location, with a specific Partner. Mas & Table curates and approves all listings, but cannot guarantee the exact delivery of every detail described — weather, seasonal variations, and unforeseen circumstances may affect the experience.</p>
            <H3>3.3 No account required</H3>
            <p>You are not required to create an account to complete a booking. A valid email address is sufficient.</p>
          </Section>

          <Section title="4. Pricing and Payments">
            <H3>4.1 Pricing</H3>
            <p>All prices are per person (unless stated otherwise), inclusive of all taxes, and represent the total amount you will pay. There are no booking fees, service charges, or hidden costs.</p>
            <H3>4.2 Payment processing</H3>
            <p>Payments are processed securely by Stripe, Inc. via Stripe Connect. Mas & Table does not store your card details. By completing a payment, you also agree to Stripe&apos;s Terms of Service.</p>
            <H3>4.3 Currency</H3>
            <p>All prices are displayed and charged in Euros (€). Your bank or card provider may apply currency conversion fees — these are outside our control.</p>
          </Section>

          <Section title="5. Cancellation Policy">
            <p>The following policy applies to all bookings unless a specific listing states otherwise:</p>
            <CancellationTable />
            <p className="mt-4">To cancel a booking, email us at <a href="mailto:hello@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">hello@masandtable.com</a> with your booking reference.</p>
          </Section>

          <Section title="6. Responsibilities">
            <H3>6.1 Mas & Table&apos;s responsibilities</H3>
            <Ul items={[
              "Curating and approving all experience listings to our published standards.",
              "Processing payments securely via Stripe Connect.",
              "Sending booking confirmations, welcome guides, and day-before reminders.",
              "Handling cancellations and refunds in accordance with Section 5.",
            ]} />
            <H3>6.2 What Mas & Table is not responsible for</H3>
            <Ul items={[
              "The actual delivery of the experience — this is the Partner's sole responsibility.",
              "Injury, loss, damage or dissatisfaction arising from the experience itself.",
              "Force majeure events (weather, natural disasters, strikes, pandemics).",
              "Your travel to and from the experience location.",
              "Currency fluctuations or bank charges applied by your card provider.",
            ]} />
            <H3>6.3 Your responsibilities</H3>
            <Ul items={[
              "Providing accurate contact and booking information.",
              "Arriving on time at the agreed meeting point.",
              "Behaving respectfully toward Partners, their property, and other guests.",
              "Reading the full experience description, including any physical requirements.",
              "Ensuring you have appropriate travel insurance for your trip.",
            ]} />
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on masandtable.com — including text, photography, design, and branding — is the property of Mas & Table SASU and is protected by French and international intellectual property law. You may not reproduce, distribute, or commercially use any content without our prior written consent.</p>
          </Section>

          <Section title="8. Reviews">
            <p>By submitting a review, you grant Mas & Table a non-exclusive, royalty-free licence to publish and use your review on the platform and in marketing materials. We reserve the right to moderate or remove reviews that contain offensive, defamatory, or false content.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, Mas & Table&apos;s total liability shall not exceed the total amount paid by you for the relevant booking. We are not liable for any indirect, incidental, or consequential losses.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms & Conditions are governed by French law. Any disputes shall be subject to the exclusive jurisdiction of the courts of Marseille, France.</p>
            <p>EU consumers may also access the dispute resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#6B7C5C] underline underline-offset-2">ec.europa.eu/consumers/odr</a>.</p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>We reserve the right to update these Terms & Conditions at any time. Material changes will be communicated by email or by a prominent notice on the platform.</p>
          </Section>

          <Section title="12. Contact">
            <p>Mas & Table SASU</p>
            <p>Email: <a href="mailto:hello@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">hello@masandtable.com</a></p>
            <p>Website: masandtable.com</p>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}