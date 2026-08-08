import { site } from "@/content/site";

/**
 * ProfessionalService structured data using only confirmed NAP fields (build brief section 9:
 * "only after business NAP... is confirmed"). `address` is now included since `site.addressLine`
 * is corroborated by the firm's Google Business Profile and an independent directory listing (see
 * src/content/site.ts). `telephone` still carries the open phone-number discrepancy noted there —
 * revisit once Peter confirms which number is current. No aggregate-rating markup, per the brief's
 * explicit prohibition.
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
    areaServed: site.serviceArea,
    url: "https://carpentercarleton.ca",
    sameAs: [site.ciccRegisterUrl],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
