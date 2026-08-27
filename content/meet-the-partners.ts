// content/meet-the-partners.ts
// Chrome for /meet-the-partners. The bios themselves come from Supabase
// (team_directory via lib/team.ts); only the page furniture lives here.
//
// Lifted 2026-08-27. The intro paragraph and the meta description both named
// the firm and the agents in string literals.
//
// NO em dashes.

import { siteConfig } from "@/lib/site-config";

/** "Karen and Jack", config order. */
const firstNames = (() => {
  const names = siteConfig.agents.map((a) => a.firstName);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
})();

/** "Karen and Jack Misraje" when the agents share a surname. */
const agentsForCopy = (() => {
  const surnames = new Set(siteConfig.agents.map((a) => a.lastName));
  if (surnames.size === 1 && siteConfig.agents.length > 1) {
    return `${firstNames} ${siteConfig.agents[0].lastName}`;
  }
  return siteConfig.agents.map((a) => `${a.firstName} ${a.lastName}`).join(" and ");
})();

export const meetThePartnersContent = {
  eyebrow: "The Partners",
  title: "Meet the Partners",
  subtitle: "Two principals, one practice, on the streets of Laurelwood.",

  metaDescription: `Two principals, one practice. ${agentsForCopy}, the #1 Two-Member Team in ${siteConfig.brokerage.name}, representing buyers and sellers across Los Angeles.`,

  intro: `${siteConfig.legalName} practices residential real estate across Los Angeles, Ventura, and the South Bay. Recognized as the #1 Two-Member Team in Beverly Hills, the partnership combines complementary specialties in marketing, negotiation, and contract execution.`,

  emptyState: "Team information temporarily unavailable. Please check back shortly.",
};
