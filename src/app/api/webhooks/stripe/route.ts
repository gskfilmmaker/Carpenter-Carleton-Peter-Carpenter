import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/payments";
import { emailAdapter } from "@/lib/adapters/email";
import { calendarAdapter } from "@/lib/adapters/calendar";
import { isSessionFinalized, markSessionFinalized } from "@/lib/booking-store";
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

  if (isSessionFinalized(session.id)) {
    return NextResponse.json({ received: true, alreadyFinalized: true });
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
