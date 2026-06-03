import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { CountrySelector } from "@/components/country-selector";
import { SourceDirectoryCard } from "@/components/source-directory-card";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { briefs } from "@/lib/mock-data";
import { countries, getSourcesByCountry } from "@/lib/source-registry";
import { slugify } from "@/lib/utils";

type Params = { country: string };

export function generateStaticParams() {
  return countries.filter((country) => country !== "Global").map((country) => ({ country: slugify(country) }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const country = countries.find((item) => slugify(item) === params.country);
  if (!country) return {};
  return {
    title: `${country} Local News and Intelligence`,
    description: `Top local stories, business, policy, community pulse, entertainment, official updates, and source directory for ${country}.`
  };
}

function StoryGroup({ title, items }: { title: string; items: typeof briefs }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((brief) => <ArticleCard key={brief.id} brief={brief} />)}
      </div>
    </section>
  );
}

export default function LocalCountryPage({ params }: { params: Params }) {
  const country = countries.find((item) => slugify(item) === params.country);
  if (!country) notFound();

  const countryItems = briefs.filter((brief) => brief.country === country || brief.region === country);
  const countrySources = getSourcesByCountry(country);
  const business = countryItems.filter((brief) => ["Startups & Business", "Local"].includes(brief.category) && brief.tags.some((tag) => ["Business", "Markets", "Investment", "Local news"].includes(tag)));
  const policy = countryItems.filter((brief) => ["Politics & Policy", "Visa & Immigration", "Work & Sponsorship"].includes(brief.category));
  const community = countryItems.filter((brief) => brief.category === "Community Pulse" || brief.providerType === "community_trend");
  const lifestyle = countryItems.filter((brief) => brief.category === "Health & Lifestyle" || brief.subcategory === "Entertainment");
  const officialSources = countrySources.filter((source) => source.trustTier === "official");

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <Badge>Local intelligence</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{country} Local News</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          A country-specific view for top local stories, business and economy, politics and policy, visa updates, community pulse, lifestyle, official updates, and source discovery.
        </p>
      </header>

      <CountrySelector active={country} />

      {countryItems.length ? (
        <div className="space-y-8">
          <StoryGroup title="Top Local Stories" items={countryItems.slice(0, 4)} />
          <StoryGroup title="Business and Economy" items={business} />
          <StoryGroup title="Politics, Policy, Visa" items={policy} />
          <StoryGroup title="Community Pulse" items={community} />
          <StoryGroup title="Entertainment and Lifestyle" items={lifestyle} />
        </div>
      ) : (
        <EmptyState title={`${country} local feed is source-ready`} message="Country-specific source adapters are ready for RSS/API and directory-only entries." />
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Official Updates</h2>
        {officialSources.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {officialSources.map((source) => <SourceDirectoryCard key={source.id} source={source} />)}
          </div>
        ) : (
          <EmptyState title="Official sources pending" message="Official agency sources can be added to this country without redesigning the page." />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Source Directory for {country}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {countrySources.map((source) => <SourceDirectoryCard key={source.id} source={source} />)}
        </div>
      </section>
    </div>
  );
}
