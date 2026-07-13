import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DeferredAdvisoryTools,
  DeferredConsultation,
} from "@/components/landing/deferred-islands";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

type ObserverCallback = ConstructorParameters<typeof IntersectionObserver>[0];

function holdDeferredIslands() {
  let callback: ObserverCallback | undefined;
  const disconnect = vi.fn();
  const observe = vi.fn();

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "800px 0px";
    readonly thresholds = [0];

    constructor(nextCallback: ObserverCallback) {
      callback = nextCallback;
    }

    disconnect = disconnect;
    observe = observe;
    takeRecords = () => [];
    unobserve = vi.fn();
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  return {
    enter: () => {
      if (!callback) throw new Error("Deferred island was not observed.");
      act(() =>
        callback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      );
    },
    observe,
  };
}

describe("deferred landing islands", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.history.replaceState({}, "", "/");
  });

  it("keeps consultation copy and direct contact in the static shell", () => {
    const observer = holdDeferredIslands();
    render(<DeferredConsultation />);

    expect(
      screen.getByRole("heading", {
        name: "Tell Iffy what you are considering.",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /WhatsApp \+971/ }),
    ).toHaveAttribute("href", "https://wa.me/971585802689");
    expect(screen.queryByLabelText("Your name")).not.toBeInTheDocument();
    expect(observer.observe).toHaveBeenCalledOnce();
  });

  it("loads each interactive island when its shell nears the viewport", async () => {
    const toolsObserver = holdDeferredIslands();
    const { unmount } = render(<DeferredAdvisoryTools />);
    toolsObserver.enter();
    expect(
      await screen.findByRole("tab", { name: "Area finder" }),
    ).toBeVisible();
    unmount();

    const consultationObserver = holdDeferredIslands();
    render(<DeferredConsultation />);
    consultationObserver.enter();
    expect(await screen.findByLabelText("Your name")).toBeVisible();
  });

  it("loads a consultation deep link even if layout work moves it off screen", async () => {
    window.history.replaceState({}, "", "/?intent=investing#consultation");
    const observer = holdDeferredIslands();

    render(<DeferredConsultation />);

    expect(await screen.findByLabelText("Your name")).toBeVisible();
    expect(observer.observe).not.toHaveBeenCalled();
  });

});
