import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SensitivityDisclaimer } from "@/components/sensitivity-disclaimer";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { getVisaCountryFeed } from "@/lib/live";
import { visaCategories, visaCountries } from "@/lib/navigation";
import { slugify } from "@/lib/utils";

type Params = { country: string };

export function generateStaticParams() {
  return visaCountries.map((country) => ({ country: slugify(country) }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const country = visaCountries.find((item) => slugify(item) === params.country);
  if (!country) return {};
  return {
    title: `${country} Visa and Immigration Updates`,
    description: `Source-based ${country} visa, immigration, student, work, sponsorship, fee, ETA, and official update briefings.`
  };
}

export default async function VisaCountryPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const country = visaCountries.find((item) => slugify(item) === params.country);
  if (!country) notFound();

  const page = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page || "1");
  const feed = await getVisaCountryFeed(country, { page, pageSize: 18 });
  const items = feed.items;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="premium-panel p-6 sm:p-8">
        <Badge>Country landing page</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{country} Visa and Immigration Updates</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Official-source and permitted-feed briefings for students, workers, sponsors, families, visitors, and employers.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {visaCategories.map((category) => <Badge key={category}>{category}</Badge>)}
        </div>
      </header>
      <SensitivityDisclaimer />
      {items.length ? (
        <section className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((brief) => <ArticleCard key={brief.id} brief={brief} />)}
          </div>
          {feed.hasMore && (
            <div className="flex justify-center">
              <Link href={`/visa/${params.country}?page=${page + 1}`} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm">
                Load More
              </Link>
            </div>
          )}
        </section>
      ) : (
        <EmptyState title={`${country} source adapters are ready`} message="Official update pages can be connected without storing full article text." />
      )}
    </div>
  );
}
