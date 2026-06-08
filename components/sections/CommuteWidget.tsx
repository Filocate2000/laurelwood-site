"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  PolylineF,
  useLoadScript,
  OverlayView,
} from "@react-google-maps/api";
import { MAP_ID, MAP_COLORS, ROUTE_COLORS } from "@/lib/commute/mapStyle";
import { NEIGHBORHOODS, NEIGHBORHOOD_FALLBACK } from "@/lib/neighborhoods";
import { siteConfig } from "@/lib/site-config";

// Fixed origin for this site (no origin dropdown). Coordinates live in
// lib/commute/cities.ts under this key; the heading uses the site name.
const ORIGIN_KEY = siteConfig.commuteOriginKey;
const ORIGIN_LABEL = siteConfig.name; // "Laurelwood Estates"
const DEFAULT_DESTINATIONS = siteConfig.commuteDefaultDestinations;
const MAX_CHECKED = 5;

// Studio City is the origin neighborhood (pinned in the narrative below), so it
// must never be a selectable destination. Filtered out in the UI only — the
// commute_cities data layer is left untouched.
const EXCLUDED_DESTINATION_SLUG = "studio-city";

// The Studio City narrative is pinned below the widget regardless of origin.
const STUDIO_CITY = NEIGHBORHOODS["studio-city"] ?? NEIGHBORHOOD_FALLBACK;

type City = { slug: string; label: string; lat: number; lng: number };

type CommuteResponse = {
  origin: { key: string; label: string };
  destinations: Array<{
    key: string;
    label: string;
    duration_seconds: number;
    duration_traffic_seconds: number | null;
    distance_meters: number | null;
    fetched_at: string;
  }>;
};

type RoutesResponse = {
  origin: { key: string; label: string; lat: number; lng: number };
  routes: Array<{
    key: string;
    label: string;
    encoded_polyline: string;
    fetched_at: string;
    lat: number | null;
    lng: number | null;
  }>;
};

function formatDuration(seconds: number): string {
  return `${Math.round(seconds / 60)} min`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getDepartureArrival(durationSeconds: number) {
  const departure = new Date();
  const arrival = new Date(departure.getTime() + durationSeconds * 1000);
  return { departure: formatTime(departure), arrival: formatTime(arrival) };
}

const GOOGLE_MAPS_LIBRARIES: ("geometry" | "marker")[] = ["geometry", "marker"];
const MAP_CONTAINER_STYLE = { width: "100%", height: "460px" };

function colorForIndex(i: number): string {
  return ROUTE_COLORS[i % ROUTE_COLORS.length];
}

// Square checkbox; gold by default, or a route color when one is passed.
function CheckBox({ checked, color = "#C8A75B" }: { checked: boolean; color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0 border transition-colors"
      style={{
        borderColor: checked ? color : "rgba(255,255,255,0.35)",
        backgroundColor: checked ? color : "transparent",
      }}
    >
      {checked && (
        <svg
          viewBox="0 0 16 16"
          className="w-3 h-3"
          fill="none"
          stroke="#0A1F3D"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 8 7 12 13 4" />
        </svg>
      )}
    </span>
  );
}

// HTML map marker via OverlayView, for full Tailwind control over the pin.
function HtmlPin({
  position,
  color,
  size = "sm",
  label,
}: {
  position: { lat: number; lng: number };
  color: string;
  size?: "sm" | "lg";
  label?: string;
}) {
  const dim = size === "lg" ? 18 : 12;
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
      })}
    >
      <div className="flex flex-col items-center pointer-events-none select-none">
        <div
          className="rounded-full border-2 border-white shadow-md"
          style={{
            width: `${dim}px`,
            height: `${dim}px`,
            backgroundColor: color,
            ...(size === "lg" && {
              boxShadow: `0 0 0 3px ${MAP_COLORS.originPinStroke}, 0 2px 6px rgba(0,0,0,0.25)`,
            }),
          }}
        />
        {label && (
          <div
            className="mt-2 px-2 py-0.5 bg-white/95 text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-sm ring-1 ring-black/5"
            style={{ color: "#0e1a2e", textShadow: "0 1px 0 rgba(255,255,255,0.6)" }}
          >
            {label}
          </div>
        )}
      </div>
    </OverlayView>
  );
}

// Map of the origin plus every checked destination's route. fitBounds frames the
// origin and all destinations; the origin pin is labeled Laurelwood Estates.
function RouteMap({
  routesData,
  durationsByKey,
}: {
  routesData: RoutesResponse;
  durationsByKey: Map<string, number>;
}) {
  const browserApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: browserApiKey ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
    id: "misraje-commute-map-script",
  });

  const decodedRoutes = useMemo(() => {
    if (!isLoaded || !window.google?.maps?.geometry?.encoding) return [];
    return routesData.routes
      .filter((r) => r.lat !== null && r.lng !== null)
      .map((r, i) => ({
        key: r.key,
        label: r.label,
        destLat: r.lat as number,
        destLng: r.lng as number,
        color: colorForIndex(i),
        path: window.google.maps.geometry.encoding.decodePath(r.encoded_polyline),
      }));
  }, [isLoaded, routesData]);

  const bounds = useMemo(() => {
    if (!isLoaded) return null;
    const b = new window.google.maps.LatLngBounds();
    b.extend({ lat: routesData.origin.lat, lng: routesData.origin.lng });
    decodedRoutes.forEach((r) => b.extend({ lat: r.destLat, lng: r.destLng }));
    return b;
  }, [isLoaded, routesData, decodedRoutes]);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  useEffect(() => {
    if (map && bounds && !bounds.isEmpty()) {
      map.fitBounds(bounds, 60);
    }
  }, [map, bounds]);

  if (!browserApiKey) {
    return (
      <p className="text-ink-300 text-sm py-12">
        Map unavailable, browser key not configured.
      </p>
    );
  }
  if (loadError) {
    return <p className="text-ink-300 text-sm py-12">Map failed to load.</p>;
  }
  if (!isLoaded) {
    return (
      <div
        className="bg-white/5 animate-pulse"
        style={MAP_CONTAINER_STYLE}
        aria-label="Loading map"
      />
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={{ lat: routesData.origin.lat, lng: routesData.origin.lng }}
      zoom={11}
      options={{
        mapId: MAP_ID,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
      }}
      onLoad={(m) => setMap(m)}
    >
      {decodedRoutes.map((route) => (
        <PolylineF
          key={`route-${route.key}`}
          path={route.path}
          options={{
            strokeColor: route.color,
            strokeOpacity: MAP_COLORS.routeStrokeOpacity,
            strokeWeight: MAP_COLORS.routeStrokeWeight,
            clickable: false,
          }}
        />
      ))}

      {/* Origin pin, labeled. "Laurelwood Estates" is not a Google base-map
          label, so there's no name-over-name overlap to avoid. */}
      <HtmlPin
        position={{ lat: routesData.origin.lat, lng: routesData.origin.lng }}
        color={MAP_COLORS.originPin}
        size="lg"
        label={ORIGIN_LABEL}
      />

      {decodedRoutes.map((route) => {
        const dur = durationsByKey.get(route.key);
        return (
          <HtmlPin
            key={`pin-${route.key}`}
            position={{ lat: route.destLat, lng: route.destLng }}
            color={route.color}
            label={dur !== undefined ? formatDuration(dur) : undefined}
          />
        );
      })}
    </GoogleMap>
  );
}

// Collapsed dropdown that opens a checkbox panel of all selectable cities, with
// the soft cap (and its hint) enforced inside the panel. Closes on outside
// click or Escape; the panel is full-width on mobile, a popover on desktop.
function DestinationDropdown({
  cities,
  checked,
  onToggle,
}: {
  cities: City[];
  checked: Set<string>;
  onToggle: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const atCap = checked.size >= MAX_CHECKED;

  // Red-flash state for clicks blocked by the five-city cap. The message reverts
  // to gold after ~1.5s; repeat clicks restart the timer, and it's cleared on
  // unmount.
  const [flash, setFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function triggerFlash() {
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 1500);
  }
  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative max-w-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between gap-3 bg-navy-900 border border-white/20 px-4 py-3 text-left text-ink-100 hover:border-gold-500/60 focus:border-gold-500 focus:outline-none transition-colors"
      >
        <span>Choose destinations</span>
        <span className="flex items-center gap-2 text-sm text-gold-500">
          {checked.size} selected
          <svg
            viewBox="0 0 16 16"
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 8 11 13 6" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label="Commute destinations"
          className="absolute z-20 left-0 mt-2 w-full md:w-[34rem] bg-navy-900 border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)] p-4"
        >
          <p
            aria-live="polite"
            className={`text-sm mb-3 ${flash ? "text-red-400" : "text-gold-500"}`}
          >
            {flash
              ? "Only five cities can be selected. Uncheck one to add another."
              : "Only five cities can be selected at a time."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-0.5 max-h-72 overflow-y-auto">
            {cities.map((city) => {
              const isChecked = checked.has(city.slug);
              const blocked = !isChecked && atCap;
              return (
                <button
                  key={city.slug}
                  type="button"
                  role="option"
                  aria-selected={isChecked}
                  aria-disabled={blocked}
                  // Blocked items stay clickable but do NOT toggle; the only
                  // effect of clicking one is the red cap flash above.
                  onClick={() => (blocked ? triggerFlash() : onToggle(city.slug))}
                  className={`flex items-center gap-2.5 text-left py-2 transition-opacity ${
                    blocked
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-90"
                  }`}
                >
                  <CheckBox checked={isChecked} />
                  <span className="text-sm text-ink-100 leading-snug">{city.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CommuteWidget() {
  const [cities, setCities] = useState<City[] | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [commuteData, setCommuteData] = useState<CommuteResponse | null>(null);
  const [routesData, setRoutesData] = useState<RoutesResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  // 1. Load the selectable city list (server route: table -> local fallback).
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/commute-cities");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { cities: City[] };
        if (cancelled) return;
        // Drop the origin (Studio City) from the rendered list; alphabetical
        // order of the remaining cities is preserved.
        const list = (json.cities ?? []).filter(
          (c) => c.slug !== EXCLUDED_DESTINATION_SLUG
        );
        setCities(list);
        const available = new Set(list.map((c) => c.slug));
        const initial = new Set(
          DEFAULT_DESTINATIONS.filter((s) => available.has(s)).slice(0, MAX_CHECKED)
        );
        setChecked(initial);
      } catch {
        if (!cancelled) setCities([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. When the checked set changes, fetch durations + routes for it (debounced
  //    so rapid toggling doesn't fire a request per click).
  const checkedKey = useMemo(() => [...checked].sort().join(","), [checked]);
  useEffect(() => {
    if (checked.size === 0) {
      setCommuteData(null);
      setRoutesData(null);
      setStatus("idle");
      return;
    }
    let cancelled = false;
    const dests = [...checked].join(",");
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const [commuteRes, routesRes] = await Promise.all([
          fetch(`/api/commute?origin=${ORIGIN_KEY}&destinations=${encodeURIComponent(dests)}`),
          fetch(`/api/routes?origin=${ORIGIN_KEY}&destinations=${encodeURIComponent(dests)}`),
        ]);
        if (!commuteRes.ok) throw new Error(`commute HTTP ${commuteRes.status}`);
        const commute: CommuteResponse = await commuteRes.json();
        const routes: RoutesResponse | null = routesRes.ok
          ? await routesRes.json()
          : null;
        if (cancelled) return;
        setCommuteData(commute);
        setRoutesData(routes);
        setFetchedAt(new Date());
        setStatus("idle");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedKey]);

  const durationsByKey = useMemo(() => {
    const m = new Map<string, number>();
    commuteData?.destinations.forEach((d) => {
      m.set(d.key, d.duration_traffic_seconds ?? d.duration_seconds);
    });
    return m;
  }, [commuteData]);

  const citiesBySlug = useMemo(() => {
    const m = new Map<string, string>();
    (cities ?? []).forEach((c) => m.set(c.slug, c.label));
    return m;
  }, [cities]);

  function toggle(slug: string) {
    if (slug === EXCLUDED_DESTINATION_SLUG) return; // origin is never selectable
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        if (next.size >= MAX_CHECKED) return prev; // soft cap
        next.add(slug);
      }
      return next;
    });
  }

  // Insertion order matches the destination order sent to the APIs, so card
  // colors line up with the map route colors (colorForIndex by position).
  // Studio City is excluded defensively so it never renders as a card even if it
  // somehow ends up in state.
  const checkedList = useMemo(
    () => [...checked].filter((s) => s !== EXCLUDED_DESTINATION_SLUG),
    [checked]
  );

  return (
    <section className="bg-navy-950 text-white py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <p className="eyebrow text-gold-500 mb-4">Explore Los Angeles</p>
        <h2 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-white mb-6">
          Explore commute times from {ORIGIN_LABEL}
        </h2>
        <span className="gold-rule mb-8" />
        <p className="text-lg text-ink-100 leading-relaxed mb-8 max-w-2xl">
          Select up to five destinations to see drive times from {ORIGIN_LABEL}.
        </p>

        {/* Live-data indicator: gold pulse dot + note. */}
        <p className="flex items-center gap-2.5 text-sm text-ink-300 mb-8 max-w-2xl">
          <span
            aria-hidden="true"
            className="inline-block w-2 h-2 rounded-full bg-gold-500 animate-pulse flex-shrink-0"
          />
          Drive times reflect live Los Angeles traffic at this moment, not static
          estimates.
        </p>

        {/* Dropdown selector */}
        {cities === null ? (
          <p className="text-ink-300 text-sm">Loading destinations…</p>
        ) : cities.length === 0 ? (
          <p className="text-ink-300 text-sm">Destinations are unavailable right now.</p>
        ) : (
          <DestinationDropdown cities={cities} checked={checked} onToggle={toggle} />
        )}

        {status === "error" && (
          <p className="mt-3 text-xs text-red-400">
            Commute data is temporarily unavailable. Try again shortly.
          </p>
        )}

        {/* Selected-city detail cards: display-only readouts. Cities are added or
            removed only via the "Choose destinations" dropdown checkboxes; the
            cards themselves are not clickable. Colors match the map route colors. */}
        {checkedList.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
            {checkedList.map((slug, i) => {
              const label = citiesBySlug.get(slug) ?? slug;
              const color = colorForIndex(i);
              const dur = durationsByKey.get(slug);
              const times = dur !== undefined ? getDepartureArrival(dur) : null;
              return (
                <div
                  key={slug}
                  className="text-left border-l pl-5 py-2 min-w-[10rem]"
                  style={{ borderColor: `${color}66` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckBox checked color={color} />
                    <h4 className="font-display font-medium text-xl xl:text-2xl text-white whitespace-nowrap">
                      {label}
                    </h4>
                  </div>
                  <p className="text-2xl mb-3" style={{ color }}>
                    {dur !== undefined ? formatDuration(dur) : "…"}
                  </p>
                  <div className="text-xs text-ink-300 space-y-1">
                    <p>Departure: {times ? times.departure : "—"}</p>
                    <p>Arrival: {times ? times.arrival : "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live-traffic timestamp, from the moment the commute response arrived. */}
        {fetchedAt && checkedList.length > 0 && (
          <p className="mt-6 text-sm text-ink-300">
            Times as of {formatTime(fetchedAt)} today, via Google live traffic.
            Check back anytime for current conditions.
          </p>
        )}

        {/* Single split block (misraje-style arrangement): pinned Studio City
            narrative on the left (~45%), the one live route map on the right
            (~55%). On mobile it stacks: narrative above map, both full width. */}
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-14 mt-16 mb-16 items-start">
          {/* Pinned Studio City narrative (verbatim from lib/neighborhoods.ts),
              shown regardless of the widget origin. */}
          <div>
            <h3 className="font-display font-light text-4xl md:text-5xl text-white mb-6">
              Studio City
            </h3>
            <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
              {STUDIO_CITY.narrative.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* THE live route map (origin + checked destinations). */}
          <div className="lg:sticky lg:top-24">
            {checked.size === 0 ? (
              <div
                className="bg-white/5 border-2 border-gold-500/70 grid place-items-center text-ink-300 text-sm px-6 text-center"
                style={MAP_CONTAINER_STYLE}
              >
                Select a destination to see drive times and routes.
              </div>
            ) : routesData && routesData.routes.length > 0 ? (
              <div
                className="overflow-hidden border-2 border-gold-500/70"
                style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
              >
                <RouteMap routesData={routesData} durationsByKey={durationsByKey} />
              </div>
            ) : (
              <div
                className="bg-white/5 animate-pulse border-2 border-gold-500/70"
                style={MAP_CONTAINER_STYLE}
                aria-label="Loading map"
              />
            )}
          </div>
        </div>

        {/* Static listings CTA (origin-fixed). Full-width divider; the block
            centers as a unit (centered heading, sub-line, and button row). */}
        <div className="mt-16 pt-12 border-t border-white/10 text-center">
          <p className="font-display font-light text-3xl md:text-4xl text-white mb-3 leading-snug">
            Explore homes in {ORIGIN_LABEL}
          </p>
          <p className="text-lg text-ink-100 mb-8 leading-relaxed max-w-2xl mx-auto">
            Discover the properties and opportunities that define one of Los
            Angeles&apos; most distinctive communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium px-8 py-4 tracking-wide transition-colors"
            >
              View {ORIGIN_LABEL} listings
            </a>
            <a
              href="/contact"
              className="inline-block border border-white/30 hover:border-gold-500 hover:text-gold-500 text-white font-medium px-8 py-4 tracking-wide transition-colors"
            >
              Start a conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
