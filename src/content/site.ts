/**
 * Firm identity, trust-bar copy and navigation — the single source of truth for contact details.
 * Never hard-code phone/email strings in components; import from here.
 *
 * `legalName`, `representativeName`, `collegeId` and `addressLine` remain placeholders pending
 * Peter's written approval — see docs/LAUNCH-INPUTS-CHECKLIST.md. `publicEmail`, `businessPhone`
 * and `businessWhatsApp` were supplied directly as real, current contact details and are safe to
 * publish. `secondaryPhone` (Peter's direct line) is intentionally NOT exported here — it is
 * server-only, see src/lib/server/internal-contact.ts, and stays off the public site unless
 * SHOW_SECONDARY_PHONE=true.
 */

export const site = {
  legalName: "Carpenter & Carleton", // placeholder — confirm exact registered/marketing spelling
  representativeName: "Peter Carpenter",
  designation: "RCIC",
  collegeId: "R408495", // placeholder pending display-approval, per CICC public register lookup
  ciccRegisterUrl:
    "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant",
  representativeInfoUrl:
    "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigration-citizenship-representative/learn-about-representatives.html",
  noGuaranteeNotice:
    "Hiring a representative is optional. A representative cannot guarantee a decision, approval or processing time. Government authorities make all decisions.",
  sensitiveDocsNotice:
    "Do not send passports, bank statements, immigration portal passwords or other sensitive documents through this form.",
  publicEmail: "info@carpentercarleton.ca",
  businessPhone: "+16478613970",
  businessWhatsApp: "+16478613970",
  addressLine: "Greater Toronto Area, Ontario, Canada", // placeholder — exact office address pending approval
  serviceArea: "Greater Toronto Area, Ontario, Canada",
} as const;

/** Config-flagged features that ship off by default until Peter opts in. */
export const features = {
  inPersonMeetings: false,
  callbackRequest: false,
} as const;

export function formatPhoneForDisplay(e164: string): string {
  const digits = e164.replace(/^\+1/, "");
  const match = digits.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `+1 (${match[1]}) ${match[2]}-${match[3]}` : e164;
}

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function whatsAppHref(e164: string, message: string): string {
  const number = e164.replace(/^\+/, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const whatsAppDefaultMessage = "Hi, I'd like to ask about a consultation.";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Start Here", href: "/start-here" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Permanent Residence & Express Entry", href: "/services/permanent-residence" },
      { label: "Provincial Nominee Pathways", href: "/services/provincial-nominee" },
      { label: "Work Permits & Employers", href: "/services/work-permits-employers" },
      { label: "Study & Post-Graduation Planning", href: "/services/study-permits" },
      { label: "Family Sponsorship & Super Visa", href: "/services/family-sponsorship" },
      { label: "Business Pathway Assessment", href: "/services/business-pathways" },
      { label: "Citizenship & PR Cards", href: "/services/citizenship-pr-cards" },
      { label: "Complex / Time-Sensitive Matters", href: "/services/complex-matters" },
    ],
  },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Fees & Consultation", href: "/fees" },
  {
    label: "Resources",
    href: "/resources",
  },
  { label: "About", href: "/about" },
  { label: "Client Experience", href: "/client-experience" },
];

export const primaryCta = { label: "Book a Consultation", href: "/book" };
