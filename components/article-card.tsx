import { Clock } from "lucide-react";
import { StoryLink } from "@/components/story-link";
import { Badge } from "@/components/ui/badge";
import { CountryBadge, CredibilityLabel, SourceBadge } from "@/components/source-badges";
import { SaveButton } from "@/components/save-button";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({
  brief,
  compact = false,
  featured = false
}: {
  brief: SignalBrief;
  compact?: boolean;
  featured?: boolean;
}) {
  const summary = brief.summary || "Source metadata is available. Open the brief for attribution and the original source link.";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-premium">
      <div className="absolute right-3 top-3 z-10">
        <SaveButton title={brief.title} />
      </div>
      <StoryLink brief={brief} className="block h-full" ariaLabel={`Open story: ${brief.title}`}>
        <div className={featured ? "grid gap-0 md:grid-cols-[0.9fr_1.1fr]" : "grid gap-0 sm:grid-cols-[132px_1fr]"}>
          <div className={featured ? "relative min-h-64 bg-muted" : "relative min-h-28 bg-muted sm:min-h-full"}>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
              style={{
                backgroundImage: brief.imageUrl
                  ? `linear-gradient(135deg, rgb(15 23 42 / 0.10), rgb(8 13 24 / 0.42)), url(${brief.imageUrl})`
                  : undefined
              }}
            />
            {!brief.imageUrl && (
              <div className="absolute inset-0 flex items-end p-4 text-sm font-semibold uppercase tracking-wide text-white/70">
                {brief.category}
              </div>
            )}
          </div>

          <div className={featured ? "flex min-w-0 flex-col p-5 sm:p-6" : "flex min-w-0 flex-col p-4"}>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge>{brief.category}</Badge>
              <CountryBadge country={brief.country} region={brief.region} />
            </div>
            <h3 className={featured ? "line-clamp-3 text-2xl font-semibold leading-tight" : "line-clamp-3 text-base font-semibold leading-snug"}>
              {brief.title}
            </h3>
            {!compact && <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{summary}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <SourceBadge brief={brief} />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(brief.publishedAt)}
              </span>
              <CredibilityLabel provider={brief.providerType} score={brief.trustScore} />
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <div className="flex flex-wrap gap-1.5">
                {brief.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
              </div>
              <span className="text-xs font-medium text-primary">{brief.isLive ? "Open source" : "Read brief"}</span>
            </div>
          </div>
        </div>
      </StoryLink>
    </article>
  );
}
