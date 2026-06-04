"use client";

import { useState, useEffect, useMemo } from "react";
import {
  GoogleMap,
  PolylineF,
  useLoadScript,
  OverlayView,
} from "@react-google-maps/api";
import { ORIGIN_LIST, DEFAULT_ORIGIN_KEY } from "@/lib/commute/origins";
import { NEIGHBORHOODS, NEIGHBORHOOD_FALLBACK } from "@/lib/neighborhoods";
import { MAP_ID, MAP_COLORS, ROUTE_COLORS } from "@/lib/commute/mapStyle";
import { siteConfig } from "@/lib/site-config";

// Initial origin for this site. Laurelwood uses the nearest curated origin,
// studio-city (siteConfig.commuteOriginKey; see STATE.md). Falls back to the
// shared default if the configured key is not a known origin.
const INITIAL_ORIGIN_KEY = ORIGIN_LIST.some(
  (o) => o.key === siteConfig.commuteOriginKey
)
  ? siteConfig.commuteOriginKey
  : DEFAULT_ORIGIN_KEY;

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
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getDepartureArrival(durationSeconds: number) {
  const departure = new Date();
  const arrival = new Date(departure.getTime() + durationSeconds * 1000);
  return {
    departure: formatTime(departure),
    arrival: formatTime(arrival),
  };
}

const GOOGLE_MAPS_LIBRARIES: ("geometry" | "marker")[] = ["geometry", "marker"];

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "460px",
};

// Default-checked destination indices on first load. Picks the 1st, 3rd, and
// 5th destinations from each origin's curated list of 5. The lists in origins.ts
// alternate between directions (coastal / east / Valley / etc.) so this naturally
// gives a spread-out map without all 5 routes overlapping.
const DEFAULT_VISIBLE_INDICES = [0, 2, 4];

function colorForIndex(i: number): string {
  return ROUTE_COLORS[i % ROUTE_COLORS.length];
}

// HTML marker rendered via OverlayView. Gives us full Tailwind control over the
// pin's appearance, instead of Google's deprecated built-in markers which have
// limited styling.
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
            style={{
              color: "#0e1a2e",
              textShadow: "0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            {label}
          </div>
        )}
      </div>
    </OverlayView>
  );
}

function RouteMap({
  routesData,
  visibleKeys,
  durationsByKey,
}: {
  routesData: RoutesResponse;
  visibleKeys: Set<string>;
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
    decodedRoutes.forEach((r) => {
      if (visibleKeys.has(r.key)) {
        b.extend({ lat: r.destLat, lng: r.destLng });
      }
    });
    return b;
  }, [isLoaded, routesData, decodedRoutes, visibleKeys]);

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
      {decodedRoutes
        .filter((r) => visibleKeys.has(r.key))
        .map((route) => (
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

      {/* Origin pin, unlabeled. The base map already shows the city name
          beside the pin, so adding our own label causes a "Beverly Hills /
          Beverly Hills" overlap. The gold-ringed navy pin is enough to mark
          the starting point. */}
      <HtmlPin
        position={{ lat: routesData.origin.lat, lng: routesData.origin.lng }}
        color={MAP_COLORS.originPin}
        size="lg"
      />

      {decodedRoutes
        .filter((r) => visibleKeys.has(r.key))
        .map((route) => {
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

function CheckBox({
  checked,
  color,
}: {
  checked: boolean;
  color: string;
}) {
  return (
    <span
      role="presentation"
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
          stroke="white"
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

export function CommuteWidget() {
  const [originKey, setOriginKey] = useState<string>(INITIAL_ORIGIN_KEY);
  const [commuteData, setCommuteData] = useState<CommuteResponse | null>(null);
  const [routesData, setRoutesData] = useState<RoutesResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const [commuteRes, routesRes] = await Promise.all([
          fetch(`/api/commute?origin=${encodeURIComponent(originKey)}`),
          fetch(`/api/routes?origin=${encodeURIComponent(originKey)}`),
        ]);

        if (!commuteRes.ok) {
          const err = await commuteRes.json().catch(() => ({}));
          throw new Error(err.error || `Commute HTTP ${commuteRes.status}`);
        }
        const commute: CommuteResponse = await commuteRes.json();

        let routes: RoutesResponse | null = null;
        if (routesRes.ok) {
          routes = await routesRes.json();
        } else {
          console.warn("Routes endpoint failed:", routesRes.status);
        }

        if (!cancelled) {
          setCommuteData(commute);
          setRoutesData(routes);
          // Default-visible: positions 0, 2, 4 of the destination list. The
          // origin lists in origins.ts alternate by direction so this naturally
          // gives the map a spread-out look instead of 5 overlapping routes.
          const defaults = new Set<string>();
          DEFAULT_VISIBLE_INDICES.forEach((i) => {
            const d = commute.destinations[i];
            if (d) defaults.add(d.key);
          });
          setVisibleKeys(defaults);
          setStatus("idle");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Failed to load commute data");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [originKey]);

  function toggleDestination(key: string) {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const durationsByKey = useMemo(() => {
    const m = new Map<string, number>();
    commuteData?.destinations.forEach((d) => {
      m.set(d.key, d.duration_traffic_seconds ?? d.duration_seconds);
    });
    return m;
  }, [commuteData]);

  const currentLabel = commuteData?.origin.label ?? "Studio City";
  const neighborhood = NEIGHBORHOODS[originKey] ?? NEIGHBORHOOD_FALLBACK;

  return (
    <section className="bg-navy-950 text-white py-20 md:py-28">
      <div className="editorial">
        <p className="eyebrow text-gold-500 mb-4">Explore Los Angeles</p>
        <h2 className="font-display font-light text-display mb-6">
          Find the neighborhood <span className="italic">that fits your life</span>
        </h2>
        <span className="gold-rule mb-10" />

        <p className="text-lg text-ink-100 mb-12 max-w-2xl leading-relaxed">
          Explore commute times, discover iconic communities, and uncover the neighborhoods that align with the way you live, work, and move throughout Los Angeles.
        </p>

        <div className="mb-16">
          <label htmlFor="commute-origin" className="eyebrow block mb-3">
            Explore from neighborhood
          </label>
          <select
            id="commute-origin"
            value={originKey}
            onChange={(e) => setOriginKey(e.target.value)}
            className="bg-transparent border border-white/20 text-white px-4 py-3 pr-10 min-w-[280px] focus:border-gold-500 focus:outline-none transition-colors"
          >
            {ORIGIN_LIST.map((origin) => (
              <option key={origin.key} value={origin.key} className="bg-navy-950">
                {origin.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <p className="eyebrow text-gold-500 mb-3">
            Explore commute times from {currentLabel}
          </p>
          <p className="text-xs text-ink-300 mb-6">
            Select destinations to display their routes on the map below.
          </p>

          {status === "loading" && !commuteData && (
            <p className="text-ink-200">Loading commute times…</p>
          )}

          {status === "error" && (
            <p className="text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3 inline-block">
              {error}
            </p>
          )}

          {commuteData && (
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 transition-opacity duration-300 ${
                status === "loading" ? "opacity-50" : "opacity-100"
              }`}
            >
              {commuteData.destinations.map((dest, i) => {
                const dur = dest.duration_traffic_seconds ?? dest.duration_seconds;
                const { departure, arrival } = getDepartureArrival(dur);
                const dotColor = colorForIndex(i);
                const isVisible = visibleKeys.has(dest.key);
                return (
                  <button
                    key={dest.key}
                    type="button"
                    onClick={() => toggleDestination(dest.key)}
                    aria-pressed={isVisible}
                    aria-label={`Toggle ${dest.label} route on map`}
                    className="text-left border-l pl-5 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    style={{ borderColor: `${dotColor}66` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <CheckBox checked={isVisible} color={dotColor} />
                      <h4 className="font-display font-medium text-2xl lg:text-xl xl:text-2xl text-white whitespace-nowrap">
                        {dest.label}
                      </h4>
                    </div>
                    <p className="text-lg mb-4" style={{ color: dotColor }}>
                      {formatDuration(dur)}
                    </p>
                    <div className="text-xs text-ink-300 space-y-1">
                      <p>Departure: {departure}</p>
                      <p>Arrival: {arrival}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mt-16 mb-16 items-start">
          <div
            className={`transition-opacity duration-300 ${
              status === "loading" ? "opacity-60" : "opacity-100"
            }`}
          >
            <h3 className="font-display font-light text-4xl md:text-5xl text-white mb-6">
              {currentLabel}
            </h3>
            <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
              {neighborhood.narrative.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            {routesData ? (
              <div
                className="overflow-hidden border-2 border-gold-500/70"
                style={{
                  boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                }}
              >
                <RouteMap
                  routesData={routesData}
                  visibleKeys={visibleKeys}
                  durationsByKey={durationsByKey}
                />
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

        <div className="pt-12 border-t border-white/10 max-w-3xl">
          <p className="font-display font-light text-3xl text-white mb-3 leading-snug">
            Explore homes in {currentLabel}
          </p>
          <p className="text-lg text-ink-100 mb-8 leading-relaxed">
            Discover the properties and opportunities that define one of Los Angeles&apos; most distinctive communities.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium px-8 py-4 tracking-wide transition-colors"
            >
              View {currentLabel} listings
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
