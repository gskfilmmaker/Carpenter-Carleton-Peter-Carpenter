import { describe, expect, it } from "vitest";
import { sanitizeStatementDescriptor } from "@/lib/statement-descriptor";

describe("sanitizeStatementDescriptor", () => {
  it("returns the default descriptor unchanged (fits under 22 chars)", () => {
    expect(sanitizeStatementDescriptor("CARPENTER CARLETON")).toBe("CARPENTER CARLETON");
    expect(sanitizeStatementDescriptor("CARPENTER CARLETON").length).toBeLessThanOrEqual(22);
  });

  it("truncates to Stripe's 22-character limit", () => {
    const result = sanitizeStatementDescriptor("A VERY LONG DESCRIPTOR THAT EXCEEDS THE LIMIT");
    expect(result.length).toBeLessThanOrEqual(22);
  });

  it("strips disallowed characters (< > \\ ' \" *)", () => {
    const result = sanitizeStatementDescriptor(`CAR<>'"*\\PENTER`);
    expect(result).not.toMatch(/[<>'"*\\]/);
  });

  it("falls back to the default when the sanitized value has no letters", () => {
    expect(sanitizeStatementDescriptor("12345")).toBe("CARPENTER CARLETON");
    expect(sanitizeStatementDescriptor("****")).toBe("CARPENTER CARLETON");
  });

  it("falls back to the default for an empty string", () => {
    expect(sanitizeStatementDescriptor("")).toBe("CARPENTER CARLETON");
  });
});
