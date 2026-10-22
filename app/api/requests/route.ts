import { NextResponse } from "next/server";
import { templateRequestSchema } from "@/lib/requests";
import { GITHUB_REPO } from "@/lib/site";

/**
 * Receives a "Request a template" submission and routes it to the project
 * owner. Runs as a serverless function on Vercel — no database, no third-party
 * form service.
 *
 * Two best-effort channels; whichever is configured runs:
 *   GITHUB_ISSUE_TOKEN — a token with "Issues: write" on the repo. Each request
 *                        becomes a GitHub issue labelled "new template".
 *   RESEND_API_KEY     — a Resend API key. Each request is emailed (and carries
 *                        the optional reference image as an attachment).
 * Optional:
 *   CONTACT_EMAIL      — email recipient (defaults below)
 *   RESEND_FROM        — verified sender (defaults to Resend's shared sender)
 */

export const runtime = "nodejs";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "navajyothputalath13@gmail.com";
const RESEND_FROM = process.env.RESEND_FROM ?? "Coverly <onboarding@resend.dev>";
const TEMPLATE_LABEL = "new template";

type RequestFields = {
  name: string;
  email: string;
  title: string;
  fields: string;
  notes: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Create a GitHub issue labelled "new template" for the request. */
async function createGithubIssue(
  token: string,
  data: RequestFields,
  hasImage: boolean,
  imageByEmail: boolean,
): Promise<boolean> {
  const { name, email, title, fields, notes } = data;
  const body = [
    `**Wants:** ${title}`,
    "",
    "**Fields it should include**",
    fields,
    "",
    "**Notes**",
    notes || "—",
    "",
    "---",
    `Submitted by: ${name || "Anonymous"}${email ? ` · ${email}` : ""}`,
    hasImage
      ? `📎 A reference image was attached${imageByEmail ? " (delivered by email)." : "."}`
      : "",
  ]
    .join("\n")
    .trim();

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Coverly-App",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `New template: ${title}`.slice(0, 250),
      body,
      labels: [TEMPLATE_LABEL],
    }),
  });

  if (!res.ok) {
    console.error("GitHub issue error:", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

/** Email the request via Resend, with the optional reference image attached. */
async function sendEmail(
  apiKey: string,
  data: RequestFields,
  attachments?: { filename: string; content: string }[],
): Promise<boolean> {
  const { name, email, title, fields, notes } = data;
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
      ...(attachments ? { attachments } : {}),
    }),
  });

  if (!res.ok) {
    console.error("Resend error:", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
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

  const data: RequestFields = {
    name: parsed.data.name ?? "",
    email: parsed.data.email ?? "",
    title: parsed.data.title,
    fields: parsed.data.fields,
    notes: parsed.data.notes ?? "",
  };

  // Optional image attachment (email only). Capped to stay within Vercel's
  // ~4.5 MB request-body limit.
  let attachments: { filename: string; content: string }[] | undefined;
  const att = (payload as { attachment?: unknown }).attachment;
  if (att && typeof att === "object") {
    const a = att as { filename?: unknown; contentType?: unknown; data?: unknown };
    const filename = typeof a.filename === "string" ? a.filename : "";
    const contentType = typeof a.contentType === "string" ? a.contentType : "";
    const content = typeof a.data === "string" ? a.data : "";
    if (content) {
      if (!contentType.startsWith("image/") || content.length > 3_000_000) {
        return NextResponse.json(
          { error: "The attached image is invalid or too large (max ~2 MB)." },
          { status: 422 },
        );
      }
      attachments = [{ filename: filename || "reference.png", content }];
    }
  }

  const ghToken = process.env.GITHUB_ISSUE_TOKEN;
  const apiKey = process.env.RESEND_API_KEY;

  if (!ghToken && !apiKey) {
    console.error("No delivery channel configured (GITHUB_ISSUE_TOKEN / RESEND_API_KEY).");
    return NextResponse.json(
      { error: "The form isn't configured to send yet. Please try again later." },
      { status: 500 },
    );
  }

  const outcomes = await Promise.all([
    ghToken
      ? createGithubIssue(ghToken, data, !!attachments, !!apiKey)
      : Promise.resolve(null),
    apiKey ? sendEmail(apiKey, data, attachments) : Promise.resolve(null),
  ]);

  const attempted = outcomes.filter((o) => o !== null);
  const anySucceeded = attempted.some((o) => o === true);

  if (!anySucceeded) {
    return NextResponse.json(
      { error: "Couldn't submit your request. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
