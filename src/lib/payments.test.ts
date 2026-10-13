import { describe, expect, it } from "vitest";
import { AGREED_FEE_PAYMENT_LINK_ID } from "@/lib/payments";
import { site } from "@/content/site";

describe("AGREED_FEE_PAYMENT_LINK_ID", () => {
  it("matches the existing, already-live Stripe Payment Link for agreed-fee payments", () => {
    expect(AGREED_FEE_PAYMENT_LINK_ID).toBe("plink_1UQBHkC2c8X1kPXix7Fs7TqA");
  });
});

describe("site.agreedFeePaymentUrl", () => {
  it("points at the exact public Stripe Payment Link URL", () => {
    expect(site.agreedFeePaymentUrl).toBe("https://buy.stripe.com/7sYdR81UsgHZbgK5743Je00");
  });

  it("publishes the min/max Stripe enforces on this link, for honest frontend copy", () => {
    expect(site.agreedFeePaymentMin).toBe(1000);
    expect(site.agreedFeePaymentMax).toBe(10000);
    expect(site.agreedFeePaymentMin).toBeLessThan(site.agreedFeePaymentMax);
  });
});
