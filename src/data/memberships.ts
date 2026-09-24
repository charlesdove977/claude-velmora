export interface Membership {
  slug: string;
  name: string;
  monthly: number;
  annual: number;
  tagline: string;
  bestFor: string;
  includes: string[];
  savings: string;
  savingsMath: string;
  highlight: boolean;
}

export const memberships: Membership[] = [
  {
    slug: "glow",
    name: "Glow",
    monthly: 199,
    annual: 2148,
    tagline: "A monthly facial and member pricing on everything else.",
    bestFor: "Skin maintenance and a consistent routine.",
    includes: [
      "One Signature HydraFacial or light peel each month",
      "10% off all injectables and laser",
      "15% off medical-grade skincare",
      "Priority booking",
      "Unused facials roll over for 60 days",
    ],
    savings: "Save $312 a year",
    savingsMath: "12 facials at $225 is $2,700. Glow is $2,388 a year and includes 10% off everything else.",
    highlight: false,
  },
  {
    slug: "refine",
    name: "Refine",
    monthly: 349,
    annual: 3768,
    tagline: "Injectables banked monthly, so maintenance is already paid for.",
    bestFor: "Regular Botox or filler plus a monthly facial.",
    includes: [
      "Everything in Glow",
      "$200 monthly credit banked toward injectables, laser and body",
      "15% off all injectables and laser",
      "One complimentary IPL or peel per year",
      "Two guest passes for a Signature HydraFacial",
    ],
    savings: "Save $840+ a year",
    savingsMath: "$2,400 in banked credit plus 12 facials worth $2,700 for $4,188 a year. Most Refine members also save $300 to $600 a year from the 15% discount.",
    highlight: true,
  },
  {
    slug: "reserve",
    name: "Reserve",
    monthly: 649,
    annual: 6988,
    tagline: "A full annual plan, designed with Dr. Marsh, at the deepest member pricing.",
    bestFor: "Comprehensive plans that combine injectables, laser and biostimulators.",
    includes: [
      "Everything in Refine",
      "$450 monthly credit banked toward any treatment",
      "20% off all treatments",
      "Annual planning visit with the medical director",
      "Quarterly body composition scan and IV drip",
      "Concierge scheduling and same-week appointments",
    ],
    savings: "Save $1,900+ a year",
    savingsMath: "$5,400 in banked credit, 12 facials worth $2,700, and four IV drips worth $900 for $7,788 a year, before the 20% discount.",
    highlight: false,
  },
];

export const membershipFaqs = [
  { q: "Is there a contract?", a: "Memberships run month to month with a 3-month minimum. Cancel any time after that with 30 days' notice." },
  { q: "Do banked credits expire?", a: "Credits roll over for 12 months from the date they are banked. Facials roll over for 60 days." },
  { q: "Can I pause?", a: "Yes. One pause of up to 60 days per year, for travel, surgery or pregnancy." },
  { q: "Can I share with a partner?", a: "Guest passes can be used by anyone. Banked credits are for the member only." },
  { q: "Can I upgrade mid-year?", a: "Any time. Your credits carry over, and the new tier starts on your next billing date." },
  { q: "Are memberships eligible for financing?", a: "Annual prepay is eligible for Cherry and PatientFi. Monthly billing is by card on file." },
];
