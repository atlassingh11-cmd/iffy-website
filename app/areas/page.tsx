import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { areaGuides } from "@/content/area-guides";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Dubai & Abu Dhabi Area Guides | Property",
  description:
    "Premium buyer guides to Dubai and Abu Dhabi's key communities, Palm Jumeirah, Dubai Hills, Marina, Downtown, Business Bay, Dubailand, Dubai Islands and Saadiyat Island, with prices, yields and honest advice.",
  alternates: { canonical: "/areas" },
  openGraph: {
    type: "website",
    url: "/areas",
    title: "Dubai & Abu Dhabi Area Guides | Iffy Khan",
    description:
      "Eight premium buyer guides: prices, yields, schools, lifestyle and honest considerations for Dubai and Abu Dhabi's key communities.",
    images: ["/media/iffykhan-og.jpg"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Areas",
      item: `${SITE_URL}/areas`,
    },
  ],
} as const;

export default function AreasPage() {
  return (
    <div className="area-hub">
      <div className="area-hub__intro">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>·</span>
          <span aria-current="page">Areas</span>
        </nav>
        <h1>Dubai and Abu Dhabi area guides</h1>
        <p className="lede">
          Realistic prices, yields, schools, lifestyle and the honest considerations
          each community deserves. Written for buyers first.
        </p>
      </div>

      <div className="area-hub__list">
        {areaGuides.map((guide) => (
          <article className="area-hub__item" key={guide.slug}>
            <div className="area-hub__image">
              <Image
                src={guide.heroImage}
                alt={guide.heroAlt}
                width={1600}
                height={1200}
              />
            </div>
            <div className="area-hub__copy">
              <span className="area-hub__city">{guide.city}</span>
              <h2>{guide.name}</h2>
              <p>{guide.summary}</p>
              <Link className="plink" href={`/areas/${guide.slug}`}>
                Read the {guide.name} guide
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="section closecta">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2>Not sure which area fits?</h2>
          <p style={{ maxWidth: "56ch", margin: "1rem auto 1.8rem" }}>
            Start with the objective, not the postcode. Iffy will help match the area
            to the way you want to buy, sell or invest.
          </p>
          <div className="ctas" style={{ justifyContent: "center" }}>
            <Link href="/?intent=not-sure#consultation" className="btn btn-dark">
              Talk to Iffy
            </Link>
            <a
              href="https://wa.me/971585802689?text=Hi%20Iffy%2C%20I%27d%20like%20help%20choosing%20the%20right%20area%20in%20Dubai%20or%20Abu%20Dhabi."
              target="_blank"
              rel="noreferrer"
              className="btn btn-line"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
