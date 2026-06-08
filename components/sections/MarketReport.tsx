"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageHero } from "@/components/layout/PageHero";

// Market-report UI for one neighborhood. Client-side reads /api/listings, then
// renders the canon hero + alternating navy/white bands:
//   hero -> Market Snapshot table -> Price Trend (line) -> Price per Sq Ft (bars)
//        -> Active -> Under Contract -> Recent Sales
// Analytics come from the API's `quarterly` object (comparison{} + byQuarter[]).
// Pure presentation of API data — no invented copy beyond section headings.

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

type QuarterAnalytics = {
  quarter: string;
  sold_count: number;
  avg_sale_price: number | null;
  median_sale_price: number | null;
  sold_avg_ppsf: number | null;
  avg_dom: number | null;
  highest_sale: number | null;
  active_avg_ppsf: number | null;
};

type QuarterSummary = {
  quarter: string;
  avg_sale_price: number | null;
  sold_ppsf: number | null;
  avg_dom: number | null;
  highest_sale: number | null;
};

type Quarterly = {
  byQuarter: QuarterAnalytics[];
  comparison: {
    current: QuarterSummary | null;
    previous: QuarterSummary | null;
    change: {
      avg_sale_price_pct: number | null;
      sold_ppsf_pct: number | null;
      avg_dom_days_diff: number | null;
      highest_sale_pct: number | null;
    } | null;
  };
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
  quarterly: Quarterly;
};

// Canon palette for the charts.
const GOLD = "#C8A75B";
const NAVY = "#16335c";
const INK = "#9fb0c8"; // muted light text on navy
const NAVY_INK = "#0A1F3D"; // dark text on white

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
/** "N days" or a dash. */
function fmtDays(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? DASH : `${fmtInt(v)} days`;
}
/** Compact money for chart axes: $X.Xm above a million, else $X,XXX. */
function fmtAxisMoney(v: number): string {
  if (!Number.isFinite(v)) return "";
  return v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}m`
    : usd0.format(Math.round(v));
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

/** Change-cell text + color. Per spec: down = red, up = green, none = neutral
 *  (directional only, regardless of whether the metric is "good" up or down). */
function changeView(
  kind: "pct" | "days",
  value: number | null | undefined
): { text: string; className: string } {
  if (value == null || !Number.isFinite(value)) {
    return { text: DASH, className: "text-navy-950/45" };
  }
  if (value === 0) return { text: "No change", className: "text-navy-950/45" };
  const up = value > 0;
  const mag =
    kind === "pct" ? `${Math.abs(value).toFixed(1)}%` : `${Math.abs(value)} days`;
  return {
    text: `${up ? "Up" : "Down"} ${mag}`,
    className: up ? "text-green-600" : "text-red-600",
  };
}

// --- Listing card + listing band (unchanged) -------------------------------

function ListingCard({ row }: { row: ListingRow }) {
  const title =
    row.address_formatted?.trim() ||
    [row.street_number, row.street_name].filter(Boolean).join(" ").trim() ||
    "Address unavailable";

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

// --- Section 1: Market Snapshot comparison table (WHITE) --------------------

function SnapshotTableBand({
  neighborhood,
  comparison,
}: {
  neighborhood: string;
  comparison: Quarterly["comparison"];
}) {
  const cur = comparison.current;
  const prev = comparison.previous;
  const change = comparison.change;

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <p className="eyebrow text-gold-600 mb-4">{neighborhood}</p>
        <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
          Market Snapshot
        </h2>
        <span className="gold-rule-dark mb-8" />

        {!cur ? (
          <p className="text-lg text-navy-950/70">
            No market data available for this period.
          </p>
        ) : prev && change ? (
          // Two-quarter comparison with a Change column.
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left border-collapse">
              <thead>
                <tr className="border-b border-navy-950/15">
                  <th className="py-3 pr-4 eyebrow text-gold-600">Metric</th>
                  <th className="py-3 px-4 eyebrow text-gold-600">{prev.quarter}</th>
                  <th className="py-3 px-4 eyebrow text-gold-600">{cur.quarter}</th>
                  <th className="py-3 pl-4 eyebrow text-gold-600">Change</th>
                </tr>
              </thead>
              <tbody className="text-base md:text-lg">
                {[
                  {
                    metric: "Average Sale Price",
                    prevVal: fmtPrice(prev.avg_sale_price),
                    curVal: fmtPrice(cur.avg_sale_price),
                    chg: changeView("pct", change.avg_sale_price_pct),
                  },
                  {
                    metric: "Price per Sq Ft",
                    prevVal: fmtPpsf(prev.sold_ppsf),
                    curVal: fmtPpsf(cur.sold_ppsf),
                    chg: changeView("pct", change.sold_ppsf_pct),
                  },
                  {
                    metric: "Days on Market",
                    prevVal: fmtDays(prev.avg_dom),
                    curVal: fmtDays(cur.avg_dom),
                    chg: changeView("days", change.avg_dom_days_diff),
                  },
                  {
                    metric: "Highest Sale",
                    prevVal: fmtPrice(prev.highest_sale),
                    curVal: fmtPrice(cur.highest_sale),
                    chg: changeView("pct", change.highest_sale_pct),
                  },
                ].map((r) => (
                  <tr key={r.metric} className="border-b border-navy-950/10">
                    <td className="py-3 pr-4 font-medium text-navy-950">{r.metric}</td>
                    <td className="py-3 px-4 text-navy-950/70">{r.prevVal}</td>
                    <td className="py-3 px-4 text-navy-950">{r.curVal}</td>
                    <td className={`py-3 pl-4 font-medium ${r.chg.className}`}>
                      {r.chg.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Only one quarter of data: current values, no Change column.
          <div className="overflow-x-auto">
            <table className="w-full min-w-[24rem] text-left border-collapse">
              <thead>
                <tr className="border-b border-navy-950/15">
                  <th className="py-3 pr-4 eyebrow text-gold-600">Metric</th>
                  <th className="py-3 pl-4 eyebrow text-gold-600">{cur.quarter}</th>
                </tr>
              </thead>
              <tbody className="text-base md:text-lg">
                {[
                  { metric: "Average Sale Price", val: fmtPrice(cur.avg_sale_price) },
                  { metric: "Price per Sq Ft", val: fmtPpsf(cur.sold_ppsf) },
                  { metric: "Days on Market", val: fmtDays(cur.avg_dom) },
                  { metric: "Highest Sale", val: fmtPrice(cur.highest_sale) },
                ].map((r) => (
                  <tr key={r.metric} className="border-b border-navy-950/10">
                    <td className="py-3 pr-4 font-medium text-navy-950">{r.metric}</td>
                    <td className="py-3 pl-4 text-navy-950">{r.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Section 2: Price Trend line chart (NAVY) ------------------------------

function PriceTrendBand({
  neighborhood,
  quarters,
}: {
  neighborhood: string;
  quarters: QuarterAnalytics[];
}) {
  const data = quarters.map((q) => ({
    quarter: q.quarter,
    avg_sale_price: q.avg_sale_price,
  }));

  return (
    <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <p className="eyebrow text-gold-500 mb-4">{neighborhood}</p>
        <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
          Price Trend
        </h2>
        <span className="gold-rule mb-8" />
        <p className="text-lg text-ink-100 mb-8">Average Sale Price by Quarter</p>

        {data.length === 0 ? (
          <p className="text-lg text-ink-100">No quarterly data available.</p>
        ) : (
          <div className="h-[340px] sm:h-[400px] md:h-[460px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 24, bottom: 8, left: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.12)"
                  vertical={false}
                />
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: INK, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  angle={-30}
                  textAnchor="end"
                  height={56}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={(v) => fmtAxisMoney(Number(v))}
                  tick={{ fill: INK, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={78}
                />
                <Tooltip
                  formatter={(v) => [fmtPrice(Number(v)), "Avg Sale Price"]}
                  contentStyle={{
                    background: "#0A1F3D",
                    border: "1px solid rgba(200,167,91,0.5)",
                    color: "#fff",
                  }}
                  labelStyle={{ color: GOLD }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="avg_sale_price"
                  name="Avg Sale Price"
                  stroke={GOLD}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: GOLD, stroke: GOLD }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Section 3: Price per Sq Ft grouped bar chart (WHITE) ------------------

function PpsfBand({
  neighborhood,
  quarters,
}: {
  neighborhood: string;
  quarters: QuarterAnalytics[];
}) {
  const data = quarters.map((q) => ({
    quarter: q.quarter,
    sold_avg_ppsf: q.sold_avg_ppsf,
    // null active bars are skipped by recharts (no bar drawn for that quarter).
    active_avg_ppsf: q.active_avg_ppsf,
  }));

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <p className="eyebrow text-gold-600 mb-4">{neighborhood}</p>
        <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
          Price per Sq Ft
        </h2>
        <span className="gold-rule-dark mb-8" />
        <p className="text-lg text-navy-950/60 mb-8">
          Sold vs Active $/Sq Ft by Quarter
        </p>

        {data.length === 0 ? (
          <p className="text-lg text-navy-950/70">No quarterly data available.</p>
        ) : (
          <div className="h-[340px] sm:h-[400px] md:h-[460px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 24, bottom: 8, left: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(10,31,61,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: NAVY_INK, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(10,31,61,0.2)" }}
                  angle={-30}
                  textAnchor="end"
                  height={56}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={(v) => fmtPpsf(Number(v))}
                  tick={{ fill: NAVY_INK, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={78}
                />
                <Tooltip
                  formatter={(v) => (v == null ? DASH : fmtPpsf(Number(v)))}
                  cursor={{ fill: "rgba(10,31,61,0.06)" }}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(200,167,91,0.6)",
                    color: NAVY_INK,
                  }}
                />
                <Legend />
                <Bar dataKey="sold_avg_ppsf" name="Sold Avg $/Sq Ft" fill={GOLD} />
                <Bar dataKey="active_avg_ppsf" name="Active Avg $/Sq Ft" fill={NAVY} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Page composition ------------------------------------------------------

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

  // Keep the x-axis readable: show roughly the last 12 quarters.
  const recentQuarters = data ? data.quarterly.byQuarter.slice(-12) : [];

  return (
    <>
      {/* Hero (navy gradient). Whole-page alternation:
          navy(hero) -> white -> navy -> white -> navy -> white -> navy */}
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
          {/* 1. Market Snapshot comparison table — WHITE */}
          <SnapshotTableBand
            neighborhood={neighborhood}
            comparison={data.quarterly.comparison}
          />
          {/* 2. Price Trend line chart — NAVY */}
          <PriceTrendBand neighborhood={neighborhood} quarters={recentQuarters} />
          {/* 3. Price per Sq Ft grouped bars — WHITE */}
          <PpsfBand neighborhood={neighborhood} quarters={recentQuarters} />

          {/* Existing listing sections (unchanged) */}
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
