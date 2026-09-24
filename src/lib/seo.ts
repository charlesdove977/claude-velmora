// JSON-LD builders. Every page passes an array of these to BaseLayout.
import { site } from "@/config/site";
import type { Treatment } from "@/data/treatments";
import type { Provider } from "@/data/team";

export function businessLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "MedicalClinic"],
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/images/space-01-1200.webp`,
    logo: `${site.url}/logo.svg`,
    priceRange: "$$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card, Debit Card, HSA, FSA, Financing",
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
    hasMap: site.address.mapsUrl,
    openingHoursSpecification: site.hours
      .filter((h) => h.open)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.open, closes: h.close })),
    sameAs: site.socials.map((s) => s.href),
    medicalSpecialty: ["Dermatology", "PlasticSurgery"],
    founder: { "@type": "Physician", name: site.medicalDirector.name, url: `${site.url}/team/${site.medicalDirector.slug}` },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/support?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.href}` })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function procedureLd(t: Treatment) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: t.name,
    description: t.summary,
    url: `${site.url}/treatments/${t.slug}`,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    howPerformed: t.howItWorks.join(" "),
    preparation: t.expect.before.join(" "),
    followup: t.expect.after.join(" "),
    bodyLocation: t.treats.join(", "),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: t.priceFrom,
      priceSpecification: { "@type": "UnitPriceSpecification", price: t.priceFrom, priceCurrency: "USD", unitText: t.priceUnit },
    },
    provider: { "@id": `${site.url}/#business` },
  };
}

export function physicianLd(p: Provider) {
  return {
    "@context": "https://schema.org",
    "@type": p.isPhysician ? "Physician" : "Person",
    name: `${p.name}, ${p.credentials}`,
    jobTitle: p.role,
    url: `${site.url}/team/${p.slug}`,
    image: `${site.url}/images/${p.image}-1200.webp`,
    worksFor: { "@id": `${site.url}/#business` },
    description: p.bio[0],
    knowsAbout: p.focus,
  };
}

export function articleLd(a: { title: string; description: string; date: Date; author: string; authorSlug: string; slug: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date.toISOString(),
    dateModified: a.date.toISOString(),
    image: `${site.url}/images/${a.image}-1200.webp`,
    author: { "@type": "Person", name: a.author, url: `${site.url}/team/${a.authorSlug}` },
    publisher: { "@id": `${site.url}/#business` },
    mainEntityOfPage: `${site.url}/journal/${a.slug}`,
  };
}
