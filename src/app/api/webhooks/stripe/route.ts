import { NextResponse } from "next/server";
import { getStripeClient, AGREED_FEE_PAYMENT_LINK_ID } from "@/lib/payments";
import { emailAdapter } from "@/lib/adapters/email";
import { calendarAdapter } from "@/lib/adapters/calendar";
import {
  isSessionFinalized,
  markSessionFinalized,
  isAgreedFeePaymentFinalized,
  markAgreedFeePaymentFinalized,
} from "@/lib/booking-store";
import { getInternalNotificationRecipients } from "@/lib/server/internal-contact";
import type { MeetingFormat, VideoPlatform } from "@/lib/adapters/calendar";

/**
 * Verifies the Stripe webhook signature server-side before trusting anything in the payload —
 * payment confirmation must never be inferred from a client redirect alone. Stripe requires the
 * raw request body for signature verification, which `request.text()` provides here since App
 * Router route handlers don't parse the body automatically.
 *
 * This is the ONLY place a booking is actually finalized: the calendar event, the join link, and
 * both confirmation emails are all created here, after `checkout.session.completed`, never at
 * Checkout-session-creation time. Idempotent on the session id — Stripe retries this webhook on
 * anything but a fast 2xx, so a duplicate delivery must not double-book or double-email.
 */
export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "Stripe is not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe:webhook] signature verification failed", error);
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as import("stripe").Stripe.Checkout.Session;

  // "Pay an agreed fee" Payment Link: a general-purpose link (customer chooses the amount), not
  // tied to any specific booking or agreement. Handled entirely separately from the $250
  // consultation-booking logic below, which trusts `session.metadata` set by our own /api/book
  // route — a Checkout Session created from a Payment Link never carries that metadata, so letting
  // it fall through to the booking logic would create a calendar event from an empty slot time and
  // send the payer a "your consultation is confirmed" email for a payment that has nothing to do
  // with a consultation.
  if (session.payment_link === AGREED_FEE_PAYMENT_LINK_ID) {
    if (isAgreedFeePaymentFinalized(session.id)) {
      return NextResponse.json({ received: true, alreadyFinalized: true });
    }

    let receiptUrl: string | undefined;
    try {
      if (typeof session.payment_intent === "string") {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
          expand: ["latest_charge"],
        });
        const charge = paymentIntent.latest_charge;
        if (charge && typeof charge !== "string") {
          receiptUrl = charge.receipt_url ?? undefined;
        }
      }
    } catch (error) {
      console.error("[stripe:webhook] could not retrieve receipt url for agreed-fee payment", error);
    }

    const amountPaid = typeof session.amount_total === "number" ? session.amount_total / 100 : undefined;
    const currency = session.currency?.toUpperCase();

    // Internal-only notification — no client-facing email from here. Stripe already sends its own
    // payment receipt to the customer, and we deliberately avoid inventing any "your payment is
    // confirmed for X" wording that could read as acknowledging a specific agreement: this
    // general-purpose link carries no reference to one. This webhook never marks any booking,
    // invoice or agreement as paid for an agreed-fee payment — staff reconcile manually against the
    // correct written agreement using the session/receipt details in the email below.
    const internalResult = await emailAdapter.send({
      to: getInternalNotificationRecipients(),
      template: "agreed-fee-payment-received",
      data: {
        sessionId: session.id,
        name: session.customer_details?.name ?? undefined,
        email: session.customer_details?.email ?? undefined,
        amountPaid,
        currency,
        receiptUrl,
      },
    });
    if (!internalResult.ok) {
      console.error("[stripe:webhook] agreed-fee internal notification failed to send", internalResult.error);
    }

    markAgreedFeePaymentFinalized(session.id);
    return NextResponse.json({ received: true });
  }

  if (isSessionFinalized(session.id)) {
    return NextResponse.json({ received: true, alreadyFinalized: true });
  }

  // Everything past this point assumes a $250-consultation Checkout Session created by our own
  // /api/book route, which always sets `bookingReference` in metadata. Anything else that isn't the
  // agreed-fee Payment Link handled above — a stray test payment, or any future ad hoc Payment Link
  // created directly in the Stripe dashboard — must NOT be treated as a consultation booking:
  // without real metadata, slotStartUtc/consultationType would be empty, and the payer would
  // wrongly receive a "your consultation is confirmed" email for a payment with no consultation
  // behind it. Verify the metadata exists rather than assuming it.
  if (!session.metadata?.bookingReference) {
    console.warn(
      "[stripe:webhook] checkout.session.completed with no recognized booking metadata and not the agreed-fee payment link — ignoring",
      session.id
    );
    return NextResponse.json({ received: true, unrecognized: true });
  }

  const md = session.metadata ?? {};
  const reference = md.bookingReference ?? session.id;
  const consultationType = md.consultationType ?? "";
  const meetingFormat = (md.meetingFormat ?? "video") as MeetingFormat;
  const videoPlatform = (md.videoPlatform || undefined) as VideoPlatform | undefined;
  const slotStartUtc = md.slotStartUtc ?? "";
  const visitorTimeZone = md.visitorTimeZone || "America/Toronto";
  const name = md.name ?? "";
  const email = md.email || session.customer_details?.email || "";
  const phone = md.phone || undefined;
  const message = md.message || undefined;

  let joinUrl: string | undefined;
  let calendarOk = true;
  try {
    const calendarResult = await calendarAdapter.requestBooking({
      consultationType,
      meetingFormat,
      videoPlatform,
      slotStartUtc,
      name,
      email,
      phone,
      message,
    });
    if (calendarResult.ok) {
      joinUrl = calendarResult.joinUrl;
    } else {
      calendarOk = false;
      console.error("[stripe:webhook] calendar booking failed after payment", calendarResult.error);
    }
  } catch (error) {
    calendarOk = false;
    console.error("[stripe:webhook] calendar adapter threw after payment", error);
  }

  let receiptUrl: string | undefined;
  try {
    if (typeof session.payment_intent === "string") {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
        expand: ["latest_charge"],
      });
      const charge = paymentIntent.latest_charge;
      if (charge && typeof charge !== "string") {
        receiptUrl = charge.receipt_url ?? undefined;
      }
    }
  } catch (error) {
    console.error("[stripe:webhook] could not retrieve receipt url", error);
  }

  const amountPaid = typeof session.amount_total === "number" ? session.amount_total / 100 : undefined;
  const currency = session.currency?.toUpperCase();

  if (email) {
    const clientResult = await emailAdapter.send({
      to: email,
      template: "booking-confirmation",
      data: {
        reference,
        consultationType,
        meetingFormat,
        videoPlatform,
        slotStartUtc,
        visitorTimeZone,
        joinUrl,
        receiptUrl,
        amountPaid,
        currency,
        paid: true,
      },
    });
    if (!clientResult.ok) {
      console.error("[stripe:webhook] client confirmation email failed to send", clientResult.error);
    }
  }

  const internalResult = await emailAdapter.send({
    to: getInternalNotificationRecipients(),
    template: "booking-internal-notification",
    data: {
      reference,
      name,
      email,
      phone,
      consultationType,
      meetingFormat,
      videoPlatform,
      slotStartUtc,
      visitorTimeZone,
      message,
      amountPaid,
      currency,
      receiptUrl,
      calendarOk,
      paymentStatus: "paid",
    },
  });
  if (!internalResult.ok) {
    console.error("[stripe:webhook] internal notification email failed to send", internalResult.error);
  }

  markSessionFinalized(session.id, {
    reference,
    consultationType,
    meetingFormat,
    videoPlatform,
    slotStartUtc,
    joinUrl,
    receiptUrl,
    calendarOk,
  });

  return NextResponse.json({ received: true });
}
