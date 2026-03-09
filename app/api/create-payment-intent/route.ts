// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" as any });

export async function POST(req: NextRequest) {
  try {
    const { experienceId, partnerId, amount, guests, date, customerData } = await req.json();

    // Récupérer partenaire + expérience
    const { data: partner } = await supabaseAdmin
      .from("partners")
      .select("stripe_account_id, commission_rate, email, host_firstname, name")
      .eq("id", partnerId)
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

    // Créer réservation en DB — status "pending" jusqu'à confirmation webhook
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

    // Les emails sont envoyés uniquement depuis le webhook Stripe (payment_intent.succeeded)
    // pour éviter tout double envoi.

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
    });

  } catch (error: any) {
    console.error("Payment intent error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}