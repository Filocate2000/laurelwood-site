"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";

// Market-report UI for one neighborhood. Client-side reads /api/listings, then
// renders the canon hero + alternating navy/white bands: snapshot, active,
// under contract, recent sales. Pure presentation of API data — no invented
// copy beyond the section headings. The two report pages are thin wrappers that
// pass `neighborhood` ("West Laurelwood" | "East Laurelwood").

type ListingRow = {
  address_formatted: string | null;
  street_name: string | null;
  street_number: string | number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  lot_size: number | null;
  year_built: number | null;
  pool: boolean | string | null;
  dom: number | null;
  status_label: string | null;
  change_date: string | null;
  list_price: number | null;
  current_price: number | null;
  sale_price: number | null;
  lp_per_sqft: number | null;
  sp_lp_ratio: number | null;
  description: string | null;
  [column: string]: unknown;
};

type BucketStats = {
  count: number;
  avgPrice: number | null;
  avgPpsf: number | null;
  avgDom: number | null;
};

type ReportResponse = {
  neighborhood: string;
  buckets: {
    active: ListingRow[];
    underContract: ListingRow[];
    soldLast90Days: ListingRow[];
    soldLast12Months: ListingRow[];
    soldAll: ListingRow[];
  };
  stats: {
    active: BucketStats;
    underContract: BucketStats;
    soldLast90Days: BucketStats;
    soldLast12Months: BucketStats;
  };
};

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DASH = "—";

/** $X,XXX,XXX or a dash. */
function fmtPrice(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? DASH : usd0.format(v);
}
/** $X,XXX (whole dollars) or a dash. */
function fmtPpsf(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? DASH : usd0.format(Math.round(v));
}
/** Whole number with thousands separators, or a dash. */
function fmtInt(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v)
    ? DASH
    : Math.round(v).toLocaleString("en-US");
}
/** Show a value or a dash (handles null / empty string). */
function orDash(v: unknown): string {
  return v == null || v === "" ? DASH : String(v);
}
/** Pool can arrive as boolean or a "Y"/"Yes"/"true" string. */
function hasPool(v: ListingRow["pool"]): boolean {
  if (v === true) return true;
  if (typeof v === "string") return /^(y|yes|true|1)/i.test(v.trim());
  return false;
}

function ListingCard({ row }: { row: ListingRow }) {
  const title =
    row.address_formatted?.trim() ||
    [row.street_number, row.street_name].filter(Boolean).join(" ").trim() ||
    "Address unavailable";

  // Sold rows carry sale_price; live rows carry current/list price.
  const price = row.sale_price ?? row.current_price ?? row.list_price ?? null;

  const meta = [
    row.dom != null ? `${fmtInt(row.dom)} DOM` : null,
    row.lp_per_sqft != null ? `${fmtPpsf(row.lp_per_sqft)}/sqft` : null,
    row.year_built != null ? `Built ${row.year_built}` : null,
    hasPool(row.pool) ? "Pool" : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <article className="flex flex-col gap-2 bg-[#f6f3ec] border border-gold-500/50 p-5 shadow-sm">
      {row.status_label && (
        <p className="eyebrow text-gold-600">{row.status_label}</p>
      )}
      <h3 className="font-display font-medium text-lg leading-snug text-navy-950">
        {title}
      </h3>
      <p className="font-display text-xl font-semibold text-navy-950">
        {fmtPrice(price)}
      </p>
      <p className="text-sm text-navy-950/75">
        {orDash(row.bedrooms)} bd&nbsp;&nbsp;·&nbsp;&nbsp;{orDash(row.bathrooms)} ba
        &nbsp;&nbsp;·&nbsp;&nbsp;{fmtInt(row.sqft)} sqft
      </p>
      {meta && <p className="text-xs text-navy-950/55">{meta}</p>}
    </article>
  );
}

function ListingsBand({
  tone,
  neighborhood,
  heading,
  note,
  rows,
  emptyText,
}: {
  tone: "navy" | "white";
  neighborhood: string;
  heading: string;
  note?: string;
  rows: ListingRow[];
  emptyText: string;
}) {
  const navy = tone === "navy";
  return (
    <section
      className={`${navy ? "bg-navy-950" : "bg-white"} py-20 md:py-28 overflow-hidden`}
    >
      <div className="w-full px-6 md:px-16">
        <p className={`eyebrow ${navy ? "text-gold-500" : "text-gold-600"} mb-4`}>
          {neighborhood}
        </p>
        <h2
          className={`font-display font-light text-3xl md:text-4xl ${
            navy ? "text-white" : "text-navy-950"
          } mb-5`}
        >
          {heading}
          {note && (
            <span
              className={`ml-3 align-middle text-base md:text-lg ${
                navy ? "text-ink-300" : "text-navy-950/50"
              }`}
            >
              · {note}
            </span>
          )}
        </h2>
        <span className={`${navy ? "gold-rule" : "gold-rule-dark"} mb-8`} />
        {rows.length === 0 ? (
          <p className={`text-lg ${navy ? "text-ink-100" : "text-navy-950/70"}`}>
            {emptyText}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rows.map((row, i) => (
              <ListingCard key={i} row={row} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MessageBand({ message }: { message: string }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <p className="text-lg text-navy-950/70">{message}</p>
      </div>
    </section>
  );
}

function SnapshotBand({
  neighborhood,
  data,
}: {
  neighborhood: string;
  data: ReportResponse;
}) {
  // Recent-sold averages: prefer the last 12 months; fall back to the last 90
  // days only when the 12-month window is empty.
  const sold12 = data.stats.soldLast12Months;
  const sold90 = data.stats.soldLast90Days;
  const sold = sold12.count > 0 ? sold12 : sold90;
  const period = sold12.count > 0 ? "last 12 months" : "last 90 days";

  const tiles = [
    { label: "Active Listings", value: fmtInt(data.stats.active.count) },
    { label: "Avg Sale Price", value: fmtPrice(sold.avgPrice) },
    { label: "Avg Price / Sq Ft", value: fmtPpsf(sold.avgPpsf) },
    { label: "Avg Days on Market", value: fmtInt(sold.avgDom) },
  ];

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <p className="eyebrow text-gold-600 mb-4">{neighborhood}</p>
        <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
          Market Snapshot
        </h2>
        <span className="gold-rule-dark mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {tiles.map((t) => (
            <div key={t.label}>
              <p className="font-display font-light text-4xl md:text-5xl text-navy-950">
                {t.value}
              </p>
              <p className="eyebrow text-gold-600 mt-3">{t.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-navy-950/55">
          Recent-sales averages reflect the {period}.
        </p>
      </div>
    </section>
  );
}

export function MarketReport({ neighborhood }: { neighborhood: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<ReportResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setData(null);
    fetch(`/api/listings?neighborhood=${encodeURIComponent(neighborhood)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as ReportResponse;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [neighborhood]);

  return (
    <>
      {/* Hero (navy gradient) — alternation: navy hero -> white -> navy -> white -> navy */}
      <PageHero
        eyebrow="BUYING OR SELLING IN LAURELWOOD"
        title={`${neighborhood} Market Overview`}
      />

      {status === "loading" && <MessageBand message="Loading market data…" />}

      {status === "error" && (
        <MessageBand message="Market data is temporarily unavailable. Please try again shortly." />
      )}

      {status === "ready" && data && (
        <>
          <SnapshotBand neighborhood={neighborhood} data={data} />
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Active Listings"
            rows={data.buckets.active}
            emptyText="No active listings at this time."
          />
          <ListingsBand
            tone="white"
            neighborhood={neighborhood}
            heading="Under Contract"
            rows={data.buckets.underContract}
            emptyText="Nothing under contract at this time."
          />
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Recent Sales"
            note="last 12 months"
            rows={data.buckets.soldLast12Months}
            emptyText="No recent sales in this period."
          />
        </>
      )}
    </>
  );
}
