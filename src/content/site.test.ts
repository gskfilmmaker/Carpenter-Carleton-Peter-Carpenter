import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

describe("site config", () => {
  it("uses the verified domain for outbound email", () => {
    expect(site.emailFrom).toBe("info@carpentercarleton.ca");
    expect(site.emailReplyTo).toBe("info@carpentercarleton.ca");
  });

  it("discloses GSK Productions Inc. as the managing entity", () => {
    expect(site.managedBy).toBe("GSK Productions Inc.");
  });

  it("does not carry the internal-notification recipient list (must stay server-only)", () => {
    expect(site as Record<string, unknown>).not.toHaveProperty("internalNotificationRecipients");
  });
});
