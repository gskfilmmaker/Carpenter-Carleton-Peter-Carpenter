import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/payments";
import { getFinalizedBooking } from "@/lib/booking-store";

/**
 * Stripe's own session status (`payment_status`) is the source of truth for whether the client
 * paid — it's already correct the instant Stripe redirects back, independent of whether our
 * webhook has finished running. The booking-store lookup adds whatever the webhook has finalized
 * so far (join link, receipt); if the webhook hasn't run yet, `finalizing: true` tells the
 * confirmation page to say "check your email" rather than show incomplete details.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const stripe = getStripeClient();

  if (!stripe || !sessionId) {
    return NextResponse.json({ ok: false, error: "Session not found." }, { status: 404 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const finalized = paid ? getFinalizedBooking(sessionId) : undefined;

    return NextResponse.json({
      ok: true,
      paid,
      finalizing: paid && !finalized,
      reference: finalized?.reference ?? session.metadata?.bookingReference,
      consultationType: finalized?.consultationType ?? session.metadata?.consultationType,
      meetingFormat: finalized?.meetingFormat ?? session.metadata?.meetingFormat,
      videoPlatform: finalized?.videoPlatform ?? session.metadata?.videoPlatform ?? undefined,
      slotStartUtc: finalized?.slotStartUtc ?? session.metadata?.slotStartUtc,
      joinUrl: finalized?.joinUrl,
      receiptUrl: finalized?.receiptUrl,
      amountPaid: typeof session.amount_total === "number" ? session.amount_total / 100 : undefined,
      currency: session.currency?.toUpperCase(),
    });
  } catch (error) {
    console.error("[stripe] session verification failed", error);
    return NextResponse.json({ ok: false, error: "Could not verify session." }, { status: 500 });
  }
}
