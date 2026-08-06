import type { FeeItem } from "@/content/types";

/**
 * The `consultation` tier is the live $250 CAD Confidential Consultation fee, charged through
 * Stripe at the final /book step. Its `approved: true` and its amount reflect this task's explicit
 * instruction. The booking flow still only calls Stripe when BOTH `PAYMENTS_ENABLED=true` (an
 * infra/env switch, not something this repo can set — see docs/LAUNCH-INPUTS-CHECKLIST.md) AND
 * `approved === true` are true (src/lib/payments.ts `isPaymentsLive`), so nothing charges by
 * accident from a code change alone. Every other tier here remains an unpriced structural
 * placeholder pending Peter's final schedule.
 *
 * Tax treatment (HST or otherwise) is NOT hard-coded here — it's read at render/charge time from
 * `NEXT_PUBLIC_CONSULT_TAX` via src/lib/tax-config.ts, so nothing in this file has to guess it.
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
    service: "consultation", // internal lookup key — see file header for why this stays stable
    publicLabel: "Confidential consultation",
    priceType: "fixed",
    amount: 250,
    currency: "CAD",
    // Static fallback only; the live label always comes from getConsultTaxConfig() at render time.
    taxNote: "Tax treatment to be confirmed with Peter's accountant",
    inclusions: [
      "45–60 minute video or phone consultation",
      "A pathway map and key evidence gaps",
      "A written next-step summary",
    ],
    exclusions: ["Government, medical and translation fees", "Ongoing representation"],
    effectiveDate: "2026-08-05",
    approved: true,
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
