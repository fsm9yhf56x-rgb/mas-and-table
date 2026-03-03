"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── STEP INDICATOR ──────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ["Your booking", "Your details", "Payment"];
  return (
    <div className="flex items-center mb-10 sm:mb-16">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 flex items-center justify-center font-sans text-[11px] transition-all duration-300"
              style={{
                backgroundColor: i + 1 === step ? "#2C2C2C" : i + 1 < step ? "#6B7C5C" : "transparent",
                color: i + 1 <= step ? "#F5F0E8" : "rgba(44,44,44,0.3)",
                border: i + 1 > step ? "1px solid rgba(44,44,44,0.15)" : "none",
              }}
            >
              {i + 1 < step ? "✓" : i + 1}
            </div>
            {/* Label caché sur très petit mobile */}
            <span
              className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-2"
              style={{ color: i + 1 === step ? "#2C2C2C" : "rgba(44,44,44,0.35)" }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-px mx-2 sm:mx-3 mb-5 transition-colors duration-300"
              style={{
                width: "clamp(24px, 8vw, 96px)",
                backgroundColor: i + 1 < step ? "#6B7C5C" : "rgba(44,44,44,0.12)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── BOUTONS ─────────────────────────────────────────────────
function BtnPrimary({ label, onClick, type = "button", disabled = false }: {
  label: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group relative flex-1 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ minHeight: "56px" }}
    >
      <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function BtnSecondary({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 border border-[#2C2C2C]/20 text-[#2C2C2C]/50 font-sans text-[11px] tracking-[0.4em] uppercase hover:border-[#2C2C2C]/40 hover:text-[#2C2C2C]/70 transition-colors duration-300"
      style={{ minHeight: "56px" }}
    >
      {label}
    </button>
  );
}

// ── STEP 1 ──────────────────────────────────────────────────
function Step1({ experience, date, guests, onNext, onChangeDetails }: any) {
  const total = experience.price_from * guests;
  return (
    <div>
      <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-4">Step 1</p>
      <h1 className="font-serif text-[clamp(1.8rem,7vw,3rem)] text-[#2C2C2C] leading-tight mb-8 sm:mb-12">Your booking</h1>

      <div className="border border-[#2C2C2C]/15 p-6 sm:p-8 mb-6 sm:mb-8" style={{ backgroundColor: "#F8F4EE" }}>
        <h2 className="font-serif text-lg sm:text-xl text-[#2C2C2C] mb-6 sm:mb-8">{experience.title}</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { label: "Date", value: new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
            { label: "Guests", value: `${guests} ${guests === 1 ? "guest" : "guests"}` },
            { label: "Location", value: experience.zone },
            { label: "Duration", value: experience.duration },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-1">{item.label}</p>
              <p className="font-sans text-sm text-[#2C2C2C]" style={{ fontWeight: 300 }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2C2C2C]/10 pt-5">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans text-sm text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
              {formatPrice(experience.price_from)} × {guests} guests
            </p>
            <p className="font-serif text-2xl sm:text-3xl text-[#2C2C2C]">{formatPrice(total)}</p>
          </div>
          <p className="font-sans text-[11px] text-[#2C2C2C]/35" style={{ fontWeight: 300 }}>All taxes included</p>
        </div>
      </div>

      <button
        onClick={onChangeDetails}
        className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/35 underline underline-offset-4 mb-8 block hover:text-[#2C2C2C] transition-colors"
        style={{ minHeight: "44px" }}
      >
        Change details
      </button>

      <div className="flex gap-3 sm:gap-4">
        <BtnPrimary label="Proceed" onClick={onNext} />
      </div>
    </div>
  );
}

// ── STEP 2 ──────────────────────────────────────────────────
function Step2({ onNext, onBack, customerData, setCustomerData }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData.firstname || !customerData.lastname || !customerData.email) return;
    onNext();
  };

  const inputClass = "w-full border border-[#2C2C2C]/15 px-4 font-sans text-sm text-[#2C2C2C] focus:outline-none focus:border-[#6B7C5C] transition-colors";
  const inputStyle = { backgroundColor: "#F8F4EE", minHeight: "48px" };

  return (
    <div>
      <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-4">Step 2</p>
      <h1 className="font-serif text-[clamp(1.8rem,7vw,3rem)] text-[#2C2C2C] leading-tight mb-2">Almost there.</h1>
      <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/55 leading-relaxed mb-8 sm:mb-12" style={{ fontWeight: 300 }}>
        We just need a few details to confirm your booking.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-2">First name *</label>
            <input type="text" required value={customerData.firstname} onChange={e => setCustomerData({ ...customerData, firstname: e.target.value })} className={inputClass} style={inputStyle} placeholder="Sarah" />
          </div>
          <div>
            <label className="block font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-2">Last name *</label>
            <input type="text" required value={customerData.lastname} onChange={e => setCustomerData({ ...customerData, lastname: e.target.value })} className={inputClass} style={inputStyle} placeholder="Mitchell" />
          </div>
        </div>
        <div>
          <label className="block font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-2">Email *</label>
          <input type="email" required value={customerData.email} onChange={e => setCustomerData({ ...customerData, email: e.target.value })} className={inputClass} style={inputStyle} placeholder="sarah@example.com" />
        </div>
        <div>
          <label className="block font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-2">
            Phone <span className="text-[#2C2C2C]/30">(optional)</span>
          </label>
          <input type="tel" value={customerData.phone} onChange={e => setCustomerData({ ...customerData, phone: e.target.value })} className={inputClass} style={inputStyle} placeholder="+44 7700 900000" />
        </div>
        <div>
          <label className="block font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-2">
            Notes for your host <span className="text-[#2C2C2C]/30">(optional)</span>
          </label>
          <textarea
            value={customerData.notes}
            onChange={e => setCustomerData({ ...customerData, notes: e.target.value })}
            rows={3}
            className={`${inputClass} resize-none pt-3`}
            style={{ backgroundColor: "#F8F4EE" }}
            placeholder="Dietary requirements, special occasions, anything your host should know..."
          />
        </div>

        <div className="flex gap-3 sm:gap-4 pt-2">
          <BtnSecondary label="Back" onClick={onBack} />
          <BtnPrimary label="Continue" type="submit" />
        </div>
      </form>
    </div>
  );
}

// ── STEP 3 ──────────────────────────────────────────────────
function PaymentForm({ experience, date, guests, customerData, onBack, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = experience.price_from * guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceId: experience.id, partnerId: experience.partner_id, amount: total, guests, date, customerData }),
      });
      const { clientSecret, bookingId, error: apiError } = await res.json();
      if (apiError) { setError(apiError); setLoading(false); return; }
      const card = elements.getElement(CardElement);
      if (!card) return;
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { name: `${customerData.firstname} ${customerData.lastname}`, email: customerData.email } },
      });
      if (stripeError) { setError(stripeError.message ?? "Payment failed."); setLoading(false); return; }
      if (paymentIntent?.status === "succeeded") onSuccess(bookingId);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-4">Step 3</p>
      <h1 className="font-serif text-[clamp(1.8rem,7vw,3rem)] text-[#2C2C2C] leading-tight mb-8 sm:mb-12">Secure your experience.</h1>

      {/* Mobile : stack vertical. Desktop : 2 colonnes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">

        {/* Card details */}
        <div>
          <label className="block font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-3">Card details</label>
          <div className="border border-[#2C2C2C]/15 px-4 py-4" style={{ backgroundColor: "#F8F4EE" }}>
            <CardElement options={{ style: {
              base: { fontSize: "14px", color: "#2C2C2C", fontFamily: "Inter, sans-serif", "::placeholder": { color: "rgba(44,44,44,0.3)" } },
              invalid: { color: "#C4714F" },
            }}} />
          </div>
          {error && <p className="font-sans text-[11px] text-[#C4714F] mt-3">{error}</p>}
          <div className="flex items-start gap-2 mt-4">
            <svg className="w-4 h-4 text-[#6B7C5C] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="font-sans text-[11px] text-[#2C2C2C]/40 leading-relaxed" style={{ fontWeight: 300 }}>
              Secured by Stripe. Your card data never touches our servers.
            </p>
          </div>
        </div>

        {/* Recap */}
        <div className="border border-[#2C2C2C]/15 p-5 sm:p-6" style={{ backgroundColor: "#F8F4EE" }}>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40 mb-3 sm:mb-4">Your booking</p>
          <p className="font-serif text-lg sm:text-xl text-[#2C2C2C] mb-4 sm:mb-6">{experience.title}</p>
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {[
              { label: "Date", value: new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
              { label: "Guests", value: `${guests}` },
              { label: "Name", value: `${customerData.firstname} ${customerData.lastname}` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-4">
                <span className="font-sans text-[11px] text-[#2C2C2C]/40">{item.label}</span>
                <span className="font-sans text-[11px] text-[#2C2C2C] text-right">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2C2C2C]/10 pt-4 flex justify-between items-center">
            <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/40">Total</span>
            <span className="font-serif text-xl sm:text-2xl text-[#2C2C2C]">{formatPrice(total)}</span>
          </div>
          <p className="font-sans text-[11px] text-[#2C2C2C]/40 mt-4 leading-relaxed" style={{ fontWeight: 300 }}>
            You won&rsquo;t be charged until your host confirms — usually within 24 hours.
          </p>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <BtnSecondary label="Back" onClick={onBack} />
        <button
          type="submit"
          disabled={loading || !stripe}
          className="group relative flex-1 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ minHeight: "56px" }}
        >
          <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">
            {loading ? "Processing..." : `Complete — ${formatPrice(total)}`}
          </span>
        </button>
      </div>
    </form>
  );
}

function Step3({ experience, date, guests, customerData, onBack, onSuccess }: any) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm experience={experience} date={date} guests={guests} customerData={customerData} onBack={onBack} onSuccess={onSuccess} />
    </Elements>
  );
}

// ── CONFIRMATION ─────────────────────────────────────────────
function Confirmation({ experience, date, customerData }: any) {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="flex items-center gap-4 mb-12 sm:mb-16">
          <span className="block w-6 sm:w-8 h-px bg-[#6B7C5C]" />
          <p className="font-sans text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">Confirmed</p>
        </div>
        <h1 className="font-serif text-[clamp(2.2rem,9vw,5rem)] text-[#2C2C2C] leading-[1.0] mb-6 sm:mb-8">
          Your Provence<br /><em>is confirmed.</em>
        </h1>
        <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/55 leading-relaxed mb-3" style={{ fontWeight: 300 }}>
          {experience.partner?.host_firstname} is expecting you on{" "}
          {new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}.
        </p>
        <p className="font-sans text-lg sm:text-xl text-[#2C2C2C]/55 leading-relaxed mb-12 sm:mb-16" style={{ fontWeight: 300 }}>
          A confirmation email has been sent to {customerData.email}.
        </p>
        <div className="border border-[#2C2C2C]/15 p-6 sm:p-8 mb-12 sm:mb-16" style={{ backgroundColor: "#F8F4EE" }}>
          {[
            { time: "Within 24h", text: "Your host confirms your booking" },
            { time: "Within 48h", text: "You receive your full welcome guide" },
            { time: "The day before", text: "A gentle reminder with all details" },
          ].map((item) => (
            <div key={item.time} className="flex gap-4 sm:gap-6 py-4 border-b border-[#2C2C2C]/08 last:border-0">
              <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#6B7C5C] w-24 sm:w-28 flex-shrink-0 pt-0.5">{item.time}</span>
              <span className="font-sans text-sm sm:text-base text-[#2C2C2C]" style={{ fontWeight: 300 }}>{item.text}</span>
            </div>
          ))}
        </div>
        <p className="font-serif text-lg sm:text-xl italic text-[#2C2C2C]/40">
          &ldquo;The Provence few travellers ever find — you&rsquo;re about to find it.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────
function BookContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const date = searchParams.get("date") ?? "";
  const guests = parseInt(searchParams.get("guests") ?? "2");

  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({ firstname: "", lastname: "", email: "", phone: "", notes: "" });

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from("experiences").select("*, partner:partners(*)").eq("slug", slug).eq("is_published", true).single();
        if (data) setExperience(data);
      } catch {}
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
      <p className="font-serif text-xl text-[#2C2C2C]/40">Loading...</p>
    </div>
  );

  if (!experience) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
      <p className="font-serif text-xl text-[#2C2C2C]/40">Experience not found.</p>
    </div>
  );

  if (bookingId) return <Confirmation experience={experience} date={date} customerData={customerData} />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-4 mb-10 sm:mb-16">
            <span className="block w-6 sm:w-8 h-px bg-[#6B7C5C]" />
            <p className="font-sans text-[11px] sm:text-[12px] tracking-[0.5em] uppercase text-[#6B7C5C]">
              Book · {experience.title}
            </p>
          </div>
          <StepIndicator step={step} />
          {step === 1 && <Step1 experience={experience} date={date} guests={guests} onNext={() => setStep(2)} onChangeDetails={() => window.history.back()} />}
          {step === 2 && <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} customerData={customerData} setCustomerData={setCustomerData} />}
          {step === 3 && <Step3 experience={experience} date={date} guests={guests} customerData={customerData} onBack={() => setStep(2)} onSuccess={(id: string) => setBookingId(id)} />}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p className="font-serif text-xl text-[#2C2C2C]/40">Loading...</p>
      </div>
    }>
      <BookContent />
    </Suspense>
  );
}