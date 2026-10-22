import { NextResponse } from "next/server";
import { templateRequestSchema } from "@/lib/requests";

/**
 * Receives a "Request a template" submission and emails it to the project
 * owner via Resend. Runs as a serverless function on Vercel — no database, no
 * third-party form service.
 *
 * Required env var:
 *   RESEND_API_KEY   — your Resend API key (https://resend.com)
 * Optional env vars:
 *   CONTACT_EMAIL    — where submissions are sent (defaults below)
 *   RESEND_FROM      — verified sender (defaults to Resend's shared sender)
 */

export const runtime = "nodejs";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "navajyothputalath13@gmail.com";
const RESEND_FROM = process.env.RESEND_FROM ?? "Coverly <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = templateRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration, not the visitor's fault — don't leak details.
    console.error("RESEND_API_KEY is not set; cannot send template request.");
    return NextResponse.json(
      { error: "The form isn't configured to send yet. Please try again later." },
      { status: 500 },
    );
  }

  const { name, email, title, fields, notes } = parsed.data;

  const lines = [
    ["From", name || "Anonymous"],
    ["Reply-to", email || "—"],
    ["Wants", title],
    ["Fields", fields],
    ["Notes", notes || "—"],
  ];

  const text = lines.map(([k, v]) => `${k}:\n${v}`).join("\n\n");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#18181b">
    <h2 style="margin:0 0 16px">New template request · Coverly</h2>
    ${lines
      .map(
        ([k, v]) =>
          `<p style="margin:0 0 12px"><strong>${escapeHtml(k)}</strong><br/>${escapeHtml(v).replace(/\n/g, "<br/>")}</p>`,
      )
      .join("")}
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [CONTACT_EMAIL],
        subject: `Template request: ${title}`,
        text,
        html,
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return NextResponse.json(
        { error: "Couldn't send your request. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Failed to reach Resend:", err);
    return NextResponse.json(
      { error: "Couldn't send your request. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
