/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is intentional for the static export and its strict entry-JS budget. */

import { navigation, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a className="wordmark wordmark--footer" href="/#top">
          <span>{site.name}</span>
          <small>
            {site.role} · {site.region}
          </small>
        </a>
        <nav className="site-footer__links" aria-label="Footer navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/privacy">Privacy</a>
        </nav>
      </div>

      <div className="site-footer__contact">
        <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.mapUrl} target="_blank" rel="noreferrer">
          {site.office}
        </a>
        <a href={site.instagram} target="_blank" rel="noreferrer">
          {site.instagramHandle}
        </a>
      </div>

      <div className="site-footer__legal">
        <span>© 2026 {site.name}. All rights reserved.</span>
        <span>{site.disclaimer}</span>
        <span>
          Iffy Khan licence no. {site.licence}. {site.agency} ORN {site.orn}.
        </span>
        <span>
          Designed and built by{" "}
          <a href={site.designerUrl} target="_blank" rel="noreferrer">
            Local Foundary
          </a>
        </span>
      </div>
    </footer>
  );
}
