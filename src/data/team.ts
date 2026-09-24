// Fictional providers for the demo brand. Swap with real team members.

export interface Provider {
  slug: string;
  name: string;
  credentials: string;
  role: string;
  isPhysician: boolean;
  image: string;
  imageAlt: string;
  quote: string;
  bio: string[];
  focus: string[];
  training: string[];
  treatments: string[];
  bookable: boolean;
}

export const team: Provider[] = [
  {
    slug: "elena-marsh",
    name: "Dr. Elena Marsh",
    credentials: "MD",
    role: "Medical Director",
    isPhysician: true,
    image: "team-01",
    imageAlt: "Dr. Elena Marsh, medical director, in a white coat against a neutral background",
    quote: "The best compliment a patient can get is that they look rested. Not different. Rested.",
    bio: [
      "Dr. Marsh is board-certified in Internal Medicine and has practiced aesthetic medicine for fourteen years. She founded Velmora in 2019 after a decade in hospital medicine convinced her that aesthetics deserved the same rigor as any other specialty.",
      "She reviews every treatment protocol, personally performs deeper resurfacing and biostimulator treatments, and leads the medical weight loss program. She is a member of the American Society for Laser Medicine and Surgery.",
    ],
    focus: ["Full-face planning", "Sculptra", "Deep laser resurfacing", "Medical weight loss"],
    training: ["MD, University of Arizona College of Medicine", "Residency, Internal Medicine, Mayo Clinic Arizona", "Advanced injectables faculty, multiple national trainings"],
    treatments: ["neuromodulators", "dermal-fillers", "biostimulators", "laser-resurfacing", "body-contouring", "iv-therapy", "medical-weight-loss"],
    bookable: true,
  },
  {
    slug: "nora-quinlan",
    name: "Nora Quinlan",
    credentials: "NP-C",
    role: "Lead Injector, Nurse Practitioner",
    isPhysician: false,
    image: "team-02",
    imageAlt: "Nora Quinlan, nurse practitioner and lead injector, in scrubs",
    quote: "Two weeks later, no one should be able to name what changed. They should just notice you.",
    bio: [
      "Nora has performed injectable treatments for eleven years and trains other injectors nationally. Her approach is structural: she treats the cause of a shadow or fold, not the fold itself.",
      "Patients come to her for cheek and jawline work that reads as bone, not filler, and for conservative neuromodulator dosing that preserves expression.",
    ],
    focus: ["Cheek and jawline structure", "Under-eye", "Lips", "Natural neuromodulator dosing"],
    training: ["MSN, Arizona State University", "Certified injector trainer", "Advanced cannula technique certification"],
    treatments: ["neuromodulators", "dermal-fillers", "lip-enhancement", "biostimulators"],
    bookable: true,
  },
  {
    slug: "daniel-oyelaran",
    name: "Daniel Oyelaran",
    credentials: "PA-C",
    role: "Physician Associate, Injectables",
    isPhysician: false,
    image: "team-03",
    imageAlt: "Daniel Oyelaran, physician associate, in a dark clinical top",
    quote: "Men want to look like they slept well and stopped squinting. That is a very achievable brief.",
    bio: [
      "Daniel spent six years in dermatology before moving into aesthetics. He leads our men's aesthetics program, from masseter treatment for jaw tension to conservative filler for a stronger jawline.",
      "He is known for precise neuromodulator mapping and for saying no when a treatment will not help.",
    ],
    focus: ["Men's aesthetics", "Masseter and jawline", "Neuromodulators", "Chin and profile balancing"],
    training: ["MPAS, Midwestern University", "Dermatology PA, 6 years", "Facial anatomy cadaver lab, annual"],
    treatments: ["neuromodulators", "dermal-fillers", "lip-enhancement"],
    bookable: true,
  },
  {
    slug: "maya-ferreira",
    name: "Maya Ferreira",
    credentials: "RN, CLT",
    role: "Laser & Device Specialist, Registered Nurse",
    isPhysician: false,
    image: "team-04",
    imageAlt: "Maya Ferreira, registered nurse and laser specialist, in a linen top",
    quote: "Every device has a sweet spot. My job is finding yours, safely, on the first try.",
    bio: [
      "Maya is a certified laser technician and registered nurse with nine years on energy-based devices. She runs our IPL, resurfacing, RF microneedling, hair removal, body contouring and IV programs.",
      "She is meticulous about test spots, skin-type assessment and honest downtime estimates.",
    ],
    focus: ["IPL and laser", "RF microneedling", "Body contouring", "IV therapy"],
    training: ["BSN, Grand Canyon University", "Certified Laser Technician", "Advanced device training across four platforms"],
    treatments: ["microneedling-rf", "ipl-photofacial", "laser-resurfacing", "laser-hair-removal", "body-contouring", "iv-therapy", "chemical-peels"],
    bookable: true,
  },
  {
    slug: "sofia-reyes",
    name: "Sofia Reyes",
    credentials: "LE, LMT",
    role: "Medical Aesthetician",
    isPhysician: false,
    image: "team-05",
    imageAlt: "Sofia Reyes, medical aesthetician, in a soft sand-colored uniform",
    quote: "Skin is a habit. I help people build one they can actually keep.",
    bio: [
      "Sofia is a licensed medical aesthetician with twelve years of experience in clinical skincare. She leads HydraFacial, peels and the skin health side of RF microneedling, and designs every home regimen we recommend.",
      "Patients describe her treatments as the calmest hour of their month.",
    ],
    focus: ["HydraFacial", "Chemical peels", "Home skincare plans", "Pre- and post-treatment care"],
    training: ["Licensed Esthetician, Arizona", "Licensed Massage Therapist", "Medical skincare certification"],
    treatments: ["hydrafacial", "chemical-peels", "microneedling-rf"],
    bookable: true,
  },
];

export const getProvider = (slug: string) => team.find((p) => p.slug === slug);
export const providersFor = (treatmentSlug: string) => team.filter((p) => p.treatments.includes(treatmentSlug));
