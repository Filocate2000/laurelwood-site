import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SignatureBlock } from "@/components/SignatureBlock";
import { getLatestLareReport, getRecentLareReports, formatReportDate } from "@/lib/lare";
import { lareReportContent as c } from "@/content/lare-report";

export const metadata = {
  title: c.metaTitle,
  description: c.metaDescription,
  alternates: { canonical: "/lare-report" },
};

// Revalidate every 5 minutes so newly ingested reports surface quickly
export const revalidate = 300;

export default async function LareReportLanding() {
  const [latest, recent] = await Promise.all([
    getLatestLareReport(),
    getRecentLareReports(12),
  ]);

  if (!latest) {
    // No reports ingested yet. Render a friendly placeholder instead of 404
    // so the page exists and Lambda can populate it on the next run.
    return (
      <>
        <PageHero {...c.hero} />
        <section className="bg-white py-20 md:py-28">
          <div className="editorial">
            <p className="text-base text-stone-600 italic">
              {c.emptyState}
            </p>
          </div>
        </section>
      </>
    );
  }

  // Filter the latest report out of the "recent" sidebar so it doesn't appear twice
  const archive = recent.filter((r) => r.id !== latest.id);

  return (
    <>
      <PageHero {...c.hero} />
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="grid md:grid-cols-4 gap-12 md:gap-16">
            {/* Main column: latest report */}
            <article className="md:col-span-3">
              <p className="text-[11px] font-medium text-gold-500 mb-3" style={{ letterSpacing: "0.18em" }}>
                {c.latestLabel} &middot; {formatReportDate(latest.publish_date).toUpperCase()}
              </p>
              <div
                className="lare-content"
                dangerouslySetInnerHTML={{ __html: latest.html_content }}
              />
              <SignatureBlock />
            </article>
            {/* Sidebar: archive list */}
            <aside className="md:col-span-1">
              <div className="md:sticky md:top-32">
                <p className="text-[11px] font-medium text-gold-500 mb-4" style={{ letterSpacing: "0.18em" }}>
                  {c.archiveLabel}
                </p>
                {archive.length === 0 ? (
                  <p className="text-sm text-stone-500 italic">
                    {c.archiveEmpty}
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {archive.map((r) => (
                      <li key={r.id} className="border-b border-stone-200 pb-4 last:border-b-0">
                        <Link href={`/lare-report/${r.slug}`} className="block group">
                          <p className="text-[10px] text-stone-500 mb-1" style={{ letterSpacing: "0.12em" }}>
                            {formatReportDate(r.publish_date).toUpperCase()}
                          </p>
                          <p className="text-sm text-navy-950 group-hover:text-gold-500 transition-colors leading-snug">
                            {r.headline ?? r.title}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
