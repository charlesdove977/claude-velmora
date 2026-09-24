export interface AftercareGuide {
  slug: string;
  name: string;
  applies: string;
  intro: string;
  first24: string[];
  firstWeek: string[];
  avoid: string[];
  callUs: string[];
  products: string[];
}

export const aftercare: AftercareGuide[] = [
  {
    slug: "injectables",
    name: "Injectables aftercare",
    applies: "Botox, Dysport, dermal fillers, lip enhancement, Sculptra, Radiesse",
    intro: "Most injectable aftercare comes down to two things: leave the area alone, and give swelling time. Here is the full picture.",
    first24: [
      "Stay upright for 4 hours after neuromodulators. No lying face-down, no hats that press on the forehead.",
      "Skip strenuous exercise, saunas, hot yoga and alcohol for 24 hours. Heat and blood flow increase swelling and bruising.",
      "Do not rub, massage or press the treated area unless your provider gave you specific massage instructions (Sculptra).",
      "Ice in 10-minute intervals through a clean cloth if the area feels swollen.",
      "Sleep on your back with your head slightly raised the first night after filler.",
    ],
    firstWeek: [
      "Swelling after filler peaks at 24 to 48 hours and settles over 1 to 2 weeks. Lips take the longest.",
      "Small bruises may appear a day later. Arnica, available at the front desk, may help them fade.",
      "Neuromodulators begin working at 3 to 7 days and are fully settled at 14. Your 2-week review is the right time to judge balance.",
      "Sculptra: massage 5 minutes, 5 times a day, for 5 days. Do not skip this.",
      "Avoid facials, peels, microneedling and dental work for 2 weeks after filler.",
    ],
    avoid: ["Blood thinners such as aspirin, ibuprofen and fish oil for 24 hours unless prescribed", "Makeup over injection sites for 12 hours", "Flying within 24 hours after filler if avoidable", "Sun and tanning for a week after filler"],
    callUs: [
      "Skin that turns white, dusky, purple or net-like after filler, or increasing pain out of proportion to swelling. Call immediately, day or night.",
      "Vision changes of any kind after filler. Call immediately and go to an emergency department.",
      "A drooping eyelid or uneven brow after neuromodulators. This is uncommon, temporary and often treatable.",
      "Firm lumps that persist past 2 weeks.",
    ],
    products: ["Gentle cleanser", "Arnica gel or tablets", "Mineral SPF 30+"],
  },
  {
    slug: "skin",
    name: "Skin treatment aftercare",
    applies: "RF microneedling, HydraFacial, chemical peels",
    intro: "Your skin has been asked to renew itself. For the next few days, the job is to protect it, keep it hydrated and let it do the work.",
    first24: [
      "Cleanse only with the gentle cleanser we send home. Lukewarm water, fingertips, pat dry.",
      "Apply the barrier balm every few hours after RF microneedling or a medium peel. The skin should feel coated, not tight.",
      "No makeup for 24 hours after RF microneedling or medium peels. HydraFacial clients may apply makeup right away.",
      "Skip exercise, saunas and hot showers for 24 hours. Sweat on open skin stings and can irritate.",
    ],
    firstWeek: [
      "Redness after RF microneedling fades over 24 to 72 hours. Tiny grid marks and mild flaking are normal through day 5.",
      "Peels: skin darkens and tightens on day 2, then flakes for 3 to 5 days. Do not pick, scrub or peel it manually.",
      "Introduce moisturizer on day 2 and sunscreen from the first morning you go outside.",
      "Resume retinoids and acids after 7 days for RF microneedling and medium peels, 48 hours after HydraFacial or light peels.",
    ],
    avoid: ["Direct sun for 2 weeks; wear a hat", "Exfoliants, scrubs, retinoids, vitamin C serums until cleared", "Swimming pools and hot tubs for 5 days", "Waxing or dermaplaning for 2 weeks"],
    callUs: ["Blistering, oozing or crusting beyond mild flaking", "Increasing redness, warmth or pain after day 3", "Any sign of a cold sore around the mouth", "Dark patches that appear after a peel"],
    products: ["Gentle cleanser", "Barrier balm", "Fragrance-free moisturizer", "Mineral SPF 30+ reapplied every 2 hours outdoors"],
  },
  {
    slug: "laser",
    name: "Laser & light aftercare",
    applies: "IPL photofacial, laser resurfacing, laser hair removal",
    intro: "Light-based treatments leave the skin sensitive to sun for weeks. Protection is not optional. It is the treatment.",
    first24: [
      "Cool compresses for comfort. No ice directly on the skin.",
      "IPL: skin may feel like a mild sunburn. Aloe or the balm we provide is enough.",
      "Resurfacing: keep the skin coated with the occlusive balm at all times for the first 3 days. Cleanse gently 2 to 3 times a day with the provided cleanser.",
      "Hair removal: mild redness and bumps around follicles fade within hours. Aloe helps. Loose clothing over treated areas.",
    ],
    firstWeek: [
      "IPL: spots darken like coffee grounds and flake off over 7 to 10 days. Let them fall off on their own.",
      "Resurfacing: swelling peaks at day 2, skin feels rough like sandpaper from day 3, and flakes through day 7. Moisturize heavily.",
      "Hair removal: treated hair sheds over 1 to 2 weeks. Gentle exfoliation after 5 days helps it release.",
      "Makeup after IPL is fine the next day. After resurfacing, wait until the skin is fully closed, usually day 5 to 7.",
    ],
    avoid: ["Sun exposure for 4 weeks; new skin burns easily", "Self-tanner for 2 weeks", "Retinoids, acids and scrubs for 1 to 2 weeks", "Hot showers, saunas and pools for 5 days after resurfacing", "Shaving over treated hair-removal areas for 3 days"],
    callUs: ["Blistering or open areas", "Signs of infection: increasing pain, warmth, yellow crust", "A cold sore forming after resurfacing", "Pigment that looks darker or lighter than surrounding skin after 2 weeks"],
    products: ["Occlusive healing balm", "Gentle cleanser", "Aloe or soothing gel", "Mineral SPF 50 for resurfacing"],
  },
  {
    slug: "body",
    name: "Body contouring aftercare",
    applies: "Fat reduction, RF skin tightening, muscle stimulation",
    intro: "Body treatments have almost no downtime. What they need is time, hydration and normal movement.",
    first24: [
      "Numbness, tingling, redness or firmness in the treated area is expected and can last several days after fat reduction.",
      "Drink plenty of water. Your body clears treated fat cells through the lymphatic system.",
      "Resume normal activity right away. Walking helps.",
      "Muscle stimulation: expect soreness similar to a strong workout.",
    ],
    firstWeek: [
      "Gentle massage of the area for 5 minutes twice a day after fat reduction may help.",
      "Mild bruising or sensitivity fades within 1 to 2 weeks.",
      "Skin tightening: results build over 6 to 12 weeks as collagen remodels.",
      "Sessions are spaced 4 to 8 weeks apart. Your provider sets the schedule.",
    ],
    avoid: ["Very hot baths on the treated area for 48 hours", "Anti-inflammatory medication for a week after fat reduction, if your physician allows, since inflammation is part of the process", "Major weight changes during a treatment series"],
    callUs: ["Severe pain, swelling that keeps increasing after day 3", "An area that becomes firm and enlarged weeks later", "Skin changes such as blistering or discoloration"],
    products: ["Water, and more water", "Compression garment if provided", "Fragrance-free moisturizer"],
  },
  {
    slug: "wellness",
    name: "IV therapy & weight loss aftercare",
    applies: "IV drips, NAD+, GLP-1 weight management",
    intro: "Wellness treatments are gentle by design. A few habits make them work better and more comfortably.",
    first24: [
      "IV: keep the bandage on for an hour. Mild bruising at the site is possible. Drink water through the day.",
      "NAD+: some people feel tired or flushed for a few hours. Rest if you need to.",
      "GLP-1: inject at the same time each week. Eat small, protein-forward meals and stop when you feel satisfied.",
    ],
    firstWeek: [
      "GLP-1 nausea is most common in the first 2 weeks and after each dose increase. Ginger tea, small meals and avoiding fatty foods help. Tell us if it does not settle.",
      "Constipation is common. Fiber, water and daily walking prevent most of it.",
      "Protein target: about 0.7 to 1 gram per pound of goal body weight, spread across the day. Strength training 2 to 3 times a week protects muscle.",
    ],
    avoid: ["Alcohol on injection day", "Skipping meals entirely, which worsens nausea", "Doubling a missed dose; take it if within 5 days, otherwise skip", "Sharing or reusing needles"],
    callUs: ["Severe abdominal pain, especially radiating to the back", "Vomiting that prevents fluids for 24 hours", "Signs of allergic reaction: hives, swelling, difficulty breathing (call 911)", "Persistent dizziness or fainting"],
    products: ["Electrolyte packets", "Ginger chews", "A protein plan, which we provide", "Sharps container, which we provide"],
  },
];

export const getAftercare = (slug: string) => aftercare.find((a) => a.slug === slug);
