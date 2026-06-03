import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";
import { StoryLink } from "@/components/story-link";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source-badges";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TopStoriesPanel({ stories }: { stories: SignalBrief[] }) {
  const lead = stories[0];
  const side = stories.slice(1, 4);
  const more = stories.slice(4, 7);

  if (!lead) return null;

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
        <Link href="/world-news" className="inline-flex items-center gap-1 text-2xl font-semibold text-primary">
          Top stories <ChevronRight className="h-6 w-6" />
        </Link>
        <Newspaper className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <StoryLink brief={lead} className="group block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 bg-cover bg-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: lead.imageUrl ? `url(${lead.imageUrl})` : undefined }}
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <SourceBadge brief={lead} />
            <Badge>{lead.country || lead.region || lead.category}</Badge>
          </div>
          <h2 className="mt-3 text-2xl font-semibold leading-tight group-hover:text-primary">{lead.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{lead.summary}</p>
          <p className="mt-3 text-sm text-muted-foreground">{formatDate(lead.publishedAt)}</p>
        </StoryLink>

        <div className="divide-y divide-border/70">
          {side.map((story) => (
            <StoryLink key={story.id} brief={story} className="grid gap-4 py-4 first:pt-0 sm:grid-cols-[1fr_112px]">
              <div>
                <SourceBadge brief={story} />
                <h3 className="mt-2 text-lg font-semibold leading-snug hover:text-primary">{story.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{formatDate(story.publishedAt)} · {story.country || story.region || story.category}</p>
              </div>
              <div
                aria-hidden="true"
                className="hidden min-h-24 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 bg-cover bg-center sm:block"
                style={{ backgroundImage: story.imageUrl ? `url(${story.imageUrl})` : undefined }}
              />
            </StoryLink>
          ))}
        </div>
      </div>

      {!!more.length && (
        <div className="mt-5 rounded-full bg-secondary/70 px-4 py-3 text-center">
          <Link href="/world-news" className="text-sm font-semibold text-primary">
            See more headlines and perspectives
          </Link>
        </div>
      )}
    </section>
  );
}
