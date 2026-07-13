"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export type PurchaseType = "ready" | "offplan";
export type FundingType = "mortgage" | "cash";
export type PurchasePurpose = "first" | "invest";
export type InitialPayment = 10 | 20 | 30;

export interface BudgetInput {
  price: number;
  type: PurchaseType;
  funding?: FundingType;
  purpose?: PurchasePurpose;
  initialPayment?: InitialPayment;
}

export interface BudgetRow { label: string; amount: number }
export interface BudgetResult { heading: string; rows: BudgetRow[]; total: number }

export function calculateBuyingCosts(input: BudgetInput): BudgetResult {
  if (!Number.isFinite(input.price) || input.price < 100_000) {
    throw new RangeError("Property price must be at least AED 100,000.");
  }
  const rows: BudgetRow[] = [];
  const add = (label: string, amount: number) => rows.push({ label, amount });
  let heading = "";
  if (input.type === "ready") {
    add("DLD transfer fee (4% + AED 580)", input.price * 0.04 + 580);
    add("Trustee office fee", input.price >= 500_000 ? 4_200 : 2_100);
    add("Agency fee (2% + VAT)", input.price * 0.021);
    if ((input.funding ?? "mortgage") === "mortgage") {
      const downPaymentRate = input.purpose === "invest" ? 0.4 : input.price >= 5_000_000 ? 0.3 : 0.2;
      const downPayment = input.price * downPaymentRate;
      const loan = input.price - downPayment;
      heading = `With a mortgage (${downPaymentRate * 100}% down payment)`;
      add(`Down payment (${downPaymentRate * 100}%)`, downPayment);
      add("Mortgage registration (0.25% of loan + AED 290)", loan * 0.0025 + 290);
      add("Bank arrangement fee (approx. 1% of loan)", loan * 0.01);
      add("Valuation fee (approx.)", 3_150);
    } else {
      heading = "Cash purchase";
      add("Property price", input.price);
    }
  } else {
    const initialPayment = input.initialPayment ?? 20;
    heading = `Off-plan, ${initialPayment}% initial payment`;
    add(`Initial payment (${initialPayment}% of price)`, input.price * (initialPayment / 100));
    add("DLD fee (4%)", input.price * 0.04);
    add("Registration admin (approx.)", 1_100);
  }
  return { heading, rows, total: rows.reduce((sum, row) => sum + row.amount, 0) };
}

const formatAED = (value: number) => `AED ${Math.round(value).toLocaleString("en-US")}`;

export function BudgetCalculator() {
  const [type, setType] = useState<PurchaseType>("ready");
  const [funding, setFunding] = useState<FundingType>("mortgage");
  const [purpose, setPurpose] = useState<PurchasePurpose>("first");
  const [initialPayment, setInitialPayment] = useState<InitialPayment>(20);
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setResult(calculateBuyingCosts({ price: Number(price), type, funding, purpose, initialPayment }));
      setError("");
    } catch {
      setResult(null);
      setError("Enter a property price of at least AED 100,000.");
    }
  }

  const fieldClass = "min-h-12 w-full bg-stone-100 px-4 py-3 text-stone-950 outline-none focus-visible:ring-2 focus-visible:ring-stone-950";
  return (
    <form onSubmit={submit} className="space-y-8">
      <p className="text-lg text-stone-600">Your day-one cash, estimated.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">Property price (AED)
          <input className={fieldClass} value={price} onChange={(event) => setPrice(event.target.value)} type="number" inputMode="numeric" min="100000" step="10000" placeholder="e.g. 1800000" />
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-700">Purchase type
          <select className={fieldClass} value={type} onChange={(event) => setType(event.target.value as PurchaseType)}><option value="ready">Ready, secondary market</option><option value="offplan">Off-plan, developer</option></select>
        </label>
        {type === "ready" ? <>
          <label className="space-y-2 text-sm font-medium text-stone-700">How are you buying?
            <select className={fieldClass} value={funding} onChange={(event) => setFunding(event.target.value as FundingType)}><option value="mortgage">With a mortgage</option><option value="cash">Cash</option></select>
          </label>
          <label className="space-y-2 text-sm font-medium text-stone-700">Purpose
            <select className={fieldClass} value={purpose} onChange={(event) => setPurpose(event.target.value as PurchasePurpose)}><option value="first">First home, to live</option><option value="invest">Investment or second property</option></select>
          </label>
        </> : <label className="space-y-2 text-sm font-medium text-stone-700">Initial payment on plan
          <select className={fieldClass} value={initialPayment} onChange={(event) => setInitialPayment(Number(event.target.value) as InitialPayment)}><option value="10">10%</option><option value="20">20%</option><option value="30">30%</option></select>
        </label>}
      </div>
      <button type="submit" className="min-h-11 rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Estimate my costs</button>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      {result ? <div aria-live="polite" className="space-y-6 bg-stone-100 p-6 sm:p-8">
        <h3 className="text-2xl font-medium text-stone-950">Estimated day-one cash · {result.heading}</h3>
        <dl className="space-y-3">{result.rows.map((row) => <div key={row.label} className="flex items-start justify-between gap-6 text-sm"><dt className="text-stone-600">{row.label}</dt><dd className="shrink-0 font-medium tabular-nums text-stone-950">{formatAED(row.amount)}</dd></div>)}
          <div className="flex items-start justify-between gap-6 pt-3 text-base font-medium"><dt>Estimated total upfront</dt><dd className="shrink-0 tabular-nums">{formatAED(result.total)}</dd></div>
        </dl>
        <p className="text-sm text-stone-500">Indicative only, based on published fees and standard UAE Central Bank rules. Confirm fees and government charges at the time of purchase. This is not financial advice.</p>
        <Link href="/?intent=buying#consultation" className="inline-flex min-h-11 items-center rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white">Ask Iffy to review this budget</Link>
      </div> : null}
    </form>
  );
}
