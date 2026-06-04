// lib/commute/mapStyle.ts
// Map ID + brand palette for the commute widget map.
//
// As of the migration to Cloud-based map styling (2024+), the styling lives in
// the Google Cloud console on a Map ID, not as a JSON array passed to the
// component. We only keep the Map ID and our brand colors here.
//
// The Map ID below points to "misraje-commute-map" with the "Sparse Map" style
// applied. Style changes happen in:
//   https://console.cloud.google.com/google/maps-apis/studio/maps

export const MAP_ID = "31246812a827e7f5ba04ad21";

// Route palette: 5 muted, editorial colors that read clearly against the cream
// map base AND against the navy section background (where the matching tile
// dots live). Ordered so adjacent indices contrast well, if a city has two
// destinations going the same general direction, their lines won't blur.
export const ROUTE_COLORS = [
  "#c8a55a", // 0, gold (brand anchor)
  "#d97757", // 1, coral
  "#7a9081", // 2, sage
  "#6b8eaa", // 3, sky blue
  "#8a5a78", // 4, plum
] as const;

// Other map colors centralized for the widget to import.
export const MAP_COLORS = {
  originPin: "#0e1a2e", // navy-950, selected city pin
  originPinStroke: "#c8a55a", // gold-500 ring
  routeStrokeOpacity: 0.9,
  routeStrokeWeight: 4,
};
