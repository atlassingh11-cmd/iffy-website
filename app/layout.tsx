import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { realEstateAgentSchema, SITE_URL } from "@/content/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Iffy Khan | Dubai & Abu Dhabi Property Advisory",
    template: "%s | Iffy Khan",
  },
  description:
    "Buy, sell and invest in Dubai and Abu Dhabi property with Iffy Khan. Advisory-led guidance across off-plan, ready homes, resale and investment opportunities.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    siteName: "Iffy Khan Property Advisory",
    locale: "en_AE",
    url: "/",
    description:
      "Advisory-led guidance across off-plan, ready homes, resale and investment opportunities in Dubai and Abu Dhabi.",
    images: [
      {
        url: "/media/iffykhan-og.jpg",
        width: 1200,
        height: 630,
        alt: "Iffy Khan, property advisor in Dubai and Abu Dhabi",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/media/favicon.svg", type: "image/svg+xml" },
      { url: "/media/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/media/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171613",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AE" className={GeistSans.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
        />
      </body>
    </html>
  );
}
