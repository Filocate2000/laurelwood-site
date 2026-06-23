import { createPublicServerClient } from "./supabase/server";

/**
 * Misraje brokerage ID, used as the tenant filter for every team query.
 * Matches NEXT_PUBLIC_MISRAJE_BROKERAGE_ID env var; hardcoded fallback ensures
 * pages render even if the env var is unset.
 */
const MISRAJE_BROKERAGE_ID =
  process.env.NEXT_PUBLIC_MISRAJE_BROKERAGE_ID ??
  "852d9bdd-4293-42e1-8833-f35273dc08e7";

export type Stat = {
  label: string;
  value: string;
};

export type Credential = {
  kind: "license" | "patent" | "award" | "role";
  label: string;
  value: string;
  year?: string;
};

export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  title: string;
  email: string | null;
  phone: string | null;
  phone_href: string | null;
  dre_license: string | null;
  nmls_license: string | null;
  photo_path: string | null;
  photo_object_position: string;
  short_bio: string;
  long_bio: string;
  stats: Stat[];
  credentials: Credential[];
  sort_order: number;
};

/**
 * Fetches all published team members for the Misraje brokerage, ordered by
 * sort_order. Returns an empty array if the query fails so pages can still
 * render (the UI handles the empty case with a friendly message).
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("team_directory")
    .select(
      "id, slug, name, title, email, phone, phone_href, dre_license, nmls_license, photo_path, photo_object_position, short_bio, long_bio, stats, credentials, sort_order"
    )
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTeamMembers error:", error);
    return [];
  }

  return (data as TeamMember[]) ?? [];
}

/**
 * Fetches a single published team member by slug. Returns null if not found
 * or on error so the dynamic route can call notFound().
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("team_directory")
    .select(
      "id, slug, name, title, email, phone, phone_href, dre_license, nmls_license, photo_path, photo_object_position, short_bio, long_bio, stats, credentials, sort_order"
    )
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("getTeamMemberBySlug error:", error);
    return null;
  }

  return (data as TeamMember | null) ?? null;
}
