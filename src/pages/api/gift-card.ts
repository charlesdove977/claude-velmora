export const prerender = false;

import type { APIRoute } from "astro";
import { site } from "@/config/site";
import { giftCardSchema, flattenErrors } from "@/lib/schemas";
import { json, readBody, isHoneypotTripped, rateLimited, sendMail, spaInbox, emailShell, escapeHtml, refId } from "@/lib/api";

export const POST: APIRoute = async ({ request }) => {
  if (rateLimited(request, "gift")) return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: "Invalid request." }, 400);
  if (isHoneypotTripped(body)) return json({ ok: true, ref: refId("GC") });

  const parsed = giftCardSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "Please check the highlighted fields.", fields: flattenErrors(parsed.error) }, 422);
  const d = parsed.data;
  const ref = refId("GC");
  const spaText = `Gift card request ${ref}\nAmount: $${d.amount}\nFrom: ${d.purchaserName} <${d.purchaserEmail}>\nTo: ${d.recipientName} ${d.recipientEmail ? `<${d.recipientEmail}>` : ""}\nDelivery: ${d.delivery}\nMessage: ${d.message || "(none)"}`;
  const clientText = `Thank you, ${d.purchaserName}. We received your request for a $${d.amount} gift card for ${d.recipientName} (${ref}). A coordinator will call or email within one business day to take payment securely. We never take card details by email. Questions: ${site.phone}.`;
  const [spa, client] = await Promise.all([
    sendMail({ to: spaInbox(), subject: `Gift card request $${d.amount} (${ref})`, html: emailShell(`Gift card request ${ref}`, `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(spaText)}</pre>`), text: spaText, replyTo: d.purchaserEmail }, "gift-spa"),
    sendMail({ to: d.purchaserEmail, subject: `Gift card request received (${ref})`, html: emailShell("Gift card request received", `<p>${escapeHtml(clientText)}</p>`), text: clientText }, "gift-client"),
  ]);
  return json({ ok: true, ref, delivered: spa.delivered && client.delivered });
};
