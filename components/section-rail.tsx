import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { VideoCard } from "@/components/video-card";
import { RepoTrendCard } from "@/components/repo-trend-card";
import type { SignalBrief } from "@/lib/types";
import { slugify } from "@/lib/utils";

export function SectionRail({ title, items, href }: { title: string; items: SignalBrief[]; href?: string }) {
  if (!items.length) return null;
  const railHref = href ?? `/${slugify(title)}`;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Link href={railHref} className="text-sm text-muted-foreground hover:text-foreground">
          View all <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-3">
        {items.map((brief, index) => {
          if (brief.contentType === "video") return <VideoCard key={brief.id} brief={brief} />;
          if (brief.contentType === "repo") return <RepoTrendCard key={brief.id} brief={brief} />;
          return <ArticleCard key={brief.id} brief={brief} compact={index > 1} />;
        })}
      </div>
    </section>
  );
}
