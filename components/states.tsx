import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="premium-panel h-60 animate-pulse bg-muted/70" />
      ))}
    </div>
  );
}

export function EmptyState({ title = "No briefs yet", message = "This section is ready for live source data." }) {
  return (
    <div className="premium-panel grid min-h-64 place-items-center p-8 text-center">
      <div>
        <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message = "We could not load live updates. Showing fallback briefings." }) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-200">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading source metadata
    </span>
  );
}
