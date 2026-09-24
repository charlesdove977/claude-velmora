// Illustrative testimonials for the demo brand. Not from real patients.
// A real client replaces these with consented reviews.

export interface Testimonial {
  name: string;
  treatment: string;
  treatmentSlug: string;
  quote: string;
  provider: string;
  since: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Claire M.",
    treatment: "Botox",
    treatmentSlug: "neuromodulators",
    quote: "My sister asked if I had changed my skincare. That is the whole review. Nora dosed it so lightly I can still raise my eyebrows, and the lines are just gone.",
    provider: "Nora Quinlan, NP-C",
    since: "Member since 2023",
  },
  {
    name: "Priya S.",
    treatment: "IPL Photofacial",
    treatmentSlug: "ipl-photofacial",
    quote: "Twenty years of Arizona sun on my chest, cleared in three sessions. Maya told me exactly what the flaking would look like, and it looked exactly like that.",
    provider: "Maya Ferreira, RN",
    since: "Patient since 2024",
  },
  {
    name: "Marcus T.",
    treatment: "Masseter Botox",
    treatmentSlug: "neuromodulators",
    quote: "I came in for jaw clenching and left with a plan that also softened my face a little. Daniel was straight with me about what would and would not help. No upsell.",
    provider: "Daniel Oyelaran, PA-C",
    since: "Patient since 2025",
  },
  {
    name: "Dana L.",
    treatment: "Sculptra",
    treatmentSlug: "biostimulators",
    quote: "It took three months, which Dr. Marsh warned me about. Then my face just looked like it did at 40. Nobody can point at anything. That is the point.",
    provider: "Dr. Elena Marsh",
    since: "Member since 2022",
  },
  {
    name: "Renée B.",
    treatment: "RF Microneedling",
    treatmentSlug: "microneedling-rf",
    quote: "I had given up on my acne scars. After a series of three, foundation sits flat for the first time in fifteen years. The numbing was thorough, and Maya checked in the whole way.",
    provider: "Maya Ferreira, RN",
    since: "Patient since 2024",
  },
  {
    name: "Jordan K.",
    treatment: "HydraFacial",
    treatmentSlug: "hydrafacial",
    quote: "The monthly facial is the reason I keep the membership. Sofia rebuilt my routine down to four products, and my skin has been calm for a year.",
    provider: "Sofia Reyes, LE",
    since: "Member since 2024",
  },
  {
    name: "Ava R.",
    treatment: "Lip Enhancement",
    treatmentSlug: "lip-enhancement",
    quote: "Half a syringe. I was nervous about looking done, and Nora talked me out of the full one. Two weeks later they just look hydrated. Exactly what I wanted.",
    provider: "Nora Quinlan, NP-C",
    since: "Patient since 2025",
  },
  {
    name: "Helen W.",
    treatment: "Medical Weight Loss",
    treatmentSlug: "medical-weight-loss",
    quote: "The monthly visits are the difference. Dr. Marsh adjusted my dose twice, fixed the nausea in week two, and made me lift weights. Eleven months in and I feel like myself.",
    provider: "Dr. Elena Marsh",
    since: "Patient since 2025",
  },
];
