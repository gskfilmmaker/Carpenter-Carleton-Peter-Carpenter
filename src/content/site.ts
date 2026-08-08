/**
 * Firm identity, trust-bar copy and navigation — the single source of truth for contact details.
 * Never hard-code phone/email strings in components; import from here.
 *
 * `publicEmail`, `businessPhone` and `businessWhatsApp` were supplied directly as real, current
 * contact details and are safe to publish. `legalName` and `addressLine` are now corroborated by
 * the firm's live Google Business Profile (name, address) plus an independent directory listing
 * for the address — see the inline notes below for what's still open. `collegeId` remains
 * pending Peter's explicit display-approval, per docs/LAUNCH-INPUTS-CHECKLIST.md. Peter's direct
 * line and the internal-notification recipient list are intentionally NOT exported here — this
 * module is imported by client components, so anything on it ships in the client bundle. Those
 * two live server-only in src/lib/server/internal-contact.ts instead.
 */

export const site = {
  // Confirmed via the firm's Google Business Profile ("Carpenter & Carleton", Etobicoke, ON) —
  // matches what was already live. Still worth a final cross-check against the exact name on the
  // CICC public register before treating this as fully closed (register listings sometimes use a
  // different employer-name spelling than public-facing marketing material).
  legalName: "Carpenter & Carleton",
  representativeName: "Peter Carpenter",
  designation: "RCIC",
  collegeId: "R408495", // placeholder pending display-approval, per CICC public register lookup
  // APPROVAL-PENDING: "More than 25 years" / "25+ years" is the approved framing per the build
  // brief (source-verified firm material; do NOT change to "nearly three decades" or any figure
  // not backed by verified records). Peter must give final written sign-off before public launch —
  // see docs/LAUNCH-INPUTS-CHECKLIST.md.
  yearsOfExperience: "25+ years",
  ciccRegisterUrl:
    "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant",
  representativeInfoUrl:
    "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigration-citizenship-representative/learn-about-representatives.html",
  noGuaranteeNotice:
    "Hiring a representative is optional. A representative cannot guarantee a decision, approval or processing time. Government authorities make all decisions.",
  sensitiveDocsNotice:
    "Do not send passports, bank statements, immigration portal passwords or other sensitive documents through this form.",
  publicEmail: "info@carpentercarleton.ca",
  // CONFLICT — NOT YET RESOLVED: this number was supplied directly as the real, current contact
  // number and is kept as the live default. Third-party research turned up two other numbers for
  // this firm — the Google Business Profile shows (905) 271-7733, and an independent directory
  // listing shows (416) 252-7733 — that don't match this one or each other. Before public launch,
  // confirm with Peter which number(s) are actually current: this may legitimately be a mobile/
  // WhatsApp line kept separate from an office landline, or one of the other two may be stale.
  businessPhone: "+16478613970",
  businessWhatsApp: "+16478613970",
  // Confirmed via the firm's Google Business Profile and corroborated by an independent directory
  // listing (same address on both). Office hours are NOT yet published anywhere on the site —
  // only a single data point ("opens 9am Monday") surfaced in research, which isn't enough to
  // publish a full weekly schedule without guessing the rest.
  addressLine: "3062 Lake Shore Blvd W, Etobicoke, ON M8V 4C9",
  serviceArea: "Greater Toronto Area, Ontario, Canada",

  // Transactional email routing — single source of truth, see src/lib/adapters/email.ts.
  // (The internal-notification recipient list is intentionally NOT here — it's server-only, see
  // src/lib/server/internal-contact.ts, because this `site` object is imported by client
  // components and anything on it ships in the client bundle.)
  emailFrom: "info@carpentercarleton.ca",
  emailReplyTo: "info@carpentercarleton.ca",

  /** Disclosed truthfully in the footer and on /privacy — payments are processed by GSK
   * Productions Inc. via Stripe on Carpenter & Carleton's behalf (single GSK Stripe account,
   * merchant of record; not a Stripe Connect setup). */
  managedBy: "GSK Productions Inc.",
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
