import { DeferredZoomParallax } from "@/components/landing/deferred-islands";

const marketImages = [
  { src: "/media/hero-downtown.webp", alt: "Downtown Dubai skyline" },
  { src: "/media/hero-marina.webp", alt: "Dubai Marina waterfront" },
  { src: "/media/hero-palm.webp", alt: "Palm Jumeirah coastline" },
  { src: "/media/hero-interior.webp", alt: "Contemporary UAE home interior" },
  { src: "/media/dubai-hills.webp", alt: "Dubai Hills golf course and homes" },
  { src: "/media/saadiyat.webp", alt: "Saadiyat Island waterfront" },
  { src: "/media/business-bay.webp", alt: "Business Bay towers and canal" },
] as const;

export function MarketPerspective() {
  return (
    <section aria-labelledby="market-perspective-title" className="bg-[var(--surface)] py-20 text-[var(--ink)] sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <h2
          id="market-perspective-title"
          className="max-w-[12ch] text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
        >
          The right area is a financial decision and a life decision.
        </h2>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Price is only one variable. Supply, lifestyle, rental demand and the next buyer all shape the recommendation.
        </p>
      </div>
      <div className="mt-12 sm:mt-16">
        <DeferredZoomParallax images={[...marketImages]} />
      </div>
    </section>
  );
}
