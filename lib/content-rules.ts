import type { ContentIntent, PermissionsPosture, SignalBrief } from "@/lib/types";
import { isRealExternalUrl } from "@/lib/utils";

const briefFirstCategories = new Set([
  "Visa & Immigration",
  "Students",
  "Health & Lifestyle",
  "Cybersecurity",
  "Human Rights",
  "GitHub Trends",
  "Developer Trends"
]);

const keywordSets = {
  official: ["official", "home office", "uscis", "ircc", "ministry", "department", "guidance", "rule change", "notice"],
  advisory: ["advisory", "vulnerability", "cve", "security advisory", "patch", "incident"],
  explainer: ["explainer", "what it means", "what to know", "briefing", "why it matters"],
  multiSource: ["roundup", "multiple sources", "consensus", "coverage comparison"],
  tool: ["repository", "repo", "open source", "tool", "framework", "sdk", "library"]
};

const matterByCategory: Record<string, string> = {
  "Visa & Immigration": "This may affect application timing, eligibility checks, documentation, or employer and sponsor decisions.",
  Students: "This may affect admissions planning, study routes, post-study options, or scholarship decisions.",
  "Health & Lifestyle": "This may affect access to health guidance, public-health awareness, or research interpretation.",
  Cybersecurity: "This may affect patching priorities, security operations, risk exposure, or affected software users.",
  "GitHub Trends": "This may affect developer tooling choices, AI workflows, or open-source adoption decisions.",
  "Developer Trends": "This may affect developer workflows, framework choices, or platform tooling adoption.",
  "Politics & Policy": "This may affect compliance planning, regulated organisations, public services, or affected residents."
};

const audienceByCategory: Record<string, string[]> = {
  "Visa & Immigration": ["Students", "Workers", "Migrants", "Applicants"],
  Students: ["Students", "Universities", "Scholarship applicants"],
  "Health & Lifestyle": ["Patients", "Public health users", "Researchers"],
  Cybersecurity: ["Developers", "Organisations", "Security teams", "Affected software users"],
  "GitHub Trends": ["Developers", "Security researchers", "AI builders"],
  "Developer Trends": ["Developers", "Platform teams", "Open-source maintainers"],
  "Human Rights": ["Affected communities", "Researchers", "Advocates", "Journalists"],
  "Politics & Policy": ["Residents", "Employers", "Institutions", "Regulated organisations"]
};

function inferIntent(brief: SignalBrief): ContentIntent {
  const haystack = [brief.title, brief.summary, ...(brief.tags || [])].join(" ").toLowerCase();

  if (brief.contentType === "repo") return "tool_profile";
  if (brief.providerType === "official_update_page" || brief.contentType === "official_notice" || keywordSets.official.some((token) => haystack.includes(token))) {
    return brief.category === "Politics & Policy" ? "policy_notice" : "official_update";
  }
  if (brief.category === "Cybersecurity" || keywordSets.advisory.some((token) => haystack.includes(token))) return "advisory";
  if (keywordSets.explainer.some((token) => haystack.includes(token))) return "explainer";
  if (keywordSets.multiSource.some((token) => haystack.includes(token))) return "multi_source";
  if (keywordSets.tool.some((token) => haystack.includes(token)) && ["Developer Trends", "GitHub Trends", "AI & Technology"].includes(brief.category)) {
    return "tool_profile";
  }

  return "general_news";
}

function inferPermissions(brief: SignalBrief): PermissionsPosture {
  if (brief.providerType === "directory_only") return "directory_only";
  if (brief.linkBehavior === "brief" || brief.providerType === "official_update_page" || brief.contentType === "repo") return "brief_metadata_only";
  return "clear_external";
}

function inferSourceLabel(brief: SignalBrief) {
  if (brief.providerType === "official_update_page") return "Official source";
  if (brief.providerType === "community_trend") return "Community trend";
  if (brief.providerType === "directory_only") return "Directory source";
  if (brief.contentIntent === "multi_source") return "Multiple sources";
  return "Publisher source";
}

function inferLinkBehavior(brief: SignalBrief, intent: ContentIntent) {
  if (!brief.isLive || !isRealExternalUrl(brief.originalUrl)) return "brief" as const;
  if (briefFirstCategories.has(brief.category)) return "brief" as const;
  if (["official_update", "policy_notice", "advisory", "explainer", "multi_source", "tool_profile"].includes(intent)) return "brief" as const;
  return "source" as const;
}

export function applyContentRules(brief: SignalBrief): SignalBrief {
  const contentIntent = brief.contentIntent || inferIntent(brief);
  const linkBehavior = inferLinkBehavior(brief, contentIntent);
  const permissionsPosture = inferPermissions({ ...brief, linkBehavior, contentIntent });
  const summary = brief.summary?.trim() || "Source metadata is limited for this item. Read the original source for the full publisher context.";
  const whyItMatters = linkBehavior === "brief" ? (brief.whyItMatters || matterByCategory[brief.category]) : brief.whyItMatters;
  const whoIsAffected = linkBehavior === "brief" ? (brief.whoIsAffected?.length ? brief.whoIsAffected : audienceByCategory[brief.category]) : brief.whoIsAffected;

  return {
    ...brief,
    summary,
    whyItMatters,
    whoIsAffected,
    contentIntent,
    linkBehavior,
    sourceLabel: brief.sourceLabel || inferSourceLabel({ ...brief, contentIntent }),
    permissionsPosture,
    trustScore: undefined,
    disclaimerRequired: linkBehavior === "brief" ? brief.disclaimerRequired : false
  };
}
