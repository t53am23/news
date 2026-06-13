"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/states";
import { getSavedItems, type SavedBrief } from "@/lib/browser-storage";

export function SavedItemsClient() {
  const [items, setItems] = useState<SavedBrief[]>([]);

  useEffect(() => {
    const sync = () => setItems(getSavedItems());
    sync();
    window.addEventListener("choyis:saved-items", sync as EventListener);
    return () => window.removeEventListener("choyis:saved-items", sync as EventListener);
  }, []);

  if (!items.length) {
    return <EmptyState title="No saved items yet" message="Saved stories, repos, videos, and official updates will appear here as you bookmark them." />;
  }

  return (
    <section className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
      {items.map((item) => <ArticleCard key={item.id} brief={item} compact />)}
    </section>
  );
}
