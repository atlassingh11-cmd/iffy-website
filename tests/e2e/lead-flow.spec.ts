import { expect, test } from "@playwright/test";

test.describe("consultation handoff", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?intent=investing#consultation");
    await expect(page.getByRole("heading", { name: "Tell Iffy what you are considering." })).toBeVisible();
  });

  test("keeps PII out of the site URL and allows a no-time route", async ({ page }) => {
    await page.getByLabel("Your name").fill("Amina Khan");
    await expect(page.getByRole("radio", { name: /Investing/ })).toBeChecked();
    await page.getByRole("button", { name: "Message without a preferred time" }).click();

    await expect(page.getByRole("heading", { name: "Choose how to continue." })).toBeVisible();
    await expect(page.getByText("I have not chosen a preferred day or time.")).toBeVisible();
    expect(page.url()).toContain("intent=investing");
    expect(page.url()).not.toContain("Amina");
    const consultation = page.locator("#consultation");
    await expect(consultation.getByRole("link", { name: /WhatsApp \+971/ })).toBeVisible();
    await expect(consultation.getByRole("link", { name: "iffy@kamaniliving.com" })).toBeVisible();
  });

  test("validates the first required field and does not claim an appointment", async ({ page }) => {
    await page.getByRole("button", { name: "Continue with this preference" }).click();
    await expect(page.getByLabel("Your name")).toBeFocused();
    await expect(page.locator("#consultation").getByRole("alert")).toContainText("Enter your name");

    await page.getByLabel("Your name").fill("Amina");
    await page.getByRole("button", { name: "Message without a preferred time" }).click();
    const consultation = page.locator("#consultation");
    await expect(consultation).not.toContainText(/sent|booked|confirmed/i);
    await expect(page.getByRole("button", { name: "Continue on WhatsApp" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Draft an email" })).toBeVisible();
  });

  test("carries a preferred Dubai day and window into the draft without confirming it", async ({ page }) => {
    await page.getByLabel("Your name").fill("Amina Khan");
    const firstAvailableDay = page
      .getByRole("grid")
      .locator("button:not(:disabled)")
      .first();
    await expect(firstAvailableDay).toBeVisible();
    const chosenDay = await firstAvailableDay.getAttribute("aria-label");
    await firstAvailableDay.click();
    await page.getByRole("radio", { name: /Afternoon/ }).check();
    await page.getByRole("button", { name: "Continue with this preference" }).click();

    const consultation = page.locator("#consultation");
    await expect(consultation.getByText(chosenDay ?? "", { exact: false })).toBeVisible();
    await expect(consultation).toContainText("Afternoon");
    await expect(consultation).toContainText(
      "This is only a preference. The exact time still needs to be agreed.",
    );
    await expect(consultation).not.toContainText(/booked|appointment confirmed/i);
  });

  test("updates intent after an in-page Next navigation", async ({ page }) => {
    await expect(page.getByRole("radio", { name: /Investing/ })).toBeChecked();
    await page.getByRole("link", { name: "Selling advice" }).click();

    await expect(page).toHaveURL(/intent=selling#consultation$/);
    await expect(page.getByRole("radio", { name: /Selling/ })).toBeChecked();
    await expect(page.getByRole("radio", { name: /Investing/ })).not.toBeChecked();
  });
});
