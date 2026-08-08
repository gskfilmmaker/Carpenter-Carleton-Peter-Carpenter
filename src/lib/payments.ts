import "server-only";
import Stripe from "stripe";
import type { FeeItem } from "@/content/types";
import { DEFAULT_STATEMENT_DESCRIPTOR, sanitizeStatementDescriptor } from "@/lib/statement-descriptor";

/**
 * Payments stay OFF (request-only booking, no charge) unless BOTH gates are open:
 *   1. PAYMENTS_ENABLED=true (an explicit ops/infra decision), AND
 *   2. the relevant FeeItem.approved === true (an explicit Peter sign-off on that exact fee).
 * Either gate closed => `isPaymentsLive` is false and the booking flow completes as a
 * request-only booking with "Fee confirmed in writing before any representation begins."
 */
export function isPaymentsLive(feeItem: FeeItem | undefined): boolean {
  return (
    process.env.PAYMENTS_ENABLED === "true" &&
    feeItem?.approved === true &&
    typeof feeItem.amount === "number" &&
    Boolean(process.env.STRIPE_SECRET_KEY)
  );
}

let stripeClient: Stripe | null | undefined;

/** Lazily-constructed Stripe client. Returns null when no secret key is configured. */
export function getStripeClient(): Stripe | null {
  if (stripeClient !== undefined) return stripeClient;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  stripeClient = secretKey ? new Stripe(secretKey) : null;
  return stripeClient;
}

/**
 * This account (a single GSK Productions Inc. Stripe account, GSK as merchant of record — not
 * Stripe Connect) would otherwise show "GSK" on the client's card statement; setting this
 * per-charge is what makes the charge recognizable as Carpenter & Carleton instead, which is the
 * whole point (fewer confused-charge chargebacks). See src/lib/statement-descriptor.ts for the
 * sanitization rules (kept in a separate, non-`server-only` module so it's unit-testable).
 */
export function getStatementDescriptor(): string {
  return sanitizeStatementDescriptor(process.env.STATEMENT_DESCRIPTOR || DEFAULT_STATEMENT_DESCRIPTOR);
}
