import legacyRoutes from "@/tests/fixtures/legacy-routes.json";
import { describe, expect, it } from "vitest";

import {
  areaGuides,
  areaGuideSlugs,
  getAreaGuide,
  landingAreaGuides,
} from "@/content/area-guides";

const expectedSlugs = [
  "business-bay",
  "downtown-dubai",
  "dubai-hills",
  "dubai-islands",
  "dubai-marina",
  "dubailand",
  "palm-jumeirah",
  "saadiyat-island",
];

describe("area guide content", () => {
  it("generates exactly the eight legacy routes", () => {
    expect([...areaGuideSlugs].sort()).toEqual(expectedSlugs);
    expect(new Set(areaGuideSlugs).size).toBe(8);
  });

  it("retains the legacy title, canonical, description and primary heading", () => {
    for (const guide of areaGuides) {
      const route = legacyRoutes.routes.find(
        (candidate) => candidate.path === `/areas/${guide.slug}`,
      );

      expect(route, guide.slug).toBeDefined();
      expect(guide.title).toBe(route?.title);
      expect(guide.description).toBe(route?.description);
      expect(guide.canonical).toBe(route?.canonical);
      expect(guide.contentHtml).toContain(`<h1>${route?.primaryHeading}</h1>`);
    }
  });

  it("keeps guide copy local and removes unsupported booking language", () => {
    for (const guide of areaGuides) {
      expect(guide.heroImage).toMatch(/^\/media\//);
      expect(guide.ogImage).toMatch(/^\/media\//);
      expect(guide.contentHtml).not.toMatch(/assets\/images|Book (?:a )?Consultation/i);
      expect(guide.contentHtml).not.toMatch(/class=["']eyebrow/);
      expect(guide.contentHtml).not.toMatch(/[—–]/);
      expect(guide.contentHtml).toContain("#consultation");
    }
  });

  it("looks guides up by slug without inventing a fallback", () => {
    expect(getAreaGuide("palm-jumeirah")?.name).toBe("Palm Jumeirah");
    expect(getAreaGuide("not-a-guide")).toBeUndefined();
  });

  it("keeps the intentional homepage guide order complete", () => {
    expect(landingAreaGuides.map((guide) => guide.slug)).toEqual([
      "dubai-hills",
      "downtown-dubai",
      "dubai-marina",
      "business-bay",
      "dubai-islands",
      "palm-jumeirah",
      "dubailand",
      "saadiyat-island",
    ]);
  });
});
