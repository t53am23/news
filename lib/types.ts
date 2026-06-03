export type ProviderType = "api" | "rss" | "official_update_page" | "community_trend" | "directory_only";

export type ContentType =
  | "article"
  | "video"
  | "repo"
  | "research"
  | "review"
  | "visa_update"
  | "policy_update"
  | "official_notice";

export type SensitivityLevel = "normal" | "legal" | "immigration" | "health" | "finance";

export type SignalBrief = {
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
  contentType: ContentType;
  providerType: ProviderType;
  sensitivityLevel?: SensitivityLevel;
  disclaimerRequired?: boolean;
  fetchedAt?: string;
};

export type SourceMode = ProviderType;

export type SourceType =
  | "news_publisher"
  | "business_finance"
  | "community_forum"
  | "entertainment_lifestyle"
  | "official_government"
  | "technology"
  | "cybersecurity"
  | "research"
  | "video_channel"
  | "directory_only";

export type TrustTier = "official" | "verified" | "business" | "community" | "lifestyle" | "directory";

export type SourceConfig = {
  id: string;
  name: string;
  mode: SourceMode;
  category: string;
  regions: string[];
  country?: string;
  cityState?: string;
  sourceType?: SourceType;
  sourceCategory?: string;
  language?: string;
  contentCategories?: string[];
  url: string;
  feedUrl?: string;
  apiProvider?: "guardian" | "gnews" | "github" | "youtube" | "openalex";
  trustTier: TrustTier;
  notes: string;
};

export type SourceRegistryEntry = {
  id: string;
  country: string;
  region: string;
  cityState?: string;
  name: string;
  sourceType: SourceType;
  sourceCategory: string;
  mode: SourceMode;
  language: string;
  contentCategories: string[];
  homepage: string;
  feedUrl?: string;
  apiUrl?: string;
  trustTier: TrustTier;
  notes: string;
};

export type SectionConfig = {
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  featuredTags?: string[];
};
