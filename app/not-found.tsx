import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/content/contact";

export const metadata: Metadata = {
  title: "Page Not Found",
  alternates: { canonical: null },
};

export default function NotFound() {
  const whatsappMessage = encodeURIComponent(
    "Hi Iffy, I'd like to talk about Dubai property.",
  );

  return (
    <section className="page-shell page-shell--narrow" style={{ minHeight: "65svh" }}>
      <h1>This page doesn&apos;t exist.</h1>
      <p className="lede">
        The link may be out of date, or the page may have moved. Guidance for buying,
        selling and investing in Dubai and Abu Dhabi is one tap away.
      </p>
      <div className="ctas">
        <Link href="/" className="btn btn-dark">
          Back to the homepage
        </Link>
        <a
          href={`https://wa.me/${contact.whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-line"
        >
          Message Iffy on WhatsApp
        </a>
      </div>
    </section>
  );
}
