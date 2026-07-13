"use client";

/* eslint-disable @next/next/no-img-element -- Local static-export media has no image service and is lazy outside LCP. */

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

export interface ZoomParallaxImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

export interface ZoomParallaxProps {
  images: readonly ZoomParallaxImage[];
  className?: string;
  imageClassName?: string;
}

const responsiveSlots = [
  "left-1/2 top-1/2 h-[52svh] w-[76vw] -translate-x-1/2 -translate-y-1/2 md:h-[48vh] md:w-[46vw]",
  "left-[4vw] top-[8svh] h-[28svh] w-[46vw] md:left-[7vw] md:top-[8vh] md:h-[30vh] md:w-[34vw]",
  "right-[4vw] bottom-[8svh] h-[26svh] w-[43vw] md:right-auto md:left-[5vw] md:bottom-[8vh] md:h-[38vh] md:w-[21vw]",
  "hidden md:block md:right-[7vw] md:top-[12vh] md:h-[25vh] md:w-[27vw]",
  "hidden md:block md:right-[5vw] md:bottom-[8vh] md:h-[29vh] md:w-[22vw]",
  "hidden md:block md:left-[31vw] md:bottom-[6vh] md:h-[21vh] md:w-[25vw]",
  "hidden md:block md:right-[28vw] md:top-[5vh] md:h-[18vh] md:w-[17vw]",
] as const;

const layoutStyles = `
  .iffy-parallax-motion {
    display: none;
  }

  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) and (max-width: 767px) {
    .iffy-parallax-motion {
      display: block;
      height: 160svh;
    }

    .iffy-parallax-static {
      display: grid;
    }
  }

  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-width: 768px) {
    .iffy-parallax-motion {
      display: block;
      height: 240svh;
    }

    .iffy-parallax-static {
      display: none;
    }
  }

  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) and (orientation: landscape) and (max-height: 620px) {
    .iffy-parallax-motion {
      display: none;
    }

    .iffy-parallax-static {
      display: grid;
    }
  }
`;

function StaticMosaic({
  images,
  imageClassName,
  className,
}: {
  images: readonly ZoomParallaxImage[];
  imageClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      data-parallax-static=""
    >
      {images.map((item, index) => (
        <figure
          className={cn(
            "relative m-0 min-h-44 overflow-hidden bg-[#d9ddd8]",
            index === 0 && "col-span-2 row-span-2 min-h-80 sm:min-h-[28rem]",
            index === 5 && "sm:col-span-2",
          )}
          key={`${item.src}-${index}`}
        >
          <img
            alt={item.alt}
            className={cn("absolute inset-0 h-full w-full object-cover", imageClassName)}
            decoding="async"
            loading="lazy"
            src={item.src}
            style={{ objectPosition: item.objectPosition }}
          />
        </figure>
      ))}
    </div>
  );
}

export function ZoomParallax({
  images,
  className,
  imageClassName,
}: ZoomParallaxProps) {
  const approvedImages = React.useMemo(() => images.slice(0, 7), [images]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale0 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 3.8]);
  const scale3 = useTransform(scrollYProgress, [0, 1], [1, 3.2]);
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 3.6]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 3.4]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 3.9]);
  const scales = [scale0, scale1, scale2, scale3, scale4, scale5, scale6];

  if (!approvedImages.length) return null;

  return (
    <section
      className={className}
      data-parallax-phone-count={Math.min(approvedImages.length, 3)}
      data-parallax-wide-count={approvedImages.length}
    >
      <style>{layoutStyles}</style>
      <div
        className="iffy-parallax-motion relative"
        data-parallax-motion=""
        ref={containerRef}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {approvedImages.map((item, index) => (
            <motion.div
              className="pointer-events-none absolute inset-0"
              key={`${item.src}-${index}`}
              style={{ scale: scales[index] }}
            >
              <div
                className={cn(
                  "absolute overflow-hidden bg-[#d9ddd8]",
                  responsiveSlots[index],
                )}
              >
                <img
                  alt={item.alt}
                  className={cn("h-full w-full object-cover", imageClassName)}
                  decoding="async"
                  loading="lazy"
                  src={item.src}
                  style={{ objectPosition: item.objectPosition }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <StaticMosaic
        className="iffy-parallax-static"
        images={approvedImages}
        imageClassName={imageClassName}
      />
    </section>
  );
}
