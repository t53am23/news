export type ProviderType = "api" | "rss" | "official_update_page" | "community_trend" | "directory_only";

export type UnifiedContent = {
  id: string;
  title: string;
  summary: string;
  keyPoints?: string[];
  whyItMatters?: string;
  whoIsAffected?: string[];
  sourceName: string;
  sourceUrl: string;
  sourceLogo?: string;
  category: string;
  subcategory?: string;
  region?: string;
  country?: string;
  publishedAt: string;
  imageUrl?: string;
  originalUrl: string;
  author?: string;
  readTime?: string;
  trustScore?: number;
  tags: string[];
  contentType: "article" | "video" | "repo" | "research" | "review" | "visa_update" | "policy_update" | "official_notice";
  providerType: ProviderType;
  sensitivityLevel?: "normal" | "legal" | "immigration" | "health" | "finance";
  disclaimerRequired?: boolean;
  fetchedAt?: string;
};

export type EdgeSource = {
  id: string;
  name: string;
  mode: ProviderType;
  category: string;
  regions: string[];
  country?: string;
  language?: string;
  sourceType?: string;
  contentCategories?: string[];
  url: string;
  feedUrl?: string;
  apiProvider?: "guardian" | "gnews" | "github" | "youtube" | "openalex";
  trustTier: "official" | "verified" | "business" | "community" | "lifestyle" | "directory";
};
