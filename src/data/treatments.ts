// Treatment catalog. Drives /treatments, /treatments/[slug], the quiz,
// the booking flow, pricing, and JSON-LD. Copy never promises outcomes.

export type TreatmentCategory = "injectables" | "skin" | "laser" | "body" | "wellness";

export type ConcernSlug =
  | "lines-wrinkles"
  | "volume-loss"
  | "pigmentation"
  | "acne-texture"
  | "body"
  | "hair";

export interface Spec {
  duration: string;
  discomfort: string;
  downtime: string;
  onset: string;
  longevity: string;
}

export interface PriceLine {
  label: string;
  price: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  shortName: string;
  category: TreatmentCategory;
  benefit: string;
  summary: string;
  priceFrom: number;
  priceUnit: string;
  priceLines: PriceLine[];
  spec: Spec;
  concerns: ConcernSlug[];
  treats: string[];
  howItWorks: string[];
  expect: { before: string[]; during: string[]; after: string[] };
  pairsWith: string[];
  providers: string[];
  faqs: Faq[];
  aftercare: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  membershipEligible: boolean;
}

export const categories: Record<TreatmentCategory, { label: string; blurb: string }> = {
  injectables: { label: "Injectables", blurb: "Neuromodulators, fillers and biostimulators, dosed conservatively." },
  skin: { label: "Skin", blurb: "Medical-grade facials, peels and microneedling for texture and tone." },
  laser: { label: "Laser & light", blurb: "FDA-cleared devices for pigment, redness, resurfacing and hair." },
  body: { label: "Body", blurb: "Non-surgical contouring and skin tightening." },
  wellness: { label: "Wellness", blurb: "IV therapy and physician-supervised weight management." },
};

export const treatments: Treatment[] = [
  {
    slug: "neuromodulators",
    name: "Botox & Dysport",
    shortName: "Botox",
    category: "injectables",
    benefit: "Softens expression lines while your face still moves.",
    summary:
      "Neuromodulators relax the small muscles that fold the skin when you frown, squint or raise your brows. We dose to soften lines, not freeze them, so you still look like you.",
    priceFrom: 13,
    priceUnit: "per unit",
    priceLines: [
      { label: "Botox, per unit", price: "$13" },
      { label: "Dysport, per unit", price: "$4.50" },
      { label: "Typical forehead and frown lines", price: "$390 to $650" },
      { label: "Crow's feet", price: "$260 to $390" },
      { label: "Masseter (jaw slimming, teeth grinding)", price: "$520 to $780" },
    ],
    spec: {
      duration: "20 to 30 min",
      discomfort: "Minimal, brief pinches",
      downtime: "None, avoid workouts 24h",
      onset: "3 to 7 days, full at 14",
      longevity: "3 to 4 months typically",
    },
    concerns: ["lines-wrinkles"],
    treats: ["Forehead lines", "Frown lines (the 11s)", "Crow's feet", "Bunny lines", "Lip flip", "Masseter and jaw tension", "Neck bands"],
    howItWorks: [
      "Botox and Dysport are purified proteins that block the signal between a nerve and a muscle. When the muscle stops contracting so hard, the skin above it stops creasing, and the line softens over the following days.",
      "Dosing is where the skill lives. Your provider maps how your face moves, then places small amounts in specific muscles. Conservative first visits are normal here. It is easier to add two weeks later than to wait out an over-treated brow.",
    ],
    expect: {
      before: [
        "Skip alcohol, aspirin, ibuprofen and fish oil for 24 hours if your physician allows, to reduce bruising.",
        "Arrive with a clean face, or we will cleanse for you.",
        "Tell us about any prior neuromodulator treatment and what you liked or did not like.",
      ],
      during: [
        "Photos, a movement map and a dosing plan.",
        "A series of small injections with a very fine needle. Most people describe it as a quick pinch.",
        "Ice or a vibration device on request.",
      ],
      after: [
        "Stay upright for 4 hours and skip strenuous exercise, saunas and facials for 24 hours.",
        "Small bumps fade within 30 minutes. Occasional pinpoint bruising fades in a few days.",
        "A complimentary touch-up review at 2 weeks if anything needs balancing.",
      ],
    },
    pairsWith: ["dermal-fillers", "hydrafacial", "microneedling-rf"],
    providers: ["nora-quinlan", "daniel-oyelaran", "elena-marsh"],
    faqs: [
      { q: "Will I look frozen?", a: "Not with our approach. We dose to soften movement, not stop it. If you want a very still forehead, tell us, and we will discuss the tradeoffs first." },
      { q: "How many units will I need?", a: "It depends on the area and how strong your muscles are. A forehead plus frown lines typically runs 30 to 50 units. You will see the exact number before we begin." },
      { q: "Does it hurt?", a: "Most people feel brief pinches and nothing more. The needle is very fine, and each injection takes a second or two." },
      { q: "Botox or Dysport?", a: "They work the same way. Dysport may start a little sooner and spreads slightly more, which some people prefer for the forehead. Your provider will recommend one based on your goals." },
      { q: "When should I come back?", a: "Most people return every 3 to 4 months. Regular maintenance may make lines less likely to etch in over time." },
      { q: "Can I do this on my lunch break?", a: "Yes. The appointment runs 20 to 30 minutes, and there is no visible downtime beyond the possibility of a small bruise." },
    ],
    aftercare: "injectables",
    image: "treatment-01",
    imageAlt: "Provider gently marking injection points on a patient's brow in a calm treatment room",
    featured: true,
    membershipEligible: true,
  },
  {
    slug: "dermal-fillers",
    name: "Dermal Fillers",
    shortName: "Fillers",
    category: "injectables",
    benefit: "Restores lost volume and structure with a light hand.",
    summary:
      "Hyaluronic acid fillers replace volume the face loses with time, in the cheeks, temples, jawline, chin and under the eyes. We work in small amounts and build over sessions.",
    priceFrom: 750,
    priceUnit: "per syringe",
    priceLines: [
      { label: "Juvéderm or Restylane, per syringe", price: "$750 to $900" },
      { label: "Cheeks (typically 1 to 2 syringes)", price: "from $750" },
      { label: "Jawline and chin (typically 2 to 4 syringes)", price: "from $1,500" },
      { label: "Under-eye (tear trough)", price: "from $850" },
      { label: "Dissolving, if ever needed", price: "$250" },
    ],
    spec: {
      duration: "45 to 60 min",
      discomfort: "Mild, numbing included",
      downtime: "1 to 3 days of swelling",
      onset: "Immediate, settles in 2 weeks",
      longevity: "9 to 18 months typically",
    },
    concerns: ["volume-loss", "lines-wrinkles"],
    treats: ["Flattened cheeks", "Hollow temples", "Under-eye hollows", "Jawline definition", "Chin projection", "Nasolabial folds", "Marionette lines"],
    howItWorks: [
      "Hyaluronic acid is a sugar your body already makes. Filler is a smooth gel version of it that holds water and adds gentle structure where the face has thinned.",
      "We place it with cannulas where possible, which means fewer entry points and less bruising. Each area gets a purpose: lifting, smoothing or defining. Nothing is added just because there is a syringe open.",
    ],
    expect: {
      before: [
        "Avoid blood thinners, alcohol and high-dose vitamin E for 3 days if your physician allows.",
        "Plan treatment at least 2 weeks before an event.",
        "Bring photos of yourself from 5 to 10 years ago if you have them. They help us understand your natural structure.",
      ],
      during: [
        "Topical numbing for 15 to 20 minutes.",
        "Slow placement with a cannula or fine needle, checking symmetry in a mirror together.",
        "Gentle massage and a cold compress.",
      ],
      after: [
        "Expect swelling for 24 to 72 hours. Lips and under-eyes swell the most.",
        "Sleep on your back the first night. Avoid pressure, makeup and heavy exercise for 24 hours.",
        "Judge results at 2 weeks, not day 2.",
      ],
    },
    pairsWith: ["neuromodulators", "biostimulators", "lip-enhancement"],
    providers: ["nora-quinlan", "daniel-oyelaran", "elena-marsh"],
    faqs: [
      { q: "Will it look overdone?", a: "Overdone comes from too much product in the wrong plane. We place small amounts where your anatomy asks for them and let you settle before adding more." },
      { q: "Is it reversible?", a: "Yes. Hyaluronic acid fillers can be dissolved with an enzyme called hyaluronidase. It is rarely needed, but it is available here." },
      { q: "How long does it last?", a: "Typically 9 to 18 months depending on the area and product. Lips and mouth-area filler tend to fade faster than cheeks." },
      { q: "Can I combine it with Botox?", a: "Often, yes. Neuromodulators handle lines from movement while filler handles lines from lost volume. We plan both in one consultation." },
      { q: "What about bruising?", a: "Some pinpoint bruising is possible. Cannula technique and pre-visit prep reduce it. Arnica is available at the front desk." },
    ],
    aftercare: "injectables",
    image: "face-03",
    imageAlt: "Woman in her forties with natural skin and soft light on her cheekbones",
    featured: true,
    membershipEligible: true,
  },
  {
    slug: "lip-enhancement",
    name: "Lip Enhancement",
    shortName: "Lips",
    category: "injectables",
    benefit: "Shape and hydration that reads as yours.",
    summary:
      "Lip filler at Velmora is about proportion. We restore the border, add hydration and balance the upper and lower lip in amounts that look native to your face.",
    priceFrom: 650,
    priceUnit: "per session",
    priceLines: [
      { label: "Half syringe (hydration and border)", price: "$650" },
      { label: "Full syringe", price: "$850" },
      { label: "Lip flip with neuromodulator (add-on)", price: "$120" },
    ],
    spec: {
      duration: "45 min",
      discomfort: "Mild, numbing included",
      downtime: "2 to 4 days of swelling",
      onset: "Immediate, settles in 2 weeks",
      longevity: "6 to 12 months typically",
    },
    concerns: ["volume-loss"],
    treats: ["Thin lips", "Lost border definition", "Asymmetry", "Vertical lip lines", "Dry, deflated texture"],
    howItWorks: [
      "Softer hyaluronic acid gels designed for the lip are placed along the border and body of the lip. The goal is a natural ratio, usually the lower lip slightly fuller than the upper.",
      "Half a syringe is a common starting point. Many people never need more than that.",
    ],
    expect: {
      before: [
        "Avoid blood thinners and alcohol for 48 hours if your physician allows.",
        "Reschedule if you have an active cold sore. If you get them often, we may prescribe a preventive antiviral.",
        "Plan at least 2 weeks before events. Lips swell more than any other area.",
      ],
      during: [
        "Strong topical numbing for 20 minutes.",
        "Small, slow placements while checking symmetry with you.",
        "Cold compress before you leave.",
      ],
      after: [
        "Swelling peaks at 24 to 48 hours and looks bigger than the final result. This is normal.",
        "No kissing, straws, hot drinks or heavy exercise for 24 hours.",
        "Bumps from swelling smooth out within 2 weeks. Gentle massage instructions are provided.",
      ],
    },
    pairsWith: ["neuromodulators", "dermal-fillers", "chemical-peels"],
    providers: ["nora-quinlan", "daniel-oyelaran"],
    faqs: [
      { q: "Will my lips look fake?", a: "Fake lips come from too much volume, or volume placed in the wrong spot. We use conservative amounts and softer products designed for the lip." },
      { q: "How much swelling is normal?", a: "Quite a bit for 48 hours. Most people are presentable by day 3 and see the real result at 2 weeks." },
      { q: "Half or full syringe?", a: "If you want hydration and a cleaner border, half is usually plenty. Full is for people who want visible added volume." },
      { q: "Can it be dissolved?", a: "Yes. Hyaluronic acid filler can be dissolved if you ever want it gone." },
      { q: "How long does it last?", a: "Six to twelve months typically. The lips move constantly, so filler here fades faster than in the cheeks." },
    ],
    aftercare: "injectables",
    image: "face-05",
    imageAlt: "Close-up of natural, hydrated lips in soft window light",
    featured: false,
    membershipEligible: true,
  },
  {
    slug: "biostimulators",
    name: "Sculptra & Biostimulators",
    shortName: "Sculptra",
    category: "injectables",
    benefit: "Helps your skin rebuild its own collagen, gradually.",
    summary:
      "Sculptra and similar biostimulators do not fill. They prompt your skin to produce collagen over months, for a firmer, fuller look that builds slowly and reads as natural.",
    priceFrom: 900,
    priceUnit: "per vial",
    priceLines: [
      { label: "Sculptra, per vial", price: "$900" },
      { label: "Typical face series (2 to 3 sessions, 1 to 2 vials each)", price: "$1,800 to $5,400" },
      { label: "Radiesse, per syringe", price: "$850" },
    ],
    spec: {
      duration: "45 to 60 min",
      discomfort: "Mild, numbing included",
      downtime: "1 to 2 days",
      onset: "Gradual over 6 to 12 weeks",
      longevity: "Up to 2 years typically",
    },
    concerns: ["volume-loss", "acne-texture"],
    treats: ["Overall facial thinning", "Temples and cheeks", "Jawline laxity", "Skin quality and firmness", "Crepey texture on neck, chest and body"],
    howItWorks: [
      "Sculptra is poly-L-lactic acid, a material used in dissolvable sutures for decades. Placed under the skin, it acts as a scaffold your body responds to by building new collagen around it.",
      "Because the effect builds slowly, results look like you simply aged well. A typical plan is 2 to 3 sessions about 6 weeks apart.",
    ],
    expect: {
      before: [
        "Avoid blood thinners and alcohol for 48 hours if your physician allows.",
        "Plan the series 4 to 6 months before an event, since the effect builds over time.",
      ],
      during: [
        "Numbing and mapping of treatment zones.",
        "Product placed in a grid with a cannula, then massaged evenly.",
      ],
      after: [
        "Massage the area 5 minutes, 5 times a day, for 5 days. We show you how.",
        "Mild swelling and tenderness for a day or two.",
        "Results arrive gradually. Judge at 3 months after the final session.",
      ],
    },
    pairsWith: ["dermal-fillers", "microneedling-rf", "laser-resurfacing"],
    providers: ["nora-quinlan", "elena-marsh"],
    faqs: [
      { q: "How is this different from filler?", a: "Filler adds volume immediately. Sculptra adds collagen over months. Many people use both: filler for structure, Sculptra for overall quality and fullness." },
      { q: "When will I see results?", a: "Subtle change at 6 weeks, clearer change at 3 months, and results may continue to build for up to 6 months after the final session." },
      { q: "Why the massage routine?", a: "Massage spreads the product evenly so collagen forms smoothly. Skipping it raises the chance of small firm areas." },
      { q: "How long does it last?", a: "Because it is your own collagen, results typically last up to 2 years. A single maintenance session per year is common." },
      { q: "Can it be used off the face?", a: "Yes. Neck, chest, upper arms, knees and buttocks are common areas for texture and firmness." },
    ],
    aftercare: "injectables",
    image: "face-06",
    imageAlt: "Profile of a woman in her fifties with firm, luminous skin in soft neutral light",
    featured: false,
    membershipEligible: true,
  },
  {
    slug: "microneedling-rf",
    name: "RF Microneedling",
    shortName: "RF Microneedling",
    category: "skin",
    benefit: "Tightens, smooths and refines texture from the inside out.",
    summary:
      "Radiofrequency microneedling delivers controlled heat below the surface through ultra-fine needles. The skin responds by remodeling collagen, which may soften acne scars, tighten laxity and refine pores.",
    priceFrom: 850,
    priceUnit: "per session",
    priceLines: [
      { label: "Face, single session", price: "$850" },
      { label: "Face and neck, single session", price: "$1,100" },
      { label: "Series of 3, face (recommended)", price: "$2,300" },
      { label: "Body area (abdomen, arms, knees)", price: "from $950" },
    ],
    spec: {
      duration: "60 to 75 min",
      discomfort: "Moderate, strong numbing used",
      downtime: "2 to 4 days of redness",
      onset: "4 to 6 weeks, builds to 3 months",
      longevity: "12 months+ after a series",
    },
    concerns: ["acne-texture", "lines-wrinkles", "body"],
    treats: ["Acne scars", "Enlarged pores", "Skin laxity on face and neck", "Fine lines", "Stretch marks", "Crepey skin on body"],
    howItWorks: [
      "A handpiece with insulated gold-plated needles enters the skin at a precise depth and releases radiofrequency energy at the tip. Heat is delivered where collagen lives, not at the surface, so the top layer of skin stays largely intact.",
      "Over the following weeks, the skin remodels. Most people see the clearest change 3 months after a series of 3.",
    ],
    expect: {
      before: [
        "Stop retinoids and exfoliating acids 5 days before.",
        "Avoid sun exposure and self-tanner for 2 weeks.",
        "Arrive with a clean face and skip makeup.",
      ],
      during: [
        "Strong topical numbing for 45 minutes. This is part of the appointment time.",
        "Passes across each zone at customized depths. It feels like warm pressure with brief prickles.",
        "A cooling mask and growth-factor serum to finish.",
      ],
      after: [
        "Red and warm like a sunburn for 24 to 48 hours. Tiny grid marks fade within a few days.",
        "Gentle cleanser and the barrier balm we send you home with. No makeup for 24 hours.",
        "Strict sunscreen for 2 weeks. Sessions are spaced 4 to 6 weeks apart.",
      ],
    },
    pairsWith: ["biostimulators", "chemical-peels", "hydrafacial"],
    providers: ["maya-ferreira", "sofia-reyes"],
    faqs: [
      { q: "Is this Morpheus8?", a: "We use an FDA-cleared fractional RF microneedling platform in the same class. Your provider can walk through the specific device at your consultation." },
      { q: "Does it hurt?", a: "With 45 minutes of strong numbing, most people rate it a 3 to 5 out of 10. Deeper settings for scars feel more intense." },
      { q: "How many sessions?", a: "Three sessions spaced 4 to 6 weeks apart is the standard series. Mild texture concerns may see change after one." },
      { q: "Is it safe for darker skin?", a: "Yes. Because the energy is delivered below the surface with insulated needles, RF microneedling is considered safer than many lasers for deeper skin tones." },
      { q: "When can I wear makeup?", a: "After 24 hours, once the skin has closed. Mineral makeup is easiest for the first few days." },
    ],
    aftercare: "skin",
    image: "treatment-02",
    imageAlt: "Clinician holding a microneedling handpiece beside a patient's cheek",
    featured: true,
    membershipEligible: true,
  },
  {
    slug: "ipl-photofacial",
    name: "IPL Photofacial",
    shortName: "IPL",
    category: "laser",
    benefit: "Clears sun spots and redness for a more even tone.",
    summary:
      "Intense pulsed light targets brown pigment and red vessels without breaking the skin. Scottsdale sun leaves its mark, and IPL is our most requested way to lift it.",
    priceFrom: 375,
    priceUnit: "per session",
    priceLines: [
      { label: "Full face", price: "$375" },
      { label: "Face and neck", price: "$525" },
      { label: "Chest", price: "$375" },
      { label: "Hands", price: "$225" },
      { label: "Series of 3, full face", price: "$1,000" },
    ],
    spec: {
      duration: "30 to 45 min",
      discomfort: "Mild, like a snapped rubber band",
      downtime: "None to 1 day of pinkness",
      onset: "Spots darken then flake in 7 to 10 days",
      longevity: "Maintain yearly with sunscreen",
    },
    concerns: ["pigmentation"],
    treats: ["Sun spots and freckles", "Redness and rosacea flushing", "Broken capillaries", "Uneven tone on face, neck, chest and hands"],
    howItWorks: [
      "IPL emits a broad spectrum of light. Brown pigment and red blood vessels absorb it, heat up, and are broken down while the surrounding skin is left alone.",
      "Treated spots darken over a few days, then flake away. Redness fades gradually over several sessions.",
    ],
    expect: {
      before: [
        "No sun exposure, tanning beds or self-tanner for 4 weeks. Tanned skin cannot be treated safely.",
        "Stop retinoids 5 days before.",
        "Tell us about any photosensitizing medication, including some antibiotics.",
      ],
      during: [
        "Cool gel and protective eyewear.",
        "A series of bright pulses. Each feels like a quick, warm snap.",
        "Cooling and sunscreen to finish.",
      ],
      after: [
        "Skin may look pink for a few hours to a day.",
        "Spots darken like coffee grounds and flake off within 7 to 10 days. Do not pick.",
        "Daily SPF 30 or higher is required to protect the result.",
      ],
    },
    pairsWith: ["hydrafacial", "chemical-peels", "laser-resurfacing"],
    providers: ["maya-ferreira"],
    faqs: [
      { q: "Is IPL a laser?", a: "Technically no. It uses broad-spectrum light rather than a single wavelength. In practice it behaves like a gentle laser for pigment and redness." },
      { q: "How many sessions?", a: "Most people plan a series of 3 spaced a month apart, then one session a year to maintain." },
      { q: "Can I do this in summer?", a: "Only if you can avoid sun exposure before and after. Many Scottsdale clients schedule IPL from October to April." },
      { q: "Is it safe for my skin tone?", a: "IPL works best on lighter to medium skin tones. For deeper tones we recommend other options such as chemical peels or RF microneedling." },
      { q: "Will it help melasma?", a: "Sometimes it can make melasma worse. We assess it carefully and may recommend a different plan." },
    ],
    aftercare: "laser",
    image: "desert-01",
    imageAlt: "Warm Sonoran desert light across sand and saguaro at golden hour",
    featured: true,
    membershipEligible: true,
  },
  {
    slug: "laser-resurfacing",
    name: "Laser Resurfacing",
    shortName: "Resurfacing",
    category: "laser",
    benefit: "A fresh surface: smoother texture, softer lines, brighter tone.",
    summary:
      "Fractional laser resurfacing creates thousands of microscopic treatment columns that prompt new, healthier skin to replace old. Depth is adjustable from a light glow treatment to deeper renewal.",
    priceFrom: 650,
    priceUnit: "per session",
    priceLines: [
      { label: "Light fractional, full face", price: "$650" },
      { label: "Medium depth, full face", price: "$1,250" },
      { label: "Deep resurfacing, full face (with physician)", price: "$2,800" },
      { label: "Add neck or chest", price: "from $350" },
    ],
    spec: {
      duration: "45 to 90 min",
      discomfort: "Moderate, numbing and cooling",
      downtime: "3 to 7 days depending on depth",
      onset: "Glow at 1 week, remodeling to 3 months",
      longevity: "1 to 3 years with sun protection",
    },
    concerns: ["acne-texture", "lines-wrinkles", "pigmentation"],
    treats: ["Fine lines and crepiness", "Sun damage and dull tone", "Acne scarring", "Rough texture", "Enlarged pores"],
    howItWorks: [
      "The laser treats a fraction of the skin at a time, leaving healthy skin between columns. That surrounding tissue speeds healing while the treated columns are replaced with new collagen and fresh cells.",
      "We set depth based on your goals and your downtime tolerance. A light session looks like a weekend of pinkness. A deep session is a week of healing with a more dramatic change.",
    ],
    expect: {
      before: [
        "No sun exposure for 4 weeks. Stop retinoids and acids 7 days before.",
        "Antiviral medication is prescribed if you have a history of cold sores.",
        "Arrange a ride home for medium or deep treatments.",
      ],
      during: [
        "Topical numbing for 45 to 60 minutes, plus cold air during treatment.",
        "Passes across the face that feel like heat and prickling.",
        "Occlusive balm and cooling to finish.",
      ],
      after: [
        "Red, swollen and tender for 2 to 4 days. Skin then feels rough, like sandpaper, and flakes.",
        "Gentle cleansing and heavy moisturizer only. No active skincare for 1 to 2 weeks.",
        "Strict sun avoidance for 4 weeks. New skin burns easily.",
      ],
    },
    pairsWith: ["ipl-photofacial", "biostimulators", "neuromodulators"],
    providers: ["maya-ferreira", "elena-marsh"],
    faqs: [
      { q: "Ablative or non-ablative?", a: "We offer both. Non-ablative treatments heat below the surface with little downtime. Ablative treatments remove micro-columns of skin for a bigger change and more recovery. Your consult decides which fits." },
      { q: "How much downtime, honestly?", a: "Light: 2 days pink. Medium: 4 to 5 days of redness and flaking. Deep: a week at home. We will not understate it." },
      { q: "Is it safe for darker skin?", a: "Non-ablative fractional settings can be used carefully on medium skin tones. For deeper tones we often recommend RF microneedling instead." },
      { q: "How many sessions?", a: "One deep treatment or 3 to 4 lighter sessions. Many people prefer the lighter series to avoid a long recovery." },
      { q: "When will I see results?", a: "A glow appears once the flaking finishes at 1 week. Collagen remodeling continues for 3 months." },
    ],
    aftercare: "laser",
    image: "face-02",
    imageAlt: "Woman with clear, even-toned skin resting in warm afternoon light",
    featured: false,
    membershipEligible: true,
  },
  {
    slug: "hydrafacial",
    name: "HydraFacial",
    shortName: "HydraFacial",
    category: "skin",
    benefit: "Deep cleansing and hydration with zero downtime.",
    summary:
      "A medical-grade facial that cleanses, exfoliates, extracts and infuses in one pass using a vortex tip. Skin looks clearer and more hydrated the same day.",
    priceFrom: 225,
    priceUnit: "per session",
    priceLines: [
      { label: "Signature, 30 min", price: "$225" },
      { label: "Deluxe with booster and LED, 45 min", price: "$295" },
      { label: "Platinum with lymphatic drainage, 60 min", price: "$375" },
      { label: "Add lip or eye perk", price: "$50" },
    ],
    spec: {
      duration: "30 to 60 min",
      discomfort: "None, feels like a cool suction",
      downtime: "None",
      onset: "Immediate glow",
      longevity: "4 to 6 weeks, monthly recommended",
    },
    concerns: ["acne-texture", "pigmentation"],
    treats: ["Congested pores and blackheads", "Dullness and dehydration", "Oily or uneven texture", "Mild breakouts", "Pre-event glow"],
    howItWorks: [
      "A spiral tip glides across the skin, exfoliating with gentle acids, lifting debris out of the pores with suction, and pushing hydrating serums back in. Everything that comes out ends up in a small jar you can see.",
      "Boosters address specific goals such as brightening or calming. LED light finishes the treatment.",
    ],
    expect: {
      before: ["Skip retinoids for 2 days.", "No waxing or peels within a week.", "Arrive bare-faced if you can."],
      during: ["Cleanse and peel step.", "Painless extractions with the vortex tip.", "Serum infusion, then LED light."],
      after: ["Skin may look slightly pink for an hour.", "Makeup is fine right away.", "Skip exfoliants for 48 hours."],
    },
    pairsWith: ["neuromodulators", "ipl-photofacial", "chemical-peels"],
    providers: ["sofia-reyes"],
    faqs: [
      { q: "Is it good for sensitive skin?", a: "Yes. The tips and serums are adjustable, and the treatment is gentle enough for rosacea-prone skin with the right settings." },
      { q: "How often should I come?", a: "Monthly keeps skin consistently clear. Members receive one HydraFacial per month at Glow tier and above." },
      { q: "Can I do it before an event?", a: "It is one of the best pre-event treatments. Same-day or the day before is ideal." },
      { q: "Does it remove blackheads?", a: "Most surface congestion, yes. Deeper extractions can be added by your aesthetician if needed." },
      { q: "Is it safe during pregnancy?", a: "The Signature treatment without certain boosters is generally considered safe. Tell your aesthetician and we will adjust." },
    ],
    aftercare: "skin",
    image: "hands-01",
    imageAlt: "Hands applying a clear serum to skin beside a glass dropper bottle",
    featured: true,
    membershipEligible: true,
  },
  {
    slug: "chemical-peels",
    name: "Chemical Peels",
    shortName: "Peels",
    category: "skin",
    benefit: "Renews tone and texture, from a lunchtime glow to a deeper reset.",
    summary:
      "Medical-grade peels lift the dull outer layer of skin so brighter, smoother skin can come through. We offer light, medium and blended peels matched to your skin tone and downtime.",
    priceFrom: 175,
    priceUnit: "per session",
    priceLines: [
      { label: "Light peel (glycolic or lactic)", price: "$175" },
      { label: "Medium peel (blended TCA)", price: "$350" },
      { label: "Brightening peel for melasma and deeper tones", price: "$425" },
      { label: "Series of 3, light", price: "$450" },
    ],
    spec: {
      duration: "30 to 45 min",
      discomfort: "Mild tingling and heat",
      downtime: "0 to 5 days of flaking",
      onset: "Brighter at 1 week",
      longevity: "Monthly light or 2 to 3 medium a year",
    },
    concerns: ["pigmentation", "acne-texture"],
    treats: ["Dull, uneven tone", "Melasma and post-acne marks", "Fine lines", "Mild acne", "Rough texture on face, back and chest"],
    howItWorks: [
      "A measured solution of acids is applied to the skin for a set time. It loosens the bonds holding dead cells to the surface and signals the layers below to renew.",
      "Light peels barely flake. Medium peels shed visibly for a few days. Your provider chooses the formula and strength for your skin, which matters most for deeper skin tones.",
    ],
    expect: {
      before: ["Stop retinoids and acids for 5 days.", "No sun exposure for 2 weeks.", "Tell us about any recent antibiotics or isotretinoin."],
      during: ["Cleanse and degrease.", "Solution applied in layers with a fan to cool the tingling.", "Neutralize or leave on, depending on the peel."],
      after: ["Skin tight and slightly darker for 2 days, then flaking.", "Do not pick or exfoliate. Moisturize and use SPF.", "Brightness shows once flaking ends."],
    },
    pairsWith: ["hydrafacial", "microneedling-rf", "ipl-photofacial"],
    providers: ["sofia-reyes", "maya-ferreira"],
    faqs: [
      { q: "Will my face visibly peel?", a: "Light peels: rarely. Medium peels: yes, for 3 to 5 days. We tell you exactly what to expect before we apply anything." },
      { q: "Are peels safe for darker skin?", a: "Yes, with the right formulation. We use blended, lower-strength peels for deeper skin tones to avoid post-inflammatory darkening." },
      { q: "How many do I need?", a: "A series of 3 light peels a month apart is a common plan for tone. Medium peels are usually 2 to 3 times a year." },
      { q: "Can I combine with other treatments?", a: "Light peels pair well with HydraFacial in the same visit. Medium peels are spaced away from lasers." },
      { q: "Does it help melasma?", a: "Our brightening peel is designed for it, along with a home regimen. Melasma is managed, not cured, and sun protection is essential." },
    ],
    aftercare: "skin",
    image: "journal-01",
    imageAlt: "Minimal skincare bottles on a linen surface in soft daylight",
    featured: false,
    membershipEligible: true,
  },
  {
    slug: "laser-hair-removal",
    name: "Laser Hair Removal",
    shortName: "Hair Removal",
    category: "laser",
    benefit: "Long-term reduction, safe for a wide range of skin tones.",
    summary:
      "Our dual-wavelength laser targets the pigment in the hair follicle while a cooling tip protects the skin. Most people see significant reduction after a series of 6 to 8.",
    priceFrom: 95,
    priceUnit: "per session",
    priceLines: [
      { label: "Small area (lip, chin, underarms)", price: "$95" },
      { label: "Medium area (bikini, half arms, lower legs)", price: "$195" },
      { label: "Large area (full legs, back, chest)", price: "$395" },
      { label: "Series of 6, any area", price: "20% off" },
    ],
    spec: {
      duration: "15 to 60 min",
      discomfort: "Mild, quick warm snaps",
      downtime: "None",
      onset: "Shedding at 1 to 2 weeks",
      longevity: "Long-term after a series",
    },
    concerns: ["hair"],
    treats: ["Unwanted facial hair", "Underarms and bikini", "Legs and arms", "Back and chest", "Ingrown hairs"],
    howItWorks: [
      "The laser sends a pulse of light that is absorbed by pigment in the hair. The follicle heats and is damaged, which reduces future growth. A sapphire cooling tip keeps the skin comfortable.",
      "Hair grows in cycles, so a series of sessions 4 to 8 weeks apart is needed to catch each follicle in its active phase.",
    ],
    expect: {
      before: ["Shave the area within 24 hours. Do not wax or pluck for 4 weeks.", "No sun exposure or self-tanner for 2 weeks.", "Skip lotions and deodorant on the day."],
      during: ["Protective eyewear and a test spot on your first visit.", "Quick pulses across the area with cooling.", "Soothing gel to finish."],
      after: ["Mild redness for a few hours.", "Hair sheds over 1 to 2 weeks. It is not regrowth.", "Sunscreen on exposed areas between sessions."],
    },
    pairsWith: ["hydrafacial", "ipl-photofacial"],
    providers: ["maya-ferreira"],
    faqs: [
      { q: "Is it safe for darker skin?", a: "Yes. Our device includes an Nd:YAG wavelength designed for deeper skin tones. Settings are chosen per person after a test spot." },
      { q: "Does it work on light or gray hair?", a: "Laser targets pigment, so blonde, red and gray hair respond poorly. We will tell you honestly at your consult." },
      { q: "How many sessions?", a: "Six to eight for most areas, then occasional maintenance." },
      { q: "Is it permanent?", a: "The FDA term is permanent reduction. Most people see a large, lasting drop in hair with occasional touch-ups." },
      { q: "Does it hurt?", a: "A warm snap with each pulse. Cooling makes it very tolerable. Sensitive areas feel it more." },
    ],
    aftercare: "laser",
    image: "body-01",
    imageAlt: "Smooth skin on a shoulder and arm in warm, diffuse light",
    featured: false,
    membershipEligible: false,
  },
  {
    slug: "body-contouring",
    name: "Body Contouring",
    shortName: "Body",
    category: "body",
    benefit: "Reduces stubborn pockets and tightens skin, no surgery.",
    summary:
      "Non-surgical contouring for the areas diet and training do not reach. We combine fat reduction and skin tightening technologies, planned around your goals and your timeline.",
    priceFrom: 650,
    priceUnit: "per area",
    priceLines: [
      { label: "Fat reduction, per area", price: "$650 to $900" },
      { label: "Skin tightening, per area", price: "$450" },
      { label: "Package of 4 sessions, one area", price: "from $2,200" },
      { label: "Muscle stimulation, series of 4", price: "$2,400" },
    ],
    spec: {
      duration: "35 to 60 min",
      discomfort: "Mild, cold or warmth",
      downtime: "None to mild soreness",
      onset: "6 to 12 weeks",
      longevity: "Lasting with stable weight",
    },
    concerns: ["body"],
    treats: ["Lower abdomen and flanks", "Inner and outer thighs", "Under the chin", "Upper arms", "Loose skin after weight change"],
    howItWorks: [
      "Fat reduction devices cool or heat fat cells to a temperature that damages them while sparing skin and muscle. Your body clears those cells naturally over the following weeks.",
      "Skin tightening uses radiofrequency to warm the deeper layers so collagen contracts and rebuilds. Muscle stimulation adds tone. Most plans combine two of the three.",
    ],
    expect: {
      before: ["Hydrate well and eat lightly beforehand.", "Wear comfortable clothing.", "Tell us about hernias, implants or recent surgery."],
      during: ["Measurements and photos.", "Applicator placed on the area for 35 to 45 minutes. You can read or rest.", "Brief massage of the area afterward."],
      after: ["Numbness, tingling or soreness for a few days is normal.", "Resume normal activity right away.", "Results show gradually over 6 to 12 weeks."],
    },
    pairsWith: ["microneedling-rf", "medical-weight-loss"],
    providers: ["maya-ferreira", "elena-marsh"],
    faqs: [
      { q: "Is this a weight-loss treatment?", a: "No. It is for people near their goal weight with specific areas that persist. For weight management, see our medical weight loss program." },
      { q: "How much reduction can I expect?", a: "Studies of these devices typically report a 20 to 25 percent reduction in fat thickness per treated area per session. Individual results vary." },
      { q: "Does it hurt?", a: "Cooling treatments feel intensely cold for the first few minutes, then numb. Heat-based treatments feel like a warm stone massage." },
      { q: "How many sessions?", a: "One to three per area for fat reduction, four to six for skin tightening." },
      { q: "Are results permanent?", a: "Treated fat cells do not return. Remaining cells can still grow if weight changes, so stable habits protect the result." },
    ],
    aftercare: "body",
    image: "body-01",
    imageAlt: "Calm treatment room with a contouring device beside a linen-covered bed",
    featured: true,
    membershipEligible: false,
  },
  {
    slug: "iv-therapy",
    name: "IV Therapy",
    shortName: "IV",
    category: "wellness",
    benefit: "Hydration and vitamins, delivered where the body can use them.",
    summary:
      "Physician-designed IV drips for hydration, recovery, immune support and skin. Administered by a registered nurse in a private lounge with a blanket and a good chair.",
    priceFrom: 175,
    priceUnit: "per drip",
    priceLines: [
      { label: "Hydrate (1L saline with electrolytes)", price: "$175" },
      { label: "Recover (B-complex, magnesium, anti-nausea)", price: "$225" },
      { label: "Glow (glutathione, vitamin C, biotin)", price: "$275" },
      { label: "Immune (high-dose vitamin C, zinc)", price: "$250" },
      { label: "NAD+ (250 to 500 mg)", price: "from $395" },
    ],
    spec: {
      duration: "45 to 90 min",
      discomfort: "Minimal, one small needle",
      downtime: "None",
      onset: "Same day",
      longevity: "Days to weeks",
    },
    concerns: ["body"],
    treats: ["Dehydration and jet lag", "Post-event recovery", "Low energy", "Immune support during travel", "Dull skin"],
    howItWorks: [
      "Fluids and nutrients go directly into the bloodstream, bypassing digestion. That allows higher doses of some vitamins than the gut can absorb, and hydration that takes effect quickly.",
      "Every drip is reviewed by our medical director and started by a nurse after a brief screening.",
    ],
    expect: {
      before: ["Eat a light meal beforehand.", "Complete the short health screening.", "Wear something with sleeves that push up easily."],
      during: ["A nurse places a small IV line, usually in the forearm.", "Drip runs 45 to 90 minutes in the lounge.", "Water, tea and Wi-Fi provided."],
      after: ["A small bandage over the site for an hour.", "Most people feel the hydration the same day.", "Normal activity right away."],
    },
    pairsWith: ["medical-weight-loss", "hydrafacial"],
    providers: ["maya-ferreira", "elena-marsh"],
    faqs: [
      { q: "Is it safe?", a: "IV therapy is administered by a registered nurse under physician protocols with a screening first. Certain conditions, such as kidney disease or heart failure, rule it out." },
      { q: "How long does it take?", a: "Forty-five minutes for a basic drip, up to 90 minutes for NAD+." },
      { q: "Can I book a mobile visit?", a: "Not currently. All drips are in our lounge." },
      { q: "How often?", a: "Some clients come monthly, others before travel or events. There is no required schedule." },
      { q: "Will it cure a hangover?", a: "It may help with dehydration and nausea. It is not a treatment for alcohol use, and we will say so if that is the pattern we see." },
    ],
    aftercare: "wellness",
    image: "iv-01",
    imageAlt: "Quiet wellness lounge with a soft chair, a blanket and warm afternoon light",
    featured: false,
    membershipEligible: true,
  },
  {
    slug: "medical-weight-loss",
    name: "Medical Weight Loss",
    shortName: "Weight Loss",
    category: "wellness",
    benefit: "GLP-1 therapy with a physician, monthly check-ins and no gimmicks.",
    summary:
      "A physician-supervised program using GLP-1 medications such as semaglutide or tirzepatide, paired with labs, nutrition guidance and monthly visits. Built for steady, sustainable change.",
    priceFrom: 349,
    priceUnit: "per month",
    priceLines: [
      { label: "Initial visit with labs", price: "$199" },
      { label: "Semaglutide program, per month", price: "$349" },
      { label: "Tirzepatide program, per month", price: "$549" },
      { label: "Monthly check-in and body composition scan", price: "included" },
    ],
    spec: {
      duration: "45 min first visit, 20 min monthly",
      discomfort: "Weekly self-injection, tiny needle",
      downtime: "None",
      onset: "Appetite changes in 1 to 2 weeks",
      longevity: "Ongoing with monitoring",
    },
    concerns: ["body"],
    treats: ["Weight that resists diet and exercise", "Constant hunger and cravings", "Plateaus", "Metabolic markers with physician oversight"],
    howItWorks: [
      "GLP-1 medications mimic a hormone your gut releases after eating. They slow stomach emptying and signal fullness to the brain, so smaller portions feel satisfying.",
      "Our program adds what the medication alone cannot: baseline labs, a protein and strength plan to protect muscle, monthly body composition scans and a physician who adjusts the dose.",
    ],
    expect: {
      before: ["Complete the intake and fasting labs.", "Bring a list of current medications.", "Think about your goals beyond the scale."],
      during: ["A 45-minute visit with the physician covering history, labs and expectations.", "First injection taught in the clinic.", "A written plan for food, protein and movement."],
      after: ["Weekly injections at home.", "Monthly check-ins, scans and dose adjustments.", "Side effects such as nausea are managed early and usually fade."],
    },
    pairsWith: ["body-contouring", "iv-therapy"],
    providers: ["elena-marsh"],
    faqs: [
      { q: "Who is a candidate?", a: "Adults with a BMI of 30 or higher, or 27 with a related condition, who are not pregnant and have no history of certain thyroid or pancreatic conditions. The physician confirms at your first visit." },
      { q: "How much weight will I lose?", a: "Clinical trials of these medications report average losses of 12 to 20 percent of body weight over a year with lifestyle support. Individual results vary, and we do not promise a number." },
      { q: "What are the side effects?", a: "Nausea, constipation and fatigue are most common in the first weeks. Slow dose increases and eating smaller meals help. Rare but serious risks are reviewed with you in person." },
      { q: "Do I have to stay on it forever?", a: "Some people taper off after reaching a goal with strong habits in place. Others stay on a maintenance dose. Your physician makes that decision with you." },
      { q: "Is the medication included?", a: "Yes. The monthly price includes medication, supplies, the check-in and the scan." },
    ],
    aftercare: "wellness",
    image: "team-01",
    imageAlt: "Physician in a white coat speaking with a patient across a warm wooden desk",
    featured: false,
    membershipEligible: false,
  },
];

export const getTreatment = (slug: string) => treatments.find((t) => t.slug === slug);
export const featuredTreatments = treatments.filter((t) => t.featured);
export const treatmentsByCategory = (c: TreatmentCategory) => treatments.filter((t) => t.category === c);
export const treatmentsForConcern = (c: ConcernSlug) => treatments.filter((t) => t.concerns.includes(c));

export const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`;
