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
import type { QuarterAnalytics } from "@/lib/market/getMarketData";
import { fmtPrice, fmtPpsf, fmtAxisMoney, DASH } from "@/lib/market/format";

// The ONLY client-rendered piece of the report: the two recharts charts (price
// trend line + price-per-sqft bars), each in its own full-bleed band so the
// page's navy/white alternation is unchanged. The band chrome (eyebrow, heading,
// subtitle) is server-rendered with the rest of the component tree; only the SVG
// charts draw after hydration, showing a fixed-height placeholder until then.

// Canon palette for the charts.
const GOLD = "#C8A75B";
const NAVY = "#16335c";
const INK = "#9fb0c8"; // muted light text on navy
const NAVY_INK = "#0A1F3D"; // dark text on white

const CHART_H = "h-[340px] sm:h-[400px] md:h-[460px] w-full";

export function MarketCharts({
  neighborhood,
  quarters,
}: {
  neighborhood: string;
  quarters: QuarterAnalytics[];
}) {
  // Gate the actual charts on mount so SSR/first paint emit a stable placeholder
  // (recharts measures the DOM, so it can only draw client-side).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const trendData = quarters.map((q) => ({
    quarter: q.quarter,
    avg_sale_price: q.avg_sale_price,
  }));
  const ppsfData = quarters.map((q) => ({
    quarter: q.quarter,
    sold_avg_ppsf: q.sold_avg_ppsf,
    // null active bars are skipped by recharts (no bar drawn for that quarter).
    active_avg_ppsf: q.active_avg_ppsf,
  }));

  return (
    <>
      {/* Section 2: Price Trend line chart — NAVY */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{neighborhood}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            Price Trend
          </h2>
          <span className="gold-rule mb-8" />
          <p className="text-lg text-ink-100 mb-8">Average Sale Price by Quarter</p>

          {trendData.length === 0 ? (
            <p className="text-lg text-ink-100">No quarterly data available.</p>
          ) : !mounted ? (
            <div className={`${CHART_H} bg-white/5 animate-pulse`} aria-hidden="true" />
          ) : (
            <div className={CHART_H}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 24, bottom: 8, left: 8 }}>
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

      {/* Section 3: Price per Sq Ft grouped bar chart — WHITE */}
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

          {ppsfData.length === 0 ? (
            <p className="text-lg text-navy-950/70">No quarterly data available.</p>
          ) : !mounted ? (
            <div className={`${CHART_H} bg-navy-950/5 animate-pulse`} aria-hidden="true" />
          ) : (
            <div className={CHART_H}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ppsfData} margin={{ top: 10, right: 24, bottom: 8, left: 8 }}>
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
    </>
  );
}
