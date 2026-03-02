// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mas & Table <hello@masandtable.com>";

// ── EMAIL HELPERS ─────────────────────────────────────────────

function emailWrapper(content: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="background:#F5F0E8;font-family:Inter,Helvetica,Arial,sans-serif;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="text-align:center;padding-bottom:24px;">
      <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 4px 0;">Mas &amp; Table</p>
      <p style="font-size:11px;color:rgba(44,44,44,0.4);letter-spacing:0.08em;margin:0;font-style:italic;">The Provence few travellers ever find.</p>
    </div>
    <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:0 0 28px 0;">
    ${content}
    <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:28px 0;">
    <div style="text-align:center;padding-bottom:24px;">
      <p style="font-size:13px;color:#2C2C2C;margin:0 0 8px 0;">The Mas &amp; Table team</p>
      <p style="font-family:Georgia,serif;font-size:13px;color:rgba(44,44,44,0.35);font-style:italic;margin:0 0 12px 0;">"The Provence few travellers ever find — you're about to find it."</p>
      <a href="https://masandtable.com" style="font-size:11px;color:#6B7C5C;letter-spacing:0.3em;text-decoration:none;">masandtable.com</a>
    </div>
  </div></body></html>`;
}

function card(content: string) {
  return `<div style="background:#F8F4EE;border:1px solid rgba(44,44,44,0.12);padding:24px;margin-bottom:24px;">${content}</div>`;
}
function cardLabel(text: string) {
  return `<p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(44,44,44,0.4);margin:0 0 8px 0;">${text}</p>`;
}
function cardTitle(text: string) {
  return `<p style="font-family:Georgia,serif;font-size:17px;color:#2C2C2C;margin:0 0 14px 0;font-weight:400;">${text}</p>`;
}
function row(label: string, value: string) {
  return `<p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;display:flex;justify-content:space-between;">
    <span style="color:rgba(44,44,44,0.4);font-weight:300;">${label}</span>
    <span>${value}</span>
  </p>`;
}
function bodyText(text: string) {
  return `<p style="font-size:15px;color:rgba(44,44,44,0.65);line-height:1.7;margin:0 0 14px 0;font-weight:300;">${text}</p>`;
}
function olive(text: string) {
  return `<p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6B7C5C;margin:12px 0 2px 0;">${text}</p>`;
}
function small(text: string) {
  return `<p style="font-size:13px;color:rgba(44,44,44,0.6);margin:0;font-weight:300;">${text}</p>`;
}

function emailConfirmationClient({
  customerFirstname, experienceTitle, experienceDate, guests, total, hostFirstname,
}: any) {
  return emailWrapper(`
    <p style="font-size:14px;color:rgba(44,44,44,0.5);margin:0 0 6px 0;font-weight:300;">Dear ${customerFirstname},</p>
    <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 28px 0;line-height:1.2;">Your Provence experience is confirmed.</p>
    ${card(`
      ${cardLabel("Your booking")}
      ${cardTitle(experienceTitle)}
      <hr style="border:none;border-top:1px solid rgba(44,44,44,0.1);margin:0 0 14px 0;">
      ${row("Date", experienceDate)}
      ${row("Guests", `${guests} ${guests === 1 ? "guest" : "guests"}`)}
      ${row("Total", `€${total}`)}
    `)}
    ${bodyText(`${hostFirstname} is expecting you. Within 48 hours, you'll receive a full welcome guide with everything you need to know.`)}
    ${bodyText("Until then, the only thing left to do is look forward to it.")}
    ${card(`
      ${cardLabel("What happens next")}
      ${olive("Within 24h")}${small("Your host confirms your booking")}
      ${olive("Within 48h")}${small("You receive your full welcome guide")}
      ${olive("The day before")}${small("A gentle reminder with all details")}
    `)}
  `);
}

function emailNotificationPartenaire({
  hostFirstname, experienceTitle, experienceDate, guests,
  customerFirstname, customerLastname, customerNotes, amountPartner, paymentDate,
}: any) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
  <body style="background:#F5F0E8;font-family:Inter,Helvetica,Arial,sans-serif;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="text-align:center;padding-bottom:24px;">
      <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0;">Mas &amp; Table</p>
    </div>
    <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:0 0 28px 0;">
    <p style="font-size:14px;color:rgba(44,44,44,0.5);margin:0 0 6px 0;font-weight:300;">Bonjour ${hostFirstname},</p>
    <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 28px 0;line-height:1.2;">Nouvelle réservation confirmée.</p>
    ${card(`
      ${cardLabel("Détails de la réservation")}
      ${cardTitle(experienceTitle)}
      <hr style="border:none;border-top:1px solid rgba(44,44,44,0.1);margin:0 0 14px 0;">
      ${row("Date", experienceDate)}
      ${row("Personnes", `${guests}`)}
      ${row("Client", `${customerFirstname} ${customerLastname}`)}
      ${customerNotes ? row("Notes", customerNotes) : ""}
    `)}
    ${card(`
      ${cardLabel("Votre paiement")}
      <p style="font-family:Georgia,serif;font-size:32px;color:#6B7C5C;margin:0 0 8px 0;font-weight:400;">€${amountPartner}</p>
      <p style="font-size:12px;color:rgba(44,44,44,0.5);margin:0;font-weight:300;">Versement automatique le ${paymentDate} (J+7 après l'expérience).</p>
    `)}
    ${bodyText("Pour annuler ou modifier, contactez-nous immédiatement à contact@masandtable.com.")}
    <hr style="border:none;border-top:1px solid rgba(44,44,44,0.12);margin:28px 0;">
    <p style="text-align:center;font-size:13px;color:rgba(44,44,44,0.4);margin:0;">L'équipe Mas &amp; Table</p>
  </div></body></html>`;
}

function emailRappelClient({
  customerFirstname, experienceTitle, experienceDate, meetingPoint, meetingTime, hostFirstname,
}: any) {
  return emailWrapper(`
    <p style="font-size:14px;color:rgba(44,44,44,0.5);margin:0 0 6px 0;font-weight:300;">Dear ${customerFirstname},</p>
    <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 20px 0;line-height:1.2;">Tomorrow in Provence.</p>
    ${bodyText(`Just a gentle reminder that ${hostFirstname} is looking forward to welcoming you tomorrow.`)}
    ${card(`
      ${cardLabel("Your experience")}
      ${cardTitle(experienceTitle)}
      <hr style="border:none;border-top:1px solid rgba(44,44,44,0.1);margin:0 0 14px 0;">
      ${row("Date", experienceDate)}
      ${row("Time", meetingTime)}
      ${row("Meeting point", meetingPoint)}
    `)}
    ${bodyText("If you have any last-minute questions, reply to this email and we'll get back to you as quickly as possible.")}
  `);
}

// ── ROUTE PRINCIPALE ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { experienceId, partnerId, amount, guests, date, customerData } = await req.json();

    // Récupérer partenaire + expérience
    const { data: partner } = await supabaseAdmin
      .from("partners")
      .select("stripe_account_id, commission_rate, email, host_firstname, name")
      .eq("id", partnerId)
      .single();

    const { data: experience } = await supabaseAdmin
      .from("experiences")
      .select("title")
      .eq("id", experienceId)
      .single();

    const amountCents = Math.round(amount * 100);
    const commissionRate = partner?.commission_rate ?? 15;
    const commissionAmount = Math.round(amountCents * (commissionRate / 100));
    const partnerAmount = amountCents - commissionAmount;

    // Créer payment intent
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountCents,
      currency: "eur",
      capture_method: "manual",
      metadata: {
        experience_id: experienceId,
        partner_id: partnerId,
        guests: guests.toString(),
        booking_date: date,
        customer_email: customerData.email,
      },
    };

    if (partner?.stripe_account_id) {
      paymentIntentParams.transfer_data = {
        destination: partner.stripe_account_id,
        amount: partnerAmount,
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    // Créer réservation en DB
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        experience_id: experienceId,
        partner_id: partnerId,
        customer_firstname: customerData.firstname,
        customer_lastname: customerData.lastname,
        customer_email: customerData.email,
        customer_phone: customerData.phone || null,
        customer_notes: customerData.notes || null,
        booking_date: date,
        guests,
        amount_total: amount,
        amount_commission: (amount * commissionRate) / 100,
        amount_partner: amount - (amount * commissionRate) / 100,
        status: "pending",
        stripe_payment_intent_id: paymentIntent.id,
        cancellation_policy: "Free cancellation up to 14 days before. 50% refund between 7 and 14 days. No refund within 7 days.",
      })
      .select()
      .single();

    if (error) throw error;

    // Formater date pour les emails
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const formattedDateFr = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const paymentDate = new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000)
      .toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    // Envoyer emails en parallèle (fire & forget — ne bloque pas la réponse)
    Promise.all([
      // Email 1 — Confirmation client
      resend.emails.send({
        from: FROM,
        to: customerData.email,
        subject: "Your experience is confirmed — see you in Provence.",
        html: emailConfirmationClient({
          customerFirstname: customerData.firstname,
          experienceTitle: experience?.title ?? "",
          experienceDate: formattedDate,
          guests,
          total: amount.toFixed(0),
          hostFirstname: partner?.host_firstname ?? "Your host",
        }),
      }),
      // Email 2 — Notification partenaire
      partner?.email ? resend.emails.send({
        from: FROM,
        to: partner.email,
        subject: `Nouvelle réservation — ${experience?.title} — ${formattedDateFr}`,
        html: emailNotificationPartenaire({
          hostFirstname: partner.host_firstname,
          experienceTitle: experience?.title ?? "",
          experienceDate: formattedDateFr,
          guests,
          customerFirstname: customerData.firstname,
          customerLastname: customerData.lastname,
          customerNotes: customerData.notes,
          amountPartner: (amount - (amount * commissionRate) / 100).toFixed(0),
          paymentDate,
        }),
      }) : Promise.resolve(),
    ]).catch(console.error);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
    });

  } catch (error: any) {
    console.error("Payment intent error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}