import { BadgeCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SignalBrief } from "@/lib/types";
import { cn } from "@/lib/utils";

export function sourceInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SourceBadge({ brief, compact = false }: { brief: SignalBrief; compact?: boolean }) {
  return (
    <Badge className="bg-background/70 pl-1.5">
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary/10 px-1 text-[10px] font-bold text-primary">
        {sourceInitials(brief.sourceName)}
      </span>
      {!compact && (brief.sourceName || "Source")}
    </Badge>
  );
}

export function CountryBadge({ country, region }: { country?: string; region?: string }) {
  if (!country && !region) return null;
  return <Badge>{country || region}</Badge>;
}

export function ProviderBadge({ provider }: { provider: SignalBrief["providerType"] }) {
  const label =
    provider === "official_update_page"
      ? "official"
      : provider === "community_trend"
        ? "community"
        : provider.replace("_", " ");
  return (
    <Badge className="capitalize">
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

export function CredibilityLabel({ provider, score }: { provider: SignalBrief["providerType"]; score?: number }) {
  if (provider === "official_update_page") return <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">Official source</Badge>;
  if (provider === "community_trend") return <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200">Community Trend</Badge>;
  if (provider === "directory_only") return <Badge>Directory Source</Badge>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium text-blue-500", score ? "text-blue-600 dark:text-blue-300" : "")}>
      <BadgeCheck className="h-3.5 w-3.5" />
      Verified source
    </span>
  );
}
