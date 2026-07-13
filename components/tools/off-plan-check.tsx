"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export interface OffPlanAnswers {
  when: "now" | "soon" | "flex";
  income: "yes" | "no";
  pay: "staged" | "once";
  risk: "low" | "high";
  appeal: "new" | "est";
}

export interface OffPlanResult {
  verdict: "balanced" | "offplan" | "ready";
  heading: string;
  detail: string;
  reasons: string[];
  offPlanScore: number;
  readyScore: number;
}

export function checkOffPlanSuitability(answers: OffPlanAnswers): OffPlanResult {
  let offPlanScore = 0;
  let readyScore = 0;
  const reasons: string[] = [];
  if (answers.when === "now") { readyScore += 2; reasons.push("You need the property now, which only ready stock can deliver."); }
  if (answers.when === "soon") readyScore += 1;
  if (answers.when === "flex") { offPlanScore += 2; reasons.push("A flexible timeline lets you benefit from construction-phase pricing."); }
  if (answers.income === "yes") { readyScore += 2; reasons.push("Immediate rental income requires a completed, tenantable unit."); }
  if (answers.income === "no") offPlanScore += 1;
  if (answers.pay === "staged") { offPlanScore += 2; reasons.push("Developer payment plans spread cost through construction."); }
  if (answers.pay === "once") readyScore += 1;
  if (answers.risk === "low") { readyScore += 2; reasons.push("You value the certainty of inspecting a finished property."); }
  if (answers.risk === "high") { offPlanScore += 2; reasons.push("You are comfortable trading construction risk for launch pricing."); }
  if (answers.appeal === "new") offPlanScore += 1;
  if (answers.appeal === "est") readyScore += 1;
  if (Math.abs(offPlanScore - readyScore) <= 1) return {
    verdict: "balanced", heading: "It’s genuinely balanced", offPlanScore, readyScore, reasons,
    detail: "Your answers point both ways, which usually means the right choice depends on the specific project and community. Worth comparing one of each with Iffy.",
  };
  if (offPlanScore > readyScore) return {
    verdict: "offplan", heading: "Off-plan looks like the better fit", offPlanScore, readyScore, reasons,
    detail: "Based on your answers, off-plan’s staged payments and launch pricing align with your situation. Developer selection then becomes the critical decision.",
  };
  return {
    verdict: "ready", heading: "Ready property looks like the better fit", offPlanScore, readyScore, reasons,
    detail: "Based on your answers, a completed property matches your timeline and income needs. The focus becomes finding value in the secondary market.",
  };
}

const QUESTIONS = [
  { name: "when", legend: "When do you need the property?", options: [["now", "Ready to move or rent now"], ["soon", "Within 12 months"], ["flex", "2+ years, flexible"]] },
  { name: "income", legend: "Do you need rental income immediately?", options: [["yes", "Yes"], ["no", "No"]] },
  { name: "pay", legend: "How do you prefer to pay?", options: [["staged", "Staged payments over time"], ["once", "One complete purchase"]] },
  { name: "risk", legend: "Your comfort with construction-phase risk?", options: [["low", "Prefer a finished product"], ["high", "Comfortable, for the upside"]] },
  { name: "appeal", legend: "What appeals more?", options: [["new", "Newest product at launch pricing"], ["est", "Established community, see what you buy"]] },
] as const;

export function OffPlanCheck() {
  const [answers, setAnswers] = useState<Partial<OffPlanAnswers>>({});
  const [result, setResult] = useState<OffPlanResult | null>(null);
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.keys(answers).length !== QUESTIONS.length) { setError("Please answer all five questions first."); return; }
    setError(""); setResult(checkOffPlanSuitability(answers as OffPlanAnswers));
  }
  return <form onSubmit={submit} className="space-y-10">
    <p className="text-lg text-stone-600">Five questions. Your route.</p>
    {QUESTIONS.map((question, index) => <fieldset key={question.name} className="space-y-4">
      <legend className="text-lg font-medium text-stone-950"><span className="mr-3 text-sm tabular-nums text-stone-500">{String(index + 1).padStart(2, "0")}</span>{question.legend}</legend>
      <div className="flex flex-wrap gap-2">{question.options.map(([value, label]) => {
        const selected = answers[question.name] === value;
        return <label key={value} className={`cursor-pointer rounded-full px-4 py-3 text-sm transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${selected ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}><input className="sr-only" type="radio" name={question.name} value={value} checked={selected} onChange={() => setAnswers((current) => ({ ...current, [question.name]: value }))} />{label}</label>;
      })}</div>
    </fieldset>)}
    <button type="submit" className="min-h-11 rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Show my result</button>
    {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    {result ? <div aria-live="polite" className="space-y-6 bg-stone-100 p-6 sm:p-8"><h3 className="text-2xl font-medium text-stone-950">{result.heading}</h3><p className="text-stone-600">{result.detail}</p>{result.reasons.length ? <ul className="space-y-2 text-sm text-stone-600">{result.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul> : null}<p className="text-sm text-stone-500">A guide, not advice. Off-plan carries construction and delivery risk; ready stock carries pricing and condition risk. Both are manageable with the right due diligence.</p><Link href="/?intent=investing#consultation" className="inline-flex min-h-11 items-center rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white">Get Iffy&apos;s recommendation</Link></div> : null}
  </form>;
}
