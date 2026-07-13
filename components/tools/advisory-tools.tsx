"use client";

import { KeyboardEvent, useId, useState } from "react";
import { AreaFinder } from "./area-finder";
import { BudgetCalculator } from "./budget-calculator";
import { OffPlanCheck } from "./off-plan-check";

const TOOLS = [
  { id: "area", label: "Area finder", component: AreaFinder },
  { id: "budget", label: "Budget calculator", component: BudgetCalculator },
  { id: "offplan", label: "Off-plan or ready", component: OffPlanCheck },
] as const;

export function AdvisoryTools() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const CurrentTool = TOOLS[active].component;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next = active;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (active + 1) % TOOLS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (active - 1 + TOOLS.length) % TOOLS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TOOLS.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-tab-${TOOLS[next].id}`)?.focus();
  }

  return <section id="tools" aria-labelledby={`${uid}-heading`} className="tool-atmosphere py-20 text-[var(--ink)] sm:py-28">
    <div className="mx-auto w-[min(100%-2rem,72rem)]">
      <div className="max-w-2xl"><h2 id={`${uid}-heading`} className="text-4xl font-medium tracking-tight sm:text-6xl">Useful starting points, not final advice.</h2><p className="mt-6 text-lg leading-8 text-[var(--muted)]">Get a quick area, budget or buying-route starting point. Iffy can then test it against the details that matter.</p></div>
      <div role="tablist" aria-label="Property advisory tools" onKeyDown={handleKeyDown} className="mt-12 flex flex-wrap gap-2">
        {TOOLS.map((tool, index) => <button key={tool.id} id={`${uid}-tab-${tool.id}`} role="tab" aria-selected={active === index} aria-controls={`${uid}-panel-${tool.id}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} type="button" className={`min-h-11 rounded-full px-5 py-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-strong)] ${active === index ? "bg-[var(--ink)] text-[var(--limestone)]" : "bg-[color-mix(in_oklch,var(--paper)_72%,transparent)] text-[var(--ink-soft)] hover:bg-[var(--paper)]"}`}>{tool.label}</button>)}
      </div>
      <div id={`${uid}-panel-${TOOLS[active].id}`} role="tabpanel" aria-labelledby={`${uid}-tab-${TOOLS[active].id}`} className="mt-10 max-w-4xl" tabIndex={0}><CurrentTool /></div>
    </div>
  </section>;
}
