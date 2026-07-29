import type { FeeItem } from "@/content/types";

/**
 * Public prices are withheld until Peter approves a final schedule (build brief section 7 / 12).
 * The comparison tiers below are structural placeholders — every `amount` is intentionally
 * omitted and every `approved` flag is false, so no number can leak to production by accident.
 */
export const feeTiers: FeeItem[] = [
  {
    service: "explore-independently",
    publicLabel: "Explore independently",
    priceType: "consultation-required",
    currency: "CAD",
    inclusions: [
      "Official IRCC/ESDC/provincial links for your pathway",
      "General document-category guidance",
      "Access to the Canada Pathway Briefing",
    ],
    exclusions: ["Personalized eligibility review", "Representation"],
    effectiveDate: "2026-07-29",
    approved: false,
  },
  {
    service: "consultation",
    publicLabel: "Consultation",
    priceType: "consultation-required",
    currency: "CAD",
    inclusions: [
      "45–60 minute video or phone consultation",
      "A pathway map and key evidence gaps",
      "A written next-step summary",
    ],
    exclusions: ["Government, medical and translation fees", "Ongoing representation"],
    effectiveDate: "2026-07-29",
    approved: false,
  },
  {
    service: "guided-document-review",
    publicLabel: "Guided document review",
    priceType: "consultation-required",
    currency: "CAD",
    inclusions: [
      "Structured review of your documents against general category requirements",
      "A prioritized readiness checklist",
    ],
    exclusions: ["Filing your application on your behalf", "Government and third-party fees"],
    effectiveDate: "2026-07-29",
    approved: false,
  },
  {
    service: "full-representation",
    publicLabel: "Full representation",
    priceType: "consultation-required",
    currency: "CAD",
    inclusions: [
      "A written scope-of-work and fee agreement before representation begins",
      "Document preparation and filing support",
      "An agreed client-update rhythm through decision",
    ],
    exclusions: ["Government, medical, biometrics, language-test, translation and courier fees"],
    paymentPolicy: "Payment plans, cancellation and refund terms are confirmed in your written agreement.",
    effectiveDate: "2026-07-29",
    approved: false,
  },
];
