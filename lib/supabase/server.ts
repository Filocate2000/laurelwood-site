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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
