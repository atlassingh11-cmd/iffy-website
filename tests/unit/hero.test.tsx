import * as React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Hero } from "@/components/landing/hero";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element -- Test double for next/image.
    <img alt={alt} {...props} />
  ),
}));

vi.mock("@/components/ui/arc-reveal-hero", () => ({
  ArcRevealHero: ({ children }: { children: React.ReactNode }) => children,
}));

function installMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: reducedMotion,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function installConnection(connection?: {
  saveData?: boolean;
  effectiveType?: string;
}) {
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: connection,
  });
}

describe("Hero media deferral", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installMatchMedia(false);
    installConnection({ effectiveType: "4g" });
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    ["reduced motion", true, { effectiveType: "4g" }],
    ["data saver", false, { saveData: true, effectiveType: "4g" }],
    ["a 2g connection", false, { effectiveType: "2g" }],
    ["a slow-2g connection", false, { effectiveType: "slow-2g" }],
  ])("does not attach the portrait video for %s", (_label, reduced, connection) => {
    installMatchMedia(reduced);
    installConnection(connection);
    const { container } = render(<Hero />);

    act(() => {
      window.dispatchEvent(new Event("load"));
      vi.advanceTimersByTime(2_000);
    });

    expect(container.querySelector('source[src="/media/iffy-hero.mp4"]')).toBeNull();
  });

  it("waits for window load and the post-load delay before attaching video", () => {
    const { container } = render(<Hero />);

    act(() => vi.advanceTimersByTime(2_000));
    expect(container.querySelector('source[src="/media/iffy-hero.mp4"]')).toBeNull();

    act(() => {
      window.dispatchEvent(new Event("load"));
      vi.advanceTimersByTime(899);
    });
    expect(container.querySelector('source[src="/media/iffy-hero.mp4"]')).toBeNull();

    act(() => vi.advanceTimersByTime(1));
    expect(
      container.querySelector('source[src="/media/iffy-hero.mp4"]'),
    ).toBeInTheDocument();
  });
});
