// Treatment Match quiz. Six questions. Each answer adds weighted points to
// treatment slugs. The top three scores become recommendations.

export interface QuizOption {
  label: string;
  hint?: string;
  scores: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  helper?: string;
  multi?: boolean;
  options: QuizOption[];
}

export const quiz: QuizQuestion[] = [
  {
    id: "concern",
    question: "What would you most like to address?",
    helper: "Choose up to two.",
    multi: true,
    options: [
      { label: "Lines when I frown, squint or raise my brows", scores: { neuromodulators: 5, "laser-resurfacing": 1 } },
      { label: "My face looks flatter or more tired than it used to", scores: { "dermal-fillers": 4, biostimulators: 4 } },
      { label: "Sun spots, redness or uneven tone", scores: { "ipl-photofacial": 5, "chemical-peels": 3, "laser-resurfacing": 2 } },
      { label: "Acne scars, large pores or rough texture", scores: { "microneedling-rf": 5, "laser-resurfacing": 3, "chemical-peels": 2 } },
      { label: "Dull, congested or dehydrated skin", scores: { hydrafacial: 5, "chemical-peels": 2 } },
      { label: "Lips that feel thin or undefined", scores: { "lip-enhancement": 5 } },
      { label: "Stubborn areas on my body or loose skin", scores: { "body-contouring": 5, "microneedling-rf": 1 } },
      { label: "Weight that will not move, or low energy", scores: { "medical-weight-loss": 5, "iv-therapy": 3 } },
      { label: "Unwanted hair", scores: { "laser-hair-removal": 6 } },
    ],
  },
  {
    id: "downtime",
    question: "How much downtime can you accept?",
    options: [
      { label: "None. I need to be seen tomorrow.", scores: { neuromodulators: 2, hydrafacial: 3, "iv-therapy": 2, "laser-hair-removal": 1, "body-contouring": 2 } },
      { label: "A day or two of swelling or pinkness is fine", scores: { "dermal-fillers": 2, "lip-enhancement": 2, "ipl-photofacial": 2, "chemical-peels": 2 } },
      { label: "Up to a week if the result is worth it", scores: { "laser-resurfacing": 3, "microneedling-rf": 2, biostimulators: 1 } },
    ],
  },
  {
    id: "timeline",
    question: "When do you want to see results?",
    options: [
      { label: "Right away, I have something coming up", scores: { hydrafacial: 3, "dermal-fillers": 2, "lip-enhancement": 2, "iv-therapy": 2 } },
      { label: "Within a few weeks", scores: { neuromodulators: 3, "ipl-photofacial": 2, "chemical-peels": 2 } },
      { label: "I am patient. Gradual and natural is the goal.", scores: { biostimulators: 4, "microneedling-rf": 2, "medical-weight-loss": 2, "laser-hair-removal": 2 } },
    ],
  },
  {
    id: "experience",
    question: "Have you had aesthetic treatments before?",
    options: [
      { label: "Never. This is my first time.", scores: { hydrafacial: 2, neuromodulators: 1 } },
      { label: "A few. I know what I like.", scores: {} },
      { label: "Regularly. I want a more complete plan.", scores: { biostimulators: 2, "dermal-fillers": 1, "laser-resurfacing": 1 } },
    ],
  },
  {
    id: "sun",
    question: "How would you describe your sun exposure?",
    helper: "Arizona counts double.",
    options: [
      { label: "I am outdoors most days", scores: { "ipl-photofacial": 2, "chemical-peels": 1 } },
      { label: "Some weekends and travel", scores: { "ipl-photofacial": 1 } },
      { label: "I avoid it and wear sunscreen daily", scores: { "laser-resurfacing": 1, "microneedling-rf": 1 } },
    ],
  },
  {
    id: "budget",
    question: "What feels comfortable for a first visit?",
    options: [
      { label: "Under $400", scores: { neuromodulators: 2, hydrafacial: 2, "chemical-peels": 2, "ipl-photofacial": 1, "iv-therapy": 2, "laser-hair-removal": 2 } },
      { label: "$400 to $1,000", scores: { "dermal-fillers": 2, "lip-enhancement": 2, "microneedling-rf": 2, biostimulators: 1, "body-contouring": 1 } },
      { label: "Over $1,000 for the right plan", scores: { biostimulators: 2, "laser-resurfacing": 2, "body-contouring": 2, "dermal-fillers": 1 } },
    ],
  },
];

export function scoreQuiz(answers: Record<string, number[]>): { slug: string; score: number }[] {
  const totals: Record<string, number> = {};
  for (const q of quiz) {
    const picked = answers[q.id] ?? [];
    for (const idx of picked) {
      const opt = q.options[idx];
      if (!opt) continue;
      for (const [slug, pts] of Object.entries(opt.scores)) totals[slug] = (totals[slug] ?? 0) + pts;
    }
  }
  return Object.entries(totals)
    .map(([slug, score]) => ({ slug, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
