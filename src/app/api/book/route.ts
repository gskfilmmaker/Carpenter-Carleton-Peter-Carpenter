import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation/booking";
import { calendarAdapter } from "@/lib/adapters/calendar";
import { sendPreConsultationSequence } from "@/lib/adapters/email";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { submittedTooFast } from "@/lib/form-timing";
import { getStatementDescriptor, getStripeClient, isPaymentsLive } from "@/lib/payments";
import { getConsultTaxConfig, computeTaxAmount } from "@/lib/tax-config";
import { generateBookingReference } from "@/lib/booking-store";
import { feeTiers } from "@/content/fees";

const consultationFee = feeTiers.find((tier) => tier.service === "consultation");

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  if (isRateLimited(`book:${clientKey}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  if (parsed.data.companyWebsite || submittedTooFast(parsed.data.renderedAt)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(parsed.data.turnstileToken, clientKey);
  if (!turnstileOk) {
    return NextResponse.json({ ok: false, error: "Spam check failed. Please try again." }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    consultationType,
    meetingFormat,
    videoPlatform,
    slotStartUtc,
    visitorTimeZone,
    message,
    marketingConsent,
  } = parsed.data;

  // Paid path: create a Stripe Checkout Session and stop. Nothing is booked and no email is sent
  // yet — the calendar event and confirmations are only created once the webhook confirms payment
  // (checkout.session.completed), never from this redirect-triggering request alone.
  if (isPaymentsLive(consultationFee)) {
    const stripe = getStripeClient();
    if (!stripe || !consultationFee?.amount) {
      return NextResponse.json({ ok: false, error: "Payments are temporarily unavailable. Please try again shortly." }, { status: 503 });
    }

    const bookingReference = generateBookingReference();
    const tax = getConsultTaxConfig();
    const taxAmount = computeTaxAmount(consultationFee.amount, tax);
    const origin = new URL(request.url).origin;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: consultationFee.currency.toLowerCase(),
              unit_amount: Math.round(consultationFee.amount * 100),
              product_data: {
                name: consultationFee.publicLabel,
                description: "Carpenter & Carleton — confidential immigration consultation",
              },
            },
            quantity: 1,
          },
          ...(taxAmount > 0
            ? [
                {
                  price_data: {
                    currency: consultationFee.currency.toLowerCase(),
                    unit_amount: Math.round(taxAmount * 100),
                    product_data: { name: tax.label },
                  },
                  quantity: 1,
                },
              ]
            : []),
        ],
        payment_intent_data: {
          statement_descriptor: getStatementDescriptor(),
          receipt_email: email,
        },
        client_reference_id: bookingReference,
        metadata: {
          bookingReference,
          consultationType,
          meetingFormat,
          videoPlatform: videoPlatform ?? "",
          slotStartUtc,
          visitorTimeZone,
          name,
          email,
          phone: phone || "",
          message: message || "",
          marketingConsent: String(marketingConsent),
        },
        success_url: `${origin}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/book?canceled=1`,
      });

      return NextResponse.json({ ok: true, checkoutUrl: session.url, reference: bookingReference });
    } catch (error) {
      console.error("[stripe] checkout session creation failed", error);
      return NextResponse.json({ ok: false, error: "We couldn't start checkout. Please try again." }, { status: 500 });
    }
  }

  // Dev/test fallback: no live payment configuration in this environment. Completes the booking
  // immediately (old request-only behaviour) so the flow stays fully testable without Stripe keys.
  const booking = await calendarAdapter.requestBooking({
    consultationType,
    meetingFormat,
    videoPlatform,
    slotStartUtc,
    name,
    email,
    phone: phone || undefined,
    message: message || undefined,
  });

  if (!booking.ok) {
    return NextResponse.json({ ok: false, error: "We couldn't record your request. Please try again." }, { status: 500 });
  }

  await sendPreConsultationSequence({
    to: email,
    reference: booking.reference,
    consultationType,
    consultationAtUtc: slotStartUtc,
  });

  return NextResponse.json({
    ok: true,
    reference: booking.reference,
    joinUrl: booking.joinUrl,
    meetingFormat,
    videoPlatform,
    slotStartUtc,
    consultationType,
    paid: false,
  });
}
