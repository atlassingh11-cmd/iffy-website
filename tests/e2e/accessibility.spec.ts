import { expect, test } from "@playwright/test";

test("mobile visitors can navigate the static export without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  await page.goto("/");
  const staticNavigation = page.getByRole("navigation", {
    name: "Navigation without JavaScript",
  });
  await expect(staticNavigation).toBeVisible();
  await expect(
    staticNavigation.getByRole("link", { name: "Areas", exact: true }),
  ).toBeVisible();

  await context.close();
});

test.describe("accessibility contract", () => {
  test("honours reduced motion and preserves the full static page", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator("[data-arc-phase='done']")).toBeVisible();
    await expect(page.locator(".iffy-parallax-static")).toBeVisible();
    await expect(page.getByRole("heading", { name: "IFFY", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tell Iffy what you are considering." })).toBeVisible();
  });

  test("provides labelled consultation controls and a visible keyboard focus", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#consultation");

    const name = page.getByLabel("Your name");
    await expect(name).toBeVisible();
    await name.focus();
    await expect(name).toBeFocused();

    const outline = await name.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return `${style.outlineStyle} ${style.boxShadow}`;
    });
    expect(outline).not.toBe("none none");

    await expect(page.getByRole("group", { name: "What would you like help with?" })).toBeVisible();
    await expect(page.getByText("This is a preference, not live availability.")).toBeVisible();
  });
});
