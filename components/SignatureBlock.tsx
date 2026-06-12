import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

/**
 * Signature block rendered at the end of every LARE Report. The reports are
 * authored by Jack and Karen Misraje (shared content across the Misraje family
 * of sites), so Jack's signature sits on the left and Karen's on the right,
 * with names and tap-to-call phone numbers beneath each. Names and phones are
 * read from siteConfig (the single source of truth) rather than hardcoded.
 * Signature image files live in public/images/signatures/ and are committed to
 * the repo (no external CDN dependency). Stacks vertically on mobile.
 */
const SIGNATURES: Record<string, { src: string; width: number; height: number }> = {
  jack: { src: "/images/signatures/jack-misraje-signature.jpg", width: 307, height: 73 },
  karen: { src: "/images/signatures/karen-misraje-signature.jpg", width: 312, height: 73 },
};

export function SignatureBlock() {
  // Jack (left) then Karen (right), matching the report authors' layout on
  // misraje-site. Look the agents up by slug so the order is explicit even if
  // siteConfig lists them in a different order.
  const agents = ["jack", "karen"]
    .map((slug) => siteConfig.agents.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-16 gap-10">
        {agents.map((agent) => {
          const sig = SIGNATURES[agent.slug];
          return (
            <div key={agent.slug} className="text-left">
              {sig && (
                <Image
                  src={sig.src}
                  alt={`${agent.firstName} ${agent.lastName} signature`}
                  width={sig.width}
                  height={sig.height}
                  className="h-[70px] w-auto"
                  unoptimized
                />
              )}
              <p className="mt-2 text-sm text-navy-950">
                {agent.firstName} {agent.lastName}
              </p>
              <p className="mt-0.5 text-sm text-stone-600">
                <a href={agent.phoneHref} className="hover:text-gold-500 transition-colors">
                  {agent.phone}
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
