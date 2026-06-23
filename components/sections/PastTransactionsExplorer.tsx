"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PastTransaction } from "@/lib/past-transactions";
import { PastTransactionsMap, type MapPin } from "./PastTransactionsMap";
import { PastTransactionsTiles } from "./PastTransactionsTiles";

type Kind = "all" | "sale" | "lease";

const KINDS: { value: Kind; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sale", label: "Sales" },
  { value: "lease", label: "Leases" },
];

// "STUDIO CITY" / "studio city" -> "Studio City"
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Identity of a physical property (ignoring role/type), used to share a photo
// across the multiple rows a single house can have (e.g. represented-seller vs.
// represented-buyer, or a re-sale).
function propertyKey(t: PastTransaction): string {
  const norm = (s: string | null) => (s ?? "").trim().toLowerCase();
  return `${norm(t.address)}|${norm(t.unit)}|${norm(t.city)}`;
}

/**
 * Owns the city + Sales/Lease filter state for the public Past Transactions
 * section and feeds BOTH the coverage map and the tile grid from one filtered
 * list, so they stay in sync. The map plots every filtered property that has
 * coordinates (independent of the tiles' beds gate and pagination); the tiles
 * show filtered, spec'd properties paginated 25 at a time.
 */
export function PastTransactionsExplorer({
  transactions,
}: {
  transactions: PastTransaction[];
}) {
  const router = useRouter();
  const [cityKey, setCityKey] = useState("all"); // lowercased city, or "all"
  const [kind, setKind] = useState<Kind>("all");

  // Distinct cities across ALL transactions (not just spec'd/tiled ones), so
  // the dropdown also covers map-only properties. Grouped case-insensitively,
  // shown once in Title Case, sorted alphabetically.
  const cities = useMemo(() => {
    const map = new Map<string, string>(); // lowercase key -> Title Case label
    for (const t of transactions) {
      const raw = (t.city ?? "").trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      if (!map.has(key)) map.set(key, titleCase(raw));
    }
    return [...map.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [transactions]);

  // Initialize the city filter from ?city= (case-insensitive) when arriving from
  // the Communities page (e.g. /past-transactions?city=Studio+City). Read on the
  // client (not useSearchParams) so the page stays statically ISR-rendered.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("city");
    if (!param) return;
    const norm = param.trim().toLowerCase();
    if (cities.some((c) => c.key === norm)) setCityKey(norm);
  }, [cities]);

  // Change the city filter AND mirror it to the URL (?city=Label, or drop the
  // param for "All Cities"), keeping scroll position.
  const changeCity = useCallback(
    (nextKey: string) => {
      setCityKey(nextKey);
      const label = cities.find((c) => c.key === nextKey)?.label;
      const url =
        nextKey === "all" || !label
          ? "/past-transactions"
          : `/past-transactions?city=${encodeURIComponent(label)}`;
      router.replace(url, { scroll: false });
    },
    [cities, router]
  );

  // The shared filtered set, city + Sales/Lease applied. Pagination is a
  // tiles-only concern and is NOT applied here, so the map sees every match.
  const filtered = useMemo(() => {
    let list = transactions;
    if (cityKey !== "all") {
      list = list.filter((t) => (t.city ?? "").trim().toLowerCase() === cityKey);
    }
    if (kind === "sale") {
      list = list.filter((t) => t.transactionType === "Sale");
    } else if (kind === "lease") {
      list = list.filter((t) => t.transactionType === "Lease");
    }
    return list;
  }, [transactions, cityKey, kind]);

  // Map pins: every filtered property WITH coordinates (some may lack them).
  // A single house can have several rows (represented-seller vs. -buyer, or a
  // re-sale), whose markers stack on identical coordinates, and only some carry
  // a photo. So whichever stacked marker is clicked still shows the property's
  // photo, a photo-less row borrows one from a sibling row at the same address.
  // (Pin count, filtering, and fit-to-pins are unchanged, only the popup photo.)
  const pins: MapPin[] = useMemo(() => {
    const withCoords = filtered.filter(
      (t) => t.latitude != null && t.longitude != null
    );
    const photoByProperty = new Map<string, string>();
    for (const t of withCoords) {
      if (!t.photoUrl) continue;
      const key = propertyKey(t);
      if (!photoByProperty.has(key)) photoByProperty.set(key, t.photoUrl);
    }
    return withCoords.map((t) => ({
      id: t.id,
      lat: t.latitude as number,
      lng: t.longitude as number,
      address: t.unit ? `${t.address} #${t.unit}` : t.address,
      city: t.city,
      photoUrl: t.photoUrl ?? photoByProperty.get(propertyKey(t)) ?? null,
      transactionType: t.transactionType,
    }));
  }, [filtered]);

  // Tiles: filtered properties that have specs (beds), sorted+paginated downstream.
  const tileList = useMemo(
    () => filtered.filter((t) => t.beds != null),
    [filtered]
  );

  const filterActive = cityKey !== "all" || kind !== "all";

  // Count label above the map, reflects the active filters. The number is the
  // filtered pin count; only the wording changes. Singular handled per noun.
  const countLabel = useMemo(() => {
    const n = pins.length;
    const noun =
      kind === "sale"
        ? n === 1
          ? "closed sale"
          : "closed sales"
        : kind === "lease"
        ? // "closed leases" reads oddly, just "lease(s)".
          n === 1
          ? "lease"
          : "leases"
        : n === 1
        ? "closed transaction"
        : "closed transactions";
    const cityLabel =
      cityKey === "all"
        ? ""
        : cities.find((c) => c.key === cityKey)?.label ?? "";
    return `${n.toLocaleString()} ${noun}${cityLabel ? ` in ${cityLabel}` : ""}`;
  }, [pins.length, kind, cityKey, cities]);

  const selectClass =
    "appearance-none bg-white border border-navy-950/20 hover:border-gold-600/60 rounded-sm pl-4 pr-10 py-3 text-[13px] tracking-nav uppercase text-navy-950 focus:border-gold-600 focus:outline-none focus:ring-0 transition-colors cursor-pointer";

  return (
    <>
      {/* Coverage map, reflects the active filter; fits to the filtered pins */}
      <section className="editorial py-16 md:py-20">
        <p className="eyebrow text-ink-300 mb-6">{countLabel}</p>
        <div className="h-[clamp(420px,60vh,680px)] w-full overflow-hidden border-2 border-gold-500/60">
          <PastTransactionsMap pins={pins} fitToPins={filterActive} />
        </div>
      </section>

      {/* Tiles: spec'd properties, 25 at a time, same filters as the map.
          Light band, alternates with the dark map section above, matching the
          home page's white sections. */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <p className="eyebrow text-gold-600 mb-4">Selected properties</p>
          <span className="block h-px w-12 bg-gold-600 mb-12" />

          {/* Filter bar, drives both the map above and the tiles below */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-10">
            {/* City dropdown */}
            <div className="relative inline-block">
              <select
                value={cityKey}
                onChange={(e) => changeCity(e.target.value)}
                aria-label="Filter by city"
                className={selectClass}
              >
                <option value="all" className="bg-white normal-case">
                  All Cities
                </option>
                {cities.map((c) => (
                  <option key={c.key} value={c.key} className="bg-white normal-case">
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-600">
                ▾
              </span>
            </div>

            {/* Sales / Lease segmented control */}
            <div className="inline-flex border border-navy-950/20 rounded-sm overflow-hidden self-start sm:self-auto">
              {KINDS.map((k, i) => {
                const active = kind === k.value;
                return (
                  <button
                    key={k.value}
                    type="button"
                    onClick={() => setKind(k.value)}
                    aria-pressed={active}
                    className={`px-5 py-3 text-[13px] tracking-nav uppercase transition-colors ${
                      i > 0 ? "border-l border-navy-950/20" : ""
                    } ${
                      active
                        ? "bg-gold-600 text-navy-950 font-medium"
                        : "text-navy-950 hover:text-gold-600"
                    }`}
                  >
                    {k.label}
                  </button>
                );
              })}
            </div>
          </div>

          <PastTransactionsTiles tiles={tileList} />

          {/* Source attribution, last element, below the tile pagination */}
          <p className="mt-16 text-[12px] text-navy-950/55">
            Information sourced from the MLS.
          </p>
        </div>
      </section>
    </>
  );
}
