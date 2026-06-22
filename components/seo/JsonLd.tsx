import { siteConfig, absoluteUrl, officeAddressOneLine } from "@/lib/site-config";

/**
 * Renders a JSON-LD <script> block. Centralized so every page emits structured
 * data the same way. `data` is any schema.org object (or array).
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input flows here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide Organization (the brokerage behind the neighborhood site). */
export function OrganizationJsonLd() {
  const o = siteConfig.office;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: siteConfig.legalName,
        url: siteConfig.url,
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: o.street,
          addressLocality: o.city,
          addressRegion: o.state,
          postalCode: o.zip,
          addressCountry: "US",
        },
        telephone: o.phoneHref.replace("tel:", ""),
        areaServed: "Studio City, Los Angeles, CA",
        parentOrganization: {
          "@type": "Organization",
          name: siteConfig.brokerage.name,
        },
        employee: siteConfig.agents.map((a) => ({
          "@type": "RealEstateAgent",
          name: `${a.firstName} ${a.lastName}`,
          email: a.email,
          telephone: a.phoneHref.replace("tel:", ""),
        })),
      }}
    />
  );
}

/** Per-agent RealEstateAgent (used on /meet-the-partners). */
export function AgentJsonLd({ slug }: { slug: string }) {
  const a = siteConfig.agents.find((x) => x.slug === slug);
  if (!a) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: `${a.firstName} ${a.lastName}`,
        jobTitle: a.title,
        email: a.email,
        telephone: a.phoneHref.replace("tel:", ""),
        ...(a.calRE ? { identifier: `CalRE# ${a.calRE}` } : {}),
        worksFor: { "@type": "Organization", name: siteConfig.brokerage.name },
        url: absoluteUrl(`/meet-the-partners#${a.slug}`),
        address: { "@type": "PostalAddress", description: officeAddressOneLine() },
      }}
    />
  );
}

/** Place / Neighborhood JSON-LD for the neighborhood pages. */
export function NeighborhoodJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Place",
        name,
        description,
        url: absoluteUrl(path),
        containedInPlace: {
          "@type": "Place",
          name: "Studio City, Los Angeles, California",
        },
      }}
    />
  );
}
