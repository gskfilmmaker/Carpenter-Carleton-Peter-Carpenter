import { site } from "@/content/site";

/**
 * ProfessionalService structured data using only confirmed NAP fields (build brief section 9:
 * "only after business NAP... is confirmed" — email/phone here are confirmed; legalName/address
 * remain placeholders so this intentionally omits `address` rather than publish an unverified one).
 * No aggregate-rating markup, per the brief's explicit prohibition.
 */
export function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    email: site.publicEmail,
    telephone: site.businessPhone,
    areaServed: site.serviceArea,
    url: "https://www.canadaimmigrationhelp.ca",
    sameAs: [site.ciccRegisterUrl],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
