/**
 * Consultation tax treatment, driven by a single config value rather than a hard-coded assumption
 * (HST registration/treatment on the $250 CAD fee is an open question for Peter's accountant — see
 * docs/LAUNCH-INPUTS-CHECKLIST.md). Deliberately NOT `server-only`: this is public, non-sensitive
 * display text shown both in the booking UI (client) and in emails/Stripe line items (server), so
 * it's read from a `NEXT_PUBLIC_` variable — the only way a value set at deploy time can be
 * available to both without duplicating it. See docs/IMPLEMENTATION_PLAN.md for why this differs
 * from the plain `CONSULT_TAX` name.
 *
 * Accepted values for NEXT_PUBLIC_CONSULT_TAX: a percentage like "HST 13%" (a separate tax line is
 * added to the Stripe Checkout session at that rate), "Taxes included" / "No tax applicable" (shown
 * as-is, no separate line), or unset (shows a clearly-labelled TODO instead of guessing).
 */

export type ConsultTaxConfig = {
  /** Human-readable label shown next to the fee, e.g. "HST 13%" or "Tax treatment to be confirmed". */
  label: string;
  /** Parsed percentage when the config value contains one (e.g. "HST 13%" -> 13), else null. */
  ratePercent: number | null;
  /** True only when a real config value has been set — false means the TODO placeholder is showing. */
  isConfigured: boolean;
};

const DEFAULT_LABEL = "Tax treatment to be confirmed with Peter's accountant";

export function getConsultTaxConfig(): ConsultTaxConfig {
  const raw = process.env.NEXT_PUBLIC_CONSULT_TAX?.trim();

  if (!raw) {
    return { label: DEFAULT_LABEL, ratePercent: null, isConfigured: false };
  }

  const match = raw.match(/(\d+(?:\.\d+)?)\s*%/);
  return {
    label: raw,
    ratePercent: match ? Number(match[1]) : null,
    isConfigured: true,
  };
}

/** Computes the tax amount (in the fee's currency units, e.g. dollars) for a given fee amount. */
export function computeTaxAmount(feeAmount: number, tax: ConsultTaxConfig): number {
  if (tax.ratePercent === null) return 0;
  return Math.round(feeAmount * (tax.ratePercent / 100) * 100) / 100;
}
