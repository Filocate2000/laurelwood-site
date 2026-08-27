import type { Metadata } from "next";
import { getPastTransactions } from "@/lib/past-transactions";
import { PageHero } from "@/components/layout/PageHero";
import { PastTransactionsExplorer } from "@/components/sections/PastTransactionsExplorer";
import { photo } from "@/lib/photos";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

const DESCRIPTION =
  "A record of homes closed across Los Angeles and the South Bay by Misraje Real Estate Partners.";

export const metadata: Metadata = {
  title: "Past Transactions",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/past-transactions") },
  openGraph: { title: "Past Transactions", description: DESCRIPTION, url: absoluteUrl("/past-transactions") },
};

export default async function PastTransactionsPage() {
  // The firm's whole book, not only Laurelwood-tagged rows. Which key this reads
  // is a site-config decision, never a default buried in the data layer.
  const all = await getPastTransactions(siteConfig.pastTransactionsSiteKey);
  const hero = photo("laurelwood-scenic-4");

  return (
    <div className="bg-navy-950 text-white">
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        scrim="dark"
        eyebrow="Track Record"
        title="Past Transactions"
        subtitle="A record of homes closed across Los Angeles and the South Bay."
      />
      <PastTransactionsExplorer transactions={all} />
    </div>
  );
}
