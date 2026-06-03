import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { StoryLink } from "@/components/story-link";
import { SourceBadge } from "@/components/source-badges";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function CompactNewsList({ title, href, items }: { title: string; href: string; items: SignalBrief[] }) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-4">
        <Link href={href} className="text-xl font-semibold text-primary">{title}</Link>
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="divide-y divide-border/70">
        {items.map((item) => (
          <StoryLink key={item.id} brief={item} className="grid gap-3 py-4 first:pt-0 sm:grid-cols-[1fr_92px]">
            <div>
              <SourceBadge brief={item} />
              <h3 className="mt-2 text-base font-semibold leading-snug hover:text-primary">{item.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
            </div>
            <div
              aria-hidden="true"
              className="hidden min-h-20 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 bg-cover bg-center sm:block"
              style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
            />
          </StoryLink>
        ))}
      </div>
    </section>
  );
}
