import { Code2, GitFork, Star } from "lucide-react";
import { StoryLink } from "@/components/story-link";
import { Badge } from "@/components/ui/badge";
import type { SignalBrief } from "@/lib/types";

export function RepoTrendCard({ brief }: { brief: SignalBrief }) {
  return (
    <article className="premium-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-500">
          <Code2 className="h-5 w-5" />
        </span>
        <Badge>{brief.subcategory}</Badge>
      </div>
      <StoryLink brief={brief} className="group">
        <h3 className="text-base font-semibold leading-6 group-hover:text-primary">{brief.title}</h3>
      </StoryLink>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{brief.summary}</p>
      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" /> 18.4k</span>
        <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5 text-blue-500" /> 2.1k</span>
        <span>Updated today</span>
      </div>
    </article>
  );
}
