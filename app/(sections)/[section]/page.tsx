import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { CountrySelector } from "@/components/country-selector";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { githubFilters, briefs } from "@/lib/mock-data";
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

export default function SectionPage({ params }: { params: Params }) {
  const section = coreSections.find((item) => item.slug === params.section);
  if (!section) notFound();

  const items = briefs.filter((brief) => brief.category === section.category || brief.subcategory === section.category);
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
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((brief) => <ArticleCard key={brief.id} brief={brief} />)}
        </div>
      ) : (
        <EmptyState title={`${section.title} is source-ready`} message="Mock cards will appear here as source adapters return matching content." />
      )}
    </div>
  );
}
