// Self-hosted video in the gold-framed editorial treatment. The frame holds a
// fixed 16:9 box (no layout shift). preload="metadata" loads just enough to show
// a poster (first) frame; muted, with controls, and no autoplay, so it never
// plays on its own. Used for the archival Disorderly Orderly clip.
export function SelfHostedVideo({
  src,
  caption,
  tone = "onWhite",
}: {
  src: string;
  caption?: string;
  tone?: "onNavy" | "onWhite";
}) {
  return (
    <figure className="flex flex-col">
      <div
        className="relative w-full overflow-hidden rounded-xl border-2 border-gold-500/70 bg-navy-950 shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <video
          className="absolute inset-0 h-full w-full object-contain"
          controls
          muted
          preload="metadata"
          playsInline
        >
          {/* #t=0.1 nudges browsers to render the first frame as the poster. */}
          <source src={`${src}#t=0.1`} type="video/mp4" />
        </video>
      </div>
      {caption && (
        <figcaption
          className={`mt-3 text-sm italic leading-snug ${
            tone === "onNavy" ? "text-ink-300" : "text-navy-950/60"
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
