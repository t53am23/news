import { Play } from "lucide-react";
import { StoryLink } from "@/components/story-link";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source-badges";
import type { SignalBrief } from "@/lib/types";

export function VideoCard({ brief }: { brief: SignalBrief }) {
  return (
    <article className="premium-panel overflow-hidden">
      <StoryLink brief={brief} className="block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {brief.imageUrl && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 bg-cover bg-center"
              style={{ backgroundImage: `url(${brief.imageUrl})` }}
            />
          )}
          <div className="absolute inset-0 grid place-items-center bg-black/20">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/80 text-slate-950 shadow-lg">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </div>
          <Badge className="absolute bottom-3 right-3 bg-black/70 text-white">{brief.readTime}</Badge>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-6">{brief.title}</h3>
          <div className="mt-3 flex items-center justify-between gap-2">
            <SourceBadge brief={brief} />
            <Badge>{brief.category}</Badge>
          </div>
        </div>
      </StoryLink>
    </article>
  );
}
