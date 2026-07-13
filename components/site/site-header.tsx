"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is intentional for the static export and its strict entry-JS budget. */

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";

import { navigation, site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";
    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const controls = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("a, button:not([disabled])"),
      );
      const first = controls[0];
      const last = controls.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const desktop = window.matchMedia("(min-width: 62.001rem)");
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      setOpen(false);
      brandRef.current?.focus();
    };
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpointChange);
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a ref={brandRef} className="wordmark" href="/#top" aria-label="Iffy Khan home">
          <span>{site.name}</span>
          <small>
            {site.role} · {site.region}
          </small>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-action" href="/?intent=not-sure#consultation">
          Talk to Iffy
        </a>

        <button
          ref={triggerRef}
          className="menu-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden size={24} /> : <List aria-hidden size={24} />}
        </button>
      </div>

      {open ? (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <nav>
            {navigation.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a
              className="mobile-nav__action"
              href="/?intent=not-sure#consultation"
              onClick={() => setOpen(false)}
            >
              Talk to Iffy
            </a>
          </nav>
        </div>
      ) : null}
      <noscript>
        <nav className="no-script-nav" aria-label="Navigation without JavaScript">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/?intent=not-sure#consultation">Talk to Iffy</a>
        </nav>
      </noscript>
    </header>
  );
}
