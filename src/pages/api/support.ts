export const prerender = false;

import type { APIRoute } from "astro";
import { supportSchema, flattenErrors } from "@/lib/schemas";
import { json, readBody, isHoneypotTripped, rateLimited, sendMail, spaInbox, emailShell, escapeHtml, refId } from "@/lib/api";

export const POST: APIRoute = async ({ request }) => {
  if (rateLimited(request, "support")) return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: "Invalid request." }, 400);
  if (isHoneypotTripped(body)) return json({ ok: true, ref: refId("SP") });

  const parsed = supportSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "Please check the highlighted fields.", fields: flattenErrors(parsed.error) }, 422);
  const d = parsed.data;
  const ref = refId("SP");
  const text = `Support request ${ref}\nTopic: ${d.topic}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "(none)"}\n\n${d.message}`;
  const html = emailShell(`Support: ${d.topic}`, `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(text)}</pre>`);
  const result = await sendMail({ to: spaInbox(), subject: `[${d.topic}] ${d.name} (${ref})`, html, text, replyTo: d.email }, "support");
  return json({ ok: true, ref, delivered: result.delivered });
};
