import { createHash } from "node:crypto";
import { applyContentRules } from "@/lib/content-rules";
import type { ContentType, ProviderType, SignalBrief } from "@/lib/types";

type ParseFeedOptions = {
  sourceName: string;
  sourceUrl: string;
  category: string;
  provider: string;
  providerType?: ProviderType;
  contentType?: ContentType;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  tags?: string[];
  readTime?: string;
};

function decodeHtmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTagValue(block: string, tagNames: string[]) {
  for (const tag of tagNames) {
    const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
    if (match?.[1]) return stripHtml(match[1]);
  }

  return "";
}

function getAttrValue(block: string, tagName: string, attrName: string) {
  const match = block.match(new RegExp(`<${tagName}[^>]*${attrName}="([^"]+)"[^>]*\\/?>`, "i"));
  return match?.[1]?.trim() || "";
}

function getImageUrl(block: string) {
  const patterns = [
    /<media:content[^>]*url="([^"]+)"/i,
    /<media:thumbnail[^>]*url="([^"]+)"/i,
    /<enclosure[^>]*url="([^"]+)"/i,
    /<img[^>]*src="([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match?.[1]) return match[1];
  }

  return "";
}

function getAtomLink(block: string) {
  const altLinkMatch = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i);
  if (altLinkMatch?.[1]) return altLinkMatch[1];

  const directLinkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
  return directLinkMatch?.[1] || "";
}

function buildId(sourceName: string, originalUrl: string, title: string) {
  return createHash("sha1")
    .update(`${sourceName}|${originalUrl || title}`)
    .digest("hex")
    .slice(0, 16);
}

function inferTags(block: string, defaults: string[]) {
  const rawCategories = block.match(/<category(?:[^>]*term="([^"]+)")?[^>]*>([\s\S]*?)<\/category>|<category[^>]*term="([^"]+)"[^>]*\/>/gi) || [];
  const tags = rawCategories
    .flatMap((category) => {
      const termMatch = category.match(/term="([^"]+)"/i);
      const textMatch = category.match(/>([\s\S]*?)<\/category>/i);
      return [termMatch?.[1], stripHtml(textMatch?.[1] || "")]
        .filter(Boolean)
        .map((value) => value!.trim());
    })
    .filter(Boolean);

  return Array.from(new Set([...defaults, ...tags])).slice(0, 8);
}

function normalizeFeedItem(block: string, options: ParseFeedOptions, isAtom = false): SignalBrief | null {
  const title = getTagValue(block, ["title"]);
  const originalUrl = isAtom ? getAtomLink(block) : getTagValue(block, ["link", "guid"]);
  const summary = getTagValue(block, ["description", "summary", "content", "content:encoded"]);
  const publishedAt = getTagValue(block, ["pubDate", "published", "updated", "dc:date"]);
  const imageUrl = getImageUrl(block);

  if (!title || !originalUrl) return null;

  return applyContentRules({
    id: buildId(options.sourceName, originalUrl, title),
    title,
    summary: summary || "Open the original source for the latest publisher context.",
    sourceName: options.sourceName,
    sourceUrl: options.sourceUrl,
    category: options.category,
    region: options.region,
    country: options.country,
    city: options.city,
    publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    imageUrl: imageUrl || undefined,
    originalUrl,
    readTime: options.readTime || "3 min",
    trustScore: options.providerType === "official_update_page" ? 96 : 84,
    tags: inferTags(block, options.tags || []),
    provider: options.provider,
    language: options.language,
    isLive: true,
    isFallback: false,
    linkBehavior: "source",
    contentType: options.contentType || "article",
    providerType: options.providerType || "rss",
    disclaimerRequired: options.providerType === "official_update_page" || options.category === "Cybersecurity",
    fetchedAt: new Date().toISOString()
  });
}

export function parseFeed(xml: string, options: ParseFeedOptions) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  const normalizedItems = items.map((item) => normalizeFeedItem(item, options)).filter(Boolean) as SignalBrief[];
  const normalizedEntries = entries.map((entry) => normalizeFeedItem(entry, options, true)).filter(Boolean) as SignalBrief[];

  return [...normalizedItems, ...normalizedEntries];
}
