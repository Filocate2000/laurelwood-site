// lib/market/format.ts
// Pure display formatters shared by the server-rendered report UI (table, cards)
// and the client chart component. No DB / server-only code, so it is safe to
// import from both server and client components.

export const DASH = "—";

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** $X,XXX,XXX or a dash. */
export function fmtPrice(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? DASH : usd0.format(v);
}

/** $X,XXX (whole dollars) or a dash. */
export function fmtPpsf(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? DASH : usd0.format(Math.round(v));
}

/** Whole number with thousands separators, or a dash. */
export function fmtInt(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v)
    ? DASH
    : Math.round(v).toLocaleString("en-US");
}

/** "N days" or a dash. */
export function fmtDays(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? DASH : `${fmtInt(v)} days`;
}

/** Compact money for chart axes: $X.Xm above a million, else $X,XXX. */
export function fmtAxisMoney(v: number): string {
  if (!Number.isFinite(v)) return "";
  return v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}m`
    : usd0.format(Math.round(v));
}

/** Show a value or a dash (handles null / empty string). */
export function orDash(v: unknown): string {
  return v == null || v === "" ? DASH : String(v);
}
