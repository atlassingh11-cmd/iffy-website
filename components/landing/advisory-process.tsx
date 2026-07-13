const process = [
  ["Define the objective", "Home, investment, sale or a move. Start with the decision, not a postcode."],
  ["Test the evidence", "Compare price, supply, service charges, payment terms and realistic exit routes."],
  ["Make the recommendation", "See the upside, the trade-offs and the reason Iffy would proceed or walk away."],
  ["Complete properly", "Coordinate viewings, offers, SPA, mortgage, transfer and handover with one point of contact."],
  ["Stay useful", "Keep support for snagging, leasing strategy and portfolio reviews after the keys."],
] as const;

export function AdvisoryProcess() {
  return (
    <section id="process" className="bg-[var(--surface)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="max-w-[10ch] text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-[var(--ink)] sm:text-6xl lg:text-8xl">
          From first call to keys.
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:mt-20 lg:grid-cols-5 lg:gap-7">
          {process.map(([title, body], index) => (
            <li key={title} className="relative pt-7">
              <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-10 bg-[var(--accent-strong)]" />
              <p className="font-semibold text-[var(--ink)]">{title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
              <span className="sr-only">Position {index + 1} of {process.length}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
