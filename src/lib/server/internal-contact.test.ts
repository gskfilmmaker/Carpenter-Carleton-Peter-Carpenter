import { describe, expect, it } from "vitest";
import { getInternalNotificationRecipients } from "@/lib/server/internal-contact";

describe("getInternalNotificationRecipients", () => {
  it("sends internal notifications to both info@ and carpenter@bellnet.ca", () => {
    expect(getInternalNotificationRecipients()).toEqual(["info@carpentercarleton.ca", "carpenter@bellnet.ca"]);
  });
});
