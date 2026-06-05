// Self-hosted video in the gold-framed editorial treatment. The frame is the
// gold border ON the <video> itself, so it hugs the picture exactly: the video
// renders at its own natural aspect ratio (w-full h-auto), with no fixed-height
// box and no background behind it, so no letterbox/pillarbox bars ever show.
// muted + preload="metadata" gives a poster (first) frame, controls, no autoplay.
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
      <video
        className="block w-full h-auto rounded-xl border-2 border-gold-500/70 shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
        controls
        muted
        preload="metadata"
        playsInline
      >
        {/* #t=0.1 nudges browsers to render the first frame as the poster. */}
        <source src={`${src}#t=0.1`} type="video/mp4" />
      </video>
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
