import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { searchFeed } from "@/lib/live";

export const metadata: Metadata = {
  title: "Search",
  description: "Search live Choyis news providers by topic, country, region, category, source, or language."
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const getValue = (key: string) => {
    const value = searchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const q = getValue("q");
  const country = getValue("country");
  const region = getValue("region");
  const category = getValue("category");
  const source = getValue("source");
  const language = getValue("language");
  const page = Number(getValue("page") || "1");

  const results = await searchFeed({
    q,
    country,
    region,
    category,
    source,
    language,
    page,
    pageSize: 18
  });

  const activeFilters = [
    q && `Query: ${q}`,
    country && `Country: ${country}`,
    region && `Region: ${region}`,
    category && `Category: ${category}`,
    source && `Source: ${source}`,
    language && `Language: ${language}`
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-[1720px] space-y-8 px-4 py-8 sm:px-6 xl:px-8">
      <header className="premium-panel p-6 sm:p-8">
        <Badge>Live search</Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">Search Results</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Choyis news searches live providers server-side and falls back only when no live sources return matching items.
        </p>
        {activeFilters.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {activeFilters.map((filter) => <Badge key={filter}>{filter}</Badge>)}
          </div>
        )}
      </header>

      {results.items.length ? (
        <section className="space-y-5">
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
            {results.items.map((item) => <ArticleCard key={item.id} brief={item} />)}
          </div>
          {results.hasMore && (
            <div className="flex justify-center">
              <Link
                href={`/search?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(country ? { country } : {}),
                  ...(region ? { region } : {}),
                  ...(category ? { category } : {}),
                  ...(source ? { source } : {}),
                  ...(language ? { language } : {}),
                  page: String(page + 1)
                }).toString()}`}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm"
              >
                Load More
              </Link>
            </div>
          )}
        </section>
      ) : (
        <EmptyState title="No live results yet" message="Try a broader keyword, different country, or remove a filter to widen the live provider search." />
      )}
    </div>
  );
}
