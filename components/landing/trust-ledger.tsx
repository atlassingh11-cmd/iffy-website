const credentials = [
  ["Licensed property advisor", "Licence 91889"],
  ["Through Kamani Living", "ORN 1247700"],
  ["Based in Dubai Hills", "Office 104, Building 4"],
  ["One point of contact", "You deal with Iffy directly"],
] as const;

export function TrustLedger() {
  return (
    <section aria-label="Credentials" className="bg-[var(--surface)] px-4 py-7 sm:px-6 lg:px-10">
      <dl className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4 lg:gap-10">
        {credentials.map(([term, detail]) => (
          <div key={term} className="min-w-0">
            <dt className="text-[0.72rem] font-semibold leading-tight text-[var(--muted)] sm:text-xs">
              {term}
            </dt>
            <dd className="mt-1 text-sm font-medium leading-snug text-[var(--ink)] sm:text-base">
              {detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
