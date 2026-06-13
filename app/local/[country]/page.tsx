import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { CountrySelector } from "@/components/country-selector";
import { SourceDirectoryCard } from "@/components/source-directory-card";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { getLocalCountryFeed, getSourceDirectoryEntriesWithStatus } from "@/lib/live";
import { countries } from "@/lib/source-registry";
import { slugify, titleFromSlug } from "@/lib/utils";

type Params = { country: string };

export function generateStaticParams() {
  return countries.filter((country) => country !== "Global").map((country) => ({ country: slugify(country) }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const country = countries.find((item) => slugify(item) === params.country) || titleFromSlug(params.country);
  return {
    title: `${country} Local News and Intelligence`,
    description: `Top local stories, business, policy, community pulse, entertainment, official updates, and source directory for ${country}.`
  };
}

function StoryGroup({ title, items }: { title: string; items: Awaited<ReturnType<typeof getLocalCountryFeed>>["items"] }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
        {items.map((brief) => <ArticleCard key={brief.id} brief={brief} />)}
      </div>
    </section>
  );
}

export default async function LocalCountryPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const country = countries.find((item) => slugify(item) === params.country) || titleFromSlug(params.country);

  const page = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page || "1");
  const feed = await getLocalCountryFeed(country, { page, pageSize: 18, region: country });
  const countryItems = feed.items;
  const countrySources = getSourceDirectoryEntriesWithStatus().filter((source) => source.country === country || source.region === country);
  const business = countryItems.filter((brief) => ["Startups & Business", "Local"].includes(brief.category));
  const policy = countryItems.filter((brief) => ["Politics & Policy", "Visa & Immigration", "Work & Sponsorship"].includes(brief.category));
  const community = countryItems.filter((brief) => brief.category === "Community Pulse" || brief.providerType === "community_trend");
  const lifestyle = countryItems.filter((brief) => brief.category === "Health & Lifestyle" || brief.subcategory === "Entertainment");
  const officialSources = countrySources.filter((source) => source.trustTier === "official");

  return (
    <div className="mx-auto max-w-[1720px] space-y-8 px-4 py-6 sm:px-6 xl:px-8">
      <header className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <Badge>Local intelligence</Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{country} Local News</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          A country-specific view for top local stories, business and economy, politics and policy, visa updates, community pulse, lifestyle, official updates, and source discovery.
        </p>
      </header>

      <CountrySelector active={country} />

      {countryItems.length ? (
        <div className="space-y-8">
          <StoryGroup title="Top Local Stories" items={countryItems} />
          <StoryGroup title="Business and Economy" items={business} />
          <StoryGroup title="Politics, Policy, Visa" items={policy} />
          <StoryGroup title="Community Pulse" items={community} />
          <StoryGroup title="Entertainment and Lifestyle" items={lifestyle} />
          {feed.hasMore && (
            <div className="flex justify-center">
              <Link href={`/local/${params.country}?page=${page + 1}`} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm">
                Load More
              </Link>
            </div>
          )}
        </div>
      ) : (
        <EmptyState title={`No local stories for ${country} yet`} message="Try again shortly or widen the query as Choyis checks more live local sources." />
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Official Updates</h2>
        {officialSources.length ? (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
            {officialSources.map((source) => <SourceDirectoryCard key={source.id} source={source} />)}
          </div>
        ) : (
          <EmptyState title="Official sources pending" message="Official agency sources can be added to this country without redesigning the page." />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Source Directory for {country}</h2>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          {countrySources.map((source) => <SourceDirectoryCard key={source.id} source={source} />)}
        </div>
      </section>
    </div>
  );
}
