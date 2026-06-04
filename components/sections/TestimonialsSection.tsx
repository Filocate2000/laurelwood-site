import type { Testimonial } from "@/content/home";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16">
          <p className="eyebrow text-gold-600 mb-4">Client Experiences</p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-navy-950">
            What our clients <span className="text-gold-600">say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="relative bg-navy-900 border border-white/5 p-10 lg:p-12 group hover:border-gold-500/30 transition-colors duration-500"
            >
              <span className="absolute top-6 right-8 font-serif text-gold-500/30 text-7xl leading-none">
                &ldquo;
              </span>
              <blockquote className="relative">
                <p className="text-lg md:text-xl font-light text-ink-100 leading-relaxed mb-8 italic">
                  {t.body}
                </p>
                <span className="gold-rule mb-6" />
                <figcaption>
                  <div className="font-display text-white text-lg">{t.clientName}</div>
                  {t.property && (
                    <div className="text-ink-300 text-sm mt-1" style={{ letterSpacing: "0.1em" }}>
                      {t.property}
                    </div>
                  )}
                </figcaption>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
