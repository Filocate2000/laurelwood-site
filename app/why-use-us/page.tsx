import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Pricing, marketing, and negotiation done with precision. How the Misraje team represents buyers and sellers across Los Angeles, Ventura, and the South Bay.";

export const metadata: Metadata = {
  title: "Why Use Us",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/why-use-us") },
  openGraph: { title: "Why Use Us", description: DESCRIPTION, url: absoluteUrl("/why-use-us") },
};

export default function WhyUseUsPage() {
  const hero = photo("laurelwood-scenic-2");
  return (
    <>
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        scrim="dark"
        eyebrow="Our Practice"
        title="Why Use Us"
        subtitle="Representation built for the Laurelwood market."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="space-y-20 md:space-y-28">

            {/* FOR SELLERS: image left, text right */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="relative aspect-[4/5] overflow-hidden order-1 md:order-1 border-2 border-gold-500" style={{ borderRadius: "2px" }}>
                <Image
                  src="/images/sections/agent-at-desk.jpg"
                  alt="Pricing analysis at the agent's desk"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="order-2 md:order-2">
                <p className="text-[11px] font-medium text-gold-500 mb-4" style={{ letterSpacing: "0.18em" }}>
                  FOR SELLERS
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8" style={{ letterSpacing: "-0.01em" }}>
                  Pricing, marketing, and the work of running a listing.
                </h2>
                <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                  <p>
                    A listing starts before the photographer arrives. Pricing analysis comes first, and we work from current comparable activity rather than from what the owner hopes the home is worth. That conversation is harder than it sounds. Most sellers have a number in mind before they call us, and most of the time the number is reasonable. Sometimes it isn&rsquo;t. We tell sellers what we think the market will pay, and what we think it won&rsquo;t, and we explain the reasoning. From there, the pricing decision is theirs.
                  </p>
                  <p>
                    Once the pricing is set, the marketing plan gets built specifically for the property. Photography that matches the home&rsquo;s character. Copy that reads like prose rather than a brochure. Distribution across the channels where qualified buyers in that submarket actually look, which varies more than you&rsquo;d expect. What works in Beverly Hills isn&rsquo;t necessarily what works in Studio City. We have opinions about which channels deserve budget and which don&rsquo;t.
                  </p>
                  <p>
                    Jack&rsquo;s technical practice extends what we can do on the data side. He uses AI-supported tools to analyze market activity at a finer grain than traditional comp analysis allows, and to surface qualified buyer signals earlier in a listing cycle. Three U.S. patents in real estate technology reflect a long-running interest in how the industry&rsquo;s data infrastructure actually moves transactions. That work doesn&rsquo;t replace judgment, but it sharpens it.
                  </p>
                </div>
              </div>
            </div>

            {/* FOR BUYERS: text only, full width but constrained for readability */}
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium text-gold-500 mb-4" style={{ letterSpacing: "0.18em" }}>
                FOR BUYERS
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8" style={{ letterSpacing: "-0.01em" }}>
                Information, judgment, and pushback when it matters.
              </h2>
              <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                <p>
                  Buyer representation comes down to giving clients accurate information about the markets they&rsquo;re considering. What listings are actually worth versus what they&rsquo;re asking. How offers in this submarket tend to be structured, and what terms matter most when competition is real. Which neighborhoods make sense at a client&rsquo;s price point and which ones require stretching or compromising in ways the client may not have thought through.
                </p>
                <p>
                  We push back when a client is about to make a move we think is wrong. Politely, with reasoning, but we push. That includes telling buyers to walk away from properties they&rsquo;re emotionally attached to when the math doesn&rsquo;t work, and telling them to be more aggressive on properties they&rsquo;re underestimating. The trust that builds takes time to develop, but in our experience it&rsquo;s what separates a working agent relationship from a transactional one.
                </p>
                <p>
                  Karen&rsquo;s three decades of practice on the Westside and in Beverly Hills, combined with Jack&rsquo;s working knowledge of the Valley and the broader Los Angeles market, mean buyers get genuine geographic depth rather than one agent stretched across markets they only know in passing. When a client&rsquo;s search crosses multiple submarkets, we route the conversation to whichever of us has the stronger working knowledge of that specific area.
                </p>
              </div>
            </div>

            {/* NEGOTIATION AND CLOSING: text left, image right (alternating from FOR SELLERS) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="order-2 md:order-1">
                <p className="text-[11px] font-medium text-gold-500 mb-4" style={{ letterSpacing: "0.18em" }}>
                  NEGOTIATION AND CLOSING
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8" style={{ letterSpacing: "-0.01em" }}>
                  The two phases that matter most.
                </h2>
                <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                  <p>
                    Two parts of a transaction matter more to outcomes than most clients expect when they first start the process: how the negotiation is run, and how the inspection period is managed.
                  </p>
                  <p>
                    In negotiation, we bring a disciplined approach developed across decades of representations at price points from first purchases to high-end estates. That means structuring terms that hold under pressure, recognizing when to push and when to accept, and protecting our client&rsquo;s positioning without burning the working relationship with the other side. The other agent is usually someone we&rsquo;ll work across the table from again. We don&rsquo;t waste that.
                  </p>
                  <p>
                    Inspection period management is where deals quietly fall apart when nobody&rsquo;s paying attention. Issues surface and they always do, and the question becomes which ones are material, which are cosmetic, which are negotiable, and which are best left alone. We work directly with inspectors, contractors, and the other side to make that assessment in real time. The goal is keeping a sound transaction moving toward closing rather than letting it derail over items that can be resolved.
                  </p>
                  <p>
                    Across both phases, the working principle is the same. Protect our client&rsquo;s position without losing the deal to friction that didn&rsquo;t need to be there.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden order-1 md:order-2 border-2 border-gold-500" style={{ borderRadius: "2px" }}>
                <Image
                  src="/images/sections/inspection.jpg"
                  alt="On-site inspection during the contingency period"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
