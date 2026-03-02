// app/api/cron/reminder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

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
    <div style="text-align:center;padding-bottom:24px;">
      <p style="font-size:13px;color:#2C2C2C;margin:0 0 8px 0;">The Mas &amp; Table team</p>
      <a href="https://masandtable.com" style="font-size:11px;color:#6B7C5C;letter-spacing:0.3em;text-decoration:none;">masandtable.com</a>
    </div>
  </div></body></html>`;
}

function buildRappelHtml({ customerFirstname, experienceTitle, experienceDate, hostFirstname, meetingPoint, meetingTime }: any) {
  return emailWrapper(`
    <p style="font-size:14px;color:rgba(44,44,44,0.5);margin:0 0 6px 0;font-weight:300;">Dear ${customerFirstname},</p>
    <p style="font-family:Georgia,serif;font-size:26px;color:#2C2C2C;font-weight:400;margin:0 0 20px 0;line-height:1.2;">Tomorrow in Provence.</p>
    <p style="font-size:15px;color:rgba(44,44,44,0.65);line-height:1.7;margin:0 0 14px 0;font-weight:300;">
      Just a gentle reminder that ${hostFirstname} is looking forward to welcoming you tomorrow.
    </p>
    <div style="background:#F8F4EE;border:1px solid rgba(44,44,44,0.12);padding:24px;margin-bottom:24px;">
      <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(44,44,44,0.4);margin:0 0 8px 0;">Your experience</p>
      <p style="font-family:Georgia,serif;font-size:17px;color:#2C2C2C;margin:0 0 14px 0;font-weight:400;">${experienceTitle}</p>
      <hr style="border:none;border-top:1px solid rgba(44,44,44,0.1);margin:0 0 14px 0;">
      <p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;">
        <span style="color:rgba(44,44,44,0.4);font-weight:300;">Date</span>&nbsp;&nbsp;${experienceDate}
      </p>
      ${meetingTime ? `<p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Time</span>&nbsp;&nbsp;${meetingTime}</p>` : ""}
      ${meetingPoint ? `<p style="font-size:12px;color:#2C2C2C;margin:0 0 6px 0;"><span style="color:rgba(44,44,44,0.4);font-weight:300;">Meeting point</span>&nbsp;&nbsp;${meetingPoint}</p>` : ""}
    </div>
    <p style="font-size:15px;color:rgba(44,44,44,0.65);line-height:1.7;margin:0 0 14px 0;font-weight:300;">
      If you have any last-minute questions, reply to this email and we'll get back to you as quickly as possible.
    </p>
    <p style="font-family:Georgia,serif;font-size:15px;color:rgba(44,44,44,0.35);font-style:italic;margin:24px 0;line-height:1.6;">
      "The Provence few travellers ever find — you're about to find it."
    </p>
  `);
}

export async function GET(req: NextRequest) {
  // Vérifier le secret Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Trouver toutes les réservations confirmées dont la date = demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select(`
        *,
        experience:experiences(title, zone),
        partner:partners(host_firstname)
      `)
      .eq("booking_date", tomorrowStr)
      .eq("status", "confirmed");

    if (error) throw error;
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ sent: 0, message: "No bookings tomorrow" });
    }

    // Envoyer un rappel par réservation
    const results = await Promise.allSettled(
      bookings.map((booking: any) => {
        const formattedDate = new Date(booking.booking_date).toLocaleDateString("en-GB", {
          weekday: "long", day: "numeric", month: "long",
        });
        return resend.emails.send({
          from: FROM,
          to: booking.customer_email,
          subject: "Tomorrow in Provence — a gentle reminder",
          html: buildRappelHtml({
            customerFirstname: booking.customer_firstname,
            experienceTitle: booking.experience?.title ?? "",
            experienceDate: formattedDate,
            hostFirstname: booking.partner?.host_firstname ?? "Your host",
            meetingPoint: null, // à compléter manuellement dans le welcome guide
            meetingTime: null,
          }),
        });
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ sent, failed });
  } catch (error: any) {
    console.error("Cron reminder error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}