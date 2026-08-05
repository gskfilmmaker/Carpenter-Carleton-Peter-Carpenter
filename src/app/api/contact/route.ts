import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { emailAdapter } from "@/lib/adapters/email";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { submittedTooFast } from "@/lib/form-timing";
import { site } from "@/content/site";

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  if (isRateLimited(`contact:${clientKey}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  // Honeypot tripped, or submitted implausibly fast — reject silently as a validation failure.
  if (parsed.data.companyWebsite || submittedTooFast(parsed.data.renderedAt)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(parsed.data.turnstileToken, clientKey);
  if (!turnstileOk) {
    return NextResponse.json({ ok: false, error: "Spam check failed. Please try again." }, { status: 400 });
  }

  const { name, email, phone, countryOfResidence, currentStatus, goal, preferredLanguage, timeline, message } =
    parsed.data;

  await emailAdapter.send({
    to: site.publicEmail,
    template: "contact-enquiry",
    data: { name, email, phone, countryOfResidence, currentStatus, goal, preferredLanguage, timeline, message },
  });

  await emailAdapter.send({
    to: email,
    template: "contact-receipt",
    data: {},
  });

  return NextResponse.json({ ok: true });
}
