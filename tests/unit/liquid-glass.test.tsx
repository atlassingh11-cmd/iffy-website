import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LiquidGlass } from "@/components/ui/liquid-glass";

describe("LiquidGlass", () => {
  afterEach(cleanup);

  it("keeps link semantics and forwards its ref", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <LiquidGlass href="/?intent=buying#consultation" ref={ref}>
        Talk to Iffy
      </LiquidGlass>,
    );

    const link = screen.getByRole("link", { name: "Talk to Iffy" });
    expect(link).toHaveAttribute("href", "/?intent=buying#consultation");
    expect(link).toHaveAttribute("data-liquid-glass");
    expect(ref.current).toBe(link);
  });

  it("renders a native button with stable dimensions and focus treatment", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <LiquidGlass ref={ref} tone="dark">
        Continue
      </LiquidGlass>,
    );

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("min-h-11");
    expect(button.className).toContain("focus-visible:ring-2");
    expect(button.className).toContain("forced-colors:border");
    expect(button.className).not.toContain("hover:px");
    expect(button.innerHTML).not.toContain("glass-distortion");
    expect(ref.current).toBe(button);
  });
});
