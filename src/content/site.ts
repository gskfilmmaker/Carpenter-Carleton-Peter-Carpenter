/**
 * Firm identity, trust-bar copy and navigation. Every business fact here (name spelling, address,
 * phone, RCIC display wording) is a placeholder pending Peter's written approval — see
 * docs/LAUNCH-INPUTS-CHECKLIST.md. Nothing here should be treated as verified until that sign-off.
 */

export const site = {
  legalName: "Carpenter & Carleton", // placeholder — confirm exact registered/marketing spelling
  representativeName: "Peter Carpenter",
  designation: "RCIC",
  collegeId: "R408495", // placeholder pending display-approval, per CICC public register lookup
  ciccRegisterUrl:
    "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant",
  noGuaranteeNotice:
    "Hiring a representative is optional. A representative cannot guarantee a decision, approval or processing time. Government authorities make all decisions.",
  phone: "Contact number pending approval",
  email: "Contact email pending approval",
  addressLine: "Greater Toronto Area, Ontario, Canada", // placeholder — exact office address pending approval
} as const;

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

export const primaryCta = { label: "Book a Consultation", href: "/contact" };
