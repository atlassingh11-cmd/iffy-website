import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How enquiries made through iffykhan.ae are handled.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy | Iffy Khan",
    description: "How enquiries made through iffykhan.ae are handled.",
    url: "/privacy",
    images: ["/media/iffykhan-og.jpg"],
  },
};

export default function PrivacyPage() {
  return (
    <section className="page-shell page-shell--narrow">
      <h1>How your details are handled.</h1>
      <div className="page-shell__prose">
        <p>
          The consultation form creates a draft in your browser. This website does
          not submit or store that draft. If you choose WhatsApp, email or phone, the
          details you send are handled by that external service and your device under
          their own terms and privacy policies. Iffy uses the details he receives to
          respond to your enquiry.
        </p>
        <p>
          This site does not use advertising or analytics cookies. It stores only a
          non-personal session marker in your browser so the short homepage
          introduction does not replay during the same visit.
        </p>
        <p>
          Information on this site is for guidance only and is not financial advice.
          No returns are guaranteed. Fees, availability and costs should be confirmed
          at the time of purchase.
        </p>
        <p>
          To ask about your data, or to have your details removed from any
          correspondence, contact <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
      <div className="ctas">
        <Link href="/" className="btn btn-dark">
          Back to the site
        </Link>
      </div>
    </section>
  );
}
