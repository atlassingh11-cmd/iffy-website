import { expect, test } from "@playwright/test";

test.describe("trust-first landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("communicates the offer and both advice routes within two mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "IFFY", exact: true })).toBeVisible();
    await expect(page.getByText("Licence 91889", { exact: true })).toBeVisible();

    const buying = page.getByRole("heading", { name: "Know what you are buying into." });
    const selling = page.getByRole("heading", { name: "Sell with the facts on your side." });
    await expect(buying).toBeVisible();
    await expect(selling).toBeVisible();

    const buyingY = await buying.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    const sellingY = await selling.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    expect(buyingY).toBeLessThanOrEqual(1688);
    expect(sellingY).toBeLessThanOrEqual(1688);
  });

  test("keeps the advisor film out of the request graph until Play", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    await page.goto("/");
    const play = page.getByRole("button", { name: "Play the Meet Iffy film" });
    await play.scrollIntoViewIfNeeded();
    await expect(play).toBeVisible();

    expect(requests.some((url) => url.endsWith("/media/iffy-film.mp4"))).toBe(false);
    await play.click();
    await expect.poll(() => requests.some((url) => url.endsWith("/media/iffy-film.mp4"))).toBe(true);
  });

  test("keeps the transcript usable when advisor-film playback fails", async ({ page }) => {
    await page.route("**/media/iffy-film.mp4", (route) => route.abort());
    await page.goto("/");

    await page.getByRole("button", { name: "Play the Meet Iffy film" }).click();
    await expect(
      page.getByText(/The film could not (?:load|play)\./),
    ).toBeVisible();
    await expect(page.getByText("Read what the film covers")).toBeVisible();
  });

  test("handles the normal-motion arc lifecycle and fails open on time", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => {
      window.sessionStorage.removeItem("iffy-arc-v1");
      const state = window as typeof window & { __iffyArcPhases?: string[] };
      state.__iffyArcPhases = [];
      const record = () => {
        const phase = document
          .querySelector("[data-arc-phase]")
          ?.getAttribute("data-arc-phase");
        if (phase && state.__iffyArcPhases?.at(-1) !== phase) {
          state.__iffyArcPhases?.push(phase);
        }
      };
      new MutationObserver(record).observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    });

    await page.goto("/");
    const arc = page.locator("[data-arc-phase]");
    await expect(arc).toHaveAttribute("data-arc-phase", "done", {
      timeout: 1_800,
    });
    const exitReason = await arc.getAttribute("data-arc-exit-reason");
    expect(["completed", "late-hydration", "timeout"]).toContain(exitReason);
    const phases = await page.evaluate(
      () =>
        (window as typeof window & { __iffyArcPhases?: string[] })
          .__iffyArcPhases ?? [],
    );
    expect(phases).toContain("idle");
    expect(phases.at(-1)).toBe("done");
    if (phases.includes("intro")) expect(phases).toContain("reveal");
    if (phases.includes("reveal")) expect(exitReason).toBe("completed");
    await expect(page.getByRole("link", { name: "Talk to Iffy" }).first()).toBeVisible();
  });

  test("uses local media and avoids banned display punctuation", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    const visibleText = await page.locator("body").innerText();

    expect(html).not.toMatch(/unsplash|figma\.com|picsum/i);
    expect(visibleText).not.toMatch(/[—–]/);
  });
});
