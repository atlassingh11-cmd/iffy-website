import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const routes = [
  {
    title: "Know what you are buying into.",
    body: "Compare the area, the asset and the exit before you commit.",
    href: "/?intent=buying#consultation",
    image: "/media/hero-interior.webp",
    alt: "Contemporary residential interior in the UAE",
    action: "Buying advice",
  },
  {
    title: "Sell with the facts on your side.",
    body: "Position the property properly, price it honestly and manage the transfer clearly.",
    href: "/?intent=selling#consultation",
    image: "/media/hero-marina.webp",
    alt: "Dubai Marina waterfront and residential towers",
    action: "Selling advice",
  },
] as const;

export function AdviceRoutes() {
  return (
    <section id="services" aria-label="Buying and selling advice" className="grid bg-[var(--ink)] md:grid-cols-2">
      {routes.map((route) => (
        <article key={route.title} className="group relative min-h-[17rem] overflow-hidden md:min-h-[34rem]">
          <Image
            src={route.image}
            alt={route.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,15,14,0.12),rgba(6,15,14,0.86))]" />
          <div className="relative flex min-h-[17rem] flex-col justify-end p-5 text-white sm:p-7 md:min-h-[34rem] lg:p-10">
            <h2 className="max-w-[12ch] text-3xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-4xl lg:text-6xl">
              {route.title}
            </h2>
            <p className="mt-4 max-w-[33rem] text-sm leading-relaxed text-white/78 sm:text-base">
              {route.body}
            </p>
            <a
              href={route.href}
              className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-white underline decoration-white/35 underline-offset-8 transition hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {route.action}
              <ArrowUpRight aria-hidden="true" size={17} weight="bold" />
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
