import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ArcRevealHero,
  type ArcRevealExitReason,
} from "@/components/ui/arc-reveal-hero";

const animationState = {
  reduced: false,
};

function installMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: animationState.reduced,
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

describe("ArcRevealHero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    animationState.reduced = false;
    window.sessionStorage.clear();
    installMatchMedia();
    vi.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("keeps hero content in the initial HTML and completes both lines within 1.8 seconds", () => {
    const onExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    render(
      <ArcRevealHero onExit={onExit} storageKey="iffy-arc-test">
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );

    const link = screen.getByRole("link", { name: "Talk to Iffy" });
    expect(link).toBeInTheDocument();
    expect(link.closest("[aria-hidden='true']")).toBeNull();

    act(() => vi.advanceTimersByTime(20));
    expect(screen.getByText("Buy properly.")).toBeInTheDocument();
    expect(link.closest("[aria-hidden='true']")).not.toBeNull();

    act(() => vi.advanceTimersByTime(421));
    expect(screen.getByText("Sell with confidence.")).toBeVisible();

    act(() => vi.advanceTimersByTime(421));
    const sweep = document.querySelector<HTMLElement>("[data-arc-sweep]");
    expect(sweep).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(800));
    expect(onExit).toHaveBeenCalledWith("timeout");
    expect(link.closest("[aria-hidden='true']")).toBeNull();
    expect(window.sessionStorage.getItem("iffy-arc-test")).toBe("seen");
  });

  it("skips on keyboard input, removes inert state, and focuses the target", () => {
    const primaryActionRef = React.createRef<HTMLAnchorElement>();
    const onExit = vi.fn<(reason: ArcRevealExitReason) => void>();

    render(
      <ArcRevealHero focusTargetRef={primaryActionRef} onExit={onExit}>
        <a href="#consultation" ref={primaryActionRef}>
          Talk to Iffy
        </a>
      </ArcRevealHero>,
    );

    act(() => vi.advanceTimersByTime(20));
    const link = screen.getByRole("link", {
      name: "Talk to Iffy",
      hidden: true,
    });
    const content = link.parentElement;
    expect(content?.inert).toBe(true);

    fireEvent.keyDown(document, { key: "Escape" });
    act(() => vi.advanceTimersByTime(20));

    expect(onExit).toHaveBeenCalledWith("keyboard");
    expect(content?.inert).toBe(false);
    expect(link).toHaveFocus();
  });

  it("never mounts the overlay for reduced motion or a prior session", () => {
    animationState.reduced = true;
    const reducedExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    const { unmount } = render(
      <ArcRevealHero onExit={reducedExit}>
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );
    expect(reducedExit).toHaveBeenCalledWith("reduced-motion");
    expect(screen.queryByText("Buy properly.")).not.toBeInTheDocument();
    unmount();

    animationState.reduced = false;
    window.sessionStorage.setItem("iffy-seen", "seen");
    const returningExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    render(
      <ArcRevealHero onExit={returningExit} storageKey="iffy-seen">
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );
    expect(returningExit).toHaveBeenCalledWith("returning-visit");
    expect(screen.queryByText("Buy properly.")).not.toBeInTheDocument();
  });

  it("fails open when session storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    const onExit = vi.fn<(reason: ArcRevealExitReason) => void>();

    render(
      <ArcRevealHero onExit={onExit} storageKey="iffy-storage-blocked">
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );

    expect(onExit).toHaveBeenCalledWith("storage-unavailable");
    expect(screen.getByRole("link", { name: "Talk to Iffy" })).toBeVisible();
    expect(screen.queryByText("Buy properly.")).not.toBeInTheDocument();
  });

  it("fails open for late hydration and input before the first frame", () => {
    const lateExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    vi.spyOn(performance, "now").mockReturnValue(1_001);
    const { unmount } = render(
      <ArcRevealHero onExit={lateExit}>
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );
    expect(lateExit).toHaveBeenCalledWith("late-hydration");
    expect(screen.queryByText("Buy properly.")).not.toBeInTheDocument();
    unmount();

    vi.spyOn(performance, "now").mockReturnValue(0);
    const preFrameExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    render(
      <ArcRevealHero onExit={preFrameExit}>
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );
    fireEvent.pointerDown(window);
    act(() => vi.advanceTimersByTime(20));
    expect(preFrameExit).toHaveBeenCalledWith("late-hydration");
    expect(screen.queryByText("Buy properly.")).not.toBeInTheDocument();
  });

  it("skips on pointer input and restores the underlying hero", () => {
    const onExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    render(
      <ArcRevealHero onExit={onExit}>
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );
    act(() => vi.advanceTimersByTime(20));

    const greeting = screen.getByText("Buy properly.");
    const overlay = greeting.closest<HTMLElement>("[aria-hidden='true']");
    expect(overlay).not.toBeNull();
    fireEvent.pointerDown(overlay as HTMLElement);
    act(() => vi.advanceTimersByTime(20));

    expect(onExit).toHaveBeenCalledWith("pointer");
    expect(screen.getByRole("link", { name: "Talk to Iffy" })).toBeVisible();
  });

  it("uses the hard timeout when the CSS animation never completes", () => {
    const onExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    render(
      <ArcRevealHero onExit={onExit}>
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );

    act(() => vi.advanceTimersByTime(20));
    act(() => vi.advanceTimersByTime(421));
    act(() => vi.advanceTimersByTime(421));
    act(() => vi.advanceTimersByTime(800));
    expect(onExit).toHaveBeenCalledWith("timeout");
    expect(screen.getByRole("link", { name: "Talk to Iffy" })).toBeVisible();
  });

  it("clears timers and listeners on unmount", () => {
    const cleanupExit = vi.fn<(reason: ArcRevealExitReason) => void>();
    const pending = render(
      <ArcRevealHero onExit={cleanupExit}>
        <a href="#consultation">Talk to Iffy</a>
      </ArcRevealHero>,
    );
    act(() => vi.advanceTimersByTime(20));
    pending.unmount();
    act(() => vi.advanceTimersByTime(2_000));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(cleanupExit).not.toHaveBeenCalled();
  });
});
