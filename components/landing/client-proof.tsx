import { testimonials } from "@/content/site";

const featuredReview = testimonials[1];

export function ClientProof() {
  return (
    <section id="testimonials" className="bg-[var(--surface-soft)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
      <figure className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-xl font-semibold tracking-[-0.025em] text-[var(--ink)] sm:text-2xl">
          Straight answers. No pressure.
        </h2>
        <blockquote className="text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
          “{featuredReview.featuredExcerpt}”
        </blockquote>
        <figcaption className="mt-8 text-sm font-semibold text-[var(--muted)] sm:text-base">
          {featuredReview.attribution}
        </figcaption>
      </figure>
    </section>
  );
}
