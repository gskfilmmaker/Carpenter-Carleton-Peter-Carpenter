import { describe, expect, it } from "vitest";
import { bookingSchema } from "@/lib/validation/booking";

const baseInput = {
  name: "Jordan Test",
  email: "jordan@example.com",
  consultationType: "Individual pathway" as const,
  meetingFormat: "video" as const,
  videoPlatform: "teams" as const,
  slotStartUtc: "2026-08-06T12:00:00.000Z",
  visitorTimeZone: "America/Toronto",
  serviceConsent: true as const,
  marketingConsent: false,
  companyWebsite: "",
};

describe("bookingSchema", () => {
  it("accepts a valid video booking with a platform", () => {
    expect(bookingSchema.safeParse(baseInput).success).toBe(true);
  });

  it("rejects a video booking with no platform chosen", () => {
    const rest: Partial<typeof baseInput> = { ...baseInput };
    delete rest.videoPlatform;
    const result = bookingSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts a phone booking with no platform", () => {
    const rest: Partial<typeof baseInput> = { ...baseInput };
    delete rest.videoPlatform;
    const result = bookingSchema.safeParse({ ...rest, meetingFormat: "phone" });
    expect(result.success).toBe(true);
  });

  it("rejects a non-ISO slotStartUtc", () => {
    const result = bookingSchema.safeParse({ ...baseInput, slotStartUtc: "tomorrow at 8am" });
    expect(result.success).toBe(false);
  });

  it("rejects when serviceConsent is false", () => {
    const result = bookingSchema.safeParse({ ...baseInput, serviceConsent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot field (bot signal)", () => {
    const result = bookingSchema.safeParse({ ...baseInput, companyWebsite: "https://spam.example" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown consultation type", () => {
    const result = bookingSchema.safeParse({ ...baseInput, consultationType: "Something else" });
    expect(result.success).toBe(false);
  });
});
