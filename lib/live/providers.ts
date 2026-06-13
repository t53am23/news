import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { applyContentRules } from "@/lib/content-rules";
import type { SourceOperationalStatus, SignalBrief } from "@/lib/types";
import { parseFeed } from "@/lib/live/rss";
import type { ProviderId, SectionRule } from "@/lib/live/rules";

export type LiveQuery = {
  q?: string;
  keywords?: string[];
  category?: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  source?: string;
  page?: number;
  pageSize?: number;
  officialOnly?: boolean;
};

export type ProviderRunResult = {
  providerId: ProviderId;
  status: SourceOperationalStatus;
  items: SignalBrief[];
  error?: string;
};

type ProviderConfig = {
  id: ProviderId;
  label: string;
  envVar?: string;
  publicWithoutKey?: boolean;
};

type FeedSource = {
  id: string;
  url: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  provider: string;
  providerType?: SignalBrief["providerType"];
  contentType?: SignalBrief["contentType"];
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  tags: string[];
};

const providerConfigs: Record<ProviderId, ProviderConfig> = {
  newsdata: { id: "newsdata", label: "NewsData.io", envVar: "NEWSDATA_API_KEY" },
  gnews: { id: "gnews", label: "GNews", envVar: "GNEWS_API_KEY" },
  newsapi: { id: "newsapi", label: "NewsAPI.org", envVar: "NEWSAPI_API_KEY" },
  eventregistry: { id: "eventregistry", label: "Event Registry", envVar: "EVENTREGISTRY_API_KEY" },
  guardian: { id: "guardian", label: "Guardian Open Platform", envVar: "GUARDIAN_API_KEY" },
  githubSearch: { id: "githubSearch", label: "GitHub REST API", envVar: "GITHUB_TOKEN", publicWithoutKey: true },
  githubTrending: { id: "githubTrending", label: "GitHub Trending", envVar: "GITHUB_TOKEN", publicWithoutKey: true },
  rssSources: { id: "rssSources", label: "Public RSS Sources", publicWithoutKey: true },
  officialFeeds: { id: "officialFeeds", label: "Official Feeds", publicWithoutKey: true },
  cyberFeeds: { id: "cyberFeeds", label: "Cybersecurity Feeds", publicWithoutKey: true },
  mediastack: { id: "mediastack", label: "Mediastack", envVar: "MEDIASTACK_API_KEY" }
};

const publicRssFeeds: FeedSource[] = [
  {
    id: "bbc-world",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    sourceName: "BBC",
    sourceUrl: "https://www.bbc.com/news/world",
    category: "World",
    provider: "bbc-rss",
    region: "Global",
    language: "en",
    tags: ["world", "bbc", "breaking"]
  },
  {
    id: "bbc-business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    sourceName: "BBC",
    sourceUrl: "https://www.bbc.com/news/business",
    category: "Startups & Business",
    provider: "bbc-rss",
    region: "Global",
    language: "en",
    tags: ["business", "markets", "economy"]
  },
  {
    id: "bbc-tech",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    sourceName: "BBC",
    sourceUrl: "https://www.bbc.com/news/technology",
    category: "AI & Technology",
    provider: "bbc-rss",
    region: "Global",
    language: "en",
    tags: ["technology", "ai", "software"]
  },
  {
    id: "bbc-uk",
    url: "https://feeds.bbci.co.uk/news/uk/rss.xml",
    sourceName: "BBC",
    sourceUrl: "https://www.bbc.com/news/uk",
    category: "Local",
    provider: "bbc-rss",
    country: "UK",
    region: "UK",
    language: "en",
    tags: ["uk", "local", "community"]
  },
  {
    id: "aljazeera-all",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    sourceName: "Al Jazeera",
    sourceUrl: "https://www.aljazeera.com/",
    category: "World",
    provider: "al-jazeera-rss",
    region: "Middle East",
    language: "en",
    tags: ["world", "middle east", "policy"]
  }
];

const officialFeeds: FeedSource[] = [
  {
    id: "govuk-home-office",
    url: "https://www.gov.uk/search/news-and-communications.atom?keywords=visa&organisations%5B%5D=home-office",
    sourceName: "GOV.UK Home Office",
    sourceUrl: "https://www.gov.uk/government/organisations/home-office",
    category: "Visa & Immigration",
    provider: "govuk-home-office",
    providerType: "official_update_page",
    contentType: "official_notice",
    country: "UK",
    region: "UK",
    language: "en",
    tags: ["uk", "home office", "visa", "immigration"]
  },
  {
    id: "govuk-students",
    url: "https://www.gov.uk/search/news-and-communications.atom?keywords=student%20visa",
    sourceName: "GOV.UK",
    sourceUrl: "https://www.gov.uk/student-visa",
    category: "Students",
    provider: "govuk-student-visa",
    providerType: "official_update_page",
    contentType: "visa_update",
    country: "UK",
    region: "UK",
    language: "en",
    tags: ["uk", "students", "student visa", "study abroad"]
  },
  {
    id: "ircc-newsroom",
    url: "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Immigration,%20Refugees%20and%20Citizenship%20Canada",
    sourceName: "IRCC Canada",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html",
    category: "Visa & Immigration",
    provider: "ircc-rss",
    providerType: "official_update_page",
    contentType: "official_notice",
    country: "Canada",
    region: "Canada",
    language: "en",
    tags: ["canada", "ircc", "immigration", "students"]
  }
];

const cyberFeeds: FeedSource[] = [
  {
    id: "cisa-advisories",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
    sourceName: "CISA",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories",
    category: "Cybersecurity",
    provider: "cisa-rss",
    providerType: "official_update_page",
    contentType: "official_notice",
    country: "USA",
    region: "Global",
    language: "en",
    tags: ["cisa", "cybersecurity", "advisory", "vulnerability"]
  },
  {
    id: "bleepingcomputer",
    url: "https://www.bleepingcomputer.com/feed/",
    sourceName: "BleepingComputer",
    sourceUrl: "https://www.bleepingcomputer.com/",
    category: "Cybersecurity",
    provider: "bleepingcomputer-rss",
    language: "en",
    tags: ["cybersecurity", "incident", "security", "ransomware"]
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleFingerprint(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeCountryCode(country?: string) {
  const map: Record<string, string> = {
    uk: "gb",
    "united kingdom": "gb",
    usa: "us",
    "united states": "us",
    canada: "ca",
    australia: "au",
    germany: "de",
    india: "in",
    china: "cn",
    malaysia: "my",
    singapore: "sg",
    nigeria: "ng",
    iran: "ir"
  };

  if (!country) return "";
  return map[country.toLowerCase()] || "";
}

function normalizeLanguage(language?: string) {
  const map: Record<string, string> = {
    english: "en",
    en: "en",
    french: "fr",
    fr: "fr",
    german: "de",
    de: "de"
  };

  if (!language) return "en";
  return map[language.toLowerCase()] || "en";
}

function getQueryText(query: LiveQuery, rule?: SectionRule) {
  const parts = [
    query.q,
    query.city,
    query.region,
    query.country,
    ...(query.keywords || rule?.keywords || [])
  ].filter(Boolean);

  return Array.from(new Set(parts)).join(" ").trim();
}

function buildFingerprint(item: SignalBrief) {
  const url = item.originalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `${url}|${item.sourceName}|${titleFingerprint(item.title)}`;
}

export function dedupeItems(items: SignalBrief[]) {
  const seen = new Set<string>();
  const output: SignalBrief[] = [];

  for (const item of items) {
    const fingerprint = buildFingerprint(item);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    output.push(item);
  }

  return output;
}

export function filterRelevantItems(items: SignalBrief[], query: LiveQuery, rule?: SectionRule) {
  const ignoredTokens = new Set(["news", "latest", "update", "updates", "today", "watch", "this", "week", "briefing"]);
  const queryText = [query.q, query.city, query.region, query.country].filter(Boolean).join(" ").toLowerCase();
  const queryTokens = queryText.split(/\s+/).filter((token) => token.length > 2 && !ignoredTokens.has(token));
  const categorySet = rule && rule.id !== "search" ? new Set(rule.fallbackCategories.map((category) => category.toLowerCase())) : null;
  const ruleKeywords = (rule?.keywords || []).map((keyword) => keyword.toLowerCase());
  const country = query.country?.toLowerCase();
  const region = query.region?.toLowerCase();
  const city = query.city?.toLowerCase();
  const source = query.source?.toLowerCase();
  const language = normalizeLanguage(query.language);

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.summary,
      item.category,
      item.sourceName,
      ...(item.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    const sourceMatches = !source || item.sourceName.toLowerCase().includes(source);
    const languageMatches = !query.language || !item.language || item.language.toLowerCase().startsWith(language);
      const countryMatches =
        !country ||
        item.country?.toLowerCase() === country ||
        item.region?.toLowerCase() === country ||
        haystack.includes(country);
      const regionMatches = !region || item.region?.toLowerCase() === region || haystack.includes(region);
      const cityMatches = !city || item.city?.toLowerCase() === city || haystack.includes(city);
      const tokenMatches = !queryTokens.length || queryTokens.some((token) => haystack.includes(token));
      const categoryMatches =
        !categorySet ||
        categorySet.has(item.category.toLowerCase()) ||
        (item.subcategory ? categorySet.has(item.subcategory.toLowerCase()) : false);
      const ruleKeywordMatches = !ruleKeywords.length || ruleKeywords.some((keyword) => haystack.includes(keyword));
      const sectionMatches = query.q ? true : !rule || rule.id === "search" ? true : categoryMatches || ruleKeywordMatches;

      return sourceMatches && languageMatches && countryMatches && regionMatches && cityMatches && tokenMatches && sectionMatches;
    });
  }

export function rankItems(items: SignalBrief[], query: LiveQuery, rule?: SectionRule) {
  const queryText = getQueryText(query, rule).toLowerCase();
  const keywords = Array.from(new Set([...(rule?.keywords || []), ...(query.keywords || [])])).map((value) => value.toLowerCase());
  const now = Date.now();

  return [...items].sort((left, right) => {
    const leftScore = getScore(left);
    const rightScore = getScore(right);
    return rightScore - leftScore;
  });

  function getScore(item: SignalBrief) {
    let score = 0;
    const title = item.title.toLowerCase();
    const summary = item.summary.toLowerCase();
    const ageHours = Math.max(1, (now - new Date(item.publishedAt).getTime()) / 36e5);

    score += 120 / ageHours;
    score += item.imageUrl ? 12 : 0;
    score += item.providerType === "official_update_page" ? 20 : 0;
    score += item.contentType === "repo" ? 8 : 0;
    score += item.trustScore || 0;
    score += item.country && query.country && item.country.toLowerCase() === query.country.toLowerCase() ? 16 : 0;
    score += item.region && query.region && item.region.toLowerCase() === query.region.toLowerCase() ? 10 : 0;
    score += item.city && query.city && item.city.toLowerCase() === query.city.toLowerCase() ? 8 : 0;
    score += item.sourceName && query.source && item.sourceName.toLowerCase().includes(query.source.toLowerCase()) ? 12 : 0;
    score += title.includes(queryText) || summary.includes(queryText) ? 14 : 0;

    for (const keyword of keywords) {
      if (title.includes(keyword)) score += 8;
      if (summary.includes(keyword)) score += 4;
      if ((item.tags || []).some((tag) => tag.toLowerCase().includes(keyword))) score += 6;
    }

    return score;
  }
}

export function extractTrendingTopics(items: SignalBrief[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const tag of item.tags || []) {
      const key = tag.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([tag]) => tag);
}

export function getProviderStatus(providerId: ProviderId): SourceOperationalStatus {
  const config = providerConfigs[providerId];
  if (!config) return "inactive";
  if (!config.envVar) return "active";
  if (process.env[config.envVar]) return "active";
  return config.publicWithoutKey ? "available_no_key" : "skipped_missing_key";
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {})
    },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/xml,text/xml,text/html" },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.text();
}

function normalizeProviderItem(item: Partial<SignalBrief> & Pick<SignalBrief, "title" | "summary" | "sourceName" | "sourceUrl" | "originalUrl" | "publishedAt" | "category" | "tags" | "contentType" | "providerType">) {
  const id = createHash("sha1")
    .update(`${item.sourceName}|${item.originalUrl}|${item.title}`)
    .digest("hex")
    .slice(0, 16);

  return applyContentRules({
    id,
    title: item.title,
    summary: item.summary || "Open the original source for the full publisher context.",
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    sourceLogo: item.sourceLogo,
    category: item.category,
    subcategory: item.subcategory,
    region: item.region,
    country: item.country,
    city: item.city,
    publishedAt: new Date(item.publishedAt).toISOString(),
    imageUrl: item.imageUrl,
    originalUrl: item.originalUrl,
    author: item.author,
    readTime: item.readTime || "3 min",
    trustScore: item.trustScore,
    tags: item.tags,
    provider: item.provider || item.sourceName,
    language: item.language,
    isLive: true,
    isFallback: false,
    linkBehavior: "source" as const,
    contentType: item.contentType,
    providerType: item.providerType,
    sensitivityLevel: item.sensitivityLevel,
    disclaimerRequired: item.disclaimerRequired,
    fetchedAt: new Date().toISOString()
  } satisfies SignalBrief);
}

async function fetchFeeds(feeds: FeedSource[]) {
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const xml = await fetchText(feed.url);
      return parseFeed(xml, {
        sourceName: feed.sourceName,
        sourceUrl: feed.sourceUrl,
        category: feed.category,
        provider: feed.provider,
        providerType: feed.providerType,
        contentType: feed.contentType,
        country: feed.country,
        region: feed.region,
        city: feed.city,
        language: feed.language,
        tags: feed.tags
      });
    })
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function fetchNewsData(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) return { providerId: "newsdata", status: "skipped_missing_key", items: [] };

  const searchParams = new URLSearchParams({
    apikey: apiKey,
    language: normalizeLanguage(query.language || rule?.language),
    q: getQueryText(query, rule) || rule?.title || "news",
    size: String(Math.min(query.pageSize || 18, 25))
  });

  const countryCode = normalizeCountryCode(query.country);
  if (countryCode) searchParams.set("country", countryCode);
  if (rule?.providerCategory) searchParams.set("category", mapNewsCategory(rule.providerCategory));

  try {
    const data = await fetchJson<{
      results?: Array<{
        title: string;
        description?: string;
        link: string;
        image_url?: string;
        pubDate: string;
        source_id?: string;
        source_url?: string;
        country?: string[];
        category?: string[];
        keywords?: string[];
        language?: string;
      }>;
    }>(`https://newsdata.io/api/1/latest?${searchParams.toString()}`);

    const items = (data.results || []).map((item) =>
      normalizeProviderItem({
        title: item.title,
        summary: item.description || "Source metadata is available from NewsData.io.",
        imageUrl: item.image_url,
        sourceName: item.source_id || "NewsData source",
        sourceUrl: item.source_url || item.link,
        originalUrl: item.link,
        publishedAt: item.pubDate,
        category: rule?.category || "World",
        tags: [...(item.category || []), ...(item.keywords || [])].slice(0, 8),
        provider: "newsdata",
        language: item.language,
        country: item.country?.[0],
        contentType: "article",
        providerType: "api"
      })
    );

    return { providerId: "newsdata", status: "active", items };
  } catch (error) {
    return { providerId: "newsdata", status: "active", items: [], error: String(error) };
  }
}

async function fetchGNews(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return { providerId: "gnews", status: "skipped_missing_key", items: [] };

  const params = new URLSearchParams({
    apikey: apiKey,
    lang: normalizeLanguage(query.language || rule?.language),
    max: String(Math.min(query.pageSize || 18, 20)),
    q: getQueryText(query, rule) || rule?.title || "news"
  });

  const countryCode = normalizeCountryCode(query.country);
  if (countryCode) params.set("country", countryCode);

  try {
    const data = await fetchJson<{
      articles?: Array<{
        title: string;
        description?: string;
        url: string;
        image?: string;
        publishedAt: string;
        content?: string;
        source?: { name?: string; url?: string };
      }>;
    }>(`https://gnews.io/api/v4/search?${params.toString()}`);

    const items = (data.articles || []).map((item) =>
      normalizeProviderItem({
        title: item.title,
        summary: item.description || item.content || "Source metadata is available from GNews.",
        imageUrl: item.image,
        sourceName: item.source?.name || "GNews source",
        sourceUrl: item.source?.url || item.url,
        originalUrl: item.url,
        publishedAt: item.publishedAt,
        category: rule?.category || "World",
        tags: rule?.tags || [],
        provider: "gnews",
        language: normalizeLanguage(query.language || rule?.language),
        country: query.country,
        contentType: "article",
        providerType: "api"
      })
    );

    return { providerId: "gnews", status: "active", items };
  } catch (error) {
    return { providerId: "gnews", status: "active", items: [], error: String(error) };
  }
}

async function fetchNewsApi(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const apiKey = process.env.NEWSAPI_API_KEY;
  if (!apiKey) return { providerId: "newsapi", status: "skipped_missing_key", items: [] };

  const params = new URLSearchParams({
    apiKey,
    q: getQueryText(query, rule) || rule?.title || "news",
    language: normalizeLanguage(query.language || rule?.language),
    sortBy: "publishedAt",
    pageSize: String(Math.min(query.pageSize || 18, 20)),
    page: String(query.page || 1)
  });

  try {
    const data = await fetchJson<{
      articles?: Array<{
        title: string;
        description?: string;
        url: string;
        urlToImage?: string;
        publishedAt: string;
        author?: string;
        source?: { name?: string; id?: string };
      }>;
    }>(`https://newsapi.org/v2/everything?${params.toString()}`);

    const items = (data.articles || []).map((item) =>
      normalizeProviderItem({
        title: item.title,
        summary: item.description || "Source metadata is available from NewsAPI.org.",
        imageUrl: item.urlToImage,
        sourceName: item.source?.name || item.source?.id || "NewsAPI source",
        sourceUrl: item.url,
        originalUrl: item.url,
        publishedAt: item.publishedAt,
        category: rule?.category || "World",
        tags: rule?.tags || [],
        provider: "newsapi",
        language: normalizeLanguage(query.language || rule?.language),
        country: query.country,
        author: item.author,
        contentType: "article",
        providerType: "api"
      })
    );

    return { providerId: "newsapi", status: "active", items };
  } catch (error) {
    return { providerId: "newsapi", status: "active", items: [], error: String(error) };
  }
}

async function fetchEventRegistry(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const apiKey = process.env.EVENTREGISTRY_API_KEY;
  if (!apiKey) return { providerId: "eventregistry", status: "skipped_missing_key", items: [] };

  const params = new URLSearchParams({
    action: "getArticles",
    resultType: "articles",
    keyword: getQueryText(query, rule) || rule?.title || "news",
    articlesPage: String(query.page || 1),
    articlesCount: String(Math.min(query.pageSize || 18, 20)),
    articlesSortBy: "date",
    articlesSortByAsc: "false",
    includeArticleImage: "true",
    includeArticleCategories: "true",
    includeArticleConcepts: "true",
    apiKey
  });

  try {
    const data = await fetchJson<{
      articles?: {
        results?: Array<{
          title: string;
          body?: string;
          url: string;
          image?: string;
          dateTime?: string;
          source?: { title?: string; uri?: string };
          concepts?: Array<{ label?: { eng?: string } }>;
          categories?: Array<{ label?: string }>;
          lang?: string;
        }>;
      };
    }>(`https://eventregistry.org/api/v1/article/getArticles?${params.toString()}`);

    const items = (data.articles?.results || []).map((item) =>
      normalizeProviderItem({
        title: item.title,
        summary: item.body || "Source metadata is available from Event Registry.",
        imageUrl: item.image,
        sourceName: item.source?.title || "Event Registry source",
        sourceUrl: item.source?.uri || item.url,
        originalUrl: item.url,
        publishedAt: item.dateTime || new Date().toISOString(),
        category: rule?.category || "World",
        tags: [
          ...(item.categories || []).map((category) => category.label || ""),
          ...(item.concepts || []).map((concept) => concept.label?.eng || "")
        ].filter(Boolean).slice(0, 8),
        provider: "eventregistry",
        language: item.lang,
        country: query.country,
        contentType: "article",
        providerType: "api"
      })
    );

    return { providerId: "eventregistry", status: "active", items };
  } catch (error) {
    return { providerId: "eventregistry", status: "active", items: [], error: String(error) };
  }
}

async function fetchGuardian(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) return { providerId: "guardian", status: "skipped_missing_key", items: [] };

  const params = new URLSearchParams({
    "api-key": apiKey,
    q: getQueryText(query, rule) || rule?.title || "news",
    "show-fields": "trailText,thumbnail,byline",
    "page-size": String(Math.min(query.pageSize || 18, 20)),
    page: String(query.page || 1),
    orderBy: "newest"
  });

  const section = mapGuardianSection(rule?.category || "");
  if (section) params.set("section", section);

  try {
    const data = await fetchJson<{
      response?: {
        results?: Array<{
          webTitle: string;
          webUrl: string;
          webPublicationDate: string;
          sectionName?: string;
          fields?: { trailText?: string; thumbnail?: string; byline?: string };
          tags?: Array<{ webTitle?: string }>;
        }>;
      };
    }>(`https://content.guardianapis.com/search?${params.toString()}`);

    const items = (data.response?.results || []).map((item) =>
      normalizeProviderItem({
        title: item.webTitle,
        summary: item.fields?.trailText || "Source metadata is available from The Guardian.",
        imageUrl: item.fields?.thumbnail,
        sourceName: "The Guardian",
        sourceUrl: "https://www.theguardian.com/",
        originalUrl: item.webUrl,
        publishedAt: item.webPublicationDate,
        category: mapGuardianCategory(item.sectionName || rule?.category || "World"),
        tags: (item.tags || []).map((tag) => tag.webTitle || "").filter(Boolean).slice(0, 8),
        provider: "guardian",
        language: "en",
        country: query.country,
        author: item.fields?.byline,
        contentType: "article",
        providerType: "api"
      })
    );

    return { providerId: "guardian", status: "active", items };
  } catch (error) {
    return { providerId: "guardian", status: "active", items: [], error: String(error) };
  }
}

function buildGitHubHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "choyis-news"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function summarizeRepo(name: string, description: string, language?: string) {
  if (description) return description;
  if (language) return `${name} is an open-source ${language} project that is trending in the developer community.`;
  return `${name} is an open-source tool that is getting fresh developer attention.`;
}

function repoWhyItMatters(stars: number) {
  if (stars > 10000) return "This repository already has broad developer validation and is influencing where the category is moving.";
  if (stars > 1000) return "This project is gaining meaningful traction and is worth tracking if the category affects your workflow.";
  return "This project is still emerging, which can make it useful for spotting where developer attention is moving early.";
}

function repoAudience(language?: string) {
  if (language === "TypeScript" || language === "JavaScript") return ["Frontend teams", "Full-stack developers", "Tool builders"];
  if (language === "Python") return ["AI teams", "Data scientists", "Automation developers"];
  return ["Developers", "Technical teams", "Open-source watchers"];
}

async function fetchGitHubRepoDetails(owner: string, repo: string) {
  const data = await fetchJson<{
    description?: string;
    stargazers_count?: number;
    language?: string;
    html_url: string;
    homepage?: string;
    topics?: string[];
    created_at?: string;
    updated_at?: string;
    pushed_at?: string;
  }>(`https://api.github.com/repos/${owner}/${repo}`, { headers: buildGitHubHeaders() });

  return data;
}

async function tryFetchReadme(owner: string, repo: string) {
  try {
    const data = await fetchJson<{ content?: string }>(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        ...buildGitHubHeaders(),
        Accept: "application/vnd.github.raw+json"
      }
    });

    if (!data.content) return "";
    const decoded = Buffer.from(data.content, "base64").toString("utf8");
    return decoded.replace(/[#>*`]/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
  } catch {
    return "";
  }
}

async function fetchGitHubSearch(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const status = getProviderStatus("githubSearch");
  const keyword = getQueryText(query, rule) || "AI tools";
  const q = `${keyword} stars:>20 archived:false`;

  try {
    const data = await fetchJson<{
      items?: Array<{
        full_name: string;
        description?: string;
        html_url: string;
        stargazers_count: number;
        language?: string;
        created_at: string;
        updated_at: string;
        topics?: string[];
        owner?: { login?: string };
        name: string;
      }>;
    }>(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=${Math.min(query.pageSize || 18, 12)}`,
      { headers: buildGitHubHeaders() }
    );

    const items = await Promise.all(
      (data.items || []).map(async (repo) => {
        const readme = !repo.description && repo.owner?.login ? await tryFetchReadme(repo.owner.login, repo.name) : "";
        const summary = summarizeRepo(repo.full_name, repo.description || readme, repo.language);

        return normalizeProviderItem({
          title: repo.full_name,
          summary,
          sourceName: "GitHub",
          sourceUrl: "https://github.com/",
          originalUrl: repo.html_url,
          publishedAt: repo.updated_at || repo.created_at,
          category: rule?.category || "GitHub Trends",
          subcategory: repo.language || "Repository",
          tags: [...(repo.topics || []), repo.language || "open-source"].filter(Boolean).slice(0, 8),
          provider: "github-search",
          language: "en",
          whyItMatters: repoWhyItMatters(repo.stargazers_count),
          whoIsAffected: repoAudience(repo.language),
          readTime: "Repo",
          trustScore: 88,
          contentType: "repo",
          providerType: "api"
        });
      })
    );

    return { providerId: "githubSearch", status, items };
  } catch (error) {
    return { providerId: "githubSearch", status, items: [], error: String(error) };
  }
}

async function fetchGitHubTrending(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const status = getProviderStatus("githubTrending");

  try {
    const html = await fetchText("https://github.com/trending?since=weekly");
    const articles = [...html.matchAll(/<article[\s\S]*?<\/article>/gi)].slice(0, Math.min(query.pageSize || 18, 10));

    const items = await Promise.all(
      articles.map(async (match) => {
        const block = match[0];
        const repoMatch = block.match(/href="\/([^"\/]+\/[^"\/]+)"/i);
        if (!repoMatch?.[1]) return null;

        const [owner, repo] = repoMatch[1].split("/");
        const details = await fetchGitHubRepoDetails(owner, repo);
        const textDescription = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
        const readme = !details.description ? await tryFetchReadme(owner, repo) : "";
        const summary = summarizeRepo(repoMatch[1], details.description || textDescription || readme, details.language);

        return normalizeProviderItem({
          title: repoMatch[1],
          summary,
          sourceName: "GitHub Trending",
          sourceUrl: "https://github.com/trending",
          originalUrl: details.html_url,
          publishedAt: details.updated_at || details.created_at || new Date().toISOString(),
          category: rule?.category || "GitHub Trends",
          subcategory: details.language || "Repository",
          tags: [...(details.topics || []), details.language || "open-source"].filter(Boolean).slice(0, 8),
          provider: "github-trending",
          language: "en",
          whyItMatters: repoWhyItMatters(details.stargazers_count || 0),
          whoIsAffected: repoAudience(details.language),
          readTime: `${details.stargazers_count || 0} stars`,
          trustScore: 90,
          contentType: "repo",
          providerType: "api"
        });
      })
    );

    return { providerId: "githubTrending", status, items: items.filter(Boolean) as SignalBrief[] };
  } catch (error) {
    return { providerId: "githubTrending", status, items: [], error: String(error) };
  }
}

async function fetchMediastack(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  const apiKey = process.env.MEDIASTACK_API_KEY;
  if (!apiKey) return { providerId: "mediastack", status: "skipped_missing_key", items: [] };

  const params = new URLSearchParams({
    access_key: apiKey,
    keywords: getQueryText(query, rule) || rule?.title || "news",
    languages: normalizeLanguage(query.language || rule?.language),
    limit: String(Math.min(query.pageSize || 18, 20)),
    sort: "published_desc"
  });

  const countryCode = normalizeCountryCode(query.country);
  if (countryCode) params.set("countries", countryCode);

  try {
    const data = await fetchJson<{
      data?: Array<{
        title: string;
        description?: string;
        url: string;
        image?: string;
        published_at: string;
        source?: string;
        country?: string;
        category?: string;
        language?: string;
      }>;
    }>(`http://api.mediastack.com/v1/news?${params.toString()}`);

    const items = (data.data || []).map((item) =>
      normalizeProviderItem({
        title: item.title,
        summary: item.description || "Source metadata is available from Mediastack.",
        imageUrl: item.image,
        sourceName: item.source || "Mediastack source",
        sourceUrl: item.url,
        originalUrl: item.url,
        publishedAt: item.published_at,
        category: rule?.category || item.category || "World",
        tags: [item.category || "", item.country || ""].filter(Boolean),
        provider: "mediastack",
        language: item.language,
        country: item.country,
        contentType: "article",
        providerType: "api"
      })
    );

    return { providerId: "mediastack", status: "active", items };
  } catch (error) {
    return { providerId: "mediastack", status: "active", items: [], error: String(error) };
  }
}

async function fetchRssSources(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  try {
    const feedItems = await fetchFeeds(publicRssFeeds);
    return { providerId: "rssSources", status: "active", items: filterRelevantItems(feedItems, query, rule) };
  } catch (error) {
    return { providerId: "rssSources", status: "active", items: [], error: String(error) };
  }
}

async function fetchOfficialFeeds(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  try {
    const feedItems = await fetchFeeds(officialFeeds);
    return { providerId: "officialFeeds", status: "active", items: filterRelevantItems(feedItems, query, rule) };
  } catch (error) {
    return { providerId: "officialFeeds", status: "active", items: [], error: String(error) };
  }
}

async function fetchCyberFeeds(query: LiveQuery, rule?: SectionRule): Promise<ProviderRunResult> {
  try {
    const feedItems = await fetchFeeds(cyberFeeds);
    return { providerId: "cyberFeeds", status: "active", items: filterRelevantItems(feedItems, query, rule) };
  } catch (error) {
    return { providerId: "cyberFeeds", status: "active", items: [], error: String(error) };
  }
}

function mapNewsCategory(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("world")) return "world";
  if (normalized.includes("technology") || normalized.includes("ai")) return "technology";
  if (normalized.includes("business") || normalized.includes("sponsorship")) return "business";
  if (normalized.includes("science")) return "science";
  if (normalized.includes("health")) return "health";
  if (normalized.includes("politics")) return "politics";
  return "top";
}

function mapGuardianSection(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("world")) return "world";
  if (normalized.includes("politics")) return "politics";
  if (normalized.includes("technology") || normalized.includes("ai")) return "technology";
  if (normalized.includes("business")) return "business";
  if (normalized.includes("students")) return "education";
  return "";
}

function mapGuardianCategory(value: string) {
  if (!value) return "World";
  const normalized = value.toLowerCase();
  if (normalized.includes("technology")) return "AI & Technology";
  if (normalized.includes("business")) return "Startups & Business";
  if (normalized.includes("education")) return "Students";
  if (normalized.includes("politics")) return "Politics & Policy";
  return "World";
}

export async function runProviders(providerIds: ProviderId[], query: LiveQuery, rule?: SectionRule) {
  const tasks = providerIds.map(async (providerId) => {
    switch (providerId) {
      case "newsdata":
        return fetchNewsData(query, rule);
      case "gnews":
        return fetchGNews(query, rule);
      case "newsapi":
        return fetchNewsApi(query, rule);
      case "eventregistry":
        return fetchEventRegistry(query, rule);
      case "guardian":
        return fetchGuardian(query, rule);
      case "githubSearch":
        return fetchGitHubSearch(query, rule);
      case "githubTrending":
        return fetchGitHubTrending(query, rule);
      case "rssSources":
        return fetchRssSources(query, rule);
      case "officialFeeds":
        return fetchOfficialFeeds(query, rule);
      case "cyberFeeds":
        return fetchCyberFeeds(query, rule);
      case "mediastack":
        return fetchMediastack(query, rule);
      default:
        return { providerId, status: "inactive" as const, items: [] };
    }
  });

  return Promise.all(tasks);
}

export function getConfiguredProviderStatuses() {
  return Object.values(providerConfigs).map((provider) => ({
    id: provider.id,
    label: provider.label,
    status: getProviderStatus(provider.id)
  }));
}
