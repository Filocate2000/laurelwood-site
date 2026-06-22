import Image from "next/image";
import type { SiteTransaction } from "@/lib/site-transactions";

/**
 * Presentational Past Transactions list for the neighborhood sites. Reads from
 * the static per-site SITE_TRANSACTIONS array (no Supabase, by design). When the
 * array is empty it renders a calm "in progress" state so the shell route is
 * presentable before data is curated. The `area` label keeps the empty-state
 * copy neighborhood-specific.
 */
export function PastTransactionsList({
  transactions,
  area,
}: {
  transactions: SiteTransaction[];
  area: string;
}) {
  if (transactions.length === 0) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="editorial text-center max-w-2xl">
          <p className="eyebrow text-gold-600 mb-6">Selected Properties</p>
          <span className="block h-px w-12 bg-gold-600 mx-auto mb-8" />
          <p className="text-navy-950/70 text-lg leading-relaxed">
            A selection of recent and notable transactions in {area} and the
            surrounding Studio City market is being prepared. Please check back
            soon, or reach out for a confidential overview of recent activity.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="editorial">
        <p className="eyebrow text-gold-600 mb-4">Selected Properties</p>
        <span className="block h-px w-12 bg-gold-600 mb-12" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {transactions.map((t) => {
            const specs = [
              t.beds != null ? `${t.beds} BD` : null,
              t.baths != null ? `${t.baths} BA` : null,
              t.livingSqft != null ? `${t.livingSqft.toLocaleString()} sqft` : null,
            ]
              .filter(Boolean)
              .join("  ·  ");
            const tag = [t.transactionType, t.soldDate].filter(Boolean).join("  ·  ");
            return (
              <article key={t.id} className="flex flex-col">
                <div
                  className="relative aspect-[4/3] overflow-hidden border border-navy-950/10 bg-navy-950/5 mb-4"
                  style={{ borderRadius: "2px" }}
                >
                  {t.photoUrl && (
                    <Image
                      src={t.photoUrl}
                      alt={t.address}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <h3 className="font-display text-lg text-navy-950 leading-snug">
                  {t.address}
                  {t.unit ? ` #${t.unit}` : ""}
                </h3>
                <p className="text-sm text-navy-950/60 mt-1">
                  {t.city}
                  {t.state ? `, ${t.state}` : ""}
                </p>
                {specs && <p className="text-sm text-navy-950/70 mt-2">{specs}</p>}
                {tag && (
                  <p className="text-[12px] tracking-nav uppercase text-gold-600 mt-2">
                    {tag}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-16 text-[12px] text-navy-950/55">
          Information sourced from the MLS.
        </p>
      </div>
    </section>
  );
}
