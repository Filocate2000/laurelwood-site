"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy, gold-framed YouTube embed. The iframe is not mounted until the frame
 * scrolls near the viewport (IntersectionObserver), and the wrapper holds a
 * fixed 16:9 aspect ratio so there is no layout shift when the iframe loads.
 *
 * Before it intersects, a lightweight poster (the YouTube thumbnail) with a
 * play glyph stands in.
 */
export function YouTubeEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-xl border-2 border-gold-500/70 shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerator; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex items-center justify-center bg-navy-900"
        >
          {inView && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
            />
          )}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/90 text-navy-950 shadow-lg transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
