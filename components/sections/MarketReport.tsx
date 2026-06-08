import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { MarketCharts } from "@/components/sections/MarketCharts";
import { fmtPrice, fmtPpsf, fmtInt, fmtDays, orDash, DASH } from "@/lib/market/format";
import type {
  Listing,
  MarketData,
  Quarterly,
} from "@/lib/market/getMarketData";

// Server-rendered market report for one neighborhood. The page fetches the data
// (lib/market/getMarketData) and passes it in, so the hero, photo gallery,
// market-snapshot TABLE, listing CARDS, and the verbatim COMMENTARY are all in
// the initial server HTML (crawlable). ONLY the two recharts charts are
// client-rendered, via <MarketCharts/>. `data` is null when the server fetch
// failed, in which case a graceful error band renders instead of the sections.

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
  return (
    <p
      className={`mb-10 text-lg md:text-xl leading-relaxed whitespace-pre-line ${
        tone === "navy" ? "text-ink-100" : "text-navy-950/80"
      }`}
    >
      {text}
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
  if (s.includes("sold")) return { text: "text-slate-500", dot: "bg-slate-500" };
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

function ListingCard({ row }: { row: Listing }) {
  const accent = statusAccent(row.status_label);
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

function ListingsBand({
  tone,
  neighborhood,
  heading,
  note,
  rows,
  emptyText,
  commentary,
}: {
  tone: "navy" | "white";
  neighborhood: string;
  heading: string;
  note?: string;
  rows: Listing[];
  emptyText: string;
  commentary?: string | null;
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
        <CommentaryProse text={commentary} tone={tone} />
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
      {/* Hero — full-bleed photo. Whole-page band alternation below:
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

      {!data ? (
        <MessageBand message="Market data is temporarily unavailable. Please try again shortly." />
      ) : (
        <>
          {/* 1. Market Snapshot comparison table — WHITE (server-rendered) */}
          <SnapshotTableBand
            neighborhood={neighborhood}
            comparison={data.quarterly.comparison}
            commentary={data.commentary?.market_snapshot ?? null}
          />

          {/* 2 + 3. Charts — the only client-rendered piece (NAVY + WHITE) */}
          <MarketCharts neighborhood={neighborhood} quarters={recentQuarters} />

          {/* 4. Active Listings — NAVY (server-rendered) */}
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Active Listings"
            rows={data.buckets.active}
            emptyText="No active listings at this time."
            commentary={data.commentary?.active_listings_analysis ?? null}
          />
          {/* 5. Under Contract — WHITE (server-rendered) */}
          <ListingsBand
            tone="white"
            neighborhood={neighborhood}
            heading="Under Contract"
            rows={data.buckets.underContract}
            emptyText="Nothing under contract at this time."
            commentary={data.commentary?.under_contract_analysis ?? null}
          />
          {/* 6. Recent Sales — NAVY (server-rendered) */}
          <ListingsBand
            tone="navy"
            neighborhood={neighborhood}
            heading="Recent Sales"
            note="last 12 months"
            rows={data.buckets.soldLast12Months}
            emptyText="No recent sales in this period."
            commentary={data.commentary?.recent_sales_analysis ?? null}
          />
        </>
      )}
    </>
  );
}
