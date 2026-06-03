import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { SensitivityDisclaimer } from "@/components/sensitivity-disclaimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountryBadge, CredibilityLabel, ProviderBadge, SourceBadge, TrustScore } from "@/components/source-badges";
import { briefs, getBriefById, getRelatedBriefs } from "@/lib/mock-data";
import { sourceRegistry, sourceTierLabels } from "@/lib/source-registry";
import { formatDate } from "@/lib/utils";

type Params = { id: string };

export function generateStaticParams() {
  return briefs.map((brief) => ({ id: brief.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const brief = getBriefById(params.id);
  if (!brief) return {};

  return {
    title: brief.title,
    description: brief.summary,
    openGraph: {
      title: brief.title,
      description: brief.summary,
      type: "article",
      images: brief.imageUrl ? [{ url: brief.imageUrl }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: brief.title,
      description: brief.summary,
      images: brief.imageUrl ? [brief.imageUrl] : undefined
    }
  };
}

export default function BriefDetailPage({ params }: { params: Params }) {
  const brief = getBriefById(params.id);
  if (!brief) notFound();

  const related = getRelatedBriefs(brief);
  const registrySource = sourceRegistry.find((source) => source.name === brief.sourceName || source.homepage === brief.sourceUrl);
  const summary = brief.summary || "This brief is based on source metadata. Open the original source for the full publisher context.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: brief.title,
    description: brief.summary,
    datePublished: brief.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "Choyis news"
    },
    isBasedOn: brief.originalUrl
  };

  return (
    <article className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="premium-panel overflow-hidden">
        {brief.imageUrl && (
          <div className="relative aspect-[16/7] min-h-72 bg-muted">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 bg-cover bg-center"
              style={{ backgroundImage: `url(${brief.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge>{brief.category}</Badge>
            {brief.subcategory && <Badge>{brief.subcategory}</Badge>}
            <CountryBadge country={brief.country} region={brief.region} />
            <ProviderBadge provider={brief.providerType} />
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{brief.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <SourceBadge brief={brief} />
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {formatDate(brief.publishedAt)}</span>
            <TrustScore score={brief.trustScore} />
            <CredibilityLabel provider={brief.providerType} score={brief.trustScore} />
          </div>
        </div>
      </header>

      {brief.disclaimerRequired && <SensitivityDisclaimer brief={brief} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="premium-panel p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Brief</h2>
              <Badge>Source-based</Badge>
            </div>
            <p className="leading-7 text-muted-foreground">{summary}</p>
          </section>

          {!!brief.keyPoints?.length && (
            <section className="premium-panel p-6">
              <h2 className="text-xl font-semibold">Key points</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                {brief.keyPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="grid gap-6 md:grid-cols-2">
            {brief.whyItMatters && (
              <div className="premium-panel p-6">
                <h2 className="text-xl font-semibold">Why it matters</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{brief.whyItMatters}</p>
              </div>
            )}
            {!!brief.whoIsAffected?.length && (
              <div className="premium-panel p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold"><Users className="h-5 w-5 text-primary" /> Who is affected</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {brief.whoIsAffected.map((item) => <Badge key={item}>{item}</Badge>)}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="premium-panel p-6">
            <h2 className="text-lg font-semibold">Source credibility</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <ProviderBadge provider={brief.providerType} />
              <CredibilityLabel provider={brief.providerType} score={brief.trustScore} />
              {registrySource && <Badge>{sourceTierLabels[registrySource.trustTier]}</Badge>}
              {registrySource?.sourceType && <Badge className="capitalize">{registrySource.sourceType.replaceAll("_", " ")}</Badge>}
            </div>
            {registrySource && <p className="mt-4 text-sm leading-6 text-muted-foreground">{registrySource.notes}</p>}
          </section>
          <section className="premium-panel p-6">
            <h2 className="text-lg font-semibold">Original source</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This page contains a short sourced brief. Full publisher content remains with the original source.
            </p>
            <Button asChild variant="premium" className="mt-5 w-full">
              <Link href={brief.originalUrl} target="_blank" rel="noreferrer">
                Open source <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </section>
          <section className="premium-panel p-6">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related stories</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {related.map((item) => <ArticleCard key={item.id} brief={item} compact />)}
          </div>
        </section>
      )}
    </article>
  );
}
