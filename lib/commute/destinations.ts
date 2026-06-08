// lib/commute/destinations.ts
// Resolves the destination list for the /api/commute and /api/routes endpoints.
//
// The reworked widget passes a dynamic, comma-separated list of destination
// slugs (the user's checked cities). Each slug is validated against the known
// city coordinates (CITY_COORDS), de-duplicated, the origin itself dropped, and
// the list capped at MAX_DESTINATIONS as a cost/abuse guard. When no list is
// provided, falls back to the origin's legacy curated destinations from ORIGINS,
// so any older caller keeps working.

import { ORIGINS } from "@/lib/commute/origins";
import { coordsFor } from "@/lib/commute/cities";

// Defensive ceiling. The widget enforces 5; this protects the Google billing
// surface if the endpoint is called directly with a long list.
export const MAX_DESTINATIONS = 10;

export type ResolvedDestination = { key: string; label: string };

export function resolveDestinations(
  originKey: string,
  destParam: string | null
): ResolvedDestination[] {
  if (destParam !== null) {
    const seen = new Set<string>();
    const out: ResolvedDestination[] = [];
    for (const raw of destParam.split(",")) {
      const key = raw.trim();
      if (!key || key === originKey || seen.has(key)) continue;
      const coords = coordsFor(key);
      if (!coords) continue; // unknown slug, skip
      seen.add(key);
      out.push({ key, label: coords.label });
      if (out.length >= MAX_DESTINATIONS) break;
    }
    return out;
  }
  const origin = ORIGINS[originKey];
  return origin
    ? origin.destinations.map((d) => ({ key: d.key, label: d.label }))
    : [];
}
