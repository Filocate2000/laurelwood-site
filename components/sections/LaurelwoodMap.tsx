"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GoogleMap,
  PolygonF,
  OverlayView,
  useLoadScript,
} from "@react-google-maps/api";
import { MAP_ID } from "@/lib/commute/mapStyle";
import {
  WEST_LAURELWOOD_BOUNDARY,
  EAST_LAURELWOOD_BOUNDARY,
  centroid,
  type LatLng,
} from "@/lib/laurelwood-boundaries";

// Reuse the SAME loader id + libraries as the commute widget so the two maps on
// the homepage share a single Google Maps script instance. @react-google-maps
// keys its loader by `id`; mismatched options under the same id throw, so these
// must stay in lockstep with CommuteWidget.tsx.
const GOOGLE_MAPS_LIBRARIES: ("geometry" | "marker")[] = ["geometry", "marker"];
const MAP_CONTAINER_STYLE = { width: "100%", height: "540px" };

// West = brand gold (anchor), East = contrasting teal/green.
const AREA_STYLE = {
  west: { fillColor: "#c8a55a", strokeColor: "#9a7a31" },
  east: { fillColor: "#3f9d8b", strokeColor: "#286c5f" },
} as const;

const POLY_BASE = {
  fillOpacity: 0.3,
  strokeOpacity: 0.95,
  strokeWeight: 2,
  clickable: false,
};

const AREAS = [
  {
    key: "west",
    label: "West Laurelwood",
    path: WEST_LAURELWOOD_BOUNDARY,
    style: AREA_STYLE.west,
  },
  {
    key: "east",
    label: "East Laurelwood",
    path: EAST_LAURELWOOD_BOUNDARY,
    style: AREA_STYLE.east,
  },
] as const;

// Gold map pin + white pill label, centered on the polygon, rendered through an
// OverlayView so it tracks the map. The map has no default google.maps.Marker;
// this custom SVG pin replaces it while keeping the readable label below.
// Ported verbatim from fryman-estates so both sites' neighborhood markers match.
function AreaLabel({ position, text }: { position: LatLng; text: string }) {
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
        <svg
          width="30"
          height="40"
          viewBox="0 0 30 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }}
        >
          <path
            d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z"
            fill="#C8A75B"
            stroke="#9A7A31"
            strokeWidth="1.5"
          />
          <circle cx="15" cy="15" r="5.5" fill="#0A1F3D" />
        </svg>
        <div
          className="-mt-1 px-2.5 py-1 bg-white/95 text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-sm ring-1 ring-black/5"
          style={{ color: "#0e1a2e", textShadow: "0 1px 0 rgba(255,255,255,0.6)" }}
        >
          {text}
        </div>
      </div>
    </OverlayView>
  );
}

function MapCanvas() {
  const browserApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: browserApiKey ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
    id: "misraje-commute-map-script",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  useEffect(() => {
    if (!map || !isLoaded) return;
    const b = new window.google.maps.LatLngBounds();
    [...WEST_LAURELWOOD_BOUNDARY, ...EAST_LAURELWOOD_BOUNDARY].forEach((p) =>
      b.extend(p)
    );
    map.fitBounds(b, 64);
  }, [map, isLoaded]);

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
      // Initial frame (overall center of both KML polygons); fitBounds() below
      // refines to the exact bounds of all vertices on load.
      center={{ lat: 34.1291, lng: -118.3806 }}
      zoom={15}
      options={{
        mapId: MAP_ID,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
      }}
      onLoad={(m) => setMap(m)}
    >
      {AREAS.map((a) => (
        <PolygonF
          key={a.key}
          path={a.path}
          options={{
            ...POLY_BASE,
            fillColor: a.style.fillColor,
            strokeColor: a.style.strokeColor,
          }}
        />
      ))}
      {AREAS.map((a) => (
        <AreaLabel key={`lbl-${a.key}`} position={centroid(a.path)} text={a.label} />
      ))}
    </GoogleMap>
  );
}

/**
 * Homepage map band: an interactive Google Map centered on the Laurelwood area
 * with two labeled boundary overlays (West Laurelwood in gold, East Laurelwood
 * in teal). The boundary vertices live in lib/laurelwood-boundaries.ts and are a
 * first approximation for Jack to refine. Navy band, minimal heading, no prose.
 */
export function LaurelwoodMap() {
  return (
    <section className="bg-navy-950 py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
          West and East Laurelwood
        </h2>
        <span className="gold-rule mb-10" />
        <p className="text-lg text-ink-100 leading-relaxed mb-10">
          The area is divided into{" "}
          <Link
            href="/west-laurelwood"
            className="text-gold-500 underline underline-offset-2 decoration-gold-500/40 hover:text-gold-400 transition-colors"
          >
            West Laurelwood
          </Link>{" "}
          and{" "}
          <Link
            href="/east-laurelwood"
            className="text-gold-500 underline underline-offset-2 decoration-gold-500/40 hover:text-gold-400 transition-colors"
          >
            East Laurelwood
          </Link>
          , with Laurel Canyon serving as the natural boundary between the two. Each
          section offers its own unique character, from the mid-century homes of{" "}
          <Link
            href="/west-laurelwood"
            className="text-gold-500 underline underline-offset-2 decoration-gold-500/40 hover:text-gold-400 transition-colors"
          >
            West Laurelwood
          </Link>{" "}
          to the spacious properties and scenic views found in{" "}
          <Link
            href="/east-laurelwood"
            className="text-gold-500 underline underline-offset-2 decoration-gold-500/40 hover:text-gold-400 transition-colors"
          >
            East Laurelwood
          </Link>
          . Whether you’re exploring the neighborhood’s rich history or enjoying its
          modern amenities, Laurelwood’s blend of tranquility and accessibility makes it
          one of the most sought-after communities in the area.
        </p>
        <div
          className="overflow-hidden border-2 border-gold-500/70"
          style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
        >
          <MapCanvas />
        </div>
      </div>
    </section>
  );
}
