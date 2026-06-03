import type { EdgeSource, UnifiedContent } from "./types.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...init.headers
    }
  });
}

export function stableId(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (Math.imul(31, hash) + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function decodeXml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function readTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(stripHtml(match?.[1] ?? ""));
}

export function normalizeRss(xml: string, source: EdgeSource): UnifiedContent[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, 20).map((item) => {
    const title = readTag(item, "title");
    const originalUrl = readTag(item, "link");
    const summary = readTag(item, "description");
    const publishedAt = readTag(item, "pubDate");
    const media = item.match(/media:thumbnail[^>]+url="([^"]+)"/i)?.[1] ?? item.match(/media:content[^>]+url="([^"]+)"/i)?.[1];

    return {
      id: stableId(`${source.id}:${originalUrl || title}`),
      title,
      summary,
      keyPoints: summary ? [summary] : [],
      whyItMatters: "This item is included because it matches a configured source and category signal.",
      whoIsAffected: ["Readers following this topic"],
      sourceName: source.name,
      sourceUrl: source.url,
      category: source.category,
      region: source.regions[0],
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      imageUrl: media,
      originalUrl: originalUrl || source.url,
      readTime: "3 min",
      trustScore: source.trustTier === "official" ? 96 : 86,
      tags: [source.category, ...source.regions],
      contentType: "article",
      providerType: source.mode,
      fetchedAt: new Date().toISOString()
    };
  });
}

export function normalizeGuardian(payload: any, source: EdgeSource): UnifiedContent[] {
  const results = payload?.response?.results ?? [];
  return results.map((item: any) => ({
    id: stableId(`${source.id}:${item.id}`),
    title: item.webTitle,
    summary: stripHtml(item.fields?.trailText ?? item.webTitle),
    keyPoints: [stripHtml(item.fields?.trailText ?? item.webTitle)],
    whyItMatters: "This source-based brief is generated from permitted Guardian Open Platform metadata.",
    whoIsAffected: ["News readers", "Policy watchers"],
    sourceName: source.name,
    sourceUrl: source.url,
    category: item.sectionName || source.category,
    publishedAt: item.webPublicationDate,
    imageUrl: item.fields?.thumbnail,
    originalUrl: item.webUrl,
    readTime: "4 min",
    trustScore: 88,
    tags: [item.sectionName || source.category],
    contentType: "article",
    providerType: "api",
    fetchedAt: new Date().toISOString()
  }));
}

export function normalizeGNews(payload: any, source: EdgeSource): UnifiedContent[] {
  return (payload?.articles ?? []).map((item: any) => ({
    id: stableId(`${source.id}:${item.url}`),
    title: item.title,
    summary: item.description || item.content || item.title,
    keyPoints: [item.description || item.title],
    whyItMatters: "This headline was returned by a configured news API and is summarized from available metadata.",
    whoIsAffected: ["Readers tracking global and local headlines"],
    sourceName: item.source?.name || source.name,
    sourceUrl: item.source?.url || source.url,
    category: source.category,
    publishedAt: item.publishedAt || new Date().toISOString(),
    imageUrl: item.image,
    originalUrl: item.url,
    readTime: "3 min",
    trustScore: 80,
    tags: [source.category],
    contentType: "article",
    providerType: "api",
    fetchedAt: new Date().toISOString()
  }));
}

export function normalizeGithub(payload: any, source: EdgeSource): UnifiedContent[] {
  return (payload?.items ?? []).slice(0, 20).map((repo: any) => ({
    id: stableId(`${source.id}:${repo.full_name}`),
    title: repo.full_name,
    summary: repo.description || "Repository trend signal from GitHub Search API metadata.",
    keyPoints: [`${repo.stargazers_count ?? 0} stars`, `${repo.forks_count ?? 0} forks`, `Updated ${repo.updated_at}`],
    whyItMatters: "Repository activity can indicate developer attention and emerging tooling demand.",
    whoIsAffected: ["Developers", "Engineering leaders", "Open-source maintainers"],
    sourceName: source.name,
    sourceUrl: source.url,
    category: "GitHub Trends",
    subcategory: repo.language,
    region: "Global",
    publishedAt: repo.created_at || repo.updated_at || new Date().toISOString(),
    originalUrl: repo.html_url,
    readTime: "2 min",
    trustScore: 90,
    tags: [repo.language, "GitHub", "Open source"].filter(Boolean),
    contentType: "repo",
    providerType: "api",
    fetchedAt: new Date().toISOString()
  }));
}
