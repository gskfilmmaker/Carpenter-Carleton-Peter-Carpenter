import { googleMapsHref, site } from "@/content/site";

/**
 * ProfessionalService structured data using only confirmed NAP fields (build brief section 9:
 * "only after business NAP... is confirmed"). `address`, `telephone` and `hasMap` all reflect the
 * NAP facts confirmed in src/content/site.ts. No aggregate-rating markup, per the brief's explicit
 * prohibition.
 */
export function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    email: site.publicEmail,
    telephone: site.businessPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "3062 Lake Shore Blvd W",
      addressLocality: "Etobicoke",
      addressRegion: "ON",
      postalCode: "M8V 4C9",
      addressCountry: "CA",
    },
    hasMap: googleMapsHref(site.addressLine),
    areaServed: site.serviceArea,
    url: "https://carpentercarleton.ca",
    sameAs: [site.ciccRegisterUrl],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
