import Link from "next/link";
import { Bookmark } from "lucide-react";
import { SourceBadge } from "@/components/source-badges";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function StoryRow({ item }: { item: SignalBrief }) {
  const summary = item.summary || "Open the brief for source attribution and the original publisher link.";

  return (
    <Link href={`/brief/${item.id}`} className="grid gap-4 border-b border-border/70 py-4 last:border-b-0 sm:grid-cols-[1fr_104px]">
      <div className="min-w-0">
        <SourceBadge brief={item} />
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug hover:text-primary">{item.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{summary}</p>
        <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
      </div>
      <div className="relative hidden min-h-20 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950 bg-cover bg-center sm:block">
        {item.imageUrl && <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />}
        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-background/85 text-primary">
          <Bookmark className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export function MoreNewsSection({ items }: { items: SignalBrief[] }) {
  const left = items.filter((_, index) => index % 2 === 0);
  const right = items.filter((_, index) => index % 2 === 1);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">More news</h2>
          <p className="mt-1 text-sm text-muted-foreground">Curated from trusted sources</p>
        </div>
        <Link href="/world-news" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary shadow-sm">
          Customize
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card px-4 shadow-sm">
          {left.map((item) => <StoryRow key={item.id} item={item} />)}
        </div>
        <div className="rounded-2xl border border-border/70 bg-card px-4 shadow-sm">
          {right.map((item) => <StoryRow key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
