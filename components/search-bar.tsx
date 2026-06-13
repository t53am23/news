"use client";

import { useEffect, useState } from "react";
import { Command, Search } from "lucide-react";
import { getPreferences, setPreference } from "@/lib/browser-storage";

export function SearchBar() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(getPreferences().lastSearch || "");
  }, []);

  return (
    <form
      action="/search"
      className="relative w-full max-w-2xl"
      role="search"
      onSubmit={() => setPreference("lastSearch", query.trim())}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        aria-label="Search topics, regions, and sources"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border/80 bg-card/70 pl-11 pr-4 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:h-12 sm:pr-16"
        placeholder="Search topics, regions, sources"
      />
      <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-border bg-secondary px-2 py-1 text-xs text-muted-foreground sm:flex">
        <Command className="h-3 w-3" /> K
      </span>
    </form>
  );
}
