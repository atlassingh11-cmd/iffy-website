import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { landingAreaGuides } from "@/content/area-guides";

export function AreaIntelligence() {
  return (
    <section id="communities" className="bg-[var(--surface-soft)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
        <div>
          <h2 className="max-w-[10ch] text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-[var(--ink)] sm:text-6xl lg:text-8xl">
            Start with the objective, not the postcode.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Schools, yield, commute, supply and exit demand matter differently for every buyer. Area guides are useful starting points, not final advice.
          </p>
          <nav aria-label="Area guides" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
            {landingAreaGuides.map((area) => (
              <a
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group flex min-h-11 items-center justify-between gap-3 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-strong)] sm:text-base"
              >
                {area.name}
                <ArrowUpRight aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={16} weight="bold" />
              </a>
            ))}
          </nav>
        </div>
        <figure className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] lg:aspect-[5/6]">
          <Image
            src="/media/dubai-hills.webp"
            alt="Green fairways and homes at Dubai Hills Estate"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </figure>
      </div>
    </section>
  );
}
