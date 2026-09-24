export const prerender = false;

import type { APIRoute } from "astro";
import { contactSchema, flattenErrors } from "@/lib/schemas";
import { json, readBody, isHoneypotTripped, rateLimited, sendMail, spaInbox, emailShell, escapeHtml, refId } from "@/lib/api";

export const POST: APIRoute = async ({ request }) => {
  if (rateLimited(request, "contact")) return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: "Invalid request." }, 400);
  if (isHoneypotTripped(body)) return json({ ok: true, ref: refId("CT") });

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "Please check the highlighted fields.", fields: flattenErrors(parsed.error) }, 422);
  const d = parsed.data;
  const ref = refId("CT");
  const text = `Contact form ${ref}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "(none)"}\n\n${d.message}`;
  const html = emailShell(`Contact form ${ref}`, `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(text)}</pre>`);
  const result = await sendMail({ to: spaInbox(), subject: `Contact: ${d.name} (${ref})`, html, text, replyTo: d.email }, "contact");
  return json({ ok: true, ref, delivered: result.delivered });
};
