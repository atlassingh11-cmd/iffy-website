"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type LiquidGlassSharedProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

export type LiquidGlassAnchorProps = LiquidGlassSharedProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

export type LiquidGlassButtonProps = LiquidGlassSharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
  };

export type LiquidGlassProps =
  | LiquidGlassAnchorProps
  | LiquidGlassButtonProps;

const sharedClasses =
  "group relative isolate inline-flex min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-full px-5 py-3 text-center text-sm font-semibold leading-5 no-underline shadow-[0_10px_32px_rgba(8,20,24,0.14),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none forced-colors:border forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]";

function liquidGlassClasses(
  tone: "light" | "dark",
  className: string | undefined,
) {
  return cn(
    sharedClasses,
    tone === "dark"
      ? "bg-[rgba(12,27,31,0.78)] text-white supports-[backdrop-filter:blur(1px)]:bg-[rgba(12,27,31,0.5)] supports-[backdrop-filter:blur(1px)]:backdrop-blur-xl"
      : "bg-[rgba(244,241,234,0.92)] text-[#102125] supports-[backdrop-filter:blur(1px)]:bg-[rgba(244,241,234,0.68)] supports-[backdrop-filter:blur(1px)]:backdrop-blur-xl",
    className,
  );
}

const LiquidGlassBase = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  LiquidGlassProps
>(function LiquidGlass(
  { children, className, tone = "light", ...props },
  ref,
) {
  const visualLayers = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-px -z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.48),rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.18))] opacity-70 forced-colors:hidden"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] top-0 -z-10 h-px bg-white/80 opacity-80 forced-colors:hidden"
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  if ("href" in props && typeof props.href === "string") {
    const anchorProps = props as Omit<
      LiquidGlassAnchorProps,
      keyof LiquidGlassSharedProps
    >;
    return (
      <a
        {...anchorProps}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        className={liquidGlassClasses(tone, className)}
        data-liquid-glass=""
      >
        {visualLayers}
      </a>
    );
  }

  const buttonProps = props as Omit<
    LiquidGlassButtonProps,
    keyof LiquidGlassSharedProps
  >;
  return (
    <button
      {...buttonProps}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      className={liquidGlassClasses(tone, className)}
      data-liquid-glass=""
      type={buttonProps.type ?? "button"}
    >
      {visualLayers}
    </button>
  );
});

export const LiquidGlass = LiquidGlassBase as {
  (
    props: LiquidGlassAnchorProps & React.RefAttributes<HTMLAnchorElement>,
  ): React.ReactElement;
  (
    props: LiquidGlassButtonProps & React.RefAttributes<HTMLButtonElement>,
  ): React.ReactElement;
};
