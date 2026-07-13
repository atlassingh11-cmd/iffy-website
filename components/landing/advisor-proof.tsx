import { AdvisorFilm } from "./advisor-film";

export function AdvisorProof() {
  return (
    <section id="about-iffy" className="overflow-hidden bg-[var(--surface)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[1.05fr_0.7fr] lg:gap-20">
        <div>
          <h2 className="max-w-[12ch] text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-[var(--ink)] sm:text-6xl lg:text-8xl">
            The recommendation has to be right, even when it costs a sale.
          </h2>
          <div className="mt-10 grid max-w-2xl gap-6 text-base leading-relaxed text-[var(--muted)] sm:grid-cols-2 sm:text-lg">
            <p>
              Iffy moved from retail banking into property after six years investing in the UK. He now advises across Dubai and Abu Dhabi.
            </p>
            <p>
              The work is personal: understand the objective, challenge weak assumptions and stay accountable through completion.
            </p>
          </div>
          <a
            href="/about"
            className="mt-9 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--ink)] underline decoration-[var(--accent)] underline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-strong)]"
          >
            Read Iffy&apos;s story
          </a>
        </div>
        <div className="flex justify-center lg:justify-end">
          <AdvisorFilm />
        </div>
      </div>
    </section>
  );
}
