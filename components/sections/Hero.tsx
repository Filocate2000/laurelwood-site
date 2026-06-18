import Image from "next/image";
import { homeContent } from "@/content/home";
import { bestWideHero } from "@/lib/photos";

export function Hero() {
  const photo = bestWideHero();
  const h = homeContent.hero;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 30%, #1a3a66 0%, #0F2547 45%, #07172e 100%)",
          }}
        />
      )}

      <div className="absolute inset-0 bg-navy-950/45" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at center, rgba(10,31,61,0.6) 0%, rgba(10,31,61,0.35) 50%, transparent 90%)",
        }}
      />

      <div className="relative w-full text-center px-6 animate-fade-in max-w-6xl mx-auto">
        {/* Hero wordmark: elegant serif (Cormorant Garamond via font-serif),
            uppercase, light weight, letter-spaced, single line (nowrap). The
            tagline and italic line below intentionally keep the DM Sans
            (font-display) treatment, so this title diverges from the sibling
            sites' heroes by design. */}
        <h1
          className="font-serif font-light text-white animate-fade-up uppercase"
          style={{
            fontSize: "clamp(1.75rem, 7vw, 6rem)",
            letterSpacing: "0.08em",
            lineHeight: "1.02",
            whiteSpace: "nowrap",
            textShadow: "0 4px 40px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          {h.wordmark}
        </h1>

        <p
          className="font-display font-light text-white animate-fade-up uppercase mt-4"
          style={{
            fontSize: "clamp(0.7rem, 1.8vw, 1.5rem)",
            letterSpacing: "0.62em",
            paddingLeft: "0.62em",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            animationDelay: "0.2s",
          }}
        >
          {h.tagline}
        </p>

        <p
          className="font-display italic text-white mt-12 animate-fade-up"
          style={{
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            animationDelay: "0.4s",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}
        >
          {h.italicLine}
        </p>
      </div>

      {/* Scroll cue: a gold label over a soft radial dark scrim, with an
          animated brighter-gold segment traveling down a faint gold track so
          motion catches the eye on busy photos. Lives in the shared hero
          component (every site, incl. fryman, inherits it). The travel
          animation is disabled under prefers-reduced-motion (see globals.css). */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="relative isolate flex flex-col items-center gap-2.5">
          {/* Soft radial scrim: invisible as a shape, only felt as contrast. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-0"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0.25), rgba(0,0,0,0.1) 45%, transparent 75%)",
              filter: "blur(4px)",
            }}
          />
          <span
            className="relative z-10 text-xs md:text-sm font-medium tracking-[0.3em] text-gold-500"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.75)" }}
          >
            SCROLL
          </span>
          {/* Faint gold track; a brighter segment travels down it (~2s loop). */}
          <div className="relative z-10 h-8 w-[1.5px] overflow-hidden rounded-full bg-gold-500/30">
            <div
              className="scroll-cue-seg absolute inset-x-0 top-0 h-3 rounded-full bg-gold-400"
              style={{ filter: "drop-shadow(0 0 3px rgba(200,167,91,0.85))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
