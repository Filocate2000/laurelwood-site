// lib/commute/origins.ts
// Curated commute origin-destination pairs for misraje-site home page widget.
// 28 origins, 5 destinations each = 140 pairs.
// Generated 2026-05-25.
//
// Each destination references a city by `key` (slug). Destinations not in the
// origin set (e.g. westlake-village) are pure destinations and only need a
// lat/lng entry in cities.ts.

export type DestinationRef = { key: string; label: string };

export type OriginEntry = {
  key: string;
  label: string;
  destinations: DestinationRef[];
};

export const ORIGINS: Record<string, OriginEntry> = {
  // Default origin shown when widget loads
  "beverly-hills": {
    key: "beverly-hills",
    label: "Beverly Hills",
    destinations: [
      { key: "malibu", label: "Malibu" },
      { key: "pacific-palisades", label: "Pacific Palisades" },
      { key: "brentwood", label: "Brentwood" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "encino", label: "Encino" },
    ],
  },

  // Valley & adjacent
  burbank: {
    key: "burbank",
    label: "Burbank",
    destinations: [
      { key: "studio-city", label: "Studio City" },
      { key: "glendale", label: "Glendale" },
      { key: "hollywood", label: "Hollywood" },
      { key: "pasadena", label: "Pasadena" },
      { key: "beverly-hills", label: "Beverly Hills" },
    ],
  },
  glendale: {
    key: "glendale",
    label: "Glendale",
    destinations: [
      { key: "burbank", label: "Burbank" },
      { key: "pasadena", label: "Pasadena" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "hollywood", label: "Hollywood" },
      { key: "studio-city", label: "Studio City" },
    ],
  },
  "sherman-oaks": {
    key: "sherman-oaks",
    label: "Sherman Oaks",
    destinations: [
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "studio-city", label: "Studio City" },
      { key: "encino", label: "Encino" },
      { key: "burbank", label: "Burbank" },
      { key: "santa-monica", label: "Santa Monica" },
    ],
  },
  encino: {
    key: "encino",
    label: "Encino",
    destinations: [
      { key: "westlake-village", label: "Westlake Village" },
      { key: "woodland-hills", label: "Woodland Hills" },
      { key: "studio-city", label: "Studio City" },
      { key: "pasadena", label: "Pasadena" },
      { key: "beverly-hills", label: "Beverly Hills" },
    ],
  },
  "van-nuys": {
    key: "van-nuys",
    label: "Van Nuys",
    destinations: [
      { key: "sherman-oaks", label: "Sherman Oaks" },
      { key: "studio-city", label: "Studio City" },
      { key: "burbank", label: "Burbank" },
      { key: "encino", label: "Encino" },
      { key: "beverly-hills", label: "Beverly Hills" },
    ],
  },
  "north-hollywood": {
    key: "north-hollywood",
    label: "North Hollywood",
    destinations: [
      { key: "burbank", label: "Burbank" },
      { key: "studio-city", label: "Studio City" },
      { key: "hollywood", label: "Hollywood" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "sherman-oaks", label: "Sherman Oaks" },
    ],
  },
  "woodland-hills": {
    key: "woodland-hills",
    label: "Woodland Hills",
    destinations: [
      { key: "calabasas", label: "Calabasas" },
      { key: "encino", label: "Encino" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "malibu", label: "Malibu" },
      { key: "sherman-oaks", label: "Sherman Oaks" },
    ],
  },
  "studio-city": {
    key: "studio-city",
    label: "Studio City",
    destinations: [
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "burbank", label: "Burbank" },
      { key: "sherman-oaks", label: "Sherman Oaks" },
      { key: "pasadena", label: "Pasadena" },
      { key: "west-hollywood", label: "West Hollywood" },
    ],
  },
  "san-fernando": {
    key: "san-fernando",
    label: "San Fernando",
    destinations: [
      { key: "burbank", label: "Burbank" },
      { key: "glendale", label: "Glendale" },
      { key: "pasadena", label: "Pasadena" },
      { key: "sherman-oaks", label: "Sherman Oaks" },
      { key: "studio-city", label: "Studio City" },
    ],
  },
  calabasas: {
    key: "calabasas",
    label: "Calabasas",
    destinations: [
      { key: "woodland-hills", label: "Woodland Hills" },
      { key: "malibu", label: "Malibu" },
      { key: "westlake-village", label: "Westlake Village" },
      { key: "encino", label: "Encino" },
      { key: "beverly-hills", label: "Beverly Hills" },
    ],
  },

  // Westside cities
  "santa-monica": {
    key: "santa-monica",
    label: "Santa Monica",
    destinations: [
      { key: "venice", label: "Venice" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "brentwood", label: "Brentwood" },
      { key: "malibu", label: "Malibu" },
      { key: "pacific-palisades", label: "Pacific Palisades" },
    ],
  },
  "culver-city": {
    key: "culver-city",
    label: "Culver City",
    destinations: [
      { key: "santa-monica", label: "Santa Monica" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "marina-del-rey", label: "Marina del Rey" },
      { key: "playa-vista", label: "Playa Vista" },
      { key: "west-hollywood", label: "West Hollywood" },
    ],
  },
  "west-hollywood": {
    key: "west-hollywood",
    label: "West Hollywood",
    destinations: [
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "hollywood", label: "Hollywood" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "studio-city", label: "Studio City" },
      { key: "santa-monica", label: "Santa Monica" },
    ],
  },
  malibu: {
    key: "malibu",
    label: "Malibu",
    destinations: [
      { key: "pacific-palisades", label: "Pacific Palisades" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "calabasas", label: "Calabasas" },
      { key: "brentwood", label: "Brentwood" },
    ],
  },
  "el-segundo": {
    key: "el-segundo",
    label: "El Segundo",
    destinations: [
      { key: "playa-vista", label: "Playa Vista" },
      { key: "marina-del-rey", label: "Marina del Rey" },
      { key: "culver-city", label: "Culver City" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "beverly-hills", label: "Beverly Hills" },
    ],
  },

  // Westside LA neighborhoods
  venice: {
    key: "venice",
    label: "Venice",
    destinations: [
      { key: "century-city", label: "Century City" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "studio-city", label: "Studio City" },
      { key: "woodland-hills", label: "Woodland Hills" },
    ],
  },
  westwood: {
    key: "westwood",
    label: "Westwood",
    destinations: [
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "century-city", label: "Century City" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "brentwood", label: "Brentwood" },
    ],
  },
  brentwood: {
    key: "brentwood",
    label: "Brentwood",
    destinations: [
      { key: "century-city", label: "Century City" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "studio-city", label: "Studio City" },
    ],
  },
  "pacific-palisades": {
    key: "pacific-palisades",
    label: "Pacific Palisades",
    destinations: [
      { key: "santa-monica", label: "Santa Monica" },
      { key: "century-city", label: "Century City" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "brentwood", label: "Brentwood" },
      { key: "malibu", label: "Malibu" },
    ],
  },
  "playa-vista": {
    key: "playa-vista",
    label: "Playa Vista",
    destinations: [
      { key: "santa-monica", label: "Santa Monica" },
      { key: "culver-city", label: "Culver City" },
      { key: "el-segundo", label: "El Segundo" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "marina-del-rey", label: "Marina del Rey" },
    ],
  },
  "marina-del-rey": {
    key: "marina-del-rey",
    label: "Marina del Rey",
    destinations: [
      { key: "santa-monica", label: "Santa Monica" },
      { key: "venice", label: "Venice" },
      { key: "playa-vista", label: "Playa Vista" },
      { key: "culver-city", label: "Culver City" },
      { key: "el-segundo", label: "El Segundo" },
    ],
  },

  // Other
  pasadena: {
    key: "pasadena",
    label: "Pasadena",
    destinations: [
      { key: "downtown-la", label: "Downtown LA" },
      { key: "glendale", label: "Glendale" },
      { key: "burbank", label: "Burbank" },
      { key: "studio-city", label: "Studio City" },
      { key: "beverly-hills", label: "Beverly Hills" },
    ],
  },
  "toluca-lake": {
    key: "toluca-lake",
    label: "Toluca Lake",
    destinations: [
      { key: "burbank", label: "Burbank" },
      { key: "studio-city", label: "Studio City" },
      { key: "glendale", label: "Glendale" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "pasadena", label: "Pasadena" },
    ],
  },
  "downtown-la": {
    key: "downtown-la",
    label: "Downtown LA",
    destinations: [
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "hollywood", label: "Hollywood" },
      { key: "pasadena", label: "Pasadena" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "studio-city", label: "Studio City" },
    ],
  },
  hollywood: {
    key: "hollywood",
    label: "Hollywood",
    destinations: [
      { key: "west-hollywood", label: "West Hollywood" },
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "studio-city", label: "Studio City" },
      { key: "burbank", label: "Burbank" },
      { key: "downtown-la", label: "Downtown LA" },
    ],
  },
  "century-city": {
    key: "century-city",
    label: "Century City",
    destinations: [
      { key: "beverly-hills", label: "Beverly Hills" },
      { key: "santa-monica", label: "Santa Monica" },
      { key: "brentwood", label: "Brentwood" },
      { key: "downtown-la", label: "Downtown LA" },
      { key: "west-hollywood", label: "West Hollywood" },
    ],
  },
};

export const DEFAULT_ORIGIN_KEY = "beverly-hills";

export const ORIGIN_LIST = Object.values(ORIGINS).sort((a, b) =>
  a.label.localeCompare(b.label)
);