"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AMOUNTS = [150, 300, 500, 800, 1500];

export default function AccountGiftCards() {
  const [cards, setCards]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"buy"|"mine">("mine");

  // Formulaire achat
  const [amount, setAmount]           = useState(300);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage]         = useState("");
  const [buying, setBuying]           = useState(false);
  const [buyMsg, setBuyMsg]           = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase
        .from("gift_cards")
        .select("*")
        .eq("buyer_email", session.user.email)
        .order("created_at", { ascending: false });
      setCards(data ?? []);
      setLoading(false);
    });
  }, []);

  async function handleBuy() {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount < 50) { setBuyMsg("Minimum amount is €50."); return; }
    setBuying(true); setBuyMsg("");
    // TODO: brancher Stripe — pour l'instant on crée la carte directement
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) return;

    const { error } = await supabase.from("gift_cards").insert({
      amount: finalAmount,
      buyer_email: user.email,
      buyer_firstname: user.user_metadata?.first_name ?? "",
      recipient_email: recipientEmail || null,
      recipient_name:  recipientName  || null,
      message:         message        || null,
      status: "active",
    });

    setBuying(false);
    if (error) { setBuyMsg(error.message); }
    else {
      setBuyMsg("Gift card created successfully.");
      setRecipientName(""); setRecipientEmail(""); setMessage(""); setCustomAmount("");
      // Refresh
      const { data } = await supabase.from("gift_cards").select("*").eq("buyer_email", user.email!).order("created_at", { ascending: false });
      setCards(data ?? []);
      setTimeout(() => setTab("mine"), 1200);
    }
  }

  const STATUS_COLOR: Record<string, string> = {
    active:  "#6B7C5C",
    used:    "rgba(44,44,44,0.35)",
    expired: "#C4714F",
  };

  const inputClass = "w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200";

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-[#2C2C2C]/10 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-2">Account</p>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] text-[#2C2C2C] leading-tight"><em>Gift Cards</em></h1>
        </div>
        <div className="flex gap-2">
          {[{ v: "mine", l: "My cards" }, { v: "buy", l: "Buy a gift card" }].map(t => (
            <button key={t.v} onClick={() => setTab(t.v as any)}
              className="font-sans text-[10px] tracking-[0.35em] uppercase border transition-all duration-200"
              style={{ padding: "8px 16px", background: tab === t.v ? "#2C2C2C" : "transparent", color: tab === t.v ? "#F5F0E8" : "rgba(44,44,44,0.40)", borderColor: tab === t.v ? "#2C2C2C" : "rgba(44,44,44,0.12)", cursor: "pointer" }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {tab === "mine" && (
        <>
          {loading ? (
            <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-24 animate-pulse" style={{ backgroundColor: "#F8F4EE" }} />)}</div>
          ) : cards.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-[#2C2C2C]/40 italic mb-4">No gift cards yet.</p>
              <button onClick={() => setTab("buy")}
                className="group relative inline-flex items-center gap-3 border border-[#6B7C5C] text-[#6B7C5C] font-sans text-[10px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500"
                style={{ padding: "14px 28px" }}>
                <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10">Buy a gift card</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map(c => (
                <div key={c.id} className="p-6 sm:p-8 border border-[#2C2C2C]/08 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  style={{ backgroundColor: "#FDFAF5" }}>
                  <div className="sm:col-span-5">
                    <p className="font-serif text-2xl text-[#2C2C2C] mb-1">€{c.amount?.toLocaleString("fr-FR")}</p>
                    <p className="font-sans text-[10px] tracking-[0.3em] uppercase" style={{ color: STATUS_COLOR[c.status], fontWeight: 300 }}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      {c.status === "active" && c.amount_used > 0 && ` — €${c.amount_used} used`}
                    </p>
                  </div>
                  <div className="sm:col-span-4">
                    <p className="font-sans text-xs text-[#2C2C2C]/50 mb-1" style={{ fontWeight: 300 }}>
                      Code
                    </p>
                    <p className="font-sans text-sm text-[#2C2C2C] tracking-[0.2em]">
                      {c.code}
                    </p>
                  </div>
                  <div className="sm:col-span-3 sm:text-right">
                    {c.recipient_name && (
                      <p className="font-sans text-xs text-[#2C2C2C]/40" style={{ fontWeight: 300 }}>
                        For {c.recipient_name}
                      </p>
                    )}
                    <p className="font-sans text-xs text-[#2C2C2C]/25 mt-1" style={{ fontWeight: 300 }}>
                      Expires {new Date(c.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "buy" && (
        <div className="max-w-lg">
          {/* Montant */}
          <div className="mb-8">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#2C2C2C]/50 mb-4">Amount</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {AMOUNTS.map(a => (
                <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className="font-sans text-[11px] tracking-[0.3em] uppercase border transition-all duration-200"
                  style={{ padding: "10px 18px", background: amount === a && !customAmount ? "#2C2C2C" : "transparent", color: amount === a && !customAmount ? "#F5F0E8" : "rgba(44,44,44,0.50)", borderColor: amount === a && !customAmount ? "#2C2C2C" : "rgba(44,44,44,0.15)", cursor: "pointer" }}>
                  €{a}
                </button>
              ))}
            </div>
            <div>
              <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">Or custom amount (min. €50)</label>
              <input type="number" value={customAmount} onChange={e => { setCustomAmount(e.target.value); }}
                placeholder="e.g. 1 200" className={inputClass} style={{ fontWeight: 300, maxWidth: "200px" }} />
            </div>
          </div>

          {/* Destinataire */}
          <div className="mb-8 space-y-4">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#2C2C2C]/50">Recipient (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">Name</label>
                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)}
                  placeholder="Sarah" className={inputClass} style={{ fontWeight: 300 }} />
              </div>
              <div>
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">Email</label>
                <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
                  placeholder="sarah@email.com" className={inputClass} style={{ fontWeight: 300 }} />
              </div>
            </div>
            <div>
              <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">Personal message (optional)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                placeholder="A little Provence, just for you…"
                className={`${inputClass} resize-none`} style={{ fontWeight: 300 }} />
            </div>
          </div>

          {buyMsg && (
            <p className="font-sans text-sm mb-4" style={{ color: buyMsg.includes("success") ? "#6B7C5C" : "#C4714F", fontWeight: 300 }}>
              {buyMsg}
            </p>
          )}

          <button onClick={handleBuy} disabled={buying}
            className="group relative inline-flex items-center gap-3 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 disabled:opacity-40"
            style={{ padding: "16px 36px" }}>
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">{buying ? "Processing…" : "Buy gift card →"}</span>
          </button>

          <p className="font-sans text-xs text-[#2C2C2C]/30 mt-4" style={{ fontWeight: 300 }}>
            Valid for 1 year from purchase. Can be used on any experience on Mas & Table.
          </p>
        </div>
      )}
    </div>
  );
}