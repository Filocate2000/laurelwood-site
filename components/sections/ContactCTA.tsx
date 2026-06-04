import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="editorial text-center max-w-3xl">
        <p className="eyebrow text-gold-600 mb-6">Let&apos;s Talk</p>
        <h2 className="font-display font-light text-4xl md:text-5xl text-navy-950 leading-tight mb-8">
          Considering buying or selling
          <br />
          <span className="text-gold-600">in Laurelwood?</span>
        </h2>
        <span className="gold-rule-dark mx-auto mb-10" />
        <p className="text-navy-950/70 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
          A conversation is the best place to start. We live here, and we respond
          personally to every inquiry.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-navy-950 hover:bg-gold-600 px-10 py-4 text-[12px] uppercase text-white transition-colors duration-300"
          style={{ letterSpacing: "0.25em" }}
        >
          Start a Conversation
        </Link>
      </div>
    </section>
  );
}
