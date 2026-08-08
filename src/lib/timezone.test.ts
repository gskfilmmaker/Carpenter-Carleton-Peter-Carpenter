import { describe, expect, it } from "vitest";
import { formatInTimeZone, TORONTO_TZ, zonedTimeToUtc } from "@/lib/timezone";

describe("zonedTimeToUtc — DST correctness for America/Toronto", () => {
  it("converts a winter (EST, UTC-5) wall-clock time correctly", () => {
    const result = zonedTimeToUtc(2026, 1, 15, 8, 0, TORONTO_TZ);
    expect(result.toISOString()).toBe("2026-01-15T13:00:00.000Z");
  });

  it("converts a summer (EDT, UTC-4) wall-clock time correctly", () => {
    const result = zonedTimeToUtc(2026, 7, 15, 8, 0, TORONTO_TZ);
    expect(result.toISOString()).toBe("2026-07-15T12:00:00.000Z");
  });

  it("handles the evening business-hours boundary (19:00 Toronto) across DST", () => {
    const winter = zonedTimeToUtc(2026, 1, 15, 19, 0, TORONTO_TZ);
    const summer = zonedTimeToUtc(2026, 7, 15, 19, 0, TORONTO_TZ);
    expect(winter.toISOString()).toBe("2026-01-16T00:00:00.000Z");
    expect(summer.toISOString()).toBe("2026-07-15T23:00:00.000Z");
  });
});

describe("formatInTimeZone", () => {
  it("formats an ISO instant in the given IANA timezone", () => {
    const formatted = formatInTimeZone("2026-07-15T12:00:00.000Z", TORONTO_TZ);
    // Expect it to render as 8am local (EDT, UTC-4) — exact string format is locale-dependent,
    // so assert on the hour rather than the whole string.
    expect(formatted).toMatch(/8/);
  });
});
