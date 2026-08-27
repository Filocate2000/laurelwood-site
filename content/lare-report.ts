// content/lare-report.ts
// Chrome for /lare-report and /lare-report/[slug]. The reports themselves are
// hub-authored and come from Supabase (lib/lare.ts); only the page furniture
// lives here.
//
// Lifted 2026-08-27. The same six-line hero block was typed out three times
// across two files, each naming the agents in a string, so a frymanestates.com
// clone would have carried "Karen and Jack Misraje" into its own LARE pages and
// any change to the wording had three places to miss.
//
// NO em dashes.

import { siteConfig } from "@/lib/site-config";

/** "Karen and Jack", "Karen, Jack, and Sam". First names only, config order. */
function joinFirstNames(): string {
  const names = siteConfig.agents.map((a) => a.firstName);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/** "Karen and Jack Misraje" when the agents share a surname, otherwise each
 *  name in full. The original copy relied on the shared-surname case. */
function agentsForCopy(): string {
  const surnames = new Set(siteConfig.agents.map((a) => a.lastName));
  if (surnames.size === 1 && siteConfig.agents.length > 1) {
    return `${joinFirstNames()} ${siteConfig.agents[0].lastName}`;
  }
  const full = siteConfig.agents.map((a) => `${a.firstName} ${a.lastName}`);
  if (full.length <= 1) return full[0] ?? "";
  if (full.length === 2) return `${full[0]} and ${full[1]}`;
  return `${full.slice(0, -1).join(", ")}, and ${full[full.length - 1]}`;
}

const authors = agentsForCopy();

export const lareReportContent = {
  /** Shared hero, rendered identically on the landing page and every archive page. */
  hero: {
    image: "/images/sections/lare-report-hero.jpg",
    alt: "Los Angeles real estate market commentary",
    eyebrow: "MARKET COMMENTARY",
    title: "The LARE Report.",
    subtitle: `Los Angeles Real Estate. Weekly analysis from ${authors}.`,
    scrim: "dark" as const,
  },

  metaTitle: "The LARE Report",
  metaDescription: `Weekly Los Angeles real estate analysis from ${authors}. Market trends, pricing, and commentary across the LA region and the San Fernando Valley.`,

  /** Shown when no report has been ingested yet. */
  emptyState: "The next report will be published shortly. Please check back soon.",

  /** Sidebar labels on the landing page. */
  latestLabel: "LATEST",
  archiveLabel: "ARCHIVE",
  archiveEmpty: "Earlier reports will appear here as they are published.",

  /** Back link on an archive page. */
  allReportsLabel: "ALL REPORTS",
};
