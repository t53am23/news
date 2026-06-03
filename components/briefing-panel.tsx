import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/source-badges";
import { briefs } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function BriefingPanel() {
  const updates = briefs.slice(1, 4);
  const topics = ["UK Election", "Student Visa", "AI Tools", "Cybersecurity", "Policy", "Climate"];

  return (
    <aside className="space-y-4 xl:max-h-[calc(100vh-7rem)] xl:overflow-auto xl:pr-1">
      <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top updates</h2>
          <Link href="/world-news" className="text-xs font-semibold text-primary">View all</Link>
        </div>
        <div className="divide-y divide-border/70">
          {updates.map((item) => (
            <Link key={item.id} href={`/brief/${item.id}`} className="grid grid-cols-[1fr_72px] gap-3 py-3 first:pt-0 last:pb-0">
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
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trending topics</h2>
          <Link href="/world-news" className="text-xs font-semibold text-primary">View all</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Get the Daily Briefing</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Top stories delivered to your inbox every morning.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">Enter your email</span>
          </div>
          <Button size="sm" className="sm:self-auto">
            Subscribe <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </section>
    </aside>
  );
}
