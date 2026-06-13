import type { Metadata } from "next";
import { SavedItemsClient } from "@/components/saved-items-client";

export const metadata: Metadata = {
  title: "Saved Items",
  description: "Saved Choyis news cards and briefings."
};

export default function SavedItemsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="premium-panel p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Saved Items</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Save live stories, official updates, repos, and video briefings locally in your browser while Choyis news remains login-free.
        </p>
      </header>
      <SavedItemsClient />
    </div>
  );
}
