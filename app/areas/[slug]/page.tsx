import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { areaGuides, getAreaGuide } from "@/content/area-guides";

export const dynamicParams = false;

type AreaPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return areaGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getAreaGuide(slug);

  if (!guide) return {};

  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: guide.canonical },
    openGraph: {
      type: "article",
      url: guide.canonical,
      title: guide.ogTitle,
      description: guide.ogDescription,
      images: [
        {
          url: guide.ogImage,
          width: 1200,
          height: 630,
          alt: guide.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle,
      description: guide.ogDescription,
      images: [guide.ogImage],
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { slug } = await params;
  const guide = getAreaGuide(slug);

  if (!guide) notFound();

  return (
    <>
      <article dangerouslySetInnerHTML={{ __html: guide.contentHtml }} />
      {guide.schemas.map((schema, index) => (
        <script
          key={`${guide.slug}-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
