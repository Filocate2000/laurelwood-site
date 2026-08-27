// lib/laurelwood-boundaries.ts
//
// Boundary polygons for the West / East Laurelwood map on the homepage
// (components/sections/LaurelwoodMap.tsx).
//
// ============================================================================
// SOURCE OF TRUTH: Jack's hand-drawn boundaries in Google My Maps, exported to
// content/source/laurelwood-boundaries.kml. The vertices below are the EXACT
// polygon coordinates from that KML, unchanged and unsimplified, converted from
// KML's lon,lat,alt order to { lat, lng }. Only the redundant ring-closing
// vertex (KML repeats the first point as the last) is dropped, since PolygonF
// closes the ring itself. To update, re-export from My Maps and re-parse.
// ============================================================================

export type LatLng = { lat: number; lng: number };

// WEST LAURELWOOD (gold). KML placemark "West Laurelwood", 18 vertices.
export const WEST_LAURELWOOD_BOUNDARY: LatLng[] = [
  { lat: 34.126397, lng: -118.3884022 },
  { lat: 34.1265568, lng: -118.3869646 },
  { lat: 34.1254733, lng: -118.3860204 },
  { lat: 34.1263437, lng: -118.385205 },
  { lat: 34.1265746, lng: -118.3842824 },
  { lat: 34.1260772, lng: -118.3837888 },
  { lat: 34.1266634, lng: -118.3829305 },
  { lat: 34.1269298, lng: -118.3793686 },
  { lat: 34.1303047, lng: -118.3802269 },
  { lat: 34.1318499, lng: -118.382952 },
  { lat: 34.1314947, lng: -118.3853982 },
  { lat: 34.1308908, lng: -118.3865569 },
  { lat: 34.1306954, lng: -118.3891318 },
  { lat: 34.1302869, lng: -118.3867071 },
  { lat: 34.1299139, lng: -118.3862779 },
  { lat: 34.1289547, lng: -118.3863852 },
  { lat: 34.1287949, lng: -118.3871362 },
  { lat: 34.1273739, lng: -118.3875225 },
];

// EAST LAURELWOOD (teal). KML placemark "East Laurelwood", 39 vertices.
export const EAST_LAURELWOOD_BOUNDARY: LatLng[] = [
  { lat: 34.1338371, lng: -118.3756158 },
  { lat: 34.1332687, lng: -118.3752939 },
  { lat: 34.1325671, lng: -118.3763668 },
  { lat: 34.1327004, lng: -118.3770534 },
  { lat: 34.1328336, lng: -118.378416 },
  { lat: 34.132656, lng: -118.3801755 },
  { lat: 34.1323185, lng: -118.3810982 },
  { lat: 34.131981, lng: -118.3810767 },
  { lat: 34.1317057, lng: -118.3813128 },
  { lat: 34.1304091, lng: -118.3799288 },
  { lat: 34.1296631, lng: -118.3793494 },
  { lat: 34.1282421, lng: -118.3784911 },
  { lat: 34.1275849, lng: -118.3788559 },
  { lat: 34.1269455, lng: -118.379167 },
  { lat: 34.1258175, lng: -118.3789203 },
  { lat: 34.125187, lng: -118.378019 },
  { lat: 34.124432, lng: -118.3762702 },
  { lat: 34.1247074, lng: -118.3761737 },
  { lat: 34.1246896, lng: -118.3758089 },
  { lat: 34.1250715, lng: -118.3761415 },
  { lat: 34.1254179, lng: -118.3761415 },
  { lat: 34.1261284, lng: -118.3757552 },
  { lat: 34.1270343, lng: -118.3756265 },
  { lat: 34.1274695, lng: -118.3752295 },
  { lat: 34.1279313, lng: -118.3744892 },
  { lat: 34.1277803, lng: -118.3739957 },
  { lat: 34.1264214, lng: -118.3721074 },
  { lat: 34.1267567, lng: -118.3719814 },
  { lat: 34.1271631, lng: -118.3721128 },
  { lat: 34.1277981, lng: -118.3728906 },
  { lat: 34.1284464, lng: -118.3739313 },
  { lat: 34.1289793, lng: -118.3740494 },
  { lat: 34.1297164, lng: -118.3745965 },
  { lat: 34.1302848, lng: -118.3751544 },
  { lat: 34.1310752, lng: -118.3750793 },
  { lat: 34.1322208, lng: -118.3752724 },
  { lat: 34.1328602, lng: -118.3740172 },
  { lat: 34.1331799, lng: -118.373867 },
  { lat: 34.1338548, lng: -118.3745751 },
];

/** Simple vertex-average centroid, used to place each area's text label. */
export function centroid(ring: LatLng[]): LatLng {
  const n = ring.length;
  const sum = ring.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / n, lng: sum.lng / n };
}
