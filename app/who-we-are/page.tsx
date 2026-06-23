import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "A two-principal practice representing buyers and sellers across Los Angeles, the Westside, and the San Fernando Valley. Karen and Jack Misraje, the #1 Two-Member Team in Coldwell Banker Global Luxury.";

export const metadata: Metadata = {
  title: "Who We Are",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/who-we-are") },
  openGraph: { title: "Who We Are", description: DESCRIPTION, url: absoluteUrl("/who-we-are") },
};

export default function WhoWeArePage() {
  const hero = photo("laurelwood-scenic-1");
  return (
    <>
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        scrim="dark"
        eyebrow="The Firm"
        title="Who We Are"
        subtitle="A two-principal practice rooted in the hills above Studio City."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-4xl mx-auto space-y-16 md:space-y-20">

            {/* Opening: lead prose, no heading */}
            <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
              <p>
                Misraje Real Estate Partners is the practice of Karen and Jack Misraje, recognized as the #1 Two-Member Team in Coldwell Banker Global Luxury. Across more than three decades and over a billion dollars in transactions, the partnership has represented buyers and sellers throughout Beverly Hills, the Westside, and the San Fernando Valley, with additional depth in the coastal and Valley submarkets that surround them.
              </p>
            </div>

            {/* Off-market access — image beside text (image left) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="relative aspect-[4/5] overflow-hidden order-1 md:order-1 border-2 border-gold-500" style={{ borderRadius: "2px" }}>
                <Image
                  src="/images/sections/who-we-are-estate.jpg"
                  alt="A Spanish estate represented by Misraje Real Estate Partners"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="order-2 md:order-2">
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8" style={{ letterSpacing: "-0.01em" }}>
                  Access before the market
                </h2>
                <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                  <p>
                    A meaningful share of the most desirable inventory never reaches the public portals. Through long-standing relationships and active market research, the partnership maintains working knowledge of properties coming to market before they appear on the MLS, Zillow, or Trulia. For buyers, that means access to opportunities others never see. For sellers, it means a network of qualified, motivated interest before a listing goes live.
                  </p>
                </div>
              </div>
            </div>

            {/* How a listing is marketed — image beside text (image right, alternating) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="order-2 md:order-1">
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8" style={{ letterSpacing: "-0.01em" }}>
                  How a listing is marketed
                </h2>
                <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                  <p>
                    Every listing is built specifically for the property rather than run through a template. That means design and staging that present the home at its best, photography and videography matched to the home&rsquo;s character, targeted digital campaigns across the channels where qualified buyers actually look, and selective print placement in the publications that reach high-net-worth audiences. The goal is never volume of exposure for its own sake, but the right exposure to the right buyers.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden order-1 md:order-2 border-2 border-gold-500" style={{ borderRadius: "2px" }}>
                <Image
                  src="/images/sections/who-we-are-interior.jpg"
                  alt="A staged living room interior represented by Misraje Real Estate Partners"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* The partnership */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8" style={{ letterSpacing: "-0.01em" }}>
                Two principals
              </h2>
              <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                <p>
                  Two principals, not one agent stretched thin. Karen&rsquo;s three decades on the Westside and in Beverly Hills and Jack&rsquo;s working knowledge of the Valley and the broader Los Angeles market mean clients get genuine geographic depth and two sets of eyes on every decision. The collaboration, and the discipline behind it, is what has set the practice apart in one of the most competitive luxury markets in the country.{" "}
                  <Link href="/meet-the-partners" className="text-navy-950 hover:text-gold-500 underline underline-offset-4 transition-colors">
                    Meet the partners
                  </Link>
                  .
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
