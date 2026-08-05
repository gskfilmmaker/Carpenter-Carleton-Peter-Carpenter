import { NextResponse } from "next/server";
import { calendarAdapter } from "@/lib/adapters/calendar";

const MAX_RANGE_DAYS = 21;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const daysParam = Number(url.searchParams.get("days") ?? "14");
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), MAX_RANGE_DAYS) : 14;

  const fromUtc = new Date();
  const toUtc = new Date(fromUtc.getTime() + days * 24 * 60 * 60 * 1000);

  const slots = await calendarAdapter.listAvailability(fromUtc, toUtc);
  return NextResponse.json({ ok: true, slots });
}
