"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountryBadge, SourceBadge } from "@/components/source-badges";
import { SaveButton } from "@/components/save-button";
import type { SignalBrief } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function HeroStory({ items }: { items: SignalBrief[] }) {
  const featured = items.length ? items : [];
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [featured.length]);

  useEffect(() => {
    if (featured.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % featured.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [featured.length]);

  if (!featured.length) return null;

  const brief = featured[index] ?? featured[0];
  const minHeight = "min-h-[240px] sm:min-h-[310px] lg:min-h-[360px] xl:min-h-[380px]";
  const openSource = () => window.open(brief.originalUrl, "_blank", "noopener,noreferrer");
  const showPrev = () => setIndex((current) => (current - 1 + featured.length) % featured.length);
  const showNext = () => setIndex((current) => (current + 1) % featured.length);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 sm:mb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Today&apos;s Briefing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your daily intelligence update</p>
        </div>
        <div className="chip text-[11px] sm:text-xs">
          <span>{formatDate(brief.publishedAt)}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Updated 8m ago</span>
        </div>
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl border border-border/70 bg-slate-950 text-white ${minHeight}`}
        role="button"
        tabIndex={0}
        onClick={openSource}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openSource();
          }
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || featured.length < 2) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          if (Math.abs(delta) > 40) {
            if (delta > 0) {
              showPrev();
            } else {
              showNext();
            }
          }
          touchStartX.current = null;
        }}
      >
        {brief.imageUrl && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${brief.imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className={`relative flex max-w-2xl flex-col justify-end p-5 sm:p-6 lg:p-8 ${minHeight}`}>
          <Badge className="mb-4 w-fit border-amber-400/30 bg-amber-400/15 text-amber-100 sm:mb-5">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            Top story
          </Badge>
          <h2 className="max-w-xl text-[1.9rem] font-semibold leading-tight sm:text-4xl">{brief.title}</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-200 sm:mt-4 sm:text-base">{brief.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <SourceBadge brief={brief} />
            <Badge className="bg-white/10 text-white">{brief.category}</Badge>
            <CountryBadge country={brief.country} region={brief.region} />
            <Badge className="bg-white/10 text-white">{brief.readTime}</Badge>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7" onClick={(event) => event.stopPropagation()}>
            <Button asChild>
              <Link href={`/brief/${brief.id}`}>
                Read full brief <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/15">
              <a href={brief.originalUrl} target="_blank" rel="noreferrer">
                Open source <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <SaveButton title={brief.title} />
          </div>
        </div>

        {featured.length > 1 && (
          <>
            <div className="absolute bottom-4 right-4 flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                aria-label="Previous story"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-slate-950/55 text-white transition hover:bg-slate-950/80"
                onClick={showPrev}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next story"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-slate-950/55 text-white transition hover:bg-slate-950/80"
                onClick={showNext}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2" onClick={(event) => event.stopPropagation()}>
              {featured.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to story ${itemIndex + 1}`}
                  className={itemIndex === index ? "h-2.5 w-8 rounded-full bg-white" : "h-2.5 w-2.5 rounded-full bg-white/45"}
                  onClick={() => setIndex(itemIndex)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
