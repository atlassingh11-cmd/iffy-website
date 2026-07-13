"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDownRight } from "@phosphor-icons/react";
import { ArcRevealHero } from "@/components/ui/arc-reveal-hero";
import { LiquidGlass } from "@/components/ui/liquid-glass";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function Hero() {
  const primaryActionRef = useRef<HTMLAnchorElement>(null);
  const [enhanceWithVideo, setEnhanceWithVideo] = useState(false);

  useEffect(() => {
    const navigatorWithConnection = navigator as NavigatorWithConnection;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigatorWithConnection.connection?.saveData;
    const slowConnection = ["slow-2g", "2g"].includes(navigatorWithConnection.connection?.effectiveType ?? "");

    if (reduceMotion || saveData || slowConnection) return;

    let timer = 0;
    const queueEnhancement = () => {
      timer = window.setTimeout(() => setEnhanceWithVideo(true), 900);
    };

    if (document.readyState === "complete") queueEnhancement();
    else window.addEventListener("load", queueEnhancement, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", queueEnhancement);
    };
  }, []);

  return (
    <ArcRevealHero
      storageKey="iffy-arc-v1"
      greetingHold={410}
      revealDuration={720}
      focusTargetRef={primaryActionRef}
      introClassName="bg-[#0a1514] text-[#f3f4ed]"
      greetingClassName="text-4xl font-medium tracking-[-0.05em] sm:text-6xl lg:text-8xl"
      className="relative bg-[#0a1514]"
    >
      <section id="top" className="relative min-h-[calc(100dvh-5.25rem)] overflow-hidden bg-[#0a1514] text-white">
        <Image
          src="/media/iffy-laptop.webp"
          alt="Iffy Khan working with property clients"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_24%]"
        />
        {enhanceWithVideo ? (
          <video
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/media/iffy-laptop.webp"
            className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
          >
            <source src="/media/iffy-hero.mp4" type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,11,0.9)_0%,rgba(5,12,11,0.58)_48%,rgba(5,12,11,0.15)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a1514]/70 to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-5.25rem)] max-w-[1400px] items-end px-4 pb-9 pt-20 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(5.3rem,22vw,13.5rem)] font-medium leading-[0.73] tracking-[-0.085em]">
              IFFY
            </h1>
            <p className="mt-7 text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl lg:text-4xl">
              Advice you can hold me to.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base lg:text-lg">
              Direct property guidance across Dubai and Abu Dhabi, from first shortlist or valuation to handover and transfer.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LiquidGlass
                data-hero-focus="talk"
                ref={primaryActionRef}
                href="/?intent=not-sure#consultation"
                tone="light"
                className="min-h-12 px-5 py-3 text-sm font-semibold"
              >
                Talk to Iffy
              </LiquidGlass>
              <a
                data-hero-focus="services"
                href="#services"
                className="inline-flex min-h-12 items-center gap-2 px-2 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                See how I work
                <ArrowDownRight aria-hidden="true" size={17} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </ArcRevealHero>
  );
}
