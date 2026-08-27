import { notFound, redirect } from "next/navigation";
import { getTeamMemberBySlug, getTeamMembers } from "@/lib/team";
import { TeamMemberDetail } from "@/components/team/TeamMemberDetail";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

/**
 * Is this slug one of the agents named in siteConfig?
 *
 * team_directory slugs are typed by hand in the hub admin (validated only as
 * [a-z0-9-]+), so nothing guarantees they match siteConfig.agents[].slug even
 * though migration 031 documents "karen, jack" as the intended convention. That
 * makes a legacy deep link like /karen-misraje -> /meet-the-partners/karen a
 * guess. This narrows the blast radius of the guess being wrong: a slug that
 * names a CONFIGURED agent but has no directory row falls back to the index
 * rather than 404ing, so the legacy link is never worse than pointing at the
 * index, and is better whenever the convention does hold.
 *
 * Deliberately narrow. Any other unknown slug still 404s, because a soft-404
 * that redirects every typo to the index is its own SEO problem.
 */
function isConfiguredAgentSlug(slug: string): boolean {
  return siteConfig.agents.some((a) => a.slug === slug);
}

export const revalidate = 3600;

/**
 * Pre-generates static pages for every team member at build time. Reduces
 * cold-start latency on detail page visits and means typo URLs return 404
 * immediately instead of hitting Supabase.
 */
export async function generateStaticParams() {
  const team = await getTeamMembers();
  return team.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = await getTeamMemberBySlug(slug);
  // Matches the page below: a configured agent with no directory row redirects
  // to the index, so do not advertise it as a missing page.
  if (!person) {
    return isConfiguredAgentSlug(slug)
      ? { title: siteConfig.legalName, alternates: { canonical: absoluteUrl("/meet-the-partners") } }
      : { title: "Not Found" };
  }
  return {
    title: person.name,
    alternates: { canonical: absoluteUrl(`/meet-the-partners/${slug}`) },
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = await getTeamMemberBySlug(slug);

  if (!person) {
    if (isConfiguredAgentSlug(slug)) {
      redirect("/meet-the-partners");
    }
    notFound();
  }

  return <TeamMemberDetail person={person} />;
}
