"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type ArcRevealGreeting = {
  text: string;
  lang?: string;
};

export type ArcRevealExitReason =
  | "completed"
  | "pointer"
  | "keyboard"
  | "reduced-motion"
  | "returning-visit"
  | "storage-unavailable"
  | "late-hydration"
  | "motion-error"
  | "timeout";

export interface ArcRevealHeroProps {
  greetings?: readonly ArcRevealGreeting[];
  greetingHold?: number;
  revealDuration?: number;
  storageKey?: string;
  className?: string;
  introClassName?: string;
  greetingClassName?: string;
  revealClassName?: string;
  focusTargetRef?: React.RefObject<HTMLElement | null>;
  onExit?: (reason: ArcRevealExitReason) => void;
  children?: React.ReactNode;
}

const DEFAULT_GREETINGS: readonly [ArcRevealGreeting, ArcRevealGreeting] = [
  { text: "Buy properly." },
  { text: "Sell with confidence." },
];

const MAX_INTRO_MS = 1_600;
const MAX_HYDRATION_DELAY_MS = 1_000;

type Phase = "idle" | "intro" | "reveal" | "done";

type NavigatorWithActivation = Navigator & {
  userActivation?: { hasBeenActive: boolean };
};

function twoGreetings(
  greetings: readonly ArcRevealGreeting[] | undefined,
): readonly [ArcRevealGreeting, ArcRevealGreeting] {
  if (!greetings?.length) return DEFAULT_GREETINGS;

  return [
    greetings[0] ?? DEFAULT_GREETINGS[0],
    greetings[1] ?? DEFAULT_GREETINGS[1],
  ];
}

function focusAfterExit(
  target: HTMLElement | null | undefined,
  fallback: HTMLElement | null,
) {
  window.requestAnimationFrame(() => {
    const destination =
      target ??
      fallback?.querySelector<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ) ??
      fallback;

    destination?.focus({ preventScroll: true });
  });
}

export function ArcRevealHero({
  greetings,
  greetingHold = 420,
  revealDuration = 650,
  storageKey,
  className,
  introClassName,
  greetingClassName,
  revealClassName,
  focusTargetRef,
  onExit,
  children,
}: ArcRevealHeroProps) {
  const resolvedGreetings = React.useMemo(
    () => twoGreetings(greetings),
    [greetings],
  );
  const safeGreetingHold = Math.min(Math.max(greetingHold, 120), 420);
  const safeRevealDuration = Math.min(Math.max(revealDuration, 240), 700);

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [index, setIndex] = React.useState(0);
  const [exitReason, setExitReason] = React.useState<ArcRevealExitReason | null>(
    null,
  );
  const revealRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const exitedRef = React.useRef(false);
  const hardStopRef = React.useRef<number | null>(null);

  const exit = React.useCallback(
    (reason: ArcRevealExitReason, shouldFocus = false) => {
      if (exitedRef.current) return;
      exitedRef.current = true;
      if (hardStopRef.current !== null) {
        window.clearTimeout(hardStopRef.current);
        hardStopRef.current = null;
      }
      setExitReason(reason);
      setPhase("done");
      onExit?.(reason);

      if (shouldFocus || previousFocusRef.current) {
        focusAfterExit(
          previousFocusRef.current ?? focusTargetRef?.current,
          revealRef.current,
        );
      }
    },
    [focusTargetRef, onExit],
  );

  React.useEffect(() => {
    if (phase !== "idle") return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      exit("reduced-motion");
      return;
    }

    const navigatorWithActivation = navigator as NavigatorWithActivation;
    const hydratedLate =
      performance.now() > MAX_HYDRATION_DELAY_MS ||
      navigatorWithActivation.userActivation?.hasBeenActive === true ||
      window.scrollX > 2 ||
      window.scrollY > 2 ||
      document.visibilityState !== "visible" ||
      (document.activeElement !== document.body &&
        document.activeElement !== document.documentElement);

    if (hydratedLate) {
      exit("late-hydration");
      return;
    }

    if (storageKey) {
      try {
        if (window.sessionStorage.getItem(storageKey)) {
          exit("returning-visit");
          return;
        }
        // Mark the visit before animation begins so a refresh cannot replay it.
        window.sessionStorage.setItem(storageKey, "seen");
      } catch {
        exit("storage-unavailable");
        return;
      }
    }

    let interacted = false;
    const noteInteraction = () => {
      interacted = true;
    };

    window.addEventListener("pointerdown", noteInteraction, {
      capture: true,
      once: true,
    });
    window.addEventListener("keydown", noteInteraction, {
      capture: true,
      once: true,
    });

    const frame = window.requestAnimationFrame(() => {
      if (interacted) {
        exit("late-hydration");
        return;
      }
      hardStopRef.current = window.setTimeout(
        () => exit("timeout"),
        MAX_INTRO_MS,
      );
      setPhase("intro");
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", noteInteraction, true);
      window.removeEventListener("keydown", noteInteraction, true);
    };
  }, [exit, phase, storageKey]);

  React.useEffect(
    () => () => {
      if (hardStopRef.current !== null) {
        window.clearTimeout(hardStopRef.current);
      }
    },
    [],
  );

  React.useEffect(() => {
    const content = revealRef.current;
    if (!content || (phase !== "intro" && phase !== "reveal")) return;

    const previousInert = Boolean(content.inert);
    const previousAriaHidden = content.getAttribute("aria-hidden");
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement && content.contains(activeElement)) {
      previousFocusRef.current = activeElement;
      activeElement.blur();
    }

    content.inert = true;
    content.setAttribute("aria-hidden", "true");

    return () => {
      content.inert = previousInert;
      if (previousAriaHidden === null) content.removeAttribute("aria-hidden");
      else content.setAttribute("aria-hidden", previousAriaHidden);
    };
  }, [phase]);

  React.useEffect(() => {
    if (phase !== "intro") return;

    const timeout = window.setTimeout(() => {
      if (index === 0) setIndex(1);
      else setPhase("reveal");
    }, safeGreetingHold);

    return () => window.clearTimeout(timeout);
  }, [index, phase, safeGreetingHold]);

  React.useEffect(() => {
    if (phase !== "intro" && phase !== "reveal") return;

    const skipWithKeyboard = (event: KeyboardEvent) => {
      event.preventDefault();
      exit("keyboard", true);
    };
    document.addEventListener("keydown", skipWithKeyboard, true);
    return () => document.removeEventListener("keydown", skipWithKeyboard, true);
  }, [exit, phase]);

  const showOverlay = phase === "intro" || phase === "reveal";
  const currentGreeting = resolvedGreetings[index];

  return (
    <section
      aria-label="Hero"
      className={cn(
        "relative isolate min-h-[calc(100svh-5.25rem)] w-full overflow-hidden",
        className,
      )}
      data-arc-phase={phase}
      data-arc-exit-reason={exitReason ?? undefined}
    >
      <div
        ref={revealRef}
        className={cn("relative z-0", revealClassName)}
        tabIndex={-1}
      >
        {children}
      </div>

      {showOverlay ? (
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-30 h-[calc(100svh-5.25rem)] cursor-pointer overflow-hidden bg-[var(--color-ink,#11100e)]",
              introClassName,
            )}
            onPointerDown={() => exit("pointer")}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {phase === "intro" ? (
                  <span
                    key={`${index}-${currentGreeting.text}`}
                    lang={currentGreeting.lang}
                    className={cn(
                      "iffy-greeting-in select-none px-6 text-center text-5xl font-semibold tracking-[-0.045em] text-[var(--color-limestone,#f3efe7)] sm:text-7xl lg:text-8xl",
                      greetingClassName,
                    )}
                  >
                    {currentGreeting.text}
                  </span>
                ) : null}
            </div>

            {phase === "reveal" ? (
              <div
                data-arc-sweep=""
                className="iffy-arc-sweep pointer-events-none absolute -inset-[30%] bg-[var(--arc-reveal-color,#f3efe7)]"
                onAnimationEnd={() => exit("completed")}
                style={{
                  "--iffy-arc-duration": `${safeRevealDuration}ms`,
                } as React.CSSProperties}
              />
            ) : null}
          </div>
        ) : null}
    </section>
  );
}
