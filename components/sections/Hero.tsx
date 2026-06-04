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
        <h1
          className="font-serif font-light text-white animate-fade-up"
          style={{
            fontSize: "clamp(2.75rem, 9vw, 8.5rem)",
            letterSpacing: "0.02em",
            lineHeight: "1.02",
            textShadow: "0 4px 40px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          {h.wordmark}
        </h1>

        <p
          className="font-display font-light text-white animate-fade-up uppercase mt-5"
          style={{
            fontSize: "clamp(0.7rem, 1.6vw, 1.35rem)",
            letterSpacing: "0.5em",
            paddingLeft: "0.5em",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            animationDelay: "0.2s",
          }}
        >
          {h.tagline}
        </p>

        <p
          className="font-serif italic text-white/90 mt-10 animate-fade-up"
          style={{
            fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
            animationDelay: "0.4s",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}
        >
          {h.italicLine}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80">
        <span className="text-[10px] tracking-eyebrow" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
          SCROLL
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-white/80 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
