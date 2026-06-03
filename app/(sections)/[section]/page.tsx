import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { CountrySelector } from "@/components/country-selector";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { githubFilters } from "@/lib/mock-data";
import { getSectionFeed } from "@/lib/live";
import { coreSections, visaCategories, visaCountries } from "@/lib/navigation";
import { SensitivityDisclaimer } from "@/components/sensitivity-disclaimer";

type Params = { section: string };

export function generateStaticParams() {
  return coreSections.map((section) => ({ section: section.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const section = coreSections.find((item) => item.slug === params.section);
  if (!section) return {};

  return {
    title: section.title,
    description: section.description,
    openGraph: {
      title: `${section.title} | Choyis news`,
      description: section.description
    },
    twitter: {
      card: "summary_large_image",
      title: `${section.title} | Choyis news`,
      description: section.description
    }
  };
}

export default async function SectionPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const section = coreSections.find((item) => item.slug === params.section);
  if (!section) notFound();

  const page = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page || "1");
  const feed = await getSectionFeed(params.section, { page, pageSize: 18 });
  const items = feed.items;
  const sensitive = ["Visa & Immigration", "Health & Lifestyle", "Politics & Policy", "Work & Sponsorship"].includes(section.category);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="premium-panel p-6 sm:p-8">
        <div className="max-w-3xl">
          <Badge>{section.category}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{section.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{section.description}</p>
        </div>
        {section.slug === "visa-immigration-watch" && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Countries and regions</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {visaCountries.map((country) => <Badge key={country}>{country}</Badge>)}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Visa categories</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {visaCategories.map((category) => <Badge key={category}>{category}</Badge>)}
              </div>
            </div>
          </div>
        )}
        {section.slug === "github-trends" && (
          <div className="mt-6 flex flex-wrap gap-2">
            {githubFilters.map((filter) => <Badge key={filter}>{filter}</Badge>)}
          </div>
        )}
      </header>

      {section.slug === "local-news" && <CountrySelector />}

      {sensitive && <SensitivityDisclaimer />}

      {items.length ? (
        <section className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-2">
            {items.map((brief) => <ArticleCard key={brief.id} brief={brief} />)}
          </div>
          {feed.hasMore && (
            <div className="flex justify-center">
              <Link href={`/${params.section}?page=${page + 1}`} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm">
                Load More
              </Link>
            </div>
          )}
        </section>
      ) : (
        <EmptyState title={`${section.title} is source-ready`} message="Mock cards will appear here as source adapters return matching content." />
      )}
    </div>
  );
}
