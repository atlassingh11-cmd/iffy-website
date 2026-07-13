import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { site, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "About Iffy Khan | Dubai & Abu Dhabi Property Specialist" },
  description:
    "Learn about Iffy Khan, a Dubai and Abu Dhabi property advisor helping buyers, sellers and investors compare off-plan, ready homes, resale and investment opportunities with clarity.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "About Iffy Khan | Dubai & Abu Dhabi Property Specialist",
    description:
      "Advisory-led Dubai and Abu Dhabi property guidance across off-plan, ready homes and the secondary market.",
    images: [
      {
        url: "/media/iffykhan-og.jpg",
        width: 1200,
        height: 630,
        alt: "Iffy Khan, Property Advisory, Dubai and Abu Dhabi",
      },
    ],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Iffy Khan",
  jobTitle: "Dubai & Abu Dhabi Property Advisor",
  worksFor: { "@type": "Organization", name: "Kamani Living" },
  telephone: site.phoneE164,
  email: site.email,
  areaServed: ["Dubai", "Abu Dhabi"],
  knowsAbout: [
    "Off-plan property",
    "Dubai secondary market",
    "Property investment",
    "Residential resale",
  ],
  sameAs: [site.instagram],
  url: `${SITE_URL}/about`,
};

const waysToWork = [
  {
    number: "01",
    title: "Buyers",
    body: "Area selection, shortlisting, viewings, offer guidance and support through SPA and transfer.",
  },
  {
    number: "02",
    title: "Sellers",
    body: "Pricing against comparable sales, positioning, buyer qualification, NOC and transfer guidance, and a clear resale strategy.",
  },
  {
    number: "03",
    title: "Investors",
    body: "Off-plan comparison, developer track record, payment plans, handover timelines, yield after service charges and the exit route.",
  },
  {
    number: "04",
    title: "Relocators and end-users",
    body: "Lifestyle fit, schools, commute, community maturity and practical guidance on long-term suitability.",
  },
] as const;

const process = [
  {
    number: "01",
    title: "Understand the objective",
    body: "Budget, timeline, lifestyle, yield target or resale goal.",
  },
  {
    number: "02",
    title: "Compare the right options",
    body: "Areas, developers, buildings, payment plans, service charges and exit route.",
  },
  {
    number: "03",
    title: "Move with clarity",
    body: "Negotiation, paperwork, transfer route and post-purchase guidance.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div>
          <h1>About Iffy Khan</h1>
          <p className="lede">Clear advice. No pressure. One point of contact.</p>
          <p className="quiet">
            Iffy Khan is a Dubai and Abu Dhabi property specialist helping buyers,
            sellers and investors make clear, informed decisions across off-plan,
            ready homes and the secondary market.
          </p>
          <div className="ctas">
            <Link href="/?intent=not-sure#consultation" className="btn btn-dark">
              Talk to Iffy
            </Link>
            <Link href="/areas" className="btn btn-line">
              Explore area guides
            </Link>
          </div>
        </div>
        <Image
          src="/media/fallback-iffy.jpg"
          width={480}
          height={720}
          alt="Iffy Khan at Kamani Living in Dubai"
          priority
        />
      </section>

      <section className="section">
        <div className="wrap">
          <div className="s-head">
            <h2>Advisory first. Pressure never.</h2>
          </div>
          <div className="area-prose">
            <p>
              Iffy works across Dubai and Abu Dhabi real estate with an advisory-led
              approach. His job is not to sell you a unit. It is to help you understand
              the market, compare opportunities properly and make a decision that fits
              your objective, whether that is capital appreciation, rental yield,
              portfolio diversification or a long-term home.
            </p>
            <p>
              Having worked across both advisory and property investment, he assesses
              not just what is available today, but how today&apos;s fundamentals may
              influence future performance.
            </p>
            <p>
              Iffy&apos;s goal is simple: to help clients move through the UAE property
              market with confidence. Whether someone is buying their first Dubai home,
              selling a property, comparing off-plan launches or building a long-term
              portfolio, his role is to simplify the decision, protect the client&apos;s
              time and focus on the outcome that genuinely fits.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--limestone)" }}>
        <div className="wrap s-head">
          <h2>Four ways to work together</h2>
        </div>
        <div className="principle-list">
          {waysToWork.map((item) => (
            <div key={item.number}>
              <span>{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="about-split">
          <Image
            src="/media/iffy-laptop.webp"
            width={1068}
            height={1600}
            alt="Iffy Khan preparing market analysis"
          />
          <div>
            <h2>Clarity before commitment.</h2>
            <div className="area-prose">
              <p>
                Dubai and Abu Dhabi reward timing and local insight, so every
                recommendation is data-backed and explained in plain terms. Education
                over pressure, always.
              </p>
              <p>
                And honesty even when it costs a deal: if the numbers do not work, Iffy
                will say so. Clients value advice they can hold him to, including advice
                against buying.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--limestone)" }}>
        <div className="wrap">
          <div className="s-head">
            <h2>Straightforward, start to finish.</h2>
          </div>
          <dl className="cc-facts">
            <div>
              <dt>One point of contact</dt>
              <dd>From first call to handover, you deal with Iffy.</dd>
            </div>
            <div>
              <dt>Two markets</dt>
              <dd>Dubai and Abu Dhabi, covered with the same discipline.</dd>
            </div>
            <div>
              <dt>Full spectrum</dt>
              <dd>Off-plan launches and the secondary market.</dd>
            </div>
            <div>
              <dt>Both perspectives</dt>
              <dd>Investor economics and end-user practicality.</dd>
            </div>
            <div>
              <dt>Transparent advice</dt>
              <dd>Data-backed, explained clearly, no inflated promises.</dd>
            </div>
            <div>
              <dt>Relationship-led</dt>
              <dd>Built for the long term, not the quick close.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap s-head">
          <h2>How Iffy works with you.</h2>
        </div>
        <div className="process-list">
          {process.map((item) => (
            <div key={item.number}>
              <span>{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section closecta">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2>Make the next move with clarity.</h2>
          <p style={{ maxWidth: "56ch", margin: "1rem auto 1.8rem" }}>
            Whether you are buying your first Dubai home, selling a property,
            comparing off-plan opportunities or building a long-term portfolio, Iffy
            can help you understand the market and move with confidence.
          </p>
          <div className="ctas" style={{ justifyContent: "center" }}>
            <Link href="/?intent=not-sure#consultation" className="btn btn-dark">
              Talk to Iffy
            </Link>
            <a
              href="https://wa.me/971585802689?text=Hi%20Iffy%2C%20I%27d%20like%20to%20talk%20about%20Dubai%20or%20Abu%20Dhabi%20property."
              className="btn btn-line"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp now
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
