import { unstable_cache } from "next/cache";
import { briefs } from "@/lib/mock-data";
import { coreSections } from "@/lib/navigation";
import { sourceRegistry } from "@/lib/source-registry";
import type { SignalBrief, SourceOperationalStatus, SourceRegistryEntry } from "@/lib/types";
import { dedupeItems, extractTrendingTopics, filterRelevantItems, getConfiguredProviderStatuses, rankItems, runProviders, type LiveQuery, type ProviderRunResult } from "@/lib/live/providers";
import { buildLocalCountryRule, buildVisaCountryRule, getSectionRule, homeSectionOrder, sectionRules, type ProviderId, type SectionRule } from "@/lib/live/rules";

export type FeedResponse = {
  items: SignalBrief[];
  hasMore: boolean;
  total: number;
  usedFallback: boolean;
  statuses: ProviderRunResult[];
};

export type HomePageData = {
  featured: SignalBrief[];
  topUpdates: SignalBrief[];
  moreNews: SignalBrief[];
  lowerSections: Array<{ title: string; href: string; items: SignalBrief[] }>;
  topics: Array<{ title: string; href: string; items: SignalBrief[] }>;
  trendingTopics: string[];
  statuses: ProviderRunResult[];
  showNewsletter: boolean;
};

type SectionRequest = LiveQuery & {
  page?: number;
  pageSize?: number;
  limit?: number;
};

function getFallbackItems(rule: SectionRule, query: LiveQuery, limit: number) {
  const ignoredTokens = new Set(["news", "latest", "update", "updates", "today", "watch", "this", "week", "briefing"]);
  const queryTokens = [query.q, query.country, query.region, query.city]
    .filter(Boolean)
    .flatMap((value) => value!.toLowerCase().split(/\s+/))
    .filter((token) => token.length > 2 && !ignoredTokens.has(token));

  return briefs
    .filter((item) => rule.fallbackCategories.includes(item.category) || (item.subcategory && rule.fallbackCategories.includes(item.subcategory)))
    .filter((item) => {
      if (!queryTokens.length) return true;
      const haystack = [item.title, item.summary, item.category, item.country || "", item.region || "", ...(item.tags || [])].join(" ").toLowerCase();
      return queryTokens.every((token) => haystack.includes(token));
    })
    .slice(0, limit)
    .map((item) => ({
      ...item,
      isLive: false,
      isFallback: true,
      linkBehavior: "brief" as const
    }));
}

function mapSectionHref(sectionId: string) {
  return sectionId.startsWith("local-")
    ? `/local/${sectionId.replace(/^local-/, "")}`
    : sectionId.startsWith("visa-")
      ? `/visa/${sectionId.replace(/^visa-/, "")}`
      : `/${sectionId}`;
}

async function getSectionFeedUncached(rule: SectionRule, request: SectionRequest = {}): Promise<FeedResponse> {
  const pageSize = request.pageSize || rule.pageSize || 18;
  const page = Math.max(1, request.page || 1);
  const fetchCount = Math.min((request.limit || pageSize) * page, 54);
  const query: LiveQuery = {
    ...request,
    page,
    pageSize: fetchCount,
    keywords: request.keywords || rule.keywords,
    category: request.category || rule.category
  };

  const statuses = await runProviders(rule.providers, query, rule);
  const liveItems = rankItems(
    dedupeItems(
      filterRelevantItems(
        statuses.flatMap((result) => result.items),
        query,
        rule
      )
    ),
    query,
    rule
  );

  if (!liveItems.length) {
    const fallbackPool = getFallbackItems(rule, query, 54);
    const fallbackItems = fallbackPool.slice(0, page * pageSize);
    return {
      items: fallbackItems,
      hasMore: fallbackPool.length > fallbackItems.length,
      total: fallbackPool.length,
      usedFallback: true,
      statuses
    };
  }

  const visibleItems = liveItems.slice(0, page * pageSize);
  return {
    items: visibleItems,
    hasMore: liveItems.length > visibleItems.length,
    total: liveItems.length,
    usedFallback: false,
    statuses
  };
}

const getCachedSectionFeed = unstable_cache(
  async (sectionId: string, requestKey: string) => {
    const parsedRequest = JSON.parse(requestKey) as SectionRequest;
    const rule = getSectionRule(sectionId);
    if (!rule) throw new Error(`Unknown section rule: ${sectionId}`);
    return getSectionFeedUncached(rule, parsedRequest);
  },
  ["choyis-live-section-feed-v3"],
  { revalidate: 300 }
);

export async function getSectionFeed(sectionId: string, request: SectionRequest = {}) {
  return getCachedSectionFeed(sectionId, JSON.stringify(request));
}

export async function getLocalCountryFeed(country: string, request: SectionRequest = {}) {
  const rule = buildLocalCountryRule(country, request.region, request.city);
  return getSectionFeedUncached(rule, request);
}

export async function getVisaCountryFeed(country: string, request: SectionRequest = {}) {
  const rule = buildVisaCountryRule(country);
  return getSectionFeedUncached(rule, request);
}

export async function searchFeed(request: SectionRequest) {
  const queryText = (request.q || "").toLowerCase();
  const mentionsGitHub = /github|repo|repository|open source|developer|code|library|framework/.test(queryText);
  const mentionsAiOrTech = /ai|technology|tech|software|developer tools?|coding/.test(queryText);
  const mentionsCyber = /cyber|security|advisory|vulnerability|cve|ransomware|breach/.test(queryText);
  const mentionsOfficial = /visa|immigration|home office|uscis|ircc|student visa|work permit|sponsorship|policy|government|official/.test(queryText);

  const providers: ProviderId[] = mentionsGitHub
    ? ["githubTrending", "githubSearch"]
    : [
        ...(mentionsOfficial ? (["officialFeeds"] as ProviderId[]) : []),
        ...(mentionsCyber ? (["cyberFeeds"] as ProviderId[]) : []),
        "rssSources",
        "guardian",
        "newsdata",
        "gnews",
        "newsapi",
        "eventregistry",
        "mediastack",
        ...((mentionsAiOrTech || mentionsCyber) ? (["githubSearch", "githubTrending"] as ProviderId[]) : [])
      ];

  const searchRule: SectionRule = {
    id: "search",
    title: "Search",
    category: request.category || "Search",
    providers: Array.from(new Set(providers)),
    keywords: [request.q || "news"],
    tags: ["search"],
    pageSize: 18,
    fallbackCategories: coreSections.map((section) => section.category)
  };

  return getSectionFeedUncached(searchRule, request);
}

const getCachedHomePageData = unstable_cache(
  async () => {
    const [featured, topUpdates, moreNews, topicsFeed, ...lowerSectionResults] = await Promise.all([
      getSectionFeedUncached(sectionRules.homeFeatured, { limit: 4, pageSize: 4 }),
      getSectionFeedUncached(sectionRules.homeTopUpdates, { limit: 6, pageSize: 6 }),
      getSectionFeedUncached(sectionRules.homeMoreNews, { limit: 10, pageSize: 10 }),
      getSectionFeedUncached(sectionRules.homeTopics, { limit: 12, pageSize: 12 }),
      ...homeSectionOrder.map((sectionId) => {
        const rule = getSectionRule(sectionId);
        return rule ? getSectionFeedUncached(rule, { limit: 3, pageSize: 3 }) : Promise.resolve({ items: [], hasMore: false, total: 0, usedFallback: true, statuses: [] });
      })
    ]);

    const allStatuses = [
      ...featured.statuses,
      ...topUpdates.statuses,
      ...moreNews.statuses,
      ...topicsFeed.statuses,
      ...lowerSectionResults.flatMap((result) => result.statuses)
    ];

    const lowerSections = homeSectionOrder
      .map((sectionId, index) => {
        const rule = getSectionRule(sectionId);
        const result = lowerSectionResults[index];
        if (!rule || !result.items.length) return null;

        return {
          title: rule.title,
          href: `/${sectionId}`,
          items: result.items.slice(0, 3)
        };
      })
      .filter(Boolean) as Array<{ title: string; href: string; items: SignalBrief[] }>;

    const topicItems = topicsFeed.items;
    const topics = [
      {
        title: "United Kingdom",
        href: "/local/uk",
        items: topicItems.filter((item) => item.country === "UK" || item.region === "UK").slice(0, 2)
      },
      {
        title: "World",
        href: "/world-news",
        items: topicItems.filter((item) => item.category === "World").slice(0, 2)
      },
      {
        title: "Business",
        href: "/startups-business",
        items: topicItems.filter((item) => item.category === "Startups & Business").slice(0, 2)
      },
      {
        title: "Tech",
        href: "/ai-technology",
        items: topicItems.filter((item) => ["AI & Technology", "GitHub Trends", "Developer Trends"].includes(item.category)).slice(0, 2)
      }
    ].filter((topic) => topic.items.length);

    const trendingTopics = extractTrendingTopics([
      ...featured.items,
      ...topUpdates.items,
      ...moreNews.items,
      ...topicItems
    ]);

    return {
      featured: featured.items.slice(0, 4),
      topUpdates: topUpdates.items.slice(0, 4),
      moreNews: moreNews.items.slice(0, 10),
      lowerSections,
      topics,
      trendingTopics,
      statuses: allStatuses,
      showNewsletter: true
    } satisfies HomePageData;
  },
  ["choyis-home-page-data-v3"],
  { revalidate: 300 }
);

export async function getHomePageData() {
  return getCachedHomePageData();
}

export function getProviderStatusEntries() {
  return getConfiguredProviderStatuses();
}

export function getSourceDirectoryEntriesWithStatus() {
  const providerStatuses = new Map(getConfiguredProviderStatuses().map((status) => [status.id, status.status]));

  return sourceRegistry.map((source) => {
    const status = resolveSourceStatus(source, providerStatuses);
    return {
      ...source,
      status
    };
  });
}

function resolveSourceStatus(source: SourceRegistryEntry, providerStatuses: Map<string, SourceOperationalStatus>) {
  if (source.sourceType === "directory_only") return "fallback_only" as const;
  if (source.mode === "directory_only") return "fallback_only" as const;
  if (source.providerId && providerStatuses.has(source.providerId)) return providerStatuses.get(source.providerId) || "inactive";
  if (source.mode === "rss" || source.mode === "official_update_page") return "active" as const;
  if (source.requiredEnvVar && !process.env[source.requiredEnvVar]) return "skipped_missing_key" as const;
  return "inactive" as const;
}

export function getBriefFallbackById(id: string) {
  return briefs.find((brief) => brief.id === id);
}

export function getRelatedFallbackBriefs(current: SignalBrief, limit = 3) {
  return briefs
    .filter((brief) => brief.id !== current.id)
    .filter((brief) => brief.category === current.category || brief.tags.some((tag) => current.tags.includes(tag)))
    .slice(0, limit)
    .map((item) => ({
      ...item,
      isLive: false,
      isFallback: true,
      linkBehavior: "brief" as const
    }));
}
