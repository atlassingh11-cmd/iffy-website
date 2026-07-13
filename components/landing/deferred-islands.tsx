"use client";

import {
  type ComponentType,
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { contact } from "@/content/contact";
import type { ZoomParallaxProps } from "@/components/ui/zoom-parallax";

type EmptyProps = Record<string, never>;
type DeferredLoader<Props extends object> = () => Promise<
  ComponentType<Props>
>;

const loadAdvisoryTools: DeferredLoader<EmptyProps> = () =>
  import("@/components/tools/advisory-tools").then(
    (module) => module.AdvisoryTools,
  );

const loadConsultation: DeferredLoader<EmptyProps> = () =>
  import("@/components/landing/consultation").then(
    (module) => module.Consultation,
  );

const loadZoomParallax: DeferredLoader<ZoomParallaxProps> = () =>
  import("@/components/ui/zoom-parallax").then(
    (module) => module.ZoomParallax,
  );

function useNearViewport<Props extends object>(
  loader: DeferredLoader<Props>,
  targetId?: string,
): [
  MutableRefObject<HTMLDivElement | null>,
  ComponentType<Props> | null,
] {
  const hostRef = useRef<HTMLDivElement>(null);
  const [LoadedComponent, setLoadedComponent] =
    useState<ComponentType<Props> | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || LoadedComponent) return;

    let active = true;
    let loading = false;
    let retryTimer = 0;

    const load = () => {
      if (loading) return;
      loading = true;
      void loader()
        .then((component) => {
          if (active) setLoadedComponent(() => component);
        })
        .catch(() => {
          loading = false;
          if (active && retryCount < 1) {
            retryTimer = window.setTimeout(
              () => setRetryCount((current) => current + 1),
              750,
            );
          }
        });
    };

    if (targetId && window.location.hash === `#${targetId}`) {
      load();
      return () => {
        active = false;
        window.clearTimeout(retryTimer);
      };
    }

    if (typeof IntersectionObserver !== "function") {
      load();
      return () => {
        active = false;
        window.clearTimeout(retryTimer);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(host);
    return () => {
      active = false;
      window.clearTimeout(retryTimer);
      observer.disconnect();
    };
  }, [LoadedComponent, loader, retryCount, targetId]);

  return [hostRef, LoadedComponent];
}

function StaticMosaicShell({
  images,
  imageClassName,
}: ZoomParallaxProps) {
  return (
    <div
      className="iffy-parallax-static grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
      data-parallax-static=""
    >
      {images.slice(0, 7).map((item, index) => (
        <figure
          key={`${item.src}-${index}`}
          className={`relative m-0 min-h-44 overflow-hidden bg-[#d9ddd8] ${
            index === 0
              ? "col-span-2 row-span-2 min-h-80 sm:min-h-[28rem]"
              : ""
          } ${index === 5 ? "sm:col-span-2" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Static-export fallback is intentionally runtime-free. */}
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${imageClassName ?? ""}`}
            style={{ objectPosition: item.objectPosition }}
          />
        </figure>
      ))}
    </div>
  );
}

function DeferredHost({
  children,
  hostRef,
  name,
}: {
  children: ReactNode;
  hostRef: MutableRefObject<HTMLDivElement | null>;
  name: string;
}) {
  return (
    <div ref={hostRef} data-deferred-island={name}>
      {children}
    </div>
  );
}

function AdvisoryToolsShell() {
  return (
    <section
      id="tools"
      aria-labelledby="deferred-tools-heading"
      className="tool-atmosphere py-20 text-[var(--ink)] sm:py-28"
    >
      <div className="mx-auto w-[min(100%-2rem,72rem)]">
        <div className="max-w-2xl">
          <h2
            id="deferred-tools-heading"
            className="text-4xl font-medium tracking-tight sm:text-6xl"
          >
            Useful starting points, not final advice.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            Get a quick area, budget or buying-route starting point. Iffy can
            then test it against the details that matter.
          </p>
        </div>
      </div>
    </section>
  );
}

function ConsultationShell() {
  return (
    <section
      id="consultation"
      aria-labelledby="deferred-consultation-heading"
      className="consultation-atmosphere py-20 text-[var(--ink)] sm:py-28"
    >
      <div className="mx-auto grid w-[min(100%-2rem,72rem)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <h2
            id="deferred-consultation-heading"
            className="text-4xl font-medium tracking-tight sm:text-6xl"
          >
            Tell Iffy what you are considering.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">
            Choose a preferred day and Dubai-time window, or continue without
            one. Iffy will reply personally to agree the exact time.
          </p>
        </div>
        <div className="self-end text-sm leading-6 text-[var(--ink-soft)]">
          <p>Prefer to start directly?</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            <a
              className="min-h-11 py-2 underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)]"
              href={`https://wa.me/${contact.whatsappNumber}`}
            >
              WhatsApp {contact.phoneDisplay}
            </a>
            <a
              className="min-h-11 py-2 underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)]"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
            <a
              className="min-h-11 py-2 underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)]"
              href={`tel:${contact.phoneE164}`}
            >
              Call {contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DeferredAdvisoryTools() {
  const [hostRef, LoadedComponent] = useNearViewport(loadAdvisoryTools, "tools");

  return (
    <DeferredHost hostRef={hostRef} name="tools">
      {LoadedComponent ? <LoadedComponent /> : <AdvisoryToolsShell />}
    </DeferredHost>
  );
}

export function DeferredConsultation() {
  const [hostRef, LoadedComponent] = useNearViewport(
    loadConsultation,
    "consultation",
  );

  return (
    <DeferredHost hostRef={hostRef} name="consultation">
      {LoadedComponent ? <LoadedComponent /> : <ConsultationShell />}
    </DeferredHost>
  );
}

export function DeferredZoomParallax(props: ZoomParallaxProps) {
  const [hostRef, LoadedComponent] = useNearViewport(loadZoomParallax);

  return (
    <DeferredHost hostRef={hostRef} name="zoom-parallax">
      {LoadedComponent ? (
        <LoadedComponent {...props} />
      ) : (
        <StaticMosaicShell {...props} />
      )}
    </DeferredHost>
  );
}
