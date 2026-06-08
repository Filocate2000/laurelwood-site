// app/api/commute-cities/route.ts
// Returns the alphabetized list of selectable commute destinations for the
// homepage widget. Reads the commute_cities table (active rows) with the
// service-role key, caches the result in memory for ~1 hour, and falls back to
// the local CITY_COORDS list on any failure. The origin city
// (siteConfig.commuteOriginKey) is excluded, since you can't route to yourself.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CITY_COORDS } from "@/lib/commute/cities";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

type City = { slug: string; label: string; lat: number; lng: number };

const CACHE_TTL_MS = 60 * 60 * 1000; // ~1 hour
let cache: { at: number; cities: City[] } | null = null;

/** Local fallback: the hardcoded coordinate table, shaped like the DB rows. */
function localCities(): City[] {
  return Object.entries(CITY_COORDS).map(([slug, c]) => ({
    slug,
    label: c.label,
    lat: c.lat,
    lng: c.lng,
  }));
}

async function loadCities(): Promise<{ cities: City[]; source: "table" | "fallback" }> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return { cities: cache.cities, source: "table" };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return { cities: localCities(), source: "fallback" };
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("commute_cities")
      .select("slug, label, lat, lng")
      .eq("active", true)
      .order("label", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("commute-cities read error:", error);
      // Don't cache an empty/failed read; serve the local list this time.
      return { cities: localCities(), source: "fallback" };
    }

    const cities = data as City[];
    cache = { at: now, cities };
    return { cities, source: "table" };
  } catch (err) {
    console.error("commute-cities fetch exception:", err);
    return { cities: localCities(), source: "fallback" };
  }
}

export async function GET() {
  const { cities, source } = await loadCities();
  const originKey = siteConfig.commuteOriginKey;
  const filtered = cities
    .filter((c) => c.slug !== originKey)
    .sort((a, b) => a.label.localeCompare(b.label));
  return NextResponse.json({ cities: filtered, source });
}
