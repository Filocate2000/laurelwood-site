// app/api/commute/route.ts
// Returns commute durations for a given origin's 5 curated destinations.
//
// Flow:
//   1. Validate origin query param
//   2. Look up the 5 destinations for that origin from lib/commute/origins.ts
//   3. Query Supabase commute_cache for those 5 rows
//   4. Identify which rows are stale (older than CACHE_TTL_SECONDS) or missing
//   5. If any stale, fetch fresh data from Google Maps Distance Matrix API
//   6. Upsert fresh results to cache
//   7. Return all 5 destinations to the client
//
// Resilience:
//   - If Google Maps fails, return stale cache (don't break the page)
//   - If cache has nothing AND Google Maps fails, return 503

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ORIGINS } from "@/lib/commute/origins";
import { CITY_COORDS, coordsFor, type CityCoords } from "@/lib/commute/cities";

// 1 hour cache TTL. Durations vary by traffic, so we refresh hourly.
// Without caching: 27 origins × 5 destinations × many visitors per hour = $$$.
// With this TTL: roughly 27 origins × 5 destinations × 24 refreshes/day = 3,240 elements/day,
// which is ~$0.50/day at $5 per 1000. Well within Google's $200/month free tier.
const CACHE_TTL_SECONDS = 60 * 60;

type CacheRow = {
  origin_key: string;
  destination_key: string;
  duration_seconds: number;
  duration_traffic_seconds: number | null;
  distance_meters: number | null;
  fetched_at: string;
};

type DestinationOutput = {
  key: string;
  label: string;
  duration_seconds: number;
  duration_traffic_seconds: number | null;
  distance_meters: number | null;
  fetched_at: string;
};

function isStale(fetchedAt: string): boolean {
  const ageSeconds = (Date.now() - new Date(fetchedAt).getTime()) / 1000;
  return ageSeconds > CACHE_TTL_SECONDS;
}

async function fetchFromGoogleMaps(
  originKey: string,
  destinationKeys: string[]
): Promise<Map<string, { duration: number; durationTraffic: number | null; distance: number | null }> | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY missing on server");
    return null;
  }

  const originCoords = coordsFor(originKey);
  if (!originCoords) {
    console.error("No coords for origin:", originKey);
    return null;
  }

  const destCoords = destinationKeys
    .map((key) => ({ key, coords: coordsFor(key) }))
    .filter((d): d is { key: string; coords: CityCoords } => d.coords !== null);

  if (destCoords.length === 0) {
    console.error("No valid destination coords for:", destinationKeys);
    return null;
  }

  const originParam = `${originCoords.lat},${originCoords.lng}`;
  const destinationsParam = destCoords
    .map((d) => `${d.coords.lat},${d.coords.lng}`)
    .join("|");

  // Distance Matrix API: one origin, multiple destinations, with traffic data.
  // departure_time=now enables duration_in_traffic in response.
  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", originParam);
  url.searchParams.set("destinations", destinationsParam);
  url.searchParams.set("departure_time", "now");
  url.searchParams.set("traffic_model", "best_guess");
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Google Maps HTTP error:", res.status);
      return null;
    }
    const data = await res.json();
    if (data.status !== "OK") {
      console.error("Google Maps API error:", data.status, data.error_message);
      return null;
    }

    const row = data.rows?.[0];
    if (!row?.elements) {
      console.error("Google Maps unexpected response shape");
      return null;
    }

    const results = new Map<string, { duration: number; durationTraffic: number | null; distance: number | null }>();
    row.elements.forEach((element: any, i: number) => {
      const destKey = destCoords[i].key;
      if (element.status === "OK" && element.duration?.value) {
        results.set(destKey, {
          duration: element.duration.value,
          durationTraffic: element.duration_in_traffic?.value ?? null,
          distance: element.distance?.value ?? null,
        });
      } else {
        console.warn(`Google Maps element status for ${destKey}:`, element.status);
      }
    });
    return results;
  } catch (err) {
    console.error("Google Maps fetch exception:", err);
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

  const destinationKeys = origin.destinations.map((d) => d.key);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecretKey) {
    console.error("Missing Supabase env vars for commute route");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Load whatever the cache has for these 5 pairs
  const { data: cacheRows, error: cacheError } = await supabase
    .from("commute_cache")
    .select("*")
    .eq("origin_key", originKey)
    .in("destination_key", destinationKeys);

  if (cacheError) {
    console.error("Supabase cache read error:", cacheError);
  }

  const cacheMap = new Map<string, CacheRow>();
  (cacheRows ?? []).forEach((row: CacheRow) => {
    cacheMap.set(row.destination_key, row);
  });

  // 2. Determine which destinations need refreshing
  const staleOrMissing = destinationKeys.filter((destKey) => {
    const row = cacheMap.get(destKey);
    return !row || isStale(row.fetched_at);
  });

  // 3. Refresh if needed
  if (staleOrMissing.length > 0) {
    const fresh = await fetchFromGoogleMaps(originKey, staleOrMissing);

    if (fresh && fresh.size > 0) {
      const upsertRows: Omit<CacheRow, "fetched_at">[] = [];
      fresh.forEach((value, destKey) => {
        upsertRows.push({
          origin_key: originKey,
          destination_key: destKey,
          duration_seconds: value.duration,
          duration_traffic_seconds: value.durationTraffic,
          distance_meters: value.distance,
        });
      });

      const { error: upsertError } = await supabase
        .from("commute_cache")
        .upsert(upsertRows, { onConflict: "origin_key,destination_key" });

      if (upsertError) {
        console.error("Supabase upsert error:", upsertError);
      } else {
        // Update our in-memory map so the response below uses fresh data
        const nowIso = new Date().toISOString();
        upsertRows.forEach((row) => {
          cacheMap.set(row.destination_key, { ...row, fetched_at: nowIso });
        });
      }
    } else if (cacheRows && cacheRows.length === 0) {
      // No cache AND Google Maps failed, we have nothing to return
      return NextResponse.json(
        { error: "Commute data temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }
    // else: Google Maps failed but we have some stale cache, fall through and return stale
  }

  // 4. Build response from whatever is now in cacheMap (mix of fresh + stale OK)
  const destinations: DestinationOutput[] = origin.destinations
    .map((d) => {
      const row = cacheMap.get(d.key);
      if (!row) return null;
      return {
        key: d.key,
        label: d.label,
        duration_seconds: row.duration_seconds,
        duration_traffic_seconds: row.duration_traffic_seconds,
        distance_meters: row.distance_meters,
        fetched_at: row.fetched_at,
      };
    })
    .filter((d): d is DestinationOutput => d !== null);

  return NextResponse.json({
    origin: { key: origin.key, label: origin.label },
    destinations,
  });
}