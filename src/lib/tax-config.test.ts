import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { computeTaxAmount, getConsultTaxConfig } from "@/lib/tax-config";

describe("getConsultTaxConfig", () => {
  const original = process.env.NEXT_PUBLIC_CONSULT_TAX;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_CONSULT_TAX;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_CONSULT_TAX;
    else process.env.NEXT_PUBLIC_CONSULT_TAX = original;
  });

  it("returns a clearly-labelled TODO placeholder when unset — never a guessed rate", () => {
    const tax = getConsultTaxConfig();
    expect(tax.isConfigured).toBe(false);
    expect(tax.ratePercent).toBeNull();
    expect(tax.label.toLowerCase()).toContain("confirm");
  });

  it("parses a percentage like 'HST 13%'", () => {
    process.env.NEXT_PUBLIC_CONSULT_TAX = "HST 13%";
    const tax = getConsultTaxConfig();
    expect(tax.isConfigured).toBe(true);
    expect(tax.ratePercent).toBe(13);
    expect(tax.label).toBe("HST 13%");
  });

  it("handles a decimal percentage", () => {
    process.env.NEXT_PUBLIC_CONSULT_TAX = "GST/HST 5.5%";
    expect(getConsultTaxConfig().ratePercent).toBe(5.5);
  });

  it("treats a non-percentage value (e.g. 'Taxes included') as configured with no separate rate", () => {
    process.env.NEXT_PUBLIC_CONSULT_TAX = "Taxes included";
    const tax = getConsultTaxConfig();
    expect(tax.isConfigured).toBe(true);
    expect(tax.ratePercent).toBeNull();
    expect(tax.label).toBe("Taxes included");
  });
});

describe("computeTaxAmount", () => {
  it("computes the correct amount for a percentage rate", () => {
    const tax = { label: "HST 13%", ratePercent: 13, isConfigured: true };
    expect(computeTaxAmount(250, tax)).toBeCloseTo(32.5, 2);
  });

  it("returns 0 when there is no parsed rate", () => {
    const tax = { label: "Taxes included", ratePercent: null, isConfigured: true };
    expect(computeTaxAmount(250, tax)).toBe(0);
  });
});
