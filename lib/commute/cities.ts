// lib/commute/cities.ts
// Lat/lng coordinates for every city used as an origin or destination in the
// commute widget. Source: Google Maps centerpoint of each named area.
// These coordinates are passed to the Distance Matrix API, which is faster
// and more accurate than passing place name strings.

export type CityCoords = {
  label: string;
  lat: number;
  lng: number;
};

export const CITY_COORDS: Record<string, CityCoords> = {
  // Valley & adjacent
  "burbank":           { label: "Burbank",           lat: 34.1808, lng: -118.3090 },
  "glendale":          { label: "Glendale",          lat: 34.1425, lng: -118.2551 },
  "sherman-oaks":      { label: "Sherman Oaks",      lat: 34.1511, lng: -118.4490 },
  "encino":            { label: "Encino",            lat: 34.1597, lng: -118.5012 },
  "van-nuys":          { label: "Van Nuys",          lat: 34.1865, lng: -118.4490 },
  "north-hollywood":   { label: "North Hollywood",   lat: 34.1722, lng: -118.3787 },
  "woodland-hills":    { label: "Woodland Hills",    lat: 34.1684, lng: -118.6058 },
  "studio-city":       { label: "Studio City",       lat: 34.1395, lng: -118.3870 },
  "san-fernando":      { label: "San Fernando",      lat: 34.2820, lng: -118.4389 },
  "calabasas":         { label: "Calabasas",         lat: 34.1367, lng: -118.6612 },

  // Westside cities
  "santa-monica":      { label: "Santa Monica",      lat: 34.0195, lng: -118.4912 },
  "beverly-hills":     { label: "Beverly Hills",     lat: 34.0736, lng: -118.4004 },
  "culver-city":       { label: "Culver City",       lat: 34.0211, lng: -118.3965 },
  "west-hollywood":    { label: "West Hollywood",    lat: 34.0900, lng: -118.3617 },
  "malibu":            { label: "Malibu",            lat: 34.0259, lng: -118.7798 },
  "el-segundo":        { label: "El Segundo",        lat: 33.9192, lng: -118.4165 },

  // Westside LA neighborhoods
  "venice":            { label: "Venice",            lat: 33.9850, lng: -118.4695 },
  "westwood":          { label: "Westwood",          lat: 34.0633, lng: -118.4478 },
  "brentwood":         { label: "Brentwood",         lat: 34.0613, lng: -118.4720 },
  "pacific-palisades": { label: "Pacific Palisades", lat: 34.0357, lng: -118.5156 },
  "playa-vista":       { label: "Playa Vista",       lat: 33.9760, lng: -118.4205 },
  "marina-del-rey":    { label: "Marina del Rey",    lat: 33.9803, lng: -118.4517 },

  // Other
  "pasadena":          { label: "Pasadena",          lat: 34.1478, lng: -118.1445 },
  "toluca-lake":       { label: "Toluca Lake",       lat: 34.1497, lng: -118.3531 },
  "downtown-la":       { label: "Downtown LA",       lat: 34.0407, lng: -118.2468 },
  "hollywood":         { label: "Hollywood",         lat: 34.0928, lng: -118.3287 },
  "los-feliz":         { label: "Los Feliz",         lat: 34.1062, lng: -118.2903 },
  "century-city":      { label: "Century City",      lat: 34.0560, lng: -118.4172 },

  // Destination-only (not in supported origins, but referenced by Encino + Calabasas)
  "westlake-village":  { label: "Westlake Village",  lat: 34.1467, lng: -118.8054 },
};

export function coordsFor(key: string): CityCoords | null {
  return CITY_COORDS[key] ?? null;
}