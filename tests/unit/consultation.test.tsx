import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Consultation } from "@/components/landing/consultation";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

describe("Consultation external handoff", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-12T12:00:00.000Z"));
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("revalidates a preferred day before opening an external app", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<Consultation />);

    fireEvent.change(screen.getByLabelText("Your name"), {
      target: { value: "Amina" },
    });
    fireEvent.click(screen.getByRole("radio", { name: /^BuyingA home/ }));
    fireEvent.change(screen.getByLabelText("Preferred day in Dubai"), {
      target: { value: "2026-07-13" },
    });
    fireEvent.click(
      screen.getByRole("radio", { name: "Morning, 9am to 12pm" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Continue with this preference" }),
    );
    expect(
      screen.getByRole("heading", { name: "Choose how to continue." }),
    ).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(8 * 60 * 60 * 1_000 + 100);
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Continue on WhatsApp" }),
    );

    expect(open).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a day from tomorrow onwards in Dubai.",
    );
    expect(screen.getByLabelText("Your name")).toHaveValue("Amina");
  });
});
