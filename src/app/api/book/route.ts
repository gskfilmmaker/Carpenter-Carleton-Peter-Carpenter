import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation/booking";
import { calendarAdapter } from "@/lib/adapters/calendar";
import { sendPreConsultationSequence } from "@/lib/adapters/email";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { submittedTooFast } from "@/lib/form-timing";
import { getStripeClient, isPaymentsLive } from "@/lib/payments";
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

  const { name, email, phone, consultationType, meetingFormat, videoPlatform, slotStartUtc, message } = parsed.data;

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

  if (isPaymentsLive(consultationFee)) {
    const stripe = getStripeClient();
    if (stripe && consultationFee?.amount) {
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
                product_data: { name: consultationFee.publicLabel },
              },
              quantity: 1,
            },
          ],
          client_reference_id: booking.reference,
          metadata: {
            bookingReference: booking.reference,
            consultationType,
            meetingFormat,
            videoPlatform: videoPlatform ?? "",
            slotStartUtc,
            name,
          },
          success_url: `${origin}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/book?canceled=1`,
        });

        return NextResponse.json({ ok: true, checkoutUrl: session.url });
      } catch (error) {
        console.error("[stripe] checkout session creation failed", error);
        // Fail safe: fall through to a request-only confirmation rather than blocking the booking.
      }
    }
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
