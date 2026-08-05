import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/payments";
import { emailAdapter } from "@/lib/adapters/email";

/**
 * Verifies the Stripe webhook signature server-side before trusting anything in the payload —
 * payment confirmation must never be inferred from a client redirect alone. Stripe requires the
 * raw request body for signature verification, which `request.text()` provides here since App
 * Router route handlers don't parse the body automatically.
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as import("stripe").Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const reference = session.metadata?.bookingReference;
    const consultationType = session.metadata?.consultationType;

    if (email) {
      await emailAdapter.send({
        to: email,
        template: "booking-confirmation",
        data: { reference, consultationType, paid: true },
      });
    }
  }

  return NextResponse.json({ received: true });
}
