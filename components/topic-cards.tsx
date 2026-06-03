import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SourceBadge } from "@/components/source-badges";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TopicCards({ topics }: { topics: Array<{ title: string; href: string; items: SignalBrief[] }> }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold tracking-tight">Your topics</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {topics.map((topic) => (
          <article key={topic.title} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <Link href={topic.href} className="mb-3 inline-flex items-center gap-1 text-base font-semibold">
              {topic.title} <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
            <div className="space-y-4">
              {topic.items.slice(0, 2).map((item) => (
                <Link key={item.id} href={`/brief/${item.id}`} className="grid grid-cols-[1fr_72px] gap-3">
                  <div>
                    <SourceBadge brief={item} compact />
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">{item.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
                  </div>
                  <div className="relative min-h-16 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 bg-cover bg-center">
                    {item.imageUrl && <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />}
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
