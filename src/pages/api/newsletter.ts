export const prerender = false;

import type { APIRoute } from "astro";
import { newsletterSchema, flattenErrors } from "@/lib/schemas";
import { json, readBody, isHoneypotTripped, rateLimited, sendMail, addToAudience, spaInbox, emailShell, escapeHtml } from "@/lib/api";

export const POST: APIRoute = async ({ request }) => {
  if (rateLimited(request, "newsletter")) return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: "Invalid request." }, 400);
  if (isHoneypotTripped(body)) return json({ ok: true });

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "Enter a valid email.", fields: flattenErrors(parsed.error) }, 422);
  const d = parsed.data;
  const added = await addToAudience(d.email, d.firstName || undefined);
  if (!added) {
    const text = `Newsletter sign-up: ${d.email}${d.firstName ? ` (${d.firstName})` : ""}`;
    await sendMail({ to: spaInbox(), subject: "Newsletter sign-up", html: emailShell("Newsletter sign-up", `<p>${escapeHtml(text)}</p>`), text }, "newsletter");
  }
  return json({ ok: true });
};
