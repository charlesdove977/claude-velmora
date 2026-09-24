export const prerender = false;

import type { APIRoute } from "astro";
import { site } from "@/config/site";
import { getTreatment } from "@/data/treatments";
import { getProvider } from "@/data/team";
import { bookingSchema, flattenErrors } from "@/lib/schemas";
import { json, readBody, isHoneypotTripped, rateLimited, sendMail, spaInbox, emailShell, escapeHtml, refId } from "@/lib/api";
import { isValidSlot, formatDateLong, formatTime } from "@/lib/slots";
import { buildIcs } from "@/lib/ics";

export const CONSULT_SLUG = "consultation";

export const POST: APIRoute = async ({ request }) => {
  if (rateLimited(request, "book")) return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: "Invalid request." }, 400);
  if (isHoneypotTripped(body)) return json({ ok: true, ref: refId() }); // silently accept bots

  const parsed = bookingSchema.safeParse({
    ...body,
    firstVisit: body.firstVisit === true || body.firstVisit === "true",
    smsConsent: body.smsConsent === true || body.smsConsent === "true",
    policyAck: body.policyAck === true || body.policyAck === "true",
  });
  if (!parsed.success) return json({ ok: false, error: "Please check the highlighted fields.", fields: flattenErrors(parsed.error) }, 422);
  const data = parsed.data;

  const names = data.treatments.map((s) => (s === CONSULT_SLUG ? "Consultation" : getTreatment(s)?.name)).filter(Boolean) as string[];
  if (names.length !== data.treatments.length) return json({ ok: false, error: "One of the selected treatments is not available.", fields: { treatments: "Choose from the list" } }, 422);
  const providerName = data.provider === "first-available" ? "First available provider" : getProvider(data.provider)?.name;
  if (!providerName) return json({ ok: false, error: "Choose a provider.", fields: { provider: "Choose a provider" } }, 422);
  const duration = Math.max(30, names.length * 45);
  if (!isValidSlot(data.date, data.time, duration)) return json({ ok: false, error: "That time is no longer available.", fields: { time: "Choose another time" } }, 422);

  const ref = refId("VA");
  const when = `${formatDateLong(data.date)} at ${formatTime(data.time)}`;
  const summary = `${site.name}: ${names.join(", ")}`;
  const ics = buildIcs({ ref, date: data.date, time: data.time, durationMinutes: duration, summary, description: `Booking request ${ref} with ${providerName}. ${site.phone}` });

  const clientText = [
    `Thank you, ${data.name}. We received your booking request.`,
    ``,
    `Reference: ${ref}`,
    `Treatment: ${names.join(", ")}`,
    `Provider: ${providerName}`,
    `When: ${when}`,
    `Where: ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
    ``,
    `A coordinator will confirm within one business hour during opening hours. Reply to this email or call ${site.phone} to change anything.`,
    `Prep notes: ${site.url}/book/confirmed?ref=${ref}`,
  ].join("\n");
  const clientHtml = emailShell("Your booking request is in", `
    <p>Thank you, ${escapeHtml(data.name)}. We received your request and will confirm within one business hour during opening hours.</p>
    <table style="border-collapse:collapse;margin:20px 0" cellpadding="6">
      <tr><td style="color:#736760">Reference</td><td><strong>${ref}</strong></td></tr>
      <tr><td style="color:#736760">Treatment</td><td>${escapeHtml(names.join(", "))}</td></tr>
      <tr><td style="color:#736760">Provider</td><td>${escapeHtml(providerName)}</td></tr>
      <tr><td style="color:#736760">When</td><td>${escapeHtml(when)}</td></tr>
      <tr><td style="color:#736760">Where</td><td>${escapeHtml(site.address.street)}, ${escapeHtml(site.address.city)}</td></tr>
    </table>
    <p>A calendar file is attached. Prep notes and what to expect: <a href="${site.url}/book/confirmed?ref=${ref}">${site.url}/book/confirmed</a></p>
    <p>Need to change anything? Reply to this email or call ${escapeHtml(site.phone)}.</p>`);

  const spaText = [
    `New booking request ${ref}`,
    `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
    `Treatment: ${names.join(", ")}`, `Provider: ${providerName}`, `When: ${when}`,
    `First visit: ${data.firstVisit ? "yes" : "no"}`, `SMS consent: ${data.smsConsent ? "yes" : "no"}`,
    `Notes: ${data.notes || "(none)"}`,
  ].join("\n");
  const spaHtml = emailShell(`Booking request ${ref}`, `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(spaText)}</pre>`);

  const [client, spa] = await Promise.all([
    sendMail({ to: data.email, subject: `Booking request received (${ref})`, html: clientHtml, text: clientText, attachments: [{ filename: `velmora-${ref}.ics`, content: Buffer.from(ics).toString("base64") }] }, "book-client"),
    sendMail({ to: spaInbox(), subject: `New booking request ${ref}: ${names.join(", ")}`, html: spaHtml, text: spaText, replyTo: data.email }, "book-spa"),
  ]);

  return json({ ok: true, ref, delivered: client.delivered && spa.delivered, ics, summary: { treatments: names, provider: providerName, when, date: data.date, time: data.time, name: data.name, email: data.email } });
};
