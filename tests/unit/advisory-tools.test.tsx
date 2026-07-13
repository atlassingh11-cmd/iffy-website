import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdvisoryTools } from "@/components/tools/advisory-tools";
import {
  recommendAreas,
  type AreaAnswers,
} from "@/components/tools/area-finder";
import {
  calculateBuyingCosts,
  type BudgetInput,
  type InitialPayment,
} from "@/components/tools/budget-calculator";
import {
  checkOffPlanSuitability,
  type OffPlanAnswers,
} from "@/components/tools/off-plan-check";
import legacyTools from "@/tests/fixtures/legacy-tools.json";

describe("legacy advisory tool behavior", () => {
  it("matches every frozen area-finder example", () => {
    for (const example of legacyTools.areaFinder.cases) {
      expect(
        recommendAreas(example.answers as AreaAnswers).map((area) => area.name),
      ).toEqual(example.expected);
    }
  });

  it("matches every frozen buying-cost example", () => {
    for (const example of legacyTools.budgetCalculator.cases) {
      const { initialPaymentPercent, ...fixtureInput } = example.input;
      const input = {
        ...fixtureInput,
        ...(initialPaymentPercent
          ? { initialPayment: initialPaymentPercent as InitialPayment }
          : {}),
      } as BudgetInput;

      expect(calculateBuyingCosts(input).total).toBe(example.expectedTotal);
    }
  });

  it("matches every frozen off-plan-versus-ready example", () => {
    for (const example of legacyTools.offPlanReady.cases) {
      expect(
        checkOffPlanSuitability(example.answers as OffPlanAnswers).heading,
      ).toBe(example.expected);
    }
  });

  it("preserves area scoring and budget penalties", () => {
    expect(recommendAreas({ goal: "invest", budget: "b1", life: "beach", type: "apt", prio: "yield" }).map((area) => area.name))
      .toEqual(["Dubai Marina", "Business Bay", "Dubai Islands"]);
    expect(recommendAreas({ goal: "both", budget: "b4", life: "beach", type: "villa", prio: "lifestyle" }).map((area) => area.name))
      .toEqual(["Palm Jumeirah", "Saadiyat, AD", "Dubai Hills"]);
  });

  it("preserves ready purchase mortgage formulas", () => {
    const firstHome = calculateBuyingCosts({ price: 1_800_000, type: "ready", funding: "mortgage", purpose: "first" });
    expect(firstHome.heading).toBe("With a mortgage (20% down payment)");
    expect(firstHome.total).toBe(496_020);

    const investment = calculateBuyingCosts({ price: 1_800_000, type: "ready", funding: "mortgage", purpose: "invest" });
    expect(investment.heading).toBe("With a mortgage (40% down payment)");
    expect(investment.total).toBe(851_520);

    const highValue = calculateBuyingCosts({ price: 6_000_000, type: "ready", funding: "mortgage", purpose: "first" });
    expect(highValue.heading).toBe("With a mortgage (30% down payment)");
    expect(highValue.total).toBe(2_226_720);
  });

  it("preserves cash, off-plan and threshold formulas", () => {
    expect(calculateBuyingCosts({ price: 1_800_000, type: "ready", funding: "cash" }).total).toBe(1_914_580);
    expect(calculateBuyingCosts({ price: 1_800_000, type: "offplan", initialPayment: 20 }).total).toBe(433_100);
    expect(calculateBuyingCosts({ price: 499_999, type: "ready", funding: "cash" }).rows[1].amount).toBe(2_100);
    expect(calculateBuyingCosts({ price: 500_000, type: "ready", funding: "cash" }).rows[1].amount).toBe(4_200);
    expect(() => calculateBuyingCosts({ price: 99_999, type: "ready" })).toThrow(RangeError);
  });

  it("preserves off-plan, ready and balanced recommendations", () => {
    const offPlan = checkOffPlanSuitability({ when: "flex", income: "no", pay: "staged", risk: "high", appeal: "new" });
    expect(offPlan).toMatchObject({ verdict: "offplan", offPlanScore: 8, readyScore: 0, heading: "Off-plan looks like the better fit" });
    expect(offPlan.reasons).toHaveLength(3);

    const ready = checkOffPlanSuitability({ when: "now", income: "yes", pay: "once", risk: "low", appeal: "est" });
    expect(ready).toMatchObject({ verdict: "ready", offPlanScore: 0, readyScore: 8, heading: "Ready property looks like the better fit" });

    const balanced = checkOffPlanSuitability({ when: "soon", income: "no", pay: "staged", risk: "low", appeal: "new" });
    expect(balanced).toMatchObject({ verdict: "balanced", offPlanScore: 4, readyScore: 3, heading: "It’s genuinely balanced" });
  });
});

describe("advisory tool disclosure", () => {
  it("shows one semantic panel and supports arrow-key tab selection", () => {
    render(<AdvisoryTools />);
    const areaTab = screen.getByRole("tab", { name: "Area finder" });
    const budgetTab = screen.getByRole("tab", { name: "Budget calculator" });
    expect(areaTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Area finder");

    areaTab.focus();
    fireEvent.keyDown(areaTab, { key: "ArrowRight" });
    expect(budgetTab).toHaveAttribute("aria-selected", "true");
    expect(budgetTab).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Budget calculator");
  });
});
