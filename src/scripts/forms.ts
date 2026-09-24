// Shared handler for the vanilla forms. Client-side zod validation with
// inline errors, then POST JSON to the endpoint and swap in a success state.
import type { ZodSchema } from "zod";
import { flattenErrors } from "@/lib/schemas";
import { toast } from "@/scripts/motion";

export function wireForm(form: HTMLFormElement, schema: ZodSchema, endpoint: string, successTitle: string, successBody: string) {
  const fields = () => Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input[name], select[name], textarea[name]"));
  const showErrors = (errs: Record<string, string>) => {
    fields().forEach((f) => {
      const err = form.querySelector<HTMLElement>(`#f-${f.name}-err`);
      const msg = errs[f.name] || "";
      if (err) err.textContent = msg;
      if (f.name !== "company_website") f.setAttribute("aria-invalid", msg ? "true" : "false");
    });
    const first = Object.keys(errs)[0];
    if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };
  fields().forEach((f) => f.addEventListener("input", () => { form.querySelector<HTMLElement>(`#f-${f.name}-err`)!.textContent = ""; f.setAttribute("aria-invalid", "false"); }));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data: Record<string, unknown> = {};
    fields().forEach((f) => { data[f.name] = f instanceof HTMLInputElement && f.type === "checkbox" ? f.checked : f.value; });
    const parsed = schema.safeParse(data);
    if (!parsed.success) { showErrors(flattenErrors(parsed.error)); return; }
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const label = btn?.textContent ?? "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (res.ok && json.ok) {
        const box = document.createElement("div");
        box.className = "rounded-md border border-champagne/50 bg-bone-deep p-7";
        box.setAttribute("role", "status");
        box.innerHTML = `<p class="eyebrow">Sent</p><h3 class="mt-2 font-display text-fluid-xl text-ink"></h3><p class="mt-3 text-fluid-base text-ink-soft"></p><p class="mt-4 text-fluid-xs text-ink-muted">Reference <strong></strong>${json.delivered === false ? ". Email delivery is not configured on this demo, so the message was logged on the server." : "."}</p>`;
        box.querySelector("h3")!.textContent = successTitle;
        box.querySelector("p.mt-3")!.textContent = successBody;
        box.querySelector("strong")!.textContent = json.ref || "";
        form.replaceWith(box);
        toast(successTitle);
      } else {
        showErrors(json.fields || {});
        toast(json.error || "Something went wrong.", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = label; }
    }
  });
}
