import { NextResponse } from "next/server";
import { pathwayCheckSchema } from "@/lib/validation/pathway-check";
import { emailAdapter } from "@/lib/adapters/email";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(`pathway-check:${getClientKey(request)}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = pathwayCheckSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot tripped — reject silently as if it were a validation failure.
  if (parsed.data.companyWebsite) {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  if (parsed.data.email) {
    await emailAdapter.send({
      to: parsed.data.email,
      template: "pathway-check-summary",
      data: { goal: parsed.data.answers.goal ?? "unspecified" },
    });
  }

  return NextResponse.json({ ok: true });
}
