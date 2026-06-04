import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * An editorial figure that FLOATS inside the prose flow on md+ so paragraphs
 * wrap around it. Below md the float collapses: the figure becomes a centered,
 * full-width block between paragraphs with its caption below.
 *
 * Place it in the JSX BEFORE the paragraph(s) that should wrap around it, inside
 * the same plain (non-flex, non-grid) prose container. Alternate `side` section
 * to section so the page does not feel lopsided. Add a <div className="clear-both" />
 * at the end of the container so the float never bleeds into the next band.
 *
 *   fit="fill"  the cream plate fills the float width (photos, maps, billboard).
 *   fit="hug"   the cream plate shrink-wraps the image (w-fit), a consistent mat
 *               around the artifact, never a big panel with a small ad inside.
 *               Use `width` to cap it (for tall, narrow ads: md:max-w-xs).
 */
export function FloatFigure({
  photo,
  side = "right",
  tone = "onWhite",
  caption,
  href,
  width = "md:w-[40%]",
  fit = "fill",
  maxH,
  priority = false,
  className,
  children,
}: {
  photo: Photo;
  side?: "left" | "right";
  tone?: "onNavy" | "onWhite";
  /** Overrides photo.caption. */
  caption?: string;
  /** Links the plate to the full-size original (opens in a new tab). */
  href?: string;
  /** Tailwind width/max-width classes for the float on md+ (e.g. "md:w-[40%]"). */
  width?: string;
  fit?: "fill" | "hug";
  /** Optional image max-height cap, px. */
  maxH?: number;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const cap = caption ?? photo.caption;
  const captionColor = tone === "onNavy" ? "text-ink-300" : "text-navy-950/60";
  const linkColor =
    tone === "onNavy" ? "text-gold-500 hover:text-gold-400" : "text-gold-600 hover:text-gold-500";

  const img = (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes="(min-width: 768px) 42vw, 100vw"
      priority={priority}
      className={cn("block h-auto", fit === "hug" ? "w-auto" : "w-full")}
      style={
        fit === "hug"
          ? { width: "auto", maxWidth: "100%", maxHeight: maxH ? `${maxH}px` : undefined }
          : maxH
            ? { width: "100%", maxHeight: `${maxH}px` }
            : undefined
      }
    />
  );

  return (
    <figure
      className={cn(
        // mobile: full-width block, centered, vertical breathing room
        "w-full my-6 md:my-2",
        // md+: float with a gap on the text side
        side === "right" ? "md:float-right md:ml-8" : "md:float-left md:mr-8",
        width,
        className
      )}
    >
      <div
        className={cn(
          "bg-[#f6f3ec] border border-gold-500/60 p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]",
          fit === "hug" ? "w-fit mx-auto md:mx-0" : "w-full"
        )}
      >
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            {img}
          </a>
        ) : (
          img
        )}
      </div>
      {(cap || href) && (
        <figcaption className={cn("mt-2 text-sm italic leading-snug", captionColor)}>
          {cap}
          {href && (
            <>
              {cap ? " " : ""}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("not-italic underline underline-offset-2", linkColor)}
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
