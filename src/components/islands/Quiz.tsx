// Treatment Match quiz. Six questions, client-side scoring, three
// recommendations that deep-link into /book?treatment=slug.
import { useEffect, useMemo, useState } from "react";
import { quiz, scoreQuiz } from "@/data/quiz";

interface Rec { slug: string; name: string; benefit: string; priceFrom: number; priceUnit: string; image: string; spec: { downtime: string; duration: string } }

export default function Quiz({ catalog }: { catalog: Rec[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [done, setDone] = useState(false);
  const q = quiz[step];
  const picked = answers[q?.id] ?? [];
  const total = quiz.length;

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("velmora-quiz");
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem("velmora-quiz", JSON.stringify(answers)); } catch {}
  }, [answers]);

  const results = useMemo(() => (done ? scoreQuiz(answers).map((r) => catalog.find((c) => c.slug === r.slug)).filter(Boolean) as Rec[] : []), [done, answers, catalog]);

  const toggle = (idx: number) => {
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      if (q.multi) {
        const next = cur.includes(idx) ? cur.filter((i) => i !== idx) : cur.length >= 2 ? [cur[1], idx] : [...cur, idx];
        return { ...a, [q.id]: next };
      }
      return { ...a, [q.id]: [idx] };
    });
    if (!q.multi) window.setTimeout(() => (step < total - 1 ? setStep(step + 1) : setDone(true)), 260);
  };

  const restart = () => { setAnswers({}); setStep(0); setDone(false); };

  if (done) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Your match</p>
        <h2 className="mt-3 font-display text-fluid-2xl text-ink">{results.length ? "Three treatments worth a conversation" : "Let us map this together"}</h2>
        <p className="mt-4 text-fluid-base text-ink-soft">These are starting points, not prescriptions. A consultation confirms what fits your skin, your calendar and your budget. Results vary.</p>
        <ol className="mt-8 space-y-4">
          {results.map((r, i) => (
            <li key={r.slug} className="flex flex-col gap-5 rounded-md border border-stone/40 bg-bone p-5 sm:flex-row sm:items-center">
              <picture className="block h-28 w-full shrink-0 overflow-hidden rounded-md sm:w-36">
                <source type="image/avif" srcSet={`/images/${r.image}-640.avif`} />
                <img src={`/images/${r.image}-640.webp`} alt="" width={640} height={427} className="h-full w-full object-cover" loading="lazy" />
              </picture>
              <div className="min-w-0 flex-1">
                <p className="text-fluid-xs uppercase tracking-eyebrow text-gold-text">{i === 0 ? "Best match" : `Match ${i + 1}`}</p>
                <h3 className="mt-1 font-display text-fluid-lg text-ink">{r.name}</h3>
                <p className="mt-1 text-fluid-sm text-ink-soft">{r.benefit}</p>
                <p className="mt-2 text-fluid-xs text-ink-muted">From ${r.priceFrom} {r.priceUnit} · {r.spec.duration} · Downtime: {r.spec.downtime}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <a href={`/treatments/${r.slug}`} className="inline-flex h-11 items-center rounded-pill border border-espresso/30 px-5 text-fluid-sm font-semibold text-ink hover:border-espresso">Learn more</a>
                <a href={`/book?treatment=${r.slug}`} className="inline-flex h-11 items-center rounded-pill bg-espresso px-5 text-fluid-sm font-semibold text-bone hover:bg-espresso-soft">Book</a>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/book" className="inline-flex h-12 items-center rounded-pill bg-champagne px-7 text-fluid-sm font-semibold text-espresso">Book a free virtual consultation</a>
          <button type="button" onClick={restart} className="inline-flex h-12 items-center rounded-pill border border-stone px-6 text-fluid-sm font-semibold text-ink-soft hover:border-espresso hover:text-ink">Start over</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl" aria-live="polite">
      <div className="flex items-center justify-between text-fluid-xs uppercase tracking-eyebrow text-ink-muted">
        <span>Question {step + 1} of {total}</span>
        <span>{q.multi ? "Choose up to two" : "Choose one"}</span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {quiz.map((x, i) => <span key={x.id} className={`h-1 flex-1 rounded-pill transition-colors duration-500 ${i <= step ? "bg-champagne" : "bg-stone/50"}`} />)}
      </div>
      <h2 className="mt-8 font-display text-fluid-2xl text-ink">{q.question}</h2>
      {q.helper && <p className="mt-2 text-fluid-sm text-ink-muted">{q.helper}</p>}
      <div className="mt-8 grid gap-3 sm:grid-cols-2" role={q.multi ? "group" : "radiogroup"} aria-label={q.question}>
        {q.options.map((o, i) => {
          const on = picked.includes(i);
          return (
            <button
              key={o.label}
              type="button"
              role={q.multi ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => toggle(i)}
              className={`min-h-[3.5rem] rounded-md border px-5 py-4 text-left text-fluid-base transition-all duration-300 ${on ? "border-espresso bg-espresso text-bone shadow-lift" : "border-stone/60 bg-bone text-ink hover:border-espresso"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex h-11 items-center gap-2 rounded-pill border border-stone px-5 text-fluid-sm font-semibold text-ink-soft transition-colors hover:border-espresso hover:text-ink disabled:opacity-40">Back</button>
        {q.multi && (
          <button type="button" onClick={() => (step < total - 1 ? setStep(step + 1) : setDone(true))} disabled={picked.length === 0} className="inline-flex h-11 items-center gap-2 rounded-pill bg-espresso px-6 text-fluid-sm font-semibold text-bone transition-colors hover:bg-espresso-soft disabled:opacity-40">
            {step < total - 1 ? "Next" : "See my match"}
          </button>
        )}
      </div>
    </div>
  );
}
