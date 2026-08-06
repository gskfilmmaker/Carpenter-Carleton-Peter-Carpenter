import "server-only";

/**
 * Tracks which Stripe Checkout sessions have already been finalized (calendar event created,
 * confirmation emails sent) so a duplicate `checkout.session.completed` webhook — Stripe retries
 * on anything but a fast 2xx — can't double-book or double-email. Also lets the confirmation page
 * (`/book/confirmation`, reached via the Stripe redirect, which can arrive before or after the
 * webhook) show real details once they exist instead of guessing.
 *
 * Process-local (in-memory), same caveat as src/lib/rate-limit.ts: fine for a single instance, but
 * needs a shared store (Redis/Upstash) or a real database before a multi-instance production
 * deployment — tracked in docs/LAUNCH-INPUTS-CHECKLIST.md. A cold start / redeploy loses this map,
 * which only means the confirmation page falls back to "check your email" — the webhook itself
 * still re-runs safely (Stripe's own idempotent retry plus our email adapter tolerating re-sends).
 */

export type FinalizedBooking = {
  reference: string;
  consultationType: string;
  meetingFormat: string;
  videoPlatform?: string;
  slotStartUtc: string;
  joinUrl?: string;
  receiptUrl?: string;
  calendarOk: boolean;
};

const finalized = new Map<string, FinalizedBooking>();

export function isSessionFinalized(sessionId: string): boolean {
  return finalized.has(sessionId);
}

export function getFinalizedBooking(sessionId: string): FinalizedBooking | undefined {
  return finalized.get(sessionId);
}

export function markSessionFinalized(sessionId: string, booking: FinalizedBooking): void {
  finalized.set(sessionId, booking);
}

export function generateBookingReference(): string {
  return `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
