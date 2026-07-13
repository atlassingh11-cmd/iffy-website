import businessBay from "./areas/business-bay";
import downtownDubai from "./areas/downtown-dubai";
import dubaiHills from "./areas/dubai-hills";
import dubaiIslands from "./areas/dubai-islands";
import dubaiMarina from "./areas/dubai-marina";
import dubailand from "./areas/dubailand";
import palmJumeirah from "./areas/palm-jumeirah";
import saadiyatIsland from "./areas/saadiyat-island";

export type AreaGuide = {
  slug: string;
  name: string;
  city: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  heroImage: string;
  heroAlt: string;
  summary: string;
  schemas: Array<Record<string, unknown>>;
  contentHtml: string;
};

export const areaGuides = [
  palmJumeirah,
  dubaiHills,
  dubaiMarina,
  downtownDubai,
  businessBay,
  dubailand,
  dubaiIslands,
  saadiyatIsland,
] satisfies AreaGuide[];

export const areaGuideSlugs = areaGuides.map((guide) => guide.slug);

const landingAreaOrder = [
  "dubai-hills",
  "downtown-dubai",
  "dubai-marina",
  "business-bay",
  "dubai-islands",
  "palm-jumeirah",
  "dubailand",
  "saadiyat-island",
] as const;

export const landingAreaGuides = landingAreaOrder.map((slug) => {
  const guide = areaGuides.find((candidate) => candidate.slug === slug);
  if (!guide) {
    throw new Error(`Missing landing area guide for slug: ${slug}`);
  }
  return guide;
});

export function getAreaGuide(slug: string) {
  return areaGuides.find((guide) => guide.slug === slug);
}
