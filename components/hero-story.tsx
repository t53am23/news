import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountryBadge, SourceBadge } from "@/components/source-badges";
import { SaveButton } from "@/components/save-button";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function HeroStory({ brief }: { brief: SignalBrief }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Today&apos;s Briefing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your daily intelligence update</p>
        </div>
        <div className="chip">
          <span>{formatDate(brief.publishedAt)}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Updated 8m ago</span>
        </div>
      </div>

      <div className="relative min-h-[390px] overflow-hidden rounded-2xl border border-border/70 bg-slate-950 text-white">
        {brief.imageUrl && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${brief.imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className="relative flex min-h-[390px] max-w-2xl flex-col justify-end p-6 sm:p-8">
          <Badge className="mb-5 w-fit border-amber-400/30 bg-amber-400/15 text-amber-100">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            Top story
          </Badge>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">{brief.title}</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">{brief.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <SourceBadge brief={brief} />
            <Badge className="bg-white/10 text-white">{brief.category}</Badge>
            <CountryBadge country={brief.country} region={brief.region} />
            <Badge className="bg-white/10 text-white">{brief.readTime}</Badge>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href={`/brief/${brief.id}`}>
                Read full brief <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <SaveButton title={brief.title} />
          </div>
        </div>
      </div>
    </section>
  );
}
