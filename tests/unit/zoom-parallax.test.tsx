import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ZoomParallax } from "@/components/ui/zoom-parallax";

const transformRanges = vi.hoisted(() => [] as number[][]);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: 0 }),
    useTransform: (
      _progress: unknown,
      _input: readonly number[],
      output: readonly number[],
    ) => {
      transformRanges.push([...output]);
      return 1;
    },
  };
});

const images = Array.from({ length: 9 }, (_, index) => ({
  src: `/media/property-${index + 1}.webp`,
  alt: `Property view ${index + 1}`,
}));

describe("ZoomParallax", () => {
  afterEach(() => {
    cleanup();
    transformRanges.length = 0;
  });

  it("caps the source set at seven and phone compositing at three", () => {
    const { container } = render(<ZoomParallax images={images} />);
    const section = container.querySelector("section");

    expect(section).toHaveAttribute("data-parallax-wide-count", "7");
    expect(section).toHaveAttribute("data-parallax-phone-count", "3");
    expect(container.innerHTML).not.toContain("property-8.webp");
    expect(container.innerHTML).not.toContain("property-9.webp");

    const motionStage = container.querySelector("[data-parallax-motion]");
    expect(motionStage?.querySelectorAll("img")).toHaveLength(7);
  });

  it("ships stable CSS geometry before hydration and complete static fallbacks", () => {
    const { container } = render(<ZoomParallax images={images.slice(0, 7)} />);
    const css = container.querySelector("style")?.textContent;

    expect(css).toContain("@media (scripting: enabled)");
    expect(css).toContain("height: 160svh");
    expect(css).toContain("height: 240svh");
    expect(css).toContain("prefers-reduced-motion: no-preference");
    expect(css).toContain("orientation: landscape");

    const staticMosaic = container.querySelector(".iffy-parallax-static");
    expect(staticMosaic?.querySelectorAll("img")).toHaveLength(7);
  });

  it("never declares a scale above four", () => {
    render(<ZoomParallax images={images.slice(0, 7)} />);
    expect(transformRanges).toHaveLength(7);
    expect(Math.max(...transformRanges.flat())).toBe(4);
  });
});
