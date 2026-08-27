import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for fetching public, anon-readable data
 * (e.g. team_directory, future property listings) from React Server Components
 * and generateStaticParams.
 *
 * Uses plain createClient (not the SSR cookie helper) because these queries
 * are stateless: anon role with public RLS, no user session, no cookies needed.
 * Works at both build time (generateStaticParams) and request time.
 *
 * For queries that need auth context (logged-in user data), use the SSR client
 * pattern instead with proper cookie handling in a Server Action or Route Handler.
 */
export function createPublicServerClient() {
  // Validate rather than assert with `!`. An undefined url reaches createClient
  // as undefined and supabase-js throws the opaque "supabaseUrl is required",
  // which during `next build` surfaces as a whole-build failure on whichever
  // prerendered page happened to read first. Callers catch this and fall back to
  // their empty state; the message matches lib/market/getMarketData.ts.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase credentials are not configured");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Same client, but returns null instead of throwing when the credentials are
 * absent. For the public read helpers whose contract is already "on failure,
 * return the empty state" (getTeamMembers -> [], getPastTransactions -> []).
 * Those helpers run inside generateStaticParams and prerenders, where an
 * uncaught throw fails the ENTIRE build rather than the one page. Logs loudly so
 * a credential-less build is visible in the build output, never silent.
 */
export function createPublicServerClientOrNull() {
  try {
    return createPublicServerClient();
  } catch (e) {
    console.error("Supabase client unavailable:", e);
    return null;
  }
}
