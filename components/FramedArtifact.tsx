import Image from "next/image";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * A framed archival artifact: the image sits on a cream plate inside a thin
 * gold frame, an italic caption beneath. The mat HUGS the image, it shrinks to
 * the artifact (image + a consistent ~24-28px border) rather than stretching to
 * the grid cell, and it caps at the cell width so wide scans never overflow.
 * There is no fixed plate height; the natural aspect is preserved.
 *
 * Size is driven by `variant`:
 *   - "ad":       newspaper ads, natural aspect, max-height ~520px, 2-up.
 *   - "photo":    period/neighborhood photos, medium (~460px tall).
 *   - "document": tall documents (tract/freeway maps), ~600px tall, frame links
 *                 to the full-size original in a new tab.
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
  const isBanner = variant === "banner";

  const imgStyle: React.CSSProperties = isBanner
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

  return (
    <figure
      className={cn(
        "flex flex-col",
        isBanner ? "w-full" : center ? "items-center" : "items-start",
        className
      )}
    >
      {/* Hug wrapper: shrinks to the artifact, capped at the cell width. The
          figure (a definite-width flex box) anchors max-w-full so wide scans
          scale down instead of overflowing. Caption sits under at plate width. */}
      <div className={cn(isBanner ? "w-full" : "w-fit max-w-full")}>
        <div className="bg-[#f6f3ec] border border-gold-500/60 p-6 md:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block">
              {img}
            </a>
          ) : (
            img
          )}
        </div>
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
      </div>
    </figure>
  );
}
