import { cache } from "react";
import { createPublicServerClient } from "./supabase/server";

/**
 * Phase 3 (platform-sites): resolve this site's brokerage from a SINGLE source of
 * truth - brokerage_domain, keyed by the site's own hostname - instead of a
 * hardcoded brokerage UUID that can silently drift. In the 2026-07-10
 * ghost-brokerage incident the hardcoded fallback pointed at a deleted brokerage
 * and every data-driven page went blank.
 *
 * The fix: hardcode the STABLE hostname, never the volatile brokerage id. The
 * host -> brokerage mapping lives once, in the DB.
 */

// This site's canonical serving hostname.
const SITE_HOSTNAME = "laurelwoodestates.com";

// Last-resort fallback if the resolver fails (network, or the resolver function
// not yet applied). The LIVE brokerage, logged loudly - never a silent wrong value.
const FALLBACK_BROKERAGE_ID = "4796aec0-1843-4a30-80ba-871a994604b1";

/**
 * Resolves the brokerage id for this site, cached per request. Calls the
 * SECURITY DEFINER resolver `resolve_brokerage_for_host` (migration
 * 2026-07-23-platform-sites-04) so the brokerage_domain table is never exposed to
 * anon. Does not filter is_verified (these marketing rows are is_verified=false).
 */
export const resolveBrokerageId = cache(async (): Promise<string> => {
  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase.rpc("resolve_brokerage_for_host", {
      p_hostname: SITE_HOSTNAME,
    });
    if (error) {
      console.error(
        `resolveBrokerageId: resolve_brokerage_for_host failed for ${SITE_HOSTNAME} (${error.message}); using fallback ${FALLBACK_BROKERAGE_ID}`
      );
      return FALLBACK_BROKERAGE_ID;
    }
    if (!data) {
      console.error(
        `resolveBrokerageId: no brokerage mapping for ${SITE_HOSTNAME}; using fallback ${FALLBACK_BROKERAGE_ID}`
      );
      return FALLBACK_BROKERAGE_ID;
    }
    return data as string;
  } catch (e) {
    console.error(
      `resolveBrokerageId: unexpected error for ${SITE_HOSTNAME}; using fallback ${FALLBACK_BROKERAGE_ID}`,
      e
    );
    return FALLBACK_BROKERAGE_ID;
  }
});
