import type { ReactNode } from "react";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { MarketCharts } from "@/components/sections/MarketCharts";
import { fmtPrice, fmtPpsf, fmtInt, fmtDays, orDash, DASH } from "@/lib/market/format";
import type {
  Listing,
  MarketData,
  Quarterly,
} from "@/lib/market/getMarketData";
import { siteConfig } from "@/lib/site-config";

// Server-rendered market report for one neighborhood. The page fetches the data
// (lib/market/getMarketData) and passes it in, so the hero, photo gallery,
// market-snapshot TABLE, listing CARDS, and the verbatim COMMENTARY are all in
// the initial server HTML (crawlable). ONLY the two recharts charts are
// client-rendered, via <MarketCharts/>. `data` is null when the server fetch
// failed, in which case a graceful error band renders instead of the sections.

// Speaker labels are embedded in the commentary text the ingest Lambda writes,
// so these are DATA matchers, not display copy. Derived from siteConfig so a
// sibling site matches its own labels, with the known Misraje literals kept as a
// fallback: the Lambda's exact output was not verifiable from here, and a wider
// match can only fail to bold a label, never corrupt the prose. Deduped because
// on this site the derived values and the fallbacks are the same strings.
const SPEAKERS = Array.from(
  new Set([
    `${siteConfig.legalName}:`,
    ...siteConfig.agents.map((a) => `${a.firstName} ${a.lastName}:`),
    "Misraje Real Estate Partners:",
    "Jack Misraje:",
    "Karen Misraje:",
  ])
);

// --- Commentary prose (verbatim) -------------------------------------------

/** Stored neighborhood commentary, rendered VERBATIM (speaker labels and all).
 *  Body type (Inter Tight) at canon body size; FULL content width, no max-width
 *  cap or mx-auto, exactly like the body paragraphs on /development-history. The
 *  enclosing band already supplies `w-full px-6 md:px-16`. Light on navy bands,
 *  navy on white bands. `whitespace-pre-line` keeps the author's line breaks
 *  without altering the text. Renders nothing when empty. */
function CommentaryProse({
  text,
  tone,
}: {
  text: string | null | undefined;
  tone: "navy" | "white";
}) {
  if (!text || text.trim() === "") return null;

  const trimmed = text.trimStart();
  const label = SPEAKERS.find((s) => trimmed.startsWith(s)) ?? null;
  const rest = label ? trimmed.slice(label.length) : trimmed;

  return (
    <p
      className={`mb-10 text-lg md:text-xl leading-relaxed whitespace-pre-line ${
        tone === "navy" ? "text-ink-100" : "text-navy-950/80"
      }`}
    >
      {label && <span className="font-semibold">{label}</span>}
      {label ? rest : trimmed}
    </p>
  );
}

// --- Listing card + listing band -------------------------------------------

/** Status-label accent (label text + matching dot). Tasteful, canon-compatible
 *  shades; Sold uses slate per Jack. No red is used, so this never collides with
 *  the comparison table's red/green up/down coloring. Unknown statuses fall back
 *  to canon gold. */
function statusAccent(label: string | null): { text: string; dot: string } {
  const s = (label ?? "").toLowerCase();
  if (s.includes("active")) return { text: "text-green-700", dot: "bg-green-700" };
  if (s.includes("under contract"))
    return { text: "text-blue-700", dot: "bg-blue-700" };
  if (s.includes("sold")) return { text: "text-red-600", dot: "bg-red-600" };
  return { text: "text-gold-600", dot: "bg-gold-600" };
}

/** Pool can arrive as boolean or a "Y"/"Yes"/"true" string. */
function hasPool(v: Listing["pool"]): boolean {
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

/** "Apr 24, 2026" from an ISO/date string, or null if unparseable. */
function fmtSaleDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function ListingCard({ row }: { row: Listing }) {
  const accent = statusAccent(row.status_label);
  const statusDate = fmtSaleDate(row.change_date);
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
        <p className={`eyebrow flex items-center gap-2 ${accent.text}`}>
          <span
            aria-hidden="true"
            className={`inline-block w-1.5 h-1.5 rounded-full ${accent.dot}`}
          />
          {row.status_label}
          {statusDate && <span> · {statusDate}</span>}
        </p>
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

// --- Averages panel (two boxes: active averages + 12-month sale averages) ---
// Renders at the TOP of a listings band (above the cards). Quiet, tone-aware
// panels (subtle tint, faint gold border, no shadow) so they recede and the
// cream property cards pop. $/SqFt is list-based (stats.*.avgPpsf =
// lp_per_sqft), matching the legacy report.

function AveragesPanel({
  stats,
}: {
  stats: MarketData["stats"];
}) {
  const panelClass = "rounded-xl border border-gold-500/25 bg-white/[0.04] p-6";
  const labelClass = "text-ink-200";
  const valueClass = "text-white";
  const dividerClass = "border-white/10";

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className={`flex items-baseline justify-between border-b ${dividerClass} py-2`}>
      <dt className={`text-sm ${labelClass}`}>{label}</dt>
      <dd className={`text-sm font-semibold ${valueClass}`}>{value}</dd>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
      <div className={panelClass}>
        <h3 className="font-display font-medium text-xl mb-4 text-green-400">
          Current Listing Averages
        </h3>
        <dl>
          <Row label="Average List Price" value={stats.active.avgPrice ? fmtPrice(stats.active.avgPrice) : DASH} />
          <Row label="Average $/SqFt" value={stats.active.avgPpsf ? fmtPpsf(stats.active.avgPpsf) : DASH} />
          <Row label="Average Days on Market" value={stats.active.avgDom != null ? `${fmtInt(stats.active.avgDom)}` : DASH} />
        </dl>
      </div>
      <div className={panelClass}>
        <h3 className="font-display font-medium text-xl mb-4 text-red-300">
          Last 12 Months Sales
        </h3>
        <dl>
          <Row label="Average Sale Price" value={stats.soldLast12Months.avgPrice ? fmtPrice(stats.soldLast12Months.avgPrice) : DASH} />
          <Row label="Average $/SqFt" value={stats.soldLast12Months.avgPpsf ? fmtPpsf(stats.soldLast12Months.avgPpsf) : DASH} />
          <Row label="Average Days on Market" value={stats.soldLast12Months.avgDom != null ? `${fmtInt(stats.soldLast12Months.avgDom)}` : DASH} />
          <Row label="Total Homes Sold" value={fmtInt(stats.soldLast12Months.count)} />
        </dl>
      </div>
    </div>
  );
}

// --- Recent-sales averages panel (current-quarter box + 12-month box) -------
// Renders at the TOP of the Recent Sales band. Left box is the most recent
// quarter's sale averages (from quarterly.comparison.current); right box is the
// same 12-month sale summary used in the Active band. Quiet, tone-aware panels
// so the property cards pop.

function RecentSalesAveragesPanel({
  data,
}: {
  data: MarketData;
}) {
  const panelClass = "rounded-xl border border-gold-500/25 bg-white/[0.04] p-6";
  const labelClass = "text-ink-200";
  const valueClass = "text-white";
  const dividerClass = "border-white/10";
  const cur = data.quarterly.comparison.current;

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className={`flex items-baseline justify-between border-b ${dividerClass} py-2`}>
      <dt className={`text-sm ${labelClass}`}>{label}</dt>
      <dd className={`text-sm font-semibold ${valueClass}`}>{value}</dd>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
      <div className={panelClass}>
        <h3 className="font-display font-medium text-xl mb-4 text-red-300">
          {cur ? `${cur.quarter} Sales Averages` : "Recent Quarter Sales Averages"}
        </h3>
        <dl>
          <Row label="Average Sale Price" value={cur?.avg_sale_price ? fmtPrice(cur.avg_sale_price) : DASH} />
          <Row label="Average $/SqFt" value={cur?.sold_ppsf ? fmtPpsf(cur.sold_ppsf) : DASH} />
          <Row label="Average Days on Market" value={cur?.avg_dom != null ? `${fmtInt(cur.avg_dom)}` : DASH} />
        </dl>
      </div>
      <div className={panelClass}>
        <h3 className="font-display font-medium text-xl mb-4 text-red-300">
          Last 12 Months Sales
        </h3>
        <dl>
          <Row label="Average Sale Price" value={data.stats.soldLast12Months.avgPrice ? fmtPrice(data.stats.soldLast12Months.avgPrice) : DASH} />
          <Row label="Average $/SqFt" value={data.stats.soldLast12Months.avgPpsf ? fmtPpsf(data.stats.soldLast12Months.avgPpsf) : DASH} />
          <Row label="Average Days on Market" value={data.stats.soldLast12Months.avgDom != null ? `${fmtInt(data.stats.soldLast12Months.avgDom)}` : DASH} />
          <Row label="Total Homes Sold" value={fmtInt(data.stats.soldLast12Months.count)} />
        </dl>
      </div>
    </div>
  );
}

// --- Under-contract panel (summary + context against closed sales) ----------
// Renders ONLY when underContract.count > 0. Left box: UC averages. Right box:
// UC pricing positioned against 90-day and 12-month closed $/sqft, with signed
// gap labels. $/SqFt is list-based (stats.*.avgPpsf), consistent with the rest.

function UnderContractPanel({
  stats,
}: {
  stats: MarketData["stats"];
}) {
  if (stats.underContract.count === 0) return null;

  const panelClass = "rounded-xl border border-gold-500/25 bg-white/[0.04] p-6";
  const labelClass = "text-ink-200";
  const valueClass = "text-white";
  const dividerClass = "border-white/10";

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className={`flex items-baseline justify-between border-b ${dividerClass} py-2`}>
      <dt className={`text-sm ${labelClass}`}>{label}</dt>
      <dd className={`text-sm font-semibold ${valueClass}`}>{value}</dd>
    </div>
  );

  const ucPpsf = stats.underContract.avgPpsf;
  const s90 = stats.soldLast90Days.avgPpsf;
  const s12 = stats.soldLast12Months.avgPpsf;

  const gapLabel = (uc: number | null, sold: number | null): string => {
    if (!uc || !sold || sold === 0) return DASH;
    const pct = Math.round((uc / sold - 1) * 1000) / 10;
    if (pct === 0) return "At parity";
    return `${pct > 0 ? "Above" : "Below"} ${Math.abs(pct).toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
      <div className={panelClass}>
        <h3 className="font-display font-medium text-xl mb-4 text-blue-300">
          Under Contract Summary
        </h3>
        <dl>
          <Row label="Average Price" value={stats.underContract.avgPrice ? fmtPrice(stats.underContract.avgPrice) : DASH} />
          <Row label="Average $/SqFt" value={ucPpsf ? fmtPpsf(ucPpsf) : DASH} />
          <Row label="Average Days on Market" value={stats.underContract.avgDom != null ? `${fmtInt(stats.underContract.avgDom)} days` : DASH} />
          <Row label="Total Under Contract" value={fmtInt(stats.underContract.count)} />
        </dl>
      </div>
      <div className={panelClass}>
        <h3 className="font-display font-medium text-xl mb-4 text-red-300">
          Context Against Closed Sales
        </h3>
        <dl>
          <Row label="90-Day Sold Avg $/SqFt" value={s90 ? fmtPpsf(s90) : DASH} />
          <Row label="12-Month Sold Avg $/SqFt" value={s12 ? fmtPpsf(s12) : DASH} />
          <Row label="Pricing Gap vs 90-Day" value={gapLabel(ucPpsf, s90)} />
          <Row label="Pricing Gap vs 12-Month" value={gapLabel(ucPpsf, s12)} />
        </dl>
      </div>
    </div>
  );
}

function ListingsBand({
  tone,
  neighborhood,
  heading,
  note,
  rows,
  emptyText,
  commentary,
  averages,
  id,
}: {
  tone: "navy" | "white";
  neighborhood: string;
  heading: string;
  note?: string;
  rows: Listing[];
  emptyText: string;
  commentary?: string | null;
  averages?: ReactNode;
  id?: string;
}) {
  const navy = tone === "navy";
  return (
    <section
      id={id}
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
        <CommentaryProse text={commentary} tone={tone} />
        {averages}
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

// --- Photo gallery band (NAVY) ---------------------------------------------

/** Three neighborhood photos in a responsive row (3-across on desktop, stacked
 *  on mobile), equal sizing via a shared aspect ratio + object-cover so nothing
 *  crops awkwardly. Softly rounded, subtly bordered cards with a slight shadow,
 *  on a full-bleed navy band. */
function GalleryBand({
  neighborhood,
  images,
}: {
  neighborhood: string;
  images: string[];
}) {
  return (
    <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-black/30"
            >
              <Image
                src={src}
                alt={`${neighborhood} neighborhood photo ${i + 1}`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Section 1: Market Snapshot comparison table (WHITE) --------------------

function SnapshotTableBand({
  neighborhood,
  comparison,
  commentary,
}: {
  neighborhood: string;
  comparison: Quarterly["comparison"];
  commentary?: string | null;
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
        <CommentaryProse text={commentary} tone="white" />

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

// --- Detailed Analysis band (WHITE): three stat cards + computed summary ----

function DetailedAnalysisBand({
  neighborhood,
  data,
}: {
  neighborhood: string;
  data: MarketData;
}) {
  const activeCount = data.stats.active.count;
  const sold12Count = data.stats.soldLast12Months.count;
  const sold90Count = data.stats.soldLast90Days.count;
  const activePpsf = data.stats.active.avgPpsf;
  const ucPpsf = data.stats.underContract.avgPpsf;
  const sold90Ppsf = data.stats.soldLast90Days.avgPpsf;
  const sold12Ppsf = data.stats.soldLast12Months.avgPpsf;
  const avgDomActive = data.stats.active.avgDom;

  // Absorption: months of inventory = active / (12-mo solds per month).
  const perMonth = sold12Count > 0 ? sold12Count / 12 : null;
  const absorption =
    perMonth && perMonth > 0 ? activeCount / perMonth : null;

  // Market condition from absorption (months of inventory).
  const condition =
    absorption == null
      ? "Insufficient Data"
      : absorption < 4
      ? "Seller Leaning"
      : absorption <= 6
      ? "Balanced"
      : "Buyer Leaning";

  // Pricing position: active list $/sqft vs 12-mo closed $/sqft.
  const pricingPct =
    activePpsf && sold12Ppsf && sold12Ppsf > 0
      ? Math.round(((activePpsf / sold12Ppsf) - 1) * 1000) / 10
      : null;
  const pricingLabel =
    pricingPct == null
      ? DASH
      : pricingPct > 0
      ? `Above ${Math.abs(pricingPct).toFixed(1)}%`
      : pricingPct < 0
      ? `Below ${Math.abs(pricingPct).toFixed(1)}%`
      : "At market";

  const perMonthLabel =
    perMonth != null ? (Math.round(perMonth * 100) / 100).toFixed(2) : DASH;

  const cards: Array<{
    title: string;
    blurb: string;
    headline: string;
    rows: Array<{ label: string; value: string }>;
  }> = [
    {
      title: "Market Condition",
      blurb:
        "Balance between supply and demand using active inventory, pending activity, recent closings, and exposure time.",
      headline: condition,
      rows: [
        { label: "Active Listings", value: fmtInt(activeCount) },
        { label: "Under Contract", value: fmtInt(data.stats.underContract.count) },
        { label: "Sold Last 90 Days", value: fmtInt(sold90Count) },
        { label: "Avg DOM Active", value: avgDomActive != null ? `${fmtInt(avgDomActive)} days` : DASH },
      ],
    },
    {
      title: "Absorption Rate",
      blurb:
        "How quickly current inventory would sell at the pace of the last 12 months of closed sales. Lower months indicate stronger demand.",
      headline: absorption != null ? `${(Math.round(absorption * 10) / 10).toFixed(1)} mo` : DASH,
      rows: [
        { label: "Active Homes", value: fmtInt(activeCount) },
        { label: "Sold Last 12 Months", value: fmtInt(sold12Count) },
        { label: "Homes Sold Per Month", value: perMonthLabel },
        { label: "Market Pace", value: condition },
      ],
    },
    {
      title: "Pricing Position",
      blurb:
        "Today's active and under-contract asking prices against where homes have actually closed. Whether asking levels sit above, near, or below the closed-sale range.",
      headline: pricingLabel,
      rows: [
        { label: "Active Avg $/SqFt", value: activePpsf ? fmtPpsf(activePpsf) : DASH },
        { label: "Under Contract Avg $/SqFt", value: ucPpsf ? fmtPpsf(ucPpsf) : DASH },
        { label: "90-Day Sold Avg $/SqFt", value: sold90Ppsf ? fmtPpsf(sold90Ppsf) : DASH },
        { label: "12-Month Sold Avg $/SqFt", value: sold12Ppsf ? fmtPpsf(sold12Ppsf) : DASH },
      ],
    },
  ];

  return (
    <section id="detailed-analysis" className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <p className="eyebrow text-gold-600 mb-4">{neighborhood}</p>
        <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
          Detailed Analysis
        </h2>
        <span className="gold-rule-dark mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {cards.map((c) => (
            <div
              key={c.title}
              className="flex flex-col bg-[#f6f3ec] border border-gold-500/50 p-6 shadow-sm"
            >
              <h3 className="font-display font-medium text-lg text-navy-950 mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-navy-950/60 leading-relaxed mb-5">
                {c.blurb}
              </p>
              <p className="font-display text-3xl md:text-4xl font-semibold text-navy-950 mb-5">
                {c.headline}
              </p>
              <dl className="mt-auto flex flex-col gap-2">
                {c.rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-baseline justify-between border-b border-navy-950/10 pb-1.5"
                  >
                    <dt className="text-sm text-navy-950/70">{r.label}</dt>
                    <dd className="text-sm font-medium text-navy-950">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <CommentaryProse text={data.commentary?.detailed_analysis ?? null} tone="white" />
      </div>
    </section>
  );
}

// --- CTA band (standalone WHITE band between listing sections) --------------

function CtaBand({
  heading,
  body,
  cta,
  href,
}: {
  heading: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <div className="rounded-xl border border-gold-600/30 bg-navy-950/[0.03] px-8 py-12 text-center">
          <h2 className="font-display font-light text-3xl md:text-4xl text-gold-600 mb-4">{heading}</h2>
          <p className="text-lg text-navy-950/75 max-w-2xl mx-auto mb-8 leading-relaxed">{body}</p>
          <a href={href} className="inline-block bg-gold-500 text-navy-950 font-display font-medium tracking-wide px-8 py-3 rounded-full hover:bg-gold-400 transition-colors">{cta}</a>
        </div>
      </div>
    </section>
  );
}

// --- Section nav (three jump buttons, placed after the gallery) -------------
// Anchor links to the three listing sections. Always shows all three; the
// Under Contract target may be an empty-state section when nothing is pending.

function SectionNav() {
  const items = [
    { label: "Active Listings", href: "#active" },
    { label: "Under Contract", href: "#under-contract" },
    { label: "Solds", href: "#recent-sales" },
    { label: "Detailed Analysis", href: "#detailed-analysis" },
  ];
  return (
    <section className="bg-navy-950 pb-12 md:pb-16 overflow-hidden">
      <div className="w-full px-6 md:px-16">
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="inline-block border border-gold-500/50 text-gold-500 font-display font-medium tracking-wide px-6 py-2.5 rounded-full hover:bg-gold-500 hover:text-navy-950 transition-colors"
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Page composition ------------------------------------------------------

export function MarketReport({
  neighborhood,
  data,
}: {
  neighborhood: string;
  data: MarketData | null;
}) {
  const isWest = neighborhood === "West Laurelwood";
  const heroImage = isWest
    ? "/images/report-hero-west.jpg"
    : "/images/report-hero-east.jpg";
  const galleryImages = isWest
    ? [
        "/images/report-west-1.jpg",
        "/images/report-west-2.jpg",
        "/images/report-west-3.jpg",
      ]
    : [
        "/images/report-east-1.jpg",
        "/images/report-east-2.jpg",
        "/images/report-east-3.jpg",
      ];

  // Keep the x-axis readable: show roughly the last 12 quarters.
  const recentQuarters = data ? data.quarterly.byQuarter.slice(-12) : [];

  return (
    <>
      {/* Hero, full-bleed photo. Whole-page band alternation below:
          photo hero -> navy(gallery) -> white -> navy -> white -> navy -> white
          -> navy, so no two adjacent solid bands share a color. */}
      <PageHero
        image={heroImage}
        alt={neighborhood}
        eyebrow="BUYING OR SELLING IN LAURELWOOD"
        title={`${neighborhood} Market Overview`}
      />

      {/* Photo gallery (NAVY), three across on desktop, between hero and snapshot. */}
      <GalleryBand neighborhood={neighborhood} images={galleryImages} />

      <SectionNav />

      {!data ? (
        <MessageBand message="Market data is temporarily unavailable. Please try again shortly." />
      ) : (
        <>
          {/* 1. Market Snapshot comparison table, WHITE (server-rendered) */}
          <SnapshotTableBand
            neighborhood={neighborhood}
            comparison={data.quarterly.comparison}
            commentary={data.commentary?.market_snapshot ?? null}
          />

          {/* 2 + 3. Charts, the only client-rendered piece (NAVY + WHITE) */}
          <MarketCharts neighborhood={neighborhood} quarters={recentQuarters} />

          {/* Active Listings, NAVY (server-rendered) */}
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Active Listings"
            id="active"
            rows={data.buckets.active}
            emptyText="No active listings at this time."
            commentary={data.commentary?.active_listings_analysis ?? null}
            averages={<AveragesPanel stats={data.stats} />}
          />
          {/* CTA, WHITE (selling) */}
          <CtaBand
            heading={`Thinking of selling in ${neighborhood}?`}
            body="Get a custom opinion of value based on the most recent sales, current competition, and buyer demand in your section of Laurelwood."
            cta="Request a Home Valuation"
            href="/contact"
          />
          {/* Under Contract, NAVY (server-rendered) */}
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Under Contract"
            id="under-contract"
            rows={data.buckets.underContract}
            emptyText="Nothing under contract at this time."
            commentary={data.commentary?.under_contract_analysis ?? null}
            averages={<UnderContractPanel stats={data.stats} />}
          />
          {/* CTA, WHITE (new-listing updates) */}
          <CtaBand
            heading="Want to know about new listings first?"
            body={`Stay ahead of the market with updates on new listings, escrow activity, and recent closings in ${neighborhood}.`}
            cta="Get Market Updates"
            href="/contact"
          />
          {/* Recent Sales, NAVY (server-rendered) */}
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Recent Sales"
            id="recent-sales"
            note="last 12 months"
            rows={data.buckets.soldLast12Months}
            emptyText="No recent sales in this period."
            commentary={data.commentary?.recent_sales_analysis ?? null}
            averages={<RecentSalesAveragesPanel data={data} />}
          />

          {/* 7. Detailed Analysis, WHITE (server-rendered) */}
          <DetailedAnalysisBand neighborhood={neighborhood} data={data} />
        </>
      )}
    </>
  );
}
