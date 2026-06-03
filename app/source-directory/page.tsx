import type { Metadata } from "next";
import { CountrySelector } from "@/components/country-selector";
import { SourceDirectoryCard } from "@/components/source-directory-card";
import { sourceRegistry } from "@/lib/source-registry";

export const metadata: Metadata = {
  title: "Coverage Network",
  description: "How Choyis news labels official sources, verified publishers, APIs, RSS feeds, and community pulse signals."
};

export default function SourceDirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="premium-panel p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Coverage Network</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Choyis news shows publisher attribution on each story, while this page explains source labels and coverage types without exposing the full sourcing strategy.
        </p>
      </header>
      <CountrySelector />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sourceRegistry.map((source) => <SourceDirectoryCard key={source.id} source={source} />)}
      </div>
    </div>
  );
}
