import type { Metadata } from "next";
import { CountrySelector } from "@/components/country-selector";
import { SourceDirectoryCard } from "@/components/source-directory-card";
import { getSourceDirectoryEntriesWithStatus } from "@/lib/live";

export const metadata: Metadata = {
  title: "Source Directory",
  description: "Controlled source registry for Choyis news, including official sources, verified publishers, APIs, RSS feeds, and discovery providers."
};

export default function SourceDirectoryPage() {
  const sources = getSourceDirectoryEntriesWithStatus();

  return (
    <div className="mx-auto max-w-[1720px] space-y-8 px-4 py-8 sm:px-6 xl:px-8">
      <header className="premium-panel p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">Source Directory</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Choyis news shows publisher attribution on each story, while this page explains source labels and coverage types without exposing the full sourcing strategy.
        </p>
      </header>
      <CountrySelector />
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
        {sources.map((source) => <SourceDirectoryCard key={source.id} source={source} />)}
      </div>
    </div>
  );
}
