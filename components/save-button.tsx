"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSavedItem, toggleSavedItem } from "@/lib/browser-storage";
import type { SignalBrief } from "@/lib/types";

export function SaveButton({ brief }: { brief: SignalBrief }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isSavedItem(brief.id));
    sync();
    window.addEventListener("choyis:saved-items", sync as EventListener);
    return () => window.removeEventListener("choyis:saved-items", sync as EventListener);
  }, [brief.id]);

  return (
    <Button
      type="button"
      aria-label={`${saved ? "Remove" : "Save"} ${brief.title}`}
      variant="secondary"
      size="icon"
      className="h-9 w-9 shrink-0 rounded-xl"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSaved(toggleSavedItem({
          id: brief.id,
          title: brief.title,
          summary: brief.summary,
          sourceName: brief.sourceName,
          sourceUrl: brief.sourceUrl,
          originalUrl: brief.originalUrl,
          publishedAt: brief.publishedAt,
          category: brief.category,
          country: brief.country,
          region: brief.region,
          imageUrl: brief.imageUrl,
          tags: brief.tags,
          linkBehavior: brief.linkBehavior,
          providerType: brief.providerType,
          contentType: brief.contentType,
          isLive: brief.isLive,
          isFallback: brief.isFallback,
          sourceLabel: brief.sourceLabel
        }));
      }}
    >
      <Bookmark className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
    </Button>
  );
}
