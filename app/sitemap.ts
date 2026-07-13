import type { MetadataRoute } from "next";

import { areaGuides } from "@/content/area-guides";
import { SITE_URL } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: "2026-07-12",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: "2026-07-11",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/areas`,
      lastModified: "2026-07-12",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...areaGuides.map((guide) => ({
      url: `${SITE_URL}/areas/${guide.slug}`,
      lastModified:
        guide.slug === "dubailand" || guide.slug === "dubai-islands"
          ? "2026-07-12"
          : "2026-07-11",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
