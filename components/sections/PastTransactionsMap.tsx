"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer, type Renderer } from "@googlemaps/markerclusterer";

// Own Vector map ID (tail f3fe4b27), separate from the commute raster map.
const PAST_TX_MAP_ID = "31246812a827e7f5f3fe4b27";
const GOOGLE_MAPS_LIBRARIES: ("geometry" | "marker")[] = ["geometry", "marker"];
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

// Default framing: LA + South Bay (not fit-to-all, so outliers don't zoom it out).
const FRAME_SW = { lat: 33.72, lng: -118.7 };
const FRAME_NE = { lat: 34.3, lng: -118.05 };

// Zoom at/above which individual pins grow and labels become clickable hints.
const STREET_ZOOM = 13;

const GOLD = "#c8a55a";
const NAVY = "#0e1a2e";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  photoUrl: string | null;
  transactionType: "Sale" | "Lease" | null;
};

function dotIcon(scale: number): google.maps.Symbol {
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale,
    fillColor: GOLD,
    fillOpacity: 0.9,
    strokeColor: NAVY,
    strokeWeight: 0.75,
  };
}

// Encode for safe interpolation into the raw InfoWindow HTML string, both for
// text content and HTML attribute values (e.g. the photo URL / alt).
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function infoHtml(pin: MapPin): string {
  const line1 = escapeHtml(`${pin.address}, ${pin.city}`);

  // Address line (navy bold), top of the card in both layouts.
  const addressLine = `<div style="font-weight:600;font-size:13px">${line1}</div>`;

  // Attribution on two deliberate lines: a small, quiet label (muted navy, the
  // address's navy at ~55% opacity) above the gold brokerage name as the accent.
  // Label verb is conditional: "Leased by:" for leases, "Sold by:" otherwise.
  const verb = pin.transactionType === "Lease" ? "Leased by:" : "Sold by:";
  const attribution =
    `<div style="margin-top:6px">` +
    `<div style="font-size:10px;letter-spacing:.04em;color:rgba(14,26,46,0.55);` +
    `text-transform:uppercase">${verb}</div>` +
    `<div style="font-size:11px;letter-spacing:.04em;color:#9c7521;` +
    `text-transform:uppercase;margin-top:1px">Misraje Real Estate Partners</div>` +
    `</div>`;

  // No photo: address + two-line attribution only, no image element, no gap.
  if (!pin.photoUrl) {
    return (
      `<div style="font-family:var(--font-sans);color:#0e1a2e;` +
      `min-width:200px;line-height:1.45">` +
      addressLine +
      attribution +
      `</div>`
    );
  }

  // Photo present: address on top, then a contained image (full content width,
  // rounded on all corners), then the attribution. width:100% on the image (no
  // negative margins / calc) keeps it inside the content box, so the InfoWindow
  // never overflows horizontally, no scrollbar. overflow:hidden is a backstop.
  const safeUrl = escapeHtml(pin.photoUrl);
  return (
    `<div style="font-family:var(--font-sans);color:#0e1a2e;` +
    `width:276px;line-height:1.45;overflow:hidden;box-sizing:border-box">` +
    addressLine +
    `<img src="${safeUrl}" alt="${line1}" loading="lazy" ` +
    `style="display:block;width:100%;max-width:100%;box-sizing:border-box;` +
    `height:150px;object-fit:cover;border-radius:8px;margin:8px 0 0" />` +
    attribution +
    `</div>`
  );
}

export function PastTransactionsMap({
  pins,
  fitToPins = false,
}: {
  pins: MapPin[];
  // When true (a city/type filter is active), frame the map to the filtered
  // pins instead of the fixed LA/South Bay default view.
  fitToPins?: boolean;
}) {
  const browserApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: browserApiKey ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
    id: "misraje-google-maps-script",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const hintedRef = useRef(false);

  const resetView = useCallback(() => {
    if (!map) return;
    infoRef.current?.close();
    map.fitBounds(new window.google.maps.LatLngBounds(FRAME_SW, FRAME_NE), 0);
  }, [map]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Frame to the filtered pins when a filter is active; otherwise use the
    // fixed LA/South Bay default (so outliers don't zoom the default out).
    if (fitToPins && pins.length > 0) {
      const b = new window.google.maps.LatLngBounds();
      pins.forEach((p) => b.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(b, 64);
    } else {
      map.fitBounds(new window.google.maps.LatLngBounds(FRAME_SW, FRAME_NE), 0);
    }
    const info = new window.google.maps.InfoWindow();
    infoRef.current = info;

    // one marker per sale; clicking opens its label
    const markers = pins.map((p) => {
      const marker = new window.google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        icon: dotIcon(4),
      });
      marker.addListener("click", () => {
        info.setContent(infoHtml(p));
        info.open({ map, anchor: marker });
      });
      return marker;
    });
    markersRef.current = markers;

    const renderer: Renderer = {
      render: ({ count, position }) => {
        const size = count < 10 ? 36 : count < 40 ? 46 : 58;
        const svg = window.btoa(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
            `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${GOLD}" fill-opacity="0.92" stroke="${NAVY}" stroke-width="1.5"/>` +
            `</svg>`
        );
        return new window.google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new window.google.maps.Size(size, size),
            anchor: new window.google.maps.Point(size / 2, size / 2),
          },
          label: { text: String(count), color: NAVY, fontSize: "13px", fontWeight: "600" },
          zIndex: 1000 + count,
        });
      },
    };

    clustererRef.current = new MarkerClusterer({ map, markers, renderer });

    // Zoom-responsive: grow the dots at street level, and the first time the
    // user reaches street zoom, auto-open ONE label as a hint that pins are
    // clickable. Fires once per page load.
    const zoomListener = map.addListener("zoom_changed", () => {
      const z = map.getZoom() ?? 0;
      const scale = z >= STREET_ZOOM ? 7 : 4;
      markersRef.current.forEach((m) => m.setIcon(dotIcon(scale)));

      if (z >= STREET_ZOOM && !hintedRef.current) {
        hintedRef.current = true;
        const center = map.getCenter();
        const bounds = map.getBounds();
        if (!center || !bounds) return;
        // pick the visible pin nearest the center as the hint
        let bestIdx = -1;
        let bestMarker: google.maps.Marker | null = null;
        let bestD = Infinity;
        markersRef.current.forEach((m, i) => {
          const pos = m.getPosition();
          if (!pos || !bounds.contains(pos)) return;
          const d =
            Math.abs(pos.lat() - center.lat()) + Math.abs(pos.lng() - center.lng());
          if (d < bestD) {
            bestD = d;
            bestIdx = i;
            bestMarker = m;
          }
        });
        if (bestIdx >= 0 && bestMarker) {
          info.setContent(infoHtml(pins[bestIdx]));
          info.open({ map, anchor: bestMarker });
        }
      }
    });

    return () => {
      window.google.maps.event.removeListener(zoomListener);
      info.close();
      clustererRef.current?.clearMarkers();
      clustererRef.current?.setMap(null);
      clustererRef.current = null;
      markersRef.current = [];
    };
  }, [map, isLoaded, pins, fitToPins]);

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
    return <div className="h-full w-full bg-white/5 animate-pulse" aria-label="Loading map" />;
  }

  const mapOptions: google.maps.MapOptions = {
    mapId: PAST_TX_MAP_ID,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "cooperative",
    clickableIcons: false,
    // Cap how far in the map can go. Without this, clicking a cluster of two
    // nearly-identical points zooms past street level into a blank, detail-less
    // view. 17 keeps the deepest zoom at a clean, labeled street level.
    maxZoom: 17,
  };
  (mapOptions as Record<string, unknown>).colorScheme = "DARK";

  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        options={mapOptions}
        onLoad={(m) => setMap(m)}
      />

      {/* Reset view button (top-right, above the map content) */}
      <button
        type="button"
        onClick={resetView}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-[11px] font-medium tracking-wide uppercase px-4 py-2 shadow-md transition-colors"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset map view
      </button>

      {/* Legend */}
      <div className="pointer-events-none absolute left-3 bottom-3 flex items-center gap-2 bg-navy-950/85 px-3 py-2 backdrop-blur-sm">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: GOLD, border: `1px solid ${NAVY}` }}
        />
        <span className="text-[11px] tracking-wide text-ink-100">
          Each marker is a closed transaction - click a pin for details
        </span>
      </div>
    </div>
  );
}
