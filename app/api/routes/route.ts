// app/api/routes/route.ts
// Returns encoded polylines for a given origin's 5 curated destinations.
//
// Same cache-or-refresh pattern as /api/commute (027/028), but for route geometry
// instead of duration. Route geometry changes effectively never (the 405 isn't
// moving), so TTL is 30 days rather than 1 hour.
//
// Storage: route_cache table (migration 029).
// Source of truth: Google Directions API.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ORIGINS } from "@/lib/commute/origins";
import { coordsFor, type CityCoords } from "@/lib/commute/cities";

// 30 days. Routes don't change; this is mostly defensive against the rare
// road-construction reroute. Cost impact at 30-day TTL across 140 pairs:
// pennies per month, well below the noise floor.
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

type CacheRow = {
  origin_key: string;
  destination_key: string;
  encoded_polyline: string;
  fetched_at: string;
};

type RouteOutput = {
  key: string;
  label: string;
  encoded_polyline: string;
  fetched_at: string;
};

function isStale(fetchedAt: string): boolean {
  const ageSeconds = (Date.now() - new Date(fetchedAt).getTime()) / 1000;
  return ageSeconds > CACHE_TTL_SECONDS;
}

// Directions API requires one origin-destination pair per call (unlike Distance
// Matrix which supports one-to-many). So we make N parallel calls. With N=5 and
// 30-day caching, this is fine, the parallel burst only happens when a fresh
// origin is requested for the first time or after 30 days.
async function fetchPolylineFromGoogle(
  originCoords: CityCoords,
  destCoords: CityCoords
): Promise<string | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY missing on server");
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${originCoords.lat},${originCoords.lng}`);
  url.searchParams.set("destination", `${destCoords.lat},${destCoords.lng}`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Google Directions HTTP error:", res.status);
      return null;
    }
    const data = await res.json();
    if (data.status !== "OK") {
      console.error("Google Directions API error:", data.status, data.error_message);
      return null;
    }
    const polyline = data.routes?.[0]?.overview_polyline?.points;
    if (typeof polyline !== "string") {
      console.error("Google Directions: missing overview_polyline");
      return null;
    }
    return polyline;
  } catch (err) {
    console.error("Google Directions fetch exception:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const originKey = searchParams.get("origin");

  if (!originKey) {
    return NextResponse.json(
      { error: "Missing 'origin' query parameter." },
      { status: 400 }
    );
  }

  const origin = ORIGINS[originKey];
  if (!origin) {
    return NextResponse.json(
      { error: `Unknown origin: ${originKey}` },
      { status: 400 }
    );
  }

  const originCoords = coordsFor(originKey);
  if (!originCoords) {
    return NextResponse.json(
      { error: `No coordinates for origin: ${originKey}` },
      { status: 500 }
    );
  }

  const destinationKeys = origin.destinations.map((d) => d.key);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecretKey) {
    console.error("Missing Supabase env vars for routes endpoint");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Read existing cache rows
  const { data: cacheRows, error: cacheError } = await supabase
    .from("route_cache")
    .select("*")
    .eq("origin_key", originKey)
    .in("destination_key", destinationKeys);

  if (cacheError) {
    console.error("Supabase route_cache read error:", cacheError);
  }

  const cacheMap = new Map<string, CacheRow>();
  (cacheRows ?? []).forEach((row: CacheRow) => {
    cacheMap.set(row.destination_key, row);
  });

  // 2. Identify stale or missing
  const staleOrMissing = destinationKeys.filter((destKey) => {
    const row = cacheMap.get(destKey);
    return !row || isStale(row.fetched_at);
  });

  // 3. Refresh in parallel from Google Directions
  if (staleOrMissing.length > 0) {
    const fetchPromises = staleOrMissing.map(async (destKey) => {
      const destCoords = coordsFor(destKey);
      if (!destCoords) {
        console.error("No coords for destination:", destKey);
        return null;
      }
      const polyline = await fetchPolylineFromGoogle(originCoords, destCoords);
      return polyline ? { destKey, polyline } : null;
    });

    const results = await Promise.all(fetchPromises);
    const freshRows: Omit<CacheRow, "fetched_at">[] = [];
    results.forEach((r) => {
      if (r) {
        freshRows.push({
          origin_key: originKey,
          destination_key: r.destKey,
          encoded_polyline: r.polyline,
        });
      }
    });

    if (freshRows.length > 0) {
      const { error: upsertError } = await supabase
        .from("route_cache")
        .upsert(freshRows, { onConflict: "origin_key,destination_key" });

      if (upsertError) {
        console.error("Supabase route_cache upsert error:", upsertError);
      } else {
        const nowIso = new Date().toISOString();
        freshRows.forEach((row) => {
          cacheMap.set(row.destination_key, { ...row, fetched_at: nowIso });
        });
      }
    } else if (cacheRows && cacheRows.length === 0) {
      // No cache AND Google failed for all destinations: nothing to return.
      return NextResponse.json(
        { error: "Route data temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }
    // Otherwise: some destinations failed but we have stale cache for some/all.
    // Fall through and return whatever we have, partial map > broken map.
  }

  // 4. Assemble response in the same order as origin.destinations
  const routes: RouteOutput[] = origin.destinations
    .map((d) => {
      const row = cacheMap.get(d.key);
      if (!row) return null;
      return {
        key: d.key,
        label: d.label,
        encoded_polyline: row.encoded_polyline,
        fetched_at: row.fetched_at,
      };
    })
    .filter((r): r is RouteOutput => r !== null);

  return NextResponse.json({
    origin: {
      key: origin.key,
      label: origin.label,
      lat: originCoords.lat,
      lng: originCoords.lng,
    },
    routes: routes.map((r) => {
      const destCoords = coordsFor(r.key);
      return {
        ...r,
        lat: destCoords?.lat ?? null,
        lng: destCoords?.lng ?? null,
      };
    }),
  });
}
