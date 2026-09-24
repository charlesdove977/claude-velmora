export type FaqCategory =
  | "Booking & changes"
  | "Before your visit"
  | "Aftercare"
  | "Billing & membership"
  | "Policies"
  | "Treatments & safety";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
  top?: boolean;
}

export const faqCategories: { name: FaqCategory; blurb: string; href: string }[] = [
  { name: "Booking & changes", blurb: "Consultations, rescheduling, running late.", href: "/faq#booking-changes" },
  { name: "Before your visit", blurb: "What to stop, what to bring, what to expect.", href: "/faq#before-your-visit" },
  { name: "Aftercare", blurb: "Guides for every treatment category.", href: "/support#aftercare" },
  { name: "Billing & membership", blurb: "Pricing, financing, credits, cancellations.", href: "/faq#billing-membership" },
  { name: "Policies", blurb: "Deposits, refunds, age requirements, privacy.", href: "/support/policies" },
  { name: "Treatments & safety", blurb: "Who performs what, and how we keep it safe.", href: "/faq#treatments-safety" },
];

export const faqs: FaqItem[] = [
  { id: "consult-cost", category: "Booking & changes", top: true, q: "How much is a consultation?", a: "Virtual consultations are free and take about 20 minutes. In-person consultations are $50, and that amount is credited toward any treatment you book within 60 days." },
  { id: "book-online", category: "Booking & changes", top: true, q: "Can I book online?", a: "Yes. The booking page lets you choose a treatment or consultation, a provider, a date and a time. You will receive an email confirmation and a calendar file within a few minutes." },
  { id: "reschedule", category: "Booking & changes", top: true, q: "How do I reschedule or cancel?", a: "Reply to your confirmation email, call us, or use the link in your reminder text. We ask for 24 hours' notice. Changes with less notice may forfeit the deposit." },
  { id: "late", category: "Booking & changes", q: "What if I am running late?", a: "Call us. We hold your appointment for 10 minutes. After that we may need to shorten the treatment or reschedule, so the next person is not kept waiting." },
  { id: "same-day", category: "Booking & changes", q: "Do you take same-day appointments?", a: "Sometimes, especially for HydraFacial, IV therapy and neuromodulators. Call for availability. Reserve members receive priority same-week scheduling." },
  { id: "virtual-consult", category: "Booking & changes", q: "What happens on a virtual consultation?", a: "A provider reviews your goals and photos over video, explains options, and gives an honest cost estimate. If you decide to proceed, we book your treatment visit before the call ends." },

  { id: "prep-general", category: "Before your visit", top: true, q: "What should I avoid before an injectable appointment?", a: "If your physician allows, skip alcohol, aspirin, ibuprofen, fish oil and vitamin E for 24 to 72 hours to reduce bruising. Arrive with a clean face. Eat a normal meal beforehand." },
  { id: "prep-laser", category: "Before your visit", q: "Can I get laser treatment if I have a tan?", a: "No. Tanned or recently sun-exposed skin cannot be treated safely with IPL or most lasers. Avoid sun and self-tanner for 2 to 4 weeks before, depending on the treatment." },
  { id: "bring", category: "Before your visit", q: "What should I bring?", a: "A photo ID, a list of current medications and supplements, and, for filler consultations, a few photos of yourself from 5 to 10 years ago if you have them." },
  { id: "pregnancy", category: "Before your visit", q: "Can I be treated if I am pregnant or breastfeeding?", a: "Injectables, lasers, peels and weight-loss medication are not offered during pregnancy or breastfeeding. A Signature HydraFacial without certain boosters is generally considered safe. Please tell us, and we will adapt your plan." },
  { id: "first-visit", category: "Before your visit", q: "What happens at my first visit?", a: "You will complete a short medical history, meet your provider, take baseline photos and review a written plan with pricing before anything is done. There is no pressure to proceed the same day." },
  { id: "numbing", category: "Before your visit", q: "Do you use numbing?", a: "Yes. Topical numbing is included for filler, lips, RF microneedling and resurfacing. Ice and vibration are available for neuromodulators." },

  { id: "aftercare-botox", category: "Aftercare", top: true, q: "What should I avoid after Botox?", a: "Stay upright for 4 hours. Skip strenuous exercise, saunas, facials and rubbing the area for 24 hours. Small bumps fade in about 30 minutes." },
  { id: "aftercare-filler", category: "Aftercare", q: "How long will swelling last after filler?", a: "One to three days for most areas. Lips can swell for up to a week. Judge your result at 2 weeks, not day 2." },
  { id: "aftercare-laser", category: "Aftercare", q: "How do I care for my skin after a laser or peel?", a: "Gentle cleanser, the balm we provide, and strict sunscreen. No exfoliants, retinoids or makeup until the skin has closed, typically 24 to 72 hours. Full guides are in our aftercare section." },
  { id: "aftercare-worried", category: "Aftercare", q: "What if something does not look right?", a: "Call us. A provider is available for post-treatment concerns every day, including weekends. Increasing pain, blanching, or skin that turns white or dusky after filler needs a same-day call." },

  { id: "pricing", category: "Billing & membership", top: true, q: "Do you publish pricing?", a: "Yes. Every treatment page shows starting prices and typical ranges, and the pricing page lists everything. Your written plan shows the exact number before treatment." },
  { id: "financing", category: "Billing & membership", top: true, q: "Do you offer financing?", a: "Yes. We partner with Cherry and PatientFi for monthly payment plans, with approval decisions in minutes and no impact to your credit score to check eligibility." },
  { id: "payment", category: "Billing & membership", q: "What payment methods do you accept?", a: "All major credit cards, debit cards, HSA and FSA cards for eligible services, Cherry and PatientFi. We do not accept checks or insurance." },
  { id: "insurance", category: "Billing & membership", q: "Do you accept insurance?", a: "No. Aesthetic treatments are not covered by insurance. Some medical weight loss lab work may be submitted to your insurer on request." },
  { id: "membership-cancel", category: "Billing & membership", q: "How do I cancel a membership?", a: "Email or call us with 30 days' notice after the 3-month minimum. Banked credits remain available for 12 months from the date they were earned." },
  { id: "gift", category: "Billing & membership", q: "Do you sell gift cards?", a: "Yes. Request one on the gift card page in any amount from $100, delivered by email or as a printed card at the front desk." },

  { id: "deposit", category: "Policies", top: true, q: "Do you require a deposit?", a: "A $50 deposit holds treatment appointments over 30 minutes. It is applied to your service. Deposits are refundable with 24 hours' notice." },
  { id: "age", category: "Policies", q: "Is there a minimum age?", a: "Yes. Clients must be 18 or older for all treatments. Photo ID is checked at the first visit." },
  { id: "refunds", category: "Policies", q: "Do you offer refunds?", a: "Treatment fees are not refundable once a service is performed. Unused packages and prepaid series may be refunded within 30 days minus services used. Skincare products are exchangeable unopened within 14 days." },
  { id: "guests", category: "Policies", q: "Can I bring children or guests?", a: "For safety and calm, we ask that children not attend appointments. One adult guest is welcome in the lounge and, for consultations, in the treatment room." },
  { id: "photos", category: "Policies", q: "Will you use my photos?", a: "Only with your written consent, and only for the purpose you approve. Clinical photos are stored securely and are never shared without permission." },

  { id: "who-injects", category: "Treatments & safety", top: true, q: "Who performs the treatments?", a: "Injectables are performed by a nurse practitioner, a physician associate or the medical director. Laser and device treatments are performed by a certified laser technician who is also a registered nurse. Facials and peels are performed by a licensed medical aesthetician. Dr. Marsh reviews every protocol." },
  { id: "safe", category: "Treatments & safety", q: "How do you keep treatments safe?", a: "Physician oversight, FDA-cleared devices, single-use supplies, documented protocols, test spots for energy devices, and a consultation before any new treatment. We keep hyaluronidase and emergency medication on site." },
  { id: "natural", category: "Treatments & safety", q: "How do you avoid an overdone look?", a: "Conservative dosing, small amounts across visits, cannula technique where possible, and a two-week review. We would rather add later than take away." },
  { id: "products", category: "Treatments & safety", q: "Which products do you use?", a: "FDA-approved neuromodulators (Botox, Dysport), hyaluronic acid fillers (Juvéderm, Restylane), Sculptra and Radiesse, and FDA-cleared laser, IPL, RF and body contouring devices. We do not use unapproved or imported products." },
  { id: "results-guarantee", category: "Treatments & safety", q: "Do you guarantee results?", a: "No medical provider can. We can promise a careful assessment, honest expectations, conservative technique and a follow-up review. Individual results vary." },
  { id: "men", category: "Treatments & safety", q: "Do you treat men?", a: "Yes. About a third of our patients are men. Daniel Oyelaran leads our men's aesthetics program, with treatment plans built around subtle, structural change." },
];

export const topFaqs = faqs.filter((f) => f.top);
export const faqsByCategory = (c: FaqCategory) => faqs.filter((f) => f.category === c);
export const categoryAnchor = (c: string) => c.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
