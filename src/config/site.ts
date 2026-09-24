// Single source of truth for brand data. Swap a real client in here.
// Nothing brand-specific should be hard-coded anywhere else in src/.

export const site = {
  name: "Velmora Aesthetics",
  shortName: "Velmora",
  legalName: "Velmora Aesthetics, PLLC",
  tagline: "Medical precision. Hotel calm.",
  description:
    "Physician-led medical spa in Scottsdale, Arizona. Injectables, skin rejuvenation, laser, body contouring and wellness, planned around natural-looking results.",
  url: import.meta.env.PUBLIC_SITE_URL || "https://velmora-aesthetics.com",
  locale: "en-US",
  founded: 2019,

  phone: "(480) 555-0142",
  phoneHref: "tel:+14805550142",
  email: "hello@velmora-aesthetics.com",
  address: {
    street: "7150 E Camelback Rd, Suite 240",
    city: "Scottsdale",
    region: "AZ",
    postalCode: "85251",
    country: "US",
    // Fictional coordinates near Old Town Scottsdale.
    lat: 33.5019,
    lng: -111.9264,
    mapsUrl: "https://maps.google.com/?q=7150+E+Camelback+Rd+Scottsdale+AZ+85251",
    neighborhood: "Old Town Scottsdale",
  },

  // Hours drive the booking-flow time slots. 24h clock, local time.
  timezone: "America/Phoenix",
  hours: [
    { day: "Monday", open: "09:00", close: "18:00" },
    { day: "Tuesday", open: "09:00", close: "18:00" },
    { day: "Wednesday", open: "09:00", close: "19:00" },
    { day: "Thursday", open: "09:00", close: "19:00" },
    { day: "Friday", open: "09:00", close: "17:00" },
    { day: "Saturday", open: "09:00", close: "14:00" },
    { day: "Sunday", open: null, close: null },
  ] as const,
  slotMinutes: 30,

  socials: [
    { label: "Instagram", href: "https://instagram.com/velmora.aesthetics", handle: "@velmora.aesthetics" },
    { label: "TikTok", href: "https://tiktok.com/@velmora.aesthetics", handle: "@velmora.aesthetics" },
    { label: "Facebook", href: "https://facebook.com/velmoraaesthetics", handle: "Velmora Aesthetics" },
  ],

  medicalDirector: {
    name: "Dr. Elena Marsh, MD",
    slug: "elena-marsh",
    title: "Medical Director, board-certified in Internal Medicine",
  },

  consult: {
    virtualLabel: "Free 20-minute virtual consultation",
    inPersonLabel: "$50 in-person consultation, credited toward treatment",
    inPersonFee: 50,
  },

  financing: ["Cherry", "PatientFi"],
  minimumAge: 18,

  stats: [
    { value: "7", suffix: "yrs", label: "In Scottsdale" },
    { value: "24,000", suffix: "+", label: "Treatments performed" },
    { value: "4.9", suffix: "", label: "Average rating, 1,140 reviews" },
    { value: "100", suffix: "%", label: "FDA-cleared devices" },
  ],

  colors: {
    // Mirrors src/styles/tokens.css for OG images and JSON-LD; edit both together.
    bone: "#f5f0e8",
    espresso: "#221b17",
    champagne: "#b8946a",
  },
} as const;

export type Site = typeof site;

export function isOpenOn(dayIndex: number): boolean {
  const d = site.hours[(dayIndex + 6) % 7]; // JS Sunday=0 -> our array Monday=0
  return d.open !== null;
}
