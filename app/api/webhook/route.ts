// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" as any });
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mas & Table <hello@masandtable.com>";

function emailWrapper(content: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
  <body style="background:#F5F0E8;font-family:Inter,Helvetica,Arial,sans-serif;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="text-align:center;padding-bottom:24px;">
      <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 4px 0;">Mas &amp; Table</p>
      <p style="font-size:11px;color:rgba(44,44,44,0.4);letter-spacing:0.08em;margin:0;font-style:italic;">The Provence few travellers ever find.</p>
    </div>
    <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:0 0 28px 0;">
    ${content}
    <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:28px 0;">
    <div style="text-align:center;">
      <p style="font-size:13px;color:#2C2C2C;margin:0 0 8px 0;">The Mas &amp; Table team</p>
      <a href="https://masandtable.com" style="font-size:11px;color:#6B7C5C;letter-spacing:0.3em;text-decoration:none;">masandtable.com</a>
    </div>
  </div></body></html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ── PAIEMENT RÉUSSI ─────────────────────────────────────
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Capturer les fonds (capture_method: manual)
    try {
      await stripe.paymentIntents.capture(paymentIntent.id);
    } catch (err) {
      console.error("Capture error:", err);
    }

    // Mettre à jour le booking en base
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("stripe_payment_intent_id", paymentIntent.id)
      .select(`
        *,
        experience:experiences(title, slug),
        partner:partners(host_firstname, email, commission_rate)
      `)
      .single();

    if (booking) {
      const formattedDate = new Date(booking.booking_date).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      const formattedDateFr = new Date(booking.booking_date).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      const paymentDate = new Date(new Date(booking.booking_date).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

      // Email confirmation client
      const clientHtml = emailWrapper(`
        <p style="font-size:14px;color:rgba(44,44,44,0.5);margin:0 0 6px 0;font-weight:300;">Dear ${booking.customer_firstname},</p>
        <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 28px 0;line-height:1.2;">Your Provence experience is confirmed.</p>
        <div style="background:#F8F4EE;border:1px solid rgba(44,44,44,0.12);padding:24px;margin-bottom:24px;">
          <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(44,44,44,0.4);margin:0 0 8px 0;">Your booking</p>
          <p style="font-family:Georgia,serif;font-size:17px;color:#2C2C2C;margin:0 0 14px 0;">${booking.experience?.title}</p>
          <hr style="border:none;border-top:1px solid rgba(44,44,44,0.1);margin:0 0 14px 0;">
          <p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Date</span>&nbsp;&nbsp;${formattedDate}</p>
          <p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Guests</span>&nbsp;&nbsp;${booking.guests}</p>
          <p style="font-size:12px;color:#2C2C2C;margin:0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Total</span>&nbsp;&nbsp;€${booking.amount_total}</p>
        </div>
        <p style="font-size:15px;color:rgba(44,44,44,0.65);line-height:1.7;margin:0 0 14px 0;font-weight:300;">${booking.partner?.host_firstname} is expecting you. Within 48 hours, you'll receive a full welcome guide.</p>
        <div style="background:#F8F4EE;border:1px solid rgba(44,44,44,0.12);padding:24px;">
          <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(44,44,44,0.4);margin:0 0 12px 0;">What happens next</p>
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6B7C5C;margin:0 0 2px 0;">Within 24h</p>
          <p style="font-size:13px;color:rgba(44,44,44,0.6);margin:0 0 10px 0;font-weight:300;">Your host confirms your booking</p>
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6B7C5C;margin:0 0 2px 0;">Within 48h</p>
          <p style="font-size:13px;color:rgba(44,44,44,0.6);margin:0 0 10px 0;font-weight:300;">You receive your full welcome guide</p>
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6B7C5C;margin:0 0 2px 0;">The day before</p>
          <p style="font-size:13px;color:rgba(44,44,44,0.6);margin:0;font-weight:300;">A gentle reminder with all details</p>
        </div>
      `);

      // Email notification partenaire
      const partnerHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
      <body style="background:#F5F0E8;font-family:Inter,Helvetica,Arial,sans-serif;margin:0;padding:40px 0;">
      <div style="max-width:560px;margin:0 auto;">
        <div style="text-align:center;padding-bottom:24px;">
          <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0;">Mas &amp; Table</p>
        </div>
        <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:0 0 28px 0;">
        <p style="font-size:14px;color:rgba(44,44,44,0.5);margin:0 0 6px 0;font-weight:300;">Bonjour ${booking.partner?.host_firstname},</p>
        <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 28px 0;line-height:1.2;">Nouvelle réservation confirmée.</p>
        <div style="background:#F8F4EE;border:1px solid rgba(44,44,44,0.12);padding:24px;margin-bottom:24px;">
          <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(44,44,44,0.4);margin:0 0 8px 0;">Détails</p>
          <p style="font-family:Georgia,serif;font-size:17px;color:#2C2C2C;margin:0 0 14px 0;">${booking.experience?.title}</p>
          <hr style="border:none;border-top:1px solid rgba(44,44,44,0.1);margin:0 0 14px 0;">
          <p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Date</span>&nbsp;&nbsp;${formattedDateFr}</p>
          <p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Personnes</span>&nbsp;&nbsp;${booking.guests}</p>
          <p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Client</span>&nbsp;&nbsp;${booking.customer_firstname} ${booking.customer_lastname}</p>
          ${booking.customer_notes ? `<p style="font-size:12px;color:#2C2C2C;margin:0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Notes</span>&nbsp;&nbsp;${booking.customer_notes}</p>` : ""}
        </div>
        <div style="background:#F8F4EE;border:1px solid rgba(44,44,44,0.12);padding:24px;">
          <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(44,44,44,0.4);margin:0 0 8px 0;">Votre paiement</p>
          <p style="font-family:Georgia,serif;font-size:32px;color:#6B7C5C;margin:0 0 8px 0;font-weight:400;">€${booking.amount_partner}</p>
          <p style="font-size:12px;color:rgba(44,44,44,0.5);margin:0;font-weight:300;">Versement automatique le ${paymentDate} (J+7 après l'expérience).</p>
        </div>
        <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:28px 0;">
        <p style="text-align:center;font-size:13px;color:rgba(44,44,44,0.4);margin:0;">L'équipe Mas &amp; Table</p>
      </div></body></html>`;

      // Envoyer les deux emails
      await Promise.allSettled([
        resend.emails.send({
          from: FROM,
          to: booking.customer_email,
          subject: "Your experience is confirmed — see you in Provence.",
          html: clientHtml,
        }),
        booking.partner?.email ? resend.emails.send({
          from: FROM,
          to: booking.partner.email,
          subject: `Nouvelle réservation — ${booking.experience?.title} — ${formattedDateFr}`,
          html: partnerHtml,
        }) : Promise.resolve(),
      ]);
    }
  }

  // ── PAIEMENT ÉCHOUÉ ──────────────────────────────────────
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await supabaseAdmin
      .from("bookings")
      .update({ status: "failed" })
      .eq("stripe_payment_intent_id", paymentIntent.id);
  }

  return NextResponse.json({ received: true });
}