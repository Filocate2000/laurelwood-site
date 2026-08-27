import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { SITE_ROUTES } from "@/lib/routes";
import { getAllLareReportSlugs } from "@/lib/lare";
import { getTeamMembers } from "@/lib/team";

// Regenerate hourly so a newly published LARE report reaches the sitemap without
// waiting for a deploy. The static routes come from lib/routes.ts; the two
// database-backed archives are appended below.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Both reads return [] rather than throwing when Supabase is unreachable (see
  // lib/supabase/server.ts), so a credential-less build still emits a valid
  // sitemap of the static routes instead of failing.
  const [lareReports, team] = await Promise.all([
    getAllLareReportSlugs(),
    getTeamMembers(),
  ]);

  // NOTE: lastModified is deliberately omitted for the static pages. It used to
  // be `new Date()` for every route, which told crawlers the entire site changed
  // on every regeneration. A lastModified that is always "now" is worse than
  // none, because crawlers learn to ignore it. It is set only below, where the
  // date is real.
  const staticEntries: MetadataRoute.Sitemap = SITE_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // LARE Report archive. publish_date is a genuine last-modified date.
  const lareEntries: MetadataRoute.Sitemap = lareReports.map((report) => ({
    url: absoluteUrl(`/lare-report/${report.slug}`),
    lastModified: new Date(report.publish_date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  // Partner bios. team_directory carries no public updated_at on the read we
  // do here, so these get no lastModified either.
  const teamEntries: MetadataRoute.Sitemap = team.map((person) => ({
    url: absoluteUrl(`/meet-the-partners/${person.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...lareEntries, ...teamEntries];
}
