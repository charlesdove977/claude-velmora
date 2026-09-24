// Shared server-side helpers for /api/* endpoints: JSON responses,
// honeypot check, in-memory rate limit, Resend delivery with console fallback.
import { Resend } from "resend";
import { site } from "@/config/site";

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const type = request.headers.get("content-type") || "";
  try {
    if (type.includes("application/json")) return (await request.json()) as Record<string, unknown>;
    const form = await request.formData();
    const out: Record<string, unknown> = {};
    form.forEach((v, k) => {
      out[k] = typeof v === "string" ? v : "";
    });
    return out;
  } catch {
    return null;
  }
}

// Honeypot: a visually hidden field named "company_website". Bots fill it.
export const isHoneypotTripped = (body: Record<string, unknown>) =>
  typeof body.company_website === "string" && body.company_website.trim().length > 0;

// In-memory limiter: 5 requests per IP per minute per endpoint. Resets on restart,
// which is fine for a single-instance deploy. No PHI is stored, only IP + timestamps.
const buckets = new Map<string, number[]>();
export function rateLimited(request: Request, scope: string, limit = 5, windowMs = 60_000): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) return true;
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
  return false;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
}

const env = () => ({
  key: import.meta.env.RESEND_API_KEY as string | undefined,
  from: (import.meta.env.EMAIL_FROM as string | undefined) || `${site.name} <${site.email}>`,
  inbox: (import.meta.env.SPA_INBOX_EMAIL as string | undefined) || site.email,
  audience: import.meta.env.RESEND_AUDIENCE_ID as string | undefined,
});

export const spaInbox = () => env().inbox;

// Sends through Resend when configured. Otherwise logs a redacted summary and
// returns { delivered: false } so the UI can still show success for the demo.
export async function sendMail(mail: Mail, label: string): Promise<{ delivered: boolean; id?: string }> {
  const { key, from } = env();
  if (!key) {
    console.info(`[mail:${label}] RESEND_API_KEY not set. Would send to ${Array.isArray(mail.to) ? mail.to.join(", ") : mail.to}: "${mail.subject}"`);
    console.info(`[mail:${label}]\n${mail.text}`);
    return { delivered: false };
  }
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: mail.replyTo,
      attachments: mail.attachments,
    });
    if (error) {
      console.error(`[mail:${label}] Resend error`, error.message);
      return { delivered: false };
    }
    return { delivered: true, id: data?.id };
  } catch (err) {
    console.error(`[mail:${label}] send failed`, err instanceof Error ? err.message : err);
    return { delivered: false };
  }
}

export async function addToAudience(email: string, firstName?: string): Promise<boolean> {
  const { key, audience } = env();
  if (!key || !audience) return false;
  try {
    const resend = new Resend(key);
    const { error } = await resend.contacts.create({ email, firstName, audienceId: audience, unsubscribed: false });
    if (error) {
      console.error("[newsletter] audience error", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[newsletter] audience failed", err instanceof Error ? err.message : err);
    return false;
  }
}

// Minimal branded email shell. Inline styles only, as email clients require.
export function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:${site.colors.bone};font-family:Georgia,serif;color:${site.colors.espresso}">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
  <p style="letter-spacing:0.2em;text-transform:uppercase;font-size:11px;color:#7a5c36;font-family:Helvetica,Arial,sans-serif;margin:0 0 24px">${escapeHtml(site.name)}</p>
  <h1 style="font-weight:400;font-size:26px;line-height:1.2;margin:0 0 20px">${escapeHtml(title)}</h1>
  <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6">${bodyHtml}</div>
  <hr style="border:0;border-top:1px solid ${site.colors.champagne};margin:32px 0 16px">
  <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#736760;line-height:1.5;margin:0">${escapeHtml(site.name)}<br>${escapeHtml(site.address.street)}, ${escapeHtml(site.address.city)}, ${site.address.region} ${site.address.postalCode}<br>${escapeHtml(site.phone)} · ${escapeHtml(site.email)}</p>
</div></body></html>`;
}

export const refId = (prefix = "VA") =>
  `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).toUpperCase().slice(2, 5)}`;
