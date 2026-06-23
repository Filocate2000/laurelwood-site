"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { PastTransaction } from "@/lib/past-transactions";

// Matches the admin's page hint so admin pagination and the public page line up.
const PAGE_SIZE = 25;

function fmtSqft(n: number | null): string {
  return n != null ? `${n.toLocaleString()} sq ft` : "-";
}
function fmtNum(n: number | null): string {
  return n != null ? String(n) : "-";
}

// display_order ascending, nulls last
function byOrder(a: PastTransaction, b: PastTransaction): number {
  const ao = a.displayOrder;
  const bo = b.displayOrder;
  if (ao == null && bo == null) return 0;
  if (ao == null) return 1;
  if (bo == null) return -1;
  return ao - bo;
}

// broker_role -> public-facing badge label (the pill CSS uppercases it).
const ROLE_LABELS: Record<"Listing" | "Selling" | "Both", string> = {
  Listing: "Represented Seller",
  Selling: "Represented Buyer",
  Both: "Represented Both Sides",
};

// Outlined-gold pill on a translucent navy base, so the gold text stays legible
// over both bright photos and the navy no-photo placeholder. Eyebrow-style
// letter-spacing; position (left/right) is supplied per use.
const PILL =
  "pointer-events-none absolute z-10 inline-flex items-center whitespace-nowrap " +
  "rounded-full border border-gold-500/70 bg-navy-950/65 backdrop-blur-sm " +
  "px-2.5 py-1 text-[11px] uppercase tracking-eyebrow text-gold-400";

// Grouping key for identical repeat transactions: normalized address+unit+city
// (case-insensitive, trimmed) + transaction_type + broker_role. Rows with a
// different role or type at the same address are intentionally NOT grouped.
function groupKey(t: PastTransaction): string {
  const norm = (s: string | null) => (s ?? "").trim().toLowerCase();
  return [
    norm(t.address),
    norm(t.unit),
    norm(t.city),
    t.transactionType ?? "",
    t.brokerRole ?? "",
  ].join("|");
}

type TileGroup = { rep: PastTransaction; count: number };

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="eyebrow text-gold-600">{label}</span>
      <span className="font-display font-light text-xl text-navy-950 leading-none">
        {value}
      </span>
    </div>
  );
}

function Tile({ t, count }: { t: PastTransaction; count: number }) {
  return (
    <figure className="group overflow-hidden rounded-xl border-2 border-gold-600/80 bg-white shadow-[0_8px_24px_rgba(14,26,46,0.10)] transition-shadow hover:shadow-[0_14px_36px_rgba(14,26,46,0.16)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
        {t.photoUrl ? (
          // next/image so the browser gets a retina-aware srcset (a plain <img>
          // rasterizes at 1× inside the scale-on-hover layer → soft on retina).
          // sizes mirrors the real tile width: 3-up ≥lg, 2-up ≥sm, full-width
          // on mobile. The Supabase public URL is used directly (allowed via
          // images.remotePatterns), optimized at quality 85.
          <Image
            src={t.photoUrl}
            alt={`${t.address}, ${t.city}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={85}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold-500/25">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5 10v9h14v-9" />
              <path d="M9.5 19v-5h5v5" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />
        {/* Role badge, top-left, over the photo/navy header */}
        {t.brokerRole && (
          <span className={`${PILL} left-3 top-3`}>{ROLE_LABELS[t.brokerRole]}</span>
        )}
        {/* Repeat count, top-right, only when this card stands in for >1 row */}
        {count > 1 && (
          <span className={`${PILL} right-3 top-3`}>
            {t.transactionType === "Lease" ? "Leased" : "Sold"} &times;{count}
          </span>
        )}
        <figcaption className="absolute inset-x-4 bottom-4">
          <p className="eyebrow text-gold-500">{t.address}</p>
          <p className="font-display font-light text-2xl text-white leading-tight">
            {t.city}
          </p>
        </figcaption>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 p-5">
        <Spec label="Beds" value={fmtNum(t.beds)} />
        <Spec label="Baths" value={fmtNum(t.baths)} />
        <Spec label="Living" value={fmtSqft(t.livingSqft)} />
        <Spec label="Lot" value={fmtSqft(t.lotSqft)} />
      </div>
    </figure>
  );
}

// Presentational: receives an ALREADY-FILTERED list (city + Sales/Lease are
// applied by PastTransactionsExplorer, which shares that state with the map).
// This component only sorts by display_order and paginates 25 at a time.
export function PastTransactionsTiles({ tiles }: { tiles: PastTransaction[] }) {
  const [page, setPage] = useState(1);

  // Group identical repeat transactions into one card. The representative row is
  // the member with the lowest display_order (its photo/specs are shown); that
  // same order is the group's sort position. Pagination and the count below
  // operate on CARDS (groups), so the displayed count matches what's rendered.
  const groups = useMemo(() => {
    const byKey = new Map<string, PastTransaction[]>();
    for (const t of tiles) {
      const k = groupKey(t);
      const arr = byKey.get(k);
      if (arr) arr.push(t);
      else byKey.set(k, [t]);
    }
    const out: TileGroup[] = [];
    for (const members of byKey.values()) {
      const rep = [...members].sort(byOrder)[0];
      out.push({ rep, count: members.length });
    }
    return out.sort((a, b) => byOrder(a.rep, b.rep));
  }, [tiles]);

  // Reset to the first page whenever the filtered set changes.
  useEffect(() => {
    setPage(1);
  }, [tiles]);

  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = groups.slice(start, start + PAGE_SIZE);

  return (
    <div>
      {/* Result count */}
      <p className="eyebrow text-navy-950/60 mb-6">
        {groups.length.toLocaleString()}{" "}
        {groups.length === 1 ? "property" : "properties"}
        {totalPages > 1 && (
          <span className="text-navy-950/60"> &middot; page {safePage} of {totalPages}</span>
        )}
      </p>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-navy-950/10 bg-navy-950/[0.02] px-6 py-16 text-center">
          <p className="font-display font-light text-2xl text-navy-950 mb-2">
            No transactions match
          </p>
          <p className="text-navy-950/60 text-sm">
            Try a different city or clear the Sales / Leases filter.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((g) => (
              <Tile key={g.rep.id} t={g.rep} count={g.count} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-4 py-3 text-[12px] tracking-nav uppercase text-navy-950 border border-navy-950/25 hover:border-gold-600 hover:text-gold-600 transition-colors disabled:opacity-30 disabled:hover:border-navy-950/25 disabled:hover:text-navy-950 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const active = n === safePage;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={active ? "page" : undefined}
                    className={`min-w-[2.75rem] px-3 py-3 text-[12px] tracking-nav transition-colors border ${
                      active
                        ? "bg-gold-600 border-gold-600 text-navy-950 font-medium"
                        : "border-navy-950/25 text-navy-950 hover:border-gold-600 hover:text-gold-600"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-4 py-3 text-[12px] tracking-nav uppercase text-navy-950 border border-navy-950/25 hover:border-gold-600 hover:text-gold-600 transition-colors disabled:opacity-30 disabled:hover:border-navy-950/25 disabled:hover:text-navy-950 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
