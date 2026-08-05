export const TORONTO_TZ = "America/Toronto";
export const BUSINESS_HOURS = { startHour: 8, endHour: 20 } as const;

/** A reasonably broad, curated list — not exhaustive — good enough for a manual-selector fallback. */
export const commonTimezones = [
  "America/Toronto",
  "America/Vancouver",
  "America/Winnipeg",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Lagos",
  "Africa/Nairobi",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Manila",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
] as const;

export function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || TORONTO_TZ;
  } catch {
    return TORONTO_TZ;
  }
}

/**
 * Resolves the UTC offset (in minutes) of `timeZone` at the instant `date` represents, using the
 * Intl formatToParts trick — this correctly accounts for DST without a date library.
 */
function offsetMinutesAt(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return (asUTC - date.getTime()) / 60000;
}

/** Converts a wall-clock date/time in `timeZone` to the correct UTC instant, DST-safe. */
export function zonedTimeToUtc(
  year: number,
  month: number, // 1-indexed
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offset = offsetMinutesAt(guess, timeZone);
  const first = new Date(guess.getTime() - offset * 60000);
  // Re-derive once more in case the first pass landed on the other side of a DST transition.
  const offset2 = offsetMinutesAt(first, timeZone);
  return new Date(guess.getTime() - offset2 * 60000);
}

export function formatInTimeZone(isoUtc: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoUtc));
}

export function timeZoneAbbreviation(isoUtc: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(new Date(isoUtc));
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
}
