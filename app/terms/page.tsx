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

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
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
            <th className="text-left text-white font-sans font-normal tracking-wide px-4 py-3 text-[11px] uppercase">When you cancel</th>
            <th className="text-left text-white font-sans font-normal tracking-wide px-4 py-3 text-[11px] uppercase">Refund to you</th>
            <th className="text-left text-white font-sans font-normal tracking-wide px-4 py-3 text-[11px] uppercase">Processing time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8F4EE" }}>
              <td className="px-4 py-3 text-[#2C2C2C]/70 font-sans" style={{ fontWeight: 300 }}>{row.when}</td>
              <td className="px-4 py-3 text-[#2C2C2C] font-sans font-medium">{row.refund}</td>
              <td className="px-4 py-3 text-[#2C2C2C]/50 font-sans" style={{ fontWeight: 300 }}>{row.note}</td>
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

        {/* Header */}
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 sm:px-16 pb-20">

          <Section title="1. About Mas & Table">
            <P>Mas & Table ("we", "us", "our") is an online platform operated by Mas & Table SASU, a French simplified joint-stock company registered in Marseille, France. We connect international travellers with carefully selected experience providers ("Partners") across Provence and the PACA region.</P>
            <P>Mas & Table acts as an intermediary. We are not the provider of the experiences listed on our platform. Each experience is delivered by an independent Partner who remains solely responsible for its execution.</P>
          </Section>

          <Section title="2. Acceptance of Terms">
            <P>By accessing masandtable.com, creating a booking, or completing a payment, you agree to be bound by these Terms & Conditions in full. If you do not agree with any part of these terms, you must not use our platform.</P>
          </Section>

          <Section title="3. The Booking Process">
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mb-3">3.1 How bookings work</h3>
            <P>All bookings follow a request-and-confirm model:</P>
            <Ul items={[
              "You submit a booking request by selecting a date, number of guests, and completing the payment form.",
              "Your card is authorised but not charged until your Partner confirms availability — usually within 24 hours.",
              "You will receive a confirmation email once the Partner has accepted your request.",
              "If the Partner cannot accommodate your request, your payment authorisation is immediately released and no charge is made.",
            ]} />
            <div className="mt-4 px-5 py-4 border-l-2 border-[#6B7C5C] bg-[#F8F4EE] font-serif italic text-[#2C2C2C]/60">
              "You won't be charged until your host confirms — usually within 24 hours."
            </div>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mt-8 mb-3">3.2 What you're booking</h3>
            <P>Each listing describes a specific experience, at a specific location, with a specific Partner. Mas & Table curates and approves all listings, but cannot guarantee the exact delivery of every detail described — weather, seasonal variations, and unforeseen circumstances may affect the experience.</P>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mt-8 mb-3">3.3 No account required</h3>
            <P>You are not required to create an account to complete a booking. A valid email address is sufficient.</P>
          </Section>

          <Section title="4. Pricing and Payments">
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mb-3">4.1 Pricing</h3>
            <P>All prices are per person (unless stated otherwise), inclusive of all taxes, and represent the total amount you will pay. There are no booking fees, service charges, or hidden costs.</P>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mt-8 mb-3">4.2 Payment processing</h3>
            <P>Payments are processed securely by Stripe, Inc. via Stripe Connect. Mas & Table does not store your card details. By completing a payment, you also agree to Stripe's Terms of Service.</P>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mt-8 mb-3">4.3 Currency</h3>
            <P>All prices are displayed and charged in Euros (€). Your bank or card provider may apply currency conversion fees — these are outside our control.</P>
          </Section>

          <Section title="5. Cancellation Policy">
            <P>The following policy applies to all bookings unless a specific listing states otherwise:</P>
            <CancellationTable />
            <P className="mt-4">To cancel a booking, email us at <a href="mailto:hello@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">hello@masandtable.com</a> with your booking reference. Cancellations are effective upon receipt of our written acknowledgement.</P>
          </Section>

          <Section title="6. Responsibilities">
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mb-3">6.1 Mas & Table's responsibilities</h3>
            <Ul items={[
              "Curating and approving all experience listings to our published standards.",
              "Processing payments securely via Stripe Connect.",
              "Sending booking confirmations, welcome guides, and day-before reminders.",
              "Handling cancellations and refunds in accordance with Section 5.",
            ]} />
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mt-8 mb-3">6.2 What Mas & Table is not responsible for</h3>
            <Ul items={[
              "The actual delivery of the experience — this is the Partner's sole responsibility.",
              "Injury, loss, damage or dissatisfaction arising from the experience itself.",
              "Force majeure events (weather, natural disasters, strikes, pandemics).",
              "Your travel to and from the experience location.",
              "Currency fluctuations or bank charges applied by your card provider.",
            ]} />
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-[#6B7C5C] mt-8 mb-3">6.3 Your responsibilities</h3>
            <Ul items={[
              "Providing accurate contact and booking information.",
              "Arriving on time at the agreed meeting point.",
              "Behaving respectfully toward Partners, their property, and other guests.",
              "Reading the full experience description, including any physical requirements.",
              "Ensuring you have appropriate travel insurance for your trip.",
            ]} />
          </Section>

          <Section title="7. Intellectual Property">
            <P>All content on masandtable.com — including text, photography, design, and branding — is the property of Mas & Table SASU and is protected by French and international intellectual property law. You may not reproduce, distribute, or commercially use any content without our prior written consent.</P>
          </Section>

          <Section title="8. Reviews">
            <P>By submitting a review, you grant Mas & Table a non-exclusive, royalty-free licence to publish and use your review on the platform and in marketing materials. We reserve the right to moderate or remove reviews that contain offensive, defamatory, or false content.</P>
          </Section>

          <Section title="9. Limitation of Liability">
            <P>To the maximum extent permitted by applicable law, Mas & Table's total liability to you in connection with any booking shall not exceed the total amount paid by you for that booking.</P>
            <P>We are not liable for any indirect, incidental, or consequential losses arising from your use of the platform or participation in any experience.</P>
          </Section>

          <Section title="10. Governing Law">
            <P>These Terms & Conditions are governed by and construed in accordance with French law. Any disputes shall be subject to the exclusive jurisdiction of the courts of Marseille, France.</P>
            <P>If you are a consumer resident in the European Union, you may also access the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" className="text-[#6B7C5C] underline underline-offset-2">ec.europa.eu/consumers/odr</a>.</P>
          </Section>

          <Section title="11. Changes to These Terms">
            <P>We reserve the right to update these Terms & Conditions at any time. Material changes will be communicated by email or by a prominent notice on the platform. Your continued use of the platform after changes constitutes acceptance of the revised terms.</P>
          </Section>

          <Section title="12. Contact">
            <P>Mas & Table SASU</P>
            <P>Email: <a href="mailto:hello@masandtable.com" className="text-[#6B7C5C] underline underline-offset-2">hello@masandtable.com</a></P>
            <P>Website: masandtable.com</P>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}