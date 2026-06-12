import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { SignatureBlock } from "@/components/SignatureBlock";
import { getLareReportBySlug, formatReportDate } from "@/lib/lare";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const report = await getLareReportBySlug(slug);
  if (!report) {
    return { title: "Report Not Found" };
  }
  return {
    title: `${report.title} - ${formatReportDate(report.publish_date)}`,
    description: report.meta_description ?? report.excerpt ?? undefined,
    alternates: { canonical: `/lare-report/${slug}` },
  };
}

export default async function LareReportArchivePage({ params }: PageProps) {
  const { slug } = await params;
  const report = await getLareReportBySlug(slug);
  if (!report) {
    notFound();
  }

  return (
    <>
      <PageHero
        image="/images/sections/lare-report-hero.jpg"
        alt="Los Angeles real estate market commentary"
        eyebrow="MARKET COMMENTARY"
        title="The LARE Report."
        subtitle="Los Angeles Real Estate. Weekly analysis from Karen and Jack Misraje."
        scrim="dark"
      />
      <section className="bg-white py-20 md:py-28">
      <div className="editorial">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/lare-report"
            className="inline-block text-[11px] font-medium text-gold-500 hover:text-gold-400 mb-8 transition-colors"
            style={{ letterSpacing: "0.18em" }}
          >
            &larr; ALL REPORTS
          </Link>
          {report!.headline && (
            <h1 className="font-display font-light text-navy-950 text-3xl md:text-4xl lg:text-5xl leading-tight mb-3" style={{ letterSpacing: "-0.01em" }}>
              {report!.headline}
            </h1>
          )}
          <p className="text-sm text-stone-500 mb-10">
            Published {formatReportDate(report!.publish_date)}
          </p>
          <article
            className="lare-content"
            dangerouslySetInnerHTML={{ __html: report!.html_content }}
          />
          <SignatureBlock />
        </div>
      </div>
    </section>
    </>
  );
}
