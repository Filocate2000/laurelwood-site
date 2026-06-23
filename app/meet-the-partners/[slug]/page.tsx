import { notFound } from "next/navigation";
import { getTeamMemberBySlug, getTeamMembers } from "@/lib/team";
import { TeamMemberDetail } from "@/components/team/TeamMemberDetail";
import { absoluteUrl } from "@/lib/site-config";

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
  if (!person) return { title: "Not Found" };
  return {
    title: person.name,
    alternates: { canonical: absoluteUrl(`/meet-the-partners/${slug}`) },
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = await getTeamMemberBySlug(slug);

  if (!person) {
    notFound();
  }

  return <TeamMemberDetail person={person} />;
}
