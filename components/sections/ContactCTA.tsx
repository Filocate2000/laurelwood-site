import Link from "next/link";

export function ContactCTA({
  tone = "white",
  width = "contained",
}: {
  tone?: "white" | "navy";
  width?: "contained" | "full";
}) {
  const navy = tone === "navy";
  const container =
    width === "full" ? "w-full px-6 md:px-16 text-center" : "editorial text-center max-w-3xl";
  return (
    <section className={`${navy ? "bg-navy-950" : "bg-white"} py-20 md:py-28`}>
      <div className={container}>
        <p className={`eyebrow mb-6 ${navy ? "text-gold-500" : "text-gold-600"}`}>Let&apos;s Talk</p>
        <h2
          className={`font-display font-light text-4xl md:text-5xl leading-tight mb-8 ${
            navy ? "text-white" : "text-navy-950"
          }`}
        >
          Considering buying or selling
          <br />
          <span className={navy ? "text-gold-500" : "text-gold-600"}>in Laurelwood?</span>
        </h2>
        <span className={`${navy ? "gold-rule" : "gold-rule-dark"} mx-auto mb-10`} />
        <p
          className={`text-lg leading-relaxed mb-12 max-w-xl mx-auto ${
            navy ? "text-ink-100" : "text-navy-950/70"
          }`}
        >
          A conversation is the best place to start. We live here, and we respond
          personally to every inquiry.
        </p>
        <Link
          href="/contact"
          className={`inline-flex items-center justify-center px-10 py-4 text-[12px] uppercase transition-colors duration-300 ${
            navy
              ? "bg-gold-500 hover:bg-gold-400 text-navy-950"
              : "bg-navy-950 hover:bg-gold-600 text-white"
          }`}
          style={{ letterSpacing: "0.25em" }}
        >
          Start a Conversation
        </Link>
      </div>
    </section>
  );
}
