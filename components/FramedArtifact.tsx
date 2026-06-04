import Image from "next/image";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * A framed archival artifact: the image sits on a cream plate inside a thin
 * gold frame with generous padding, an italic caption beneath. The plate hugs
 * the image (it does not stretch to its grid cell), so small scans never float
 * inside an oversized frame.
 *
 * Size is driven by `variant`, not by a single uniform rule:
 *   - "ad":       newspaper ads, natural aspect, max-height ~520px, 2-up.
 *   - "photo":    period/neighborhood photos, medium plates (~460px tall).
 *   - "document": tall documents (tract/freeway maps), ~600px tall, and the
 *                 frame links to the full-size original in a new tab.
 *   - "banner":   wide strip (the street sign), fills the container width.
 *   - "shield":   small inline accent (~120px), never hero-sized.
 */
type Variant = "ad" | "photo" | "document" | "banner" | "shield";

const MAX: Record<Variant, { maxHeight?: number; width?: number }> = {
  ad: { maxHeight: 520 },
  photo: { maxHeight: 460 },
  document: { maxHeight: 600 },
  banner: {},
  shield: { width: 120 },
};

export function FramedArtifact({
  photo,
  tone = "onNavy",
  variant = "photo",
  caption,
  href,
  priority = false,
  center = true,
  className,
}: {
  photo: Photo;
  tone?: "onNavy" | "onWhite";
  variant?: Variant;
  /** Overrides photo.caption. Pass "" to suppress. */
  caption?: string;
  /** When set, the plate links to the full-size original (opens in a new tab). */
  href?: string;
  priority?: boolean;
  /** Center the hugged plate within its cell (default true). */
  center?: boolean;
  className?: string;
}) {
  const cap = caption ?? photo.caption;
  const limit = MAX[variant];
  const captionColor = tone === "onNavy" ? "text-ink-300" : "text-navy-950/60";

  const imgStyle: React.CSSProperties =
    variant === "banner"
      ? { width: "100%", height: "auto" }
      : variant === "shield"
        ? { width: `${limit.width}px`, height: "auto" }
        : { width: "auto", height: "auto", maxWidth: "100%", maxHeight: `${limit.maxHeight}px` };

  const img = (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes="(min-width: 768px) 50vw, 100vw"
      priority={priority}
      className="block h-auto w-auto"
      style={imgStyle}
    />
  );

  const plate = (
    <div className="bg-[#f6f3ec] border border-gold-500/60 p-3 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );

  return (
    <figure
      className={cn(
        variant === "banner" ? "w-full" : "w-fit max-w-full",
        variant !== "banner" && center && "mx-auto",
        className
      )}
    >
      {plate}
      {(cap || href) && (
        <figcaption className={cn("mt-3 text-sm italic leading-snug", captionColor)}>
          {cap}
          {href && (
            <>
              {cap ? " " : ""}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "not-italic underline underline-offset-2 transition-colors",
                  tone === "onNavy" ? "text-gold-500 hover:text-gold-400" : "text-gold-600 hover:text-gold-500"
                )}
              >
                Open full size
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
