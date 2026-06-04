import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  /** Optional background image path. When absent, a navy editorial gradient is used. */
  image?: string;
  alt?: string;
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  objectPosition?: string;
  scrim?: "default" | "dark";
  imageSlot?: ReactNode;
};

/**
 * PageHero, the canonical hero treatment for every inner page. Full-bleed image
 * (or a navy gradient when no photo is supplied), centered serif title, navy
 * gradient at top so the fixed nav stays readable on light backgrounds.
 */
export function PageHero({
  image,
  alt = "",
  eyebrow,
  title,
  subtitle,
  objectPosition = "center",
  scrim = "default",
  imageSlot,
}: PageHeroProps) {
  const background =
    imageSlot ??
    (image ? (
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition }}
      />
    ) : (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 20%, #16335c 0%, #0F2547 45%, #0A1F3D 100%)",
        }}
      />
    ));

  return (
    <section className="relative w-full h-[55vh] min-h-[420px] md:h-[60vh] md:min-h-[480px] overflow-hidden">
      {background}
      {/* Top gradient so the fixed navigation stays readable */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,25,41,0.7) 0%, rgba(10,25,41,0) 100%)",
        }}
      />
      {/* Bottom darkening so the title remains legible against any image. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            scrim === "dark"
              ? "linear-gradient(to bottom, rgba(10,25,41,0.15) 0%, rgba(10,25,41,0.55) 40%, rgba(10,25,41,0.8) 70%, rgba(10,25,41,0.95) 100%)"
              : "linear-gradient(to bottom, rgba(10,25,41,0) 30%, rgba(10,25,41,0.5) 65%, rgba(10,25,41,0.85) 100%)",
        }}
      />
      <div className="relative h-full flex items-end pb-16 md:pb-20">
        <div className="w-full text-center px-6">
          {eyebrow && <div className="eyebrow text-gold-500 mb-4">{eyebrow}</div>}
          <h1
            className="font-serif text-4xl md:text-6xl font-normal text-white"
            style={{ letterSpacing: "-0.01em" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-white/85 mt-4 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
