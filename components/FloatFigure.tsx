import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * An editorial figure that IS its own cream plate (the mat hugs the image via
 * p-3; the caption sits inside the figure). On md+ it floats inside the prose
 * flow so paragraphs wrap around it; below md the float is off and it becomes a
 * centered full-width block with its caption below.
 *
 * Usage rules (enforced at the call sites, not here):
 *   - One float active at a time. A new floated figure may only appear after the
 *     previous float is cleared (by enough text or a <div className="clear-both" />).
 *     Never a left float and a right float beside the same paragraph.
 *   - If a section has several images and little text, float ONE beside the text
 *     and place the rest after the prose in a single centered row
 *     (flex flex-wrap justify-center items-start) of `float={false}` plates.
 *   - The section wrapper gets `overflow-hidden` and ends with clear-both so
 *     floats never bleed into the next band.
 *
 * `width` sets the float width on md+ (tall narrow ads ~28-30%, wide ads ~40-44%).
 * For a non-floated row plate pass `float={false}` and cap with `className`
 * (e.g. "md:max-w-[230px]").
 */
export function FloatFigure({
  photo,
  float = "right",
  width = "md:w-[40%]",
  caption,
  href,
  maxImgH,
  priority = false,
  className,
  children,
}: {
  photo: Photo;
  float?: "left" | "right" | false;
  width?: string;
  /** Overrides photo.caption. */
  caption?: string;
  /** Links the plate to the full-size original (opens in a new tab). */
  href?: string;
  /** Optional image max-height cap, px. */
  maxImgH?: number;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const cap = caption ?? photo.caption;

  const img = (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes="(min-width: 768px) 42vw, 100vw"
      priority={priority}
      className="block w-full h-auto"
      style={maxImgH ? { maxHeight: `${maxImgH}px`, width: "auto" } : undefined}
    />
  );

  return (
    <figure
      className={cn(
        // the figure IS the mat: shrink-wraps the image, p-3 cream border
        "w-fit max-w-full my-6 bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.22)]",
        float === "right" && cn("mx-auto md:mx-0 md:float-right md:ml-8", width),
        float === "left" && cn("mx-auto md:mx-0 md:float-left md:mr-8", width),
        className
      )}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {img}
        </a>
      ) : (
        img
      )}
      {(cap || href) && (
        <figcaption className="mt-2 text-sm italic leading-relaxed text-navy-950/60">
          {cap}
          {href && (
            <>
              {cap ? " " : ""}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="not-italic underline underline-offset-2 text-gold-600 hover:text-gold-500"
              >
                Open full size
              </a>
            </>
          )}
        </figcaption>
      )}
      {children}
    </figure>
  );
}
