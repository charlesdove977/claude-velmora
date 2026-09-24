// Four-step booking flow. State lives in sessionStorage and the URL so a
// refresh or a back button never loses progress. Posts to /api/book.
import { useEffect, useMemo, useRef, useState } from "react";
import { nextDays, slotsFor, formatTime, formatDateLong } from "@/lib/slots";
import { bookingSchema, flattenErrors } from "@/lib/schemas";

export interface BookTreatment { slug: string; name: string; shortName: string; priceFrom: number; priceUnit: string; category: string; providers: string[] }
export interface BookProvider { slug: string; name: string; credentials: string; role: string; image: string }
interface Props { treatments: BookTreatment[]; providers: BookProvider[]; categories: Record<string, string>; consultLabels: { virtual: string; inPerson: string }; phone: string }

const CONSULT = "consultation";
const KEY = "velmora-booking";

interface State {
  step: number;
  treatments: string[];
  provider: string;
  date: string;
  time: string;
  name: string; email: string; phone: string; firstVisit: boolean; notes: string; smsConsent: boolean; policyAck: boolean;
}
const initial: State = { step: 1, treatments: [], provider: "", date: "", time: "", name: "", email: "", phone: "", firstVisit: true, notes: "", smsConsent: false, policyAck: false };

export default function BookingFlow({ treatments, providers, categories, consultLabels, phone }: Props) {
  const [s, setS] = useState<State>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const top = useRef<HTMLDivElement>(null);
  const days = useMemo(() => nextDays(30), []);
  const duration = Math.max(30, s.treatments.length * 45);
  const slots = useMemo(() => (s.date ? slotsFor(s.date, duration) : []), [s.date, duration]);

  // Restore from sessionStorage, then apply URL prefill (?treatment=, ?provider=).
  useEffect(() => {
    let next = { ...initial };
    try { const saved = sessionStorage.getItem(KEY); if (saved) next = { ...next, ...JSON.parse(saved) }; } catch {}
    const params = new URLSearchParams(location.search);
    const t = params.get("treatment");
    if (t && (t === CONSULT || treatments.some((x) => x.slug === t))) next.treatments = [t];
    const p = params.get("provider");
    if (p && providers.some((x) => x.slug === p)) next.provider = p;
    const st = Number(params.get("step"));
    if (st >= 1 && st <= 4) next.step = st;
    if (next.step > 1 && next.treatments.length === 0) next.step = 1;
    setS(next);
  }, [treatments, providers]);

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    const url = new URL(location.href);
    url.searchParams.set("step", String(s.step));
    history.replaceState(null, "", url);
  }, [s]);

  const set = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));
  const go = (step: number) => { set({ step }); setErrors({}); setServerError(""); window.setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30); };

  const toggleTreatment = (slug: string) => {
    if (slug === CONSULT) return set({ treatments: [CONSULT] });
    const cur = s.treatments.filter((x) => x !== CONSULT);
    set({ treatments: cur.includes(slug) ? cur.filter((x) => x !== slug) : cur.length >= 3 ? cur : [...cur, slug] });
  };

  const eligibleProviders = useMemo(() => {
    if (s.treatments.length === 0 || s.treatments.includes(CONSULT)) return providers;
    return providers.filter((p) => s.treatments.every((t) => treatments.find((x) => x.slug === t)?.providers.includes(p.slug)));
  }, [s.treatments, providers, treatments]);

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (s.step === 1 && s.treatments.length === 0) e.treatments = "Choose at least one treatment, or a consultation.";
    if (s.step === 2) {
      if (!s.provider) e.provider = "Choose a provider or first available.";
      if (!s.date) e.date = "Choose a date.";
      if (!s.time) e.time = "Choose a time.";
    }
    if (s.step === 3) {
      const r = bookingSchema.safeParse({ ...s, treatments: s.treatments.length ? s.treatments : ["x"], provider: s.provider || "x", date: s.date || "2000-01-01", time: s.time || "09:00" });
      if (!r.success) Object.assign(e, flattenErrors(r.error));
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) go(s.step + 1); };

  const submit = async () => {
    setSubmitting(true); setServerError("");
    try {
      const res = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...s, company_website: (document.getElementById("company_website") as HTMLInputElement | null)?.value ?? "" }) });
      const data = await res.json();
      if (res.ok && data.ok) {
        try { sessionStorage.setItem("velmora-booking-result", JSON.stringify(data)); sessionStorage.removeItem(KEY); } catch {}
        location.href = `/book/confirmed?ref=${encodeURIComponent(data.ref)}`;
        return;
      }
      setServerError(data.error || "Something went wrong. Please call us.");
      if (data.fields) { setErrors(data.fields); if (data.fields.time || data.fields.provider) go(2); else if (data.fields.treatments) go(1); else go(3); }
    } catch {
      setServerError(`Network error. Please try again or call ${phone}.`);
    } finally { setSubmitting(false); }
  };

  const summaryNames = s.treatments.map((t) => (t === CONSULT ? "Consultation" : treatments.find((x) => x.slug === t)?.name)).filter(Boolean).join(", ");
  const providerName = s.provider === "first-available" ? "First available" : providers.find((p) => p.slug === s.provider)?.name ?? "";
  const cats = Object.keys(categories);
  const field = (k: keyof State, label: string, type = "text", extra: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={`bf-${k}`} className="block text-fluid-sm font-semibold text-ink">{label}</label>
      <input id={`bf-${k}`} type={type} value={String(s[k])} onChange={(e) => set({ [k]: e.target.value } as Partial<State>)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `bf-${k}-err` : undefined} className={`mt-2 h-12 w-full rounded-md border bg-bone px-4 text-fluid-base text-ink outline-none transition-colors focus:border-espresso ${errors[k] ? "border-error" : "border-stone/70"}`} {...extra} />
      {errors[k] && <p id={`bf-${k}-err`} className="mt-1.5 text-fluid-xs text-error" role="alert">{errors[k]}</p>}
    </div>
  );

  return (
    <div ref={top} className="scroll-mt-28">
      {/* Progress */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Booking progress">
        {["Treatment", "Provider & time", "Your details", "Review"].map((label, i) => {
          const n = i + 1; const state = n < s.step ? "done" : n === s.step ? "current" : "pending";
          return (
            <li key={label} aria-current={state === "current" ? "step" : undefined}>
              <button type="button" disabled={n > s.step} onClick={() => go(n)} className="w-full text-left disabled:cursor-default">
                <span className={`block h-1 rounded-pill transition-colors ${state === "pending" ? "bg-stone/50" : "bg-champagne"}`} />
                <span className={`mt-2 block text-[0.6875rem] font-semibold uppercase tracking-eyebrow ${state === "pending" ? "text-ink-muted" : "text-ink"}`}>{n}. {label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {s.step === 1 && (
            <section aria-labelledby="bf-s1">
              <h2 id="bf-s1" className="font-display text-fluid-2xl text-ink">What would you like to book?</h2>
              <p className="mt-2 text-fluid-sm text-ink-soft">Choose up to three treatments, or start with a consultation if you are not sure.</p>
              {errors.treatments && <p className="mt-3 text-fluid-sm text-error" role="alert">{errors.treatments}</p>}
              <button type="button" onClick={() => toggleTreatment(CONSULT)} aria-pressed={s.treatments.includes(CONSULT)} className={`mt-6 flex w-full items-start justify-between gap-4 rounded-md border p-5 text-left transition-all ${s.treatments.includes(CONSULT) ? "border-espresso bg-espresso text-bone shadow-lift" : "border-champagne/60 bg-bone-deep text-ink hover:border-espresso"}`}>
                <div>
                  <p className="font-display text-fluid-lg">Not sure yet. Book a consultation.</p>
                  <p className={`mt-1 text-fluid-sm ${s.treatments.includes(CONSULT) ? "text-stone" : "text-ink-soft"}`}>{consultLabels.virtual}, or {consultLabels.inPerson.toLowerCase()}.</p>
                </div>
                <span className="shrink-0 text-fluid-xs uppercase tracking-eyebrow">Free</span>
              </button>
              {cats.map((c) => (
                <div key={c} className="mt-8">
                  <p className="eyebrow">{categories[c]}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {treatments.filter((t) => t.category === c).map((t) => {
                      const on = s.treatments.includes(t.slug);
                      return (
                        <button key={t.slug} type="button" onClick={() => toggleTreatment(t.slug)} aria-pressed={on} className={`flex items-start justify-between gap-3 rounded-md border p-4 text-left transition-all ${on ? "border-espresso bg-espresso text-bone shadow-lift" : "border-stone/60 bg-bone text-ink hover:border-espresso"}`}>
                          <span><span className="block font-semibold">{t.name}</span><span className={`mt-0.5 block text-fluid-xs ${on ? "text-stone" : "text-ink-muted"}`}>from ${t.priceFrom} {t.priceUnit}</span></span>
                          <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border ${on ? "border-champagne bg-champagne text-espresso" : "border-stone"}`} aria-hidden="true">{on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 5l2 2 4-4" /></svg>}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}

          {s.step === 2 && (
            <section aria-labelledby="bf-s2">
              <h2 id="bf-s2" className="font-display text-fluid-2xl text-ink">Who, and when?</h2>
              <p className="mt-2 text-fluid-sm text-ink-soft">Closed Sundays. Slots are {duration} minutes for your selection. A coordinator confirms within one business hour.</p>
              <fieldset className="mt-6">
                <legend className="eyebrow">Provider</legend>
                {errors.provider && <p className="mt-2 text-fluid-sm text-error" role="alert">{errors.provider}</p>}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-all ${s.provider === "first-available" ? "border-espresso bg-espresso text-bone" : "border-stone/60 hover:border-espresso"}`}>
                    <input type="radio" name="provider" className="sr-only" checked={s.provider === "first-available"} onChange={() => set({ provider: "first-available" })} />
                    <span className="flex h-12 w-12 items-center justify-center rounded-pill border border-current text-fluid-xs">Any</span>
                    <span><span className="block font-semibold">First available</span><span className={`block text-fluid-xs ${s.provider === "first-available" ? "text-stone" : "text-ink-muted"}`}>Soonest opening with a qualified provider</span></span>
                  </label>
                  {eligibleProviders.map((p) => {
                    const on = s.provider === p.slug;
                    return (
                      <label key={p.slug} className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-all ${on ? "border-espresso bg-espresso text-bone" : "border-stone/60 hover:border-espresso"}`}>
                        <input type="radio" name="provider" className="sr-only" checked={on} onChange={() => set({ provider: p.slug })} />
                        <img src={`/images/${p.image}-640.webp`} alt="" width={48} height={48} className="h-12 w-12 rounded-pill object-cover" loading="lazy" />
                        <span><span className="block font-semibold">{p.name}, {p.credentials}</span><span className={`block text-fluid-xs ${on ? "text-stone" : "text-ink-muted"}`}>{p.role}</span></span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="mt-8">
                <legend className="eyebrow">Date</legend>
                {errors.date && <p className="mt-2 text-fluid-sm text-error" role="alert">{errors.date}</p>}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="radiogroup" aria-label="Choose a date">
                  {days.map((d) => (
                    <button key={d.iso} type="button" role="radio" aria-checked={s.date === d.iso} disabled={!d.open} onClick={() => set({ date: d.iso, time: "" })} aria-label={d.label + (d.open ? "" : ", closed")} className={`flex min-w-[4.25rem] shrink-0 flex-col items-center rounded-md border px-2 py-3 transition-all ${s.date === d.iso ? "border-espresso bg-espresso text-bone" : "border-stone/60 text-ink hover:border-espresso"} disabled:cursor-not-allowed disabled:opacity-35`}>
                      <span className="text-[0.6875rem] uppercase tracking-eyebrow">{d.weekday}</span>
                      <span className="mt-1 font-display text-fluid-lg leading-none">{d.dayNum}</span>
                      <span className="mt-1 text-[0.6875rem] text-current opacity-70">{d.month}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-8">
                <legend className="eyebrow">Time {s.date && <span className="normal-case tracking-normal text-ink-muted">· {formatDateLong(s.date)}</span>}</legend>
                {errors.time && <p className="mt-2 text-fluid-sm text-error" role="alert">{errors.time}</p>}
                {!s.date && <p className="mt-3 text-fluid-sm text-ink-muted">Choose a date to see times.</p>}
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6" role="radiogroup" aria-label="Choose a time">
                  {slots.map((t) => (
                    <button key={t} type="button" role="radio" aria-checked={s.time === t} onClick={() => set({ time: t })} className={`h-11 rounded-pill border text-fluid-sm transition-all ${s.time === t ? "border-espresso bg-espresso text-bone" : "border-stone/60 text-ink hover:border-espresso"}`}>{formatTime(t)}</button>
                  ))}
                </div>
              </fieldset>
            </section>
          )}

          {s.step === 3 && (
            <section aria-labelledby="bf-s3">
              <h2 id="bf-s3" className="font-display text-fluid-2xl text-ink">Your details</h2>
              <p className="mt-2 text-fluid-sm text-ink-soft">Used only to confirm this appointment. We do not store health information on this website.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {field("name", "Full name", "text", { autoComplete: "name" })}
                {field("email", "Email", "email", { autoComplete: "email", inputMode: "email" })}
                {field("phone", "Mobile phone", "tel", { autoComplete: "tel", inputMode: "tel" })}
                <fieldset>
                  <legend className="block text-fluid-sm font-semibold text-ink">Have you visited us before?</legend>
                  <div className="mt-2 flex gap-2">
                    {[{ v: true, l: "First visit" }, { v: false, l: "Returning" }].map((o) => (
                      <label key={o.l} className={`flex h-12 flex-1 cursor-pointer items-center justify-center rounded-md border text-fluid-sm transition-all ${s.firstVisit === o.v ? "border-espresso bg-espresso text-bone" : "border-stone/70 text-ink hover:border-espresso"}`}>
                        <input type="radio" name="firstVisit" className="sr-only" checked={s.firstVisit === o.v} onChange={() => set({ firstVisit: o.v })} />{o.l}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="mt-5">
                <label htmlFor="bf-notes" className="block text-fluid-sm font-semibold text-ink">Anything we should know? <span className="font-normal text-ink-muted">(optional)</span></label>
                <textarea id="bf-notes" rows={3} value={s.notes} onChange={(e) => set({ notes: e.target.value })} maxLength={1000} className="mt-2 w-full rounded-md border border-stone/70 bg-bone px-4 py-3 text-fluid-base text-ink outline-none focus:border-espresso" />
              </div>
              <div className="mt-6 space-y-4">
                <label className="flex items-start gap-3 text-fluid-sm text-ink-soft">
                  <input type="checkbox" checked={s.smsConsent} onChange={(e) => set({ smsConsent: e.target.checked })} className="mt-1 h-5 w-5 accent-[#221b17]" />
                  <span>Text me appointment reminders. Message and data rates may apply. Reply STOP to opt out.</span>
                </label>
                <label className={`flex items-start gap-3 text-fluid-sm ${errors.policyAck ? "text-error" : "text-ink-soft"}`}>
                  <input type="checkbox" checked={s.policyAck} onChange={(e) => set({ policyAck: e.target.checked })} aria-invalid={!!errors.policyAck} className="mt-1 h-5 w-5 accent-[#221b17]" />
                  <span>I have read the <a href="/support/policies" target="_blank" rel="noopener" className="underline decoration-champagne underline-offset-4">cancellation and deposit policies</a> and I am 18 or older.</span>
                </label>
                {errors.policyAck && <p className="text-fluid-xs text-error" role="alert">{errors.policyAck}</p>}
              </div>
              <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            </section>
          )}

          {s.step === 4 && (
            <section aria-labelledby="bf-s4">
              <h2 id="bf-s4" className="font-display text-fluid-2xl text-ink">Review and confirm</h2>
              <p className="mt-2 text-fluid-sm text-ink-soft">This sends a booking request. A coordinator confirms within one business hour during opening hours.</p>
              <dl className="mt-6 divide-y divide-stone/40 border-y border-stone/40">
                {[["Treatment", summaryNames], ["Provider", providerName], ["When", s.date && s.time ? `${formatDateLong(s.date)} at ${formatTime(s.time)}` : ""], ["Name", s.name], ["Email", s.email], ["Phone", s.phone], ["Visit", s.firstVisit ? "First visit" : "Returning"], ["Notes", s.notes || "None"]].map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-3 sm:grid-cols-3"><dt className="text-fluid-xs uppercase tracking-eyebrow text-ink-muted">{k}</dt><dd className="text-fluid-base text-ink sm:col-span-2">{v}</dd></div>
                ))}
              </dl>
              {serverError && <p className="mt-4 rounded-md border border-error/40 bg-bone-deep p-4 text-fluid-sm text-error" role="alert">{serverError}</p>}
            </section>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-stone/40 pt-6">
            <button type="button" onClick={() => go(Math.max(1, s.step - 1))} disabled={s.step === 1} className="inline-flex h-12 items-center rounded-pill border border-stone px-6 text-fluid-sm font-semibold text-ink-soft transition-colors hover:border-espresso hover:text-ink disabled:opacity-40">Back</button>
            {s.step < 4 ? (
              <button type="button" onClick={next} className="inline-flex h-12 items-center gap-2 rounded-pill bg-espresso px-7 text-fluid-sm font-semibold text-bone transition-colors hover:bg-espresso-soft">Continue</button>
            ) : (
              <button type="button" onClick={submit} disabled={submitting} className="inline-flex h-12 items-center gap-2 rounded-pill bg-champagne px-7 text-fluid-sm font-semibold text-espresso transition-colors hover:brightness-105 disabled:opacity-60">{submitting ? "Sending…" : "Confirm booking request"}</button>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-md border border-stone/40 bg-bone-deep p-6">
            <p className="eyebrow">Your request</p>
            <dl className="mt-4 space-y-3 text-fluid-sm">
              <div><dt className="text-ink-muted">Treatment</dt><dd className="text-ink">{summaryNames || "Not chosen yet"}</dd></div>
              <div><dt className="text-ink-muted">Provider</dt><dd className="text-ink">{providerName || "Not chosen yet"}</dd></div>
              <div><dt className="text-ink-muted">When</dt><dd className="text-ink">{s.date && s.time ? `${formatDateLong(s.date)}, ${formatTime(s.time)}` : "Not chosen yet"}</dd></div>
            </dl>
            <p className="mt-5 border-t border-stone/40 pt-4 text-fluid-xs text-ink-muted">Deposit of $50 for treatments over 30 minutes, applied to your service, refundable with 24 hours' notice. Prefer to call? {phone}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
