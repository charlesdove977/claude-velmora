import type { ConcernSlug } from "./treatments";

export interface Concern {
  slug: ConcernSlug;
  name: string;
  short: string;
  intro: string;
  body: string[];
  approach: string[];
  image: string;
  imageAlt: string;
}

export const concerns: Concern[] = [
  {
    slug: "lines-wrinkles",
    name: "Lines & Wrinkles",
    short: "Expression lines, forehead, crow's feet",
    intro: "Lines come from two places: movement and lost support. We treat each cause differently, and never both at once without a reason.",
    body: [
      "Dynamic lines appear when you frown, squint or raise your brows. Repeated over years, they etch into the skin even at rest. Static lines and crepiness come from thinner collagen and less volume beneath the surface.",
      "Your consultation starts with a movement map. We watch how your face moves and where the skin folds, then match the treatment to the cause rather than the symptom.",
    ],
    approach: [
      "Neuromodulators soften movement lines in the upper face.",
      "Filler or biostimulators support lines caused by lost volume.",
      "Resurfacing and RF microneedling refine texture and fine lines.",
    ],
    image: "face-01",
    imageAlt: "Woman in her late thirties with soft expression lines in natural light",
  },
  {
    slug: "volume-loss",
    name: "Volume Loss",
    short: "Cheeks, temples, jawline, under-eyes",
    intro: "The face loses fat, bone and collagen with time. Restoring a little of each, in the right order, is what keeps results looking like you.",
    body: [
      "Deflation shows up as flatter cheeks, hollow temples, shadows under the eyes and a softer jawline. Pulling skin tighter does not fix this. Restoring support underneath does.",
      "We work from the foundation up: structure first, then contour, then refinement. Small amounts across several visits look more natural than a large amount in one.",
    ],
    approach: [
      "Hyaluronic acid filler for immediate, reversible support.",
      "Sculptra for gradual, long-lasting collagen and overall fullness.",
      "Lip enhancement for balance in the lower face.",
    ],
    image: "face-03",
    imageAlt: "Profile of a woman with restored cheek contour in warm studio light",
  },
  {
    slug: "pigmentation",
    name: "Pigmentation & Sun Damage",
    short: "Sun spots, melasma, redness, uneven tone",
    intro: "Scottsdale gives us 300 days of sun. Your skin keeps a record. We can lift much of it, and teach you how to keep it from coming back.",
    body: [
      "Brown spots, freckling and redness are the most common concerns we see in Arizona. Melasma, a hormonal pigment pattern, is different and needs a gentler, longer plan.",
      "Light-based treatments clear existing pigment. Peels and a home regimen keep tone even between visits. Daily sunscreen is the non-negotiable part of every plan.",
    ],
    approach: [
      "IPL photofacial for sun spots and redness on lighter to medium skin.",
      "Brightening peels for melasma and deeper skin tones.",
      "Fractional resurfacing for combined texture and tone.",
    ],
    image: "desert-01",
    imageAlt: "Sonoran desert at golden hour with long warm light",
  },
  {
    slug: "acne-texture",
    name: "Acne & Texture",
    short: "Scars, pores, congestion, roughness",
    intro: "Active breakouts and the scars they leave need different tools. We calm the skin first, then rebuild the surface.",
    body: [
      "Congestion and active acne respond to consistent, gentle care: medical facials, light peels and a simplified routine. Scarring and enlarged pores need collagen remodeling below the surface.",
      "We sequence treatments so the skin is never asked to heal two things at once.",
    ],
    approach: [
      "HydraFacial and light peels for congestion and clarity.",
      "RF microneedling for scars, pores and laxity.",
      "Laser resurfacing for texture once acne is controlled.",
    ],
    image: "hands-02",
    imageAlt: "Hands holding a minimal skincare bottle against a bone-colored background",
  },
  {
    slug: "body",
    name: "Body & Wellness",
    short: "Contouring, tightening, IV, weight management",
    intro: "Stubborn areas, loose skin, low energy and weight that will not move. Each has a medical answer, and none of them require surgery.",
    body: [
      "Body contouring reduces specific pockets and tightens skin. Medical weight loss addresses the whole picture with physician oversight. IV therapy supports recovery and hydration along the way.",
      "We are honest about which tool fits. Contouring is not a weight-loss treatment, and we will say so.",
    ],
    approach: [
      "Non-surgical fat reduction and RF skin tightening.",
      "GLP-1 weight management with labs and monthly visits.",
      "IV therapy for hydration, recovery and travel.",
    ],
    image: "body-01",
    imageAlt: "Calm body treatment room with linen and soft light",
  },
  {
    slug: "hair",
    name: "Unwanted Hair",
    short: "Face, underarms, bikini, legs, back",
    intro: "Long-term hair reduction that is safe across skin tones, planned as a series so every follicle is caught in its growth phase.",
    body: [
      "Laser hair removal targets pigment in the follicle. Our device offers two wavelengths, so it can be adjusted safely for lighter and deeper skin tones alike.",
      "A series of 6 to 8 sessions spaced a month or two apart handles most areas, with occasional maintenance afterward.",
    ],
    approach: [
      "Dual-wavelength laser hair removal with a test spot first.",
      "Series pricing across any area.",
      "Honest guidance on light or gray hair, which responds poorly.",
    ],
    image: "body-01",
    imageAlt: "Smooth skin on a shoulder in soft light",
  },
];

export const getConcern = (slug: string) => concerns.find((c) => c.slug === slug);
