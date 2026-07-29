import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation/booking";
import { emailAdapter } from "@/lib/adapters/email";
import { calendarAdapter } from "@/lib/adapters/calendar";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(`booking:${getClientKey(request)}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  // Honeypot tripped — reject silently as if it were a validation failure.
  if (parsed.data.companyWebsite) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const { name, email, phone, consultationType, preferredContact, message } = parsed.data;

  const booking = await calendarAdapter.requestBooking({
    consultationType,
    preferredContact,
    name,
    email,
    phone: phone || undefined,
    message: message || undefined,
  });

  if (!booking.ok) {
    return NextResponse.json({ ok: false, error: "We couldn't record your request. Please try again." }, { status: 500 });
  }

  await emailAdapter.send({
    to: email,
    template: "booking-confirmation",
    data: { reference: booking.reference, consultationType },
  });

  return NextResponse.json({ ok: true, reference: booking.reference });
}
