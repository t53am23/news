import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MessageCircle, Newspaper, Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SourceRegistryEntry } from "@/lib/types";
import { sourceTierLabels } from "@/lib/source-registry";

function SourceIcon({ source }: { source: SourceRegistryEntry }) {
  if (source.mode === "rss") return <Rss className="h-5 w-5" />;
  if (source.sourceType === "community_forum") return <MessageCircle className="h-5 w-5" />;
  if (source.sourceType === "news_publisher") return <Newspaper className="h-5 w-5" />;
  return <BadgeCheck className="h-5 w-5" />;
}

const statusLabelMap = {
  active: "Active",
  available_no_key: "Public access",
  skipped_missing_key: "Key needed",
  fallback_only: "Directory only",
  inactive: "Inactive"
} as const;

const statusClassMap = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  available_no_key: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  skipped_missing_key: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  fallback_only: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  inactive: "bg-muted text-muted-foreground"
} as const;

export function SourceDirectoryCard({ source }: { source: SourceRegistryEntry }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{source.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{source.country} · {source.sourceCategory}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <SourceIcon source={source} />
        </span>
      </div>

      <p className="min-h-16 text-sm leading-6 text-muted-foreground">{source.notes}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{sourceTierLabels[source.trustTier]}</Badge>
        <Badge className="capitalize">{source.mode.replaceAll("_", " ")}</Badge>
        <Badge>{source.language}</Badge>
        {source.status && <Badge className={statusClassMap[source.status]}>{statusLabelMap[source.status]}</Badge>}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {source.contentCategories.slice(0, 4).map((category) => (
          <span key={category} className="rounded-full bg-secondary/70 px-2 py-1 text-xs text-muted-foreground">
            {category}
          </span>
        ))}
      </div>

      {source.requiredEnvVar && (
        <p className="mt-4 text-xs text-muted-foreground">
          Server variable: <span className="font-medium text-foreground">{source.requiredEnvVar}</span>
        </p>
      )}

      <Link href={source.homepage} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
        Open source <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
