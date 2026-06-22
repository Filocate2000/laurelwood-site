import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

// Static route list. Blog and LARE Report are intentionally absent (COMING
// LATER). Add their paths here when those sections ship.
const ROUTES = [
  "/",
  "/west-laurelwood",
  "/east-laurelwood",
  "/dona-streets",
  "/development-history",
  "/report",
  "/marketreport",
  "/homeowners",
  "/homeowners/neighborhood-watch",
  "/homeowners/community-news",
  "/homeowners/emergency-contacts",
  "/who-we-are",
  "/meet-the-partners",
  "/why-use-us",
  "/past-transactions",
  "/buying",
  "/selling",
  "/contact",
  "/accessibility",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
