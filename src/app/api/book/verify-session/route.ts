import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/payments";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const stripe = getStripeClient();

  if (!stripe || !sessionId) {
    return NextResponse.json({ ok: false, error: "Session not found." }, { status: 404 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      ok: true,
      paid: session.payment_status === "paid",
      reference: session.metadata?.bookingReference,
      consultationType: session.metadata?.consultationType,
      meetingFormat: session.metadata?.meetingFormat,
      videoPlatform: session.metadata?.videoPlatform || undefined,
      slotStartUtc: session.metadata?.slotStartUtc,
    });
  } catch (error) {
    console.error("[stripe] session verification failed", error);
    return NextResponse.json({ ok: false, error: "Could not verify session." }, { status: 500 });
  }
}
