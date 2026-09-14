"use server";

import { email as inbox, eventTypes } from "@/lib/site-data";

export type BookingResult = "sent" | "invalid" | "failed";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anyone can POST to a Server Action, so every field is re-read as untrusted:
// trimmed, capped, and (for single-line fields) stripped of line breaks.
function field(formData: FormData, key: string, max: number, multiline = false) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return "";
  return (multiline ? raw : raw.replace(/\s+/g, " ")).trim().slice(0, max);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// "2026-10-03" → "Sat, Oct 3, 2026". Date inputs carry no time zone, so read as UTC.
function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function sendBooking(formData: FormData): Promise<BookingResult> {
  // The hidden "website" field is only ever filled in by bots — let them
  // think it worked without spending an email on them.
  if (field(formData, "website", 1)) return "sent";

  const name = field(formData, "name", 120);
  const email = field(formData, "email", 254);
  if (!name || !EMAIL_PATTERN.test(email)) return "invalid";

  const type = field(formData, "type", 40);
  const eventType = eventTypes.includes(type) ? type : "";
  const when = formatDate(field(formData, "date", 10));
  const message = field(formData, "message", 5000, true);

  const details: [label: string, value: string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", field(formData, "phone", 40)],
    ["Event type", eventType],
    ["Event date", when],
    ["Location", field(formData, "location", 200)],
  ];

  const subject = `Booking request: ${eventType || "Event"}${when ? ` on ${when}` : ""} — ${name}`;

  const text = [
    "New booking request from the website",
    "",
    ...details.map(([label, value]) => `${label}: ${value || "—"}`),
    "",
    "Message:",
    message || "—",
    "",
    `Reply to this email to answer ${name} directly.`,
  ].join("\n");

  const rows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 20px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0">${escapeHtml(value) || "—"}</td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">
<h2 style="margin:0 0 16px;font-size:20px">New booking request</h2>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>
<p style="margin:20px 0 6px;color:#666">Message</p>
<p style="margin:0">${escapeHtml(message).replace(/\n/g, "<br>") || "—"}</p>
<p style="margin:28px 0 0;font-size:13px;color:#888">Sent from the booking form on the website. Reply to this email to answer ${escapeHtml(name)} directly.</p>
</div>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Booking email not sent: RESEND_API_KEY is not set.");
    return "failed";
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // resend.dev can only deliver to the Resend account's own address.
        // Once a domain is verified, set RESEND_FROM to an address on it.
        from: process.env.RESEND_FROM || "Sekrate Sauce Website <onboarding@resend.dev>",
        to: [inbox],
        reply_to: email,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) return "sent";
    console.error(`Booking email rejected by Resend (${res.status}):`, await res.text());
  } catch (error) {
    console.error("Booking email failed to send:", error);
  }
  return "failed";
}
