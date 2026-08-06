import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";
import { goalOptions, languageOptions, statusOptions, timelineOptions } from "@/content/intake-options";

const baseInput = {
  name: "Jordan Test",
  email: "jordan@example.com",
  countryOfResidence: "Canada",
  currentStatus: statusOptions[0].value,
  goal: goalOptions[0].value,
  preferredLanguage: languageOptions[0].value,
  timeline: timelineOptions[0].value,
  serviceConsent: true as const,
  marketingConsent: false,
  companyWebsite: "",
};

describe("contactSchema", () => {
  it("accepts a valid enquiry", () => {
    expect(contactSchema.safeParse(baseInput).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...baseInput, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short country of residence", () => {
    const result = contactSchema.safeParse({ ...baseInput, countryOfResidence: "C" });
    expect(result.success).toBe(false);
  });

  it("rejects when serviceConsent is missing", () => {
    const rest: Partial<typeof baseInput> = { ...baseInput };
    delete rest.serviceConsent;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot field", () => {
    const result = contactSchema.safeParse({ ...baseInput, companyWebsite: "not-blank" });
    expect(result.success).toBe(false);
  });

  it("rejects a goal value outside the configured option list", () => {
    const result = contactSchema.safeParse({ ...baseInput, goal: "not-a-real-goal" });
    expect(result.success).toBe(false);
  });
});
