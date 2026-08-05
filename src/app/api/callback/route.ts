import { NextResponse } from "next/server";
import { callbackSchema } from "@/lib/validation/callback";
import { emailAdapter } from "@/lib/adapters/email";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { submittedTooFast } from "@/lib/form-timing";
import { site, features } from "@/content/site";

export async function POST(request: Request) {
  if (!features.callbackRequest) {
    return NextResponse.json({ ok: false, error: "This feature is not currently available." }, { status: 404 });
  }

  const clientKey = getClientKey(request);
  if (isRateLimited(`callback:${clientKey}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = callbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  if (parsed.data.companyWebsite || submittedTooFast(parsed.data.renderedAt)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const { name, email, phone, preferredWindow, timeZone } = parsed.data;

  await emailAdapter.send({
    to: site.publicEmail,
    template: "callback-request",
    data: { name, email, phone, preferredWindow, timeZone },
  });

  return NextResponse.json({ ok: true });
}
