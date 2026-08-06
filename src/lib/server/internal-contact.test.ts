import { describe, expect, it } from "vitest";
import { getInternalNotificationRecipients, getSecondaryPhone } from "@/lib/server/internal-contact";

describe("getInternalNotificationRecipients", () => {
  it("sends internal notifications to both info@ and carpenter@bellnet.ca", () => {
    expect(getInternalNotificationRecipients()).toEqual(["info@carpentercarleton.ca", "carpenter@bellnet.ca"]);
  });
});

describe("getSecondaryPhone", () => {
  it("stays hidden unless SHOW_SECONDARY_PHONE=true", () => {
    const original = process.env.SHOW_SECONDARY_PHONE;
    delete process.env.SHOW_SECONDARY_PHONE;
    expect(getSecondaryPhone()).toBeNull();
    process.env.SHOW_SECONDARY_PHONE = "true";
    expect(getSecondaryPhone()).toBe("+14169962168");
    if (original === undefined) delete process.env.SHOW_SECONDARY_PHONE;
    else process.env.SHOW_SECONDARY_PHONE = original;
  });
});
