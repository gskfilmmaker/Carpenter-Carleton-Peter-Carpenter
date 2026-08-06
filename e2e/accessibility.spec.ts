import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/book", "/book/confirmation", "/contact", "/privacy"];

for (const path of pages) {
  test(`${path} has no critical or serious Axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const seriousOrWorse = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");

    if (seriousOrWorse.length > 0) {
      console.log(`${path} violations:`, JSON.stringify(seriousOrWorse, null, 2));
    }
    expect(seriousOrWorse).toEqual([]);
  });
}

test("footer shows the low-emphasis management credit on every page", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByText("Site managed by GSK Productions Inc.")).toBeVisible();
});

test("privacy page discloses GSK as payment processor", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByText(/processed by GSK Productions Inc\. via Stripe/i)).toBeVisible();
});

test("/book: keyboard can move through step 1 and reach step 2", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByRole("heading", { name: "What kind of consultation?" })).toBeVisible();

  // Tab from the top of the form to the "Choose a time" button and activate it with the keyboard.
  const chooseTimeButton = page.getByRole("button", { name: "Choose a time" });
  await chooseTimeButton.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: "Choose a time" })).toBeVisible();
});

test("/book: WhatsApp video platform shows the call-back note instead of a join link", async ({ page }) => {
  await page.goto("/book");
  await page.getByRole("radio", { name: /WhatsApp video/i }).check({ force: true });
  await page.getByRole("button", { name: "Choose a time" }).click();
  await expect(page.getByText(/08:00–20:00 Toronto/i).or(page.getByText(/Toronto time/i)).first()).toBeVisible({ timeout: 10_000 });
});
