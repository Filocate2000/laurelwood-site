import Image from "next/image";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * A framed archival artifact: the image sits on a cream plate inside a thin
 * gold frame with generous padding, an italic caption beneath. Reads as a
 * museum label on either band color (pass `tone`). The image is never upscaled
 * beyond its intrinsic width, so low-resolution scans stay crisp instead of
 * blurring to fill the cell.
 */
export function FramedArtifact({
  photo,
  tone = "onNavy",
  caption,
  priority = false,
  className,
}: {
  photo: Photo;
  tone?: "onNavy" | "onWhite";
  /** Overrides photo.caption. */
  caption?: string;
  priority?: boolean;
  className?: string;
}) {
  const cap = caption ?? photo.caption;
  return (
    <figure className={cn("flex flex-col", className)}>
      <div className="bg-[#f6f3ec] border border-gold-500/60 p-3 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 768px) 45vw, 90vw"
          priority={priority}
          className="mx-auto h-auto w-full object-contain"
          style={{ maxWidth: photo.width }}
        />
      </div>
      {cap && (
        <figcaption
          className={cn(
            "mt-3 text-sm italic leading-snug",
            tone === "onNavy" ? "text-ink-300" : "text-navy-950/60"
          )}
        >
          {cap}
        </figcaption>
      )}
    </figure>
  );
}
