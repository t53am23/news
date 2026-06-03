import type { Metadata } from "next";
import { EmptyState } from "@/components/states";

export const metadata: Metadata = {
  title: "Saved Items",
  description: "Saved SignalBrief cards and briefings."
};

export default function SavedItemsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="premium-panel p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Saved Items</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Bookmark state is ready for Supabase-backed saved items when user features are enabled.
        </p>
      </header>
      <EmptyState title="No saved briefings yet" message="Saved articles, videos, visa notices, repositories, and research signals will appear here." />
    </div>
  );
}
