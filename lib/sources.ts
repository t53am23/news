import type { SourceConfig } from "@/lib/types";

export const sources: SourceConfig[] = [
  {
    id: "guardian-open-platform",
    name: "The Guardian Open Platform",
    mode: "api",
    category: "World",
    regions: ["Global", "UK"],
    url: "https://open-platform.theguardian.com/",
    apiProvider: "guardian",
    trustTier: "verified",
    notes: "Fetches permitted metadata, section data, thumbnails, and web URLs through the Guardian Open Platform."
  },
  {
    id: "gnews",
    name: "GNews",
    mode: "api",
    category: "Global Headlines",
    regions: ["Global", "Local"],
    url: "https://gnews.io/",
    apiProvider: "gnews",
    trustTier: "verified",
    notes: "Optional global and local headline API provider. API keys stay on the server-side route layer."
  },
  {
    id: "bbc-world-rss",
    name: "BBC World RSS",
    mode: "rss",
    category: "World",
    regions: ["Global", "UK"],
    url: "https://www.bbc.com/news/world",
    feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    trustTier: "verified",
    notes: "RSS metadata only, with internal Choyis news summaries and original attribution."
  },
  {
    id: "bbc-uk-rss",
    name: "BBC UK RSS",
    mode: "rss",
    category: "Local",
    regions: ["UK"],
    url: "https://www.bbc.com/news/uk",
    feedUrl: "https://feeds.bbci.co.uk/news/uk/rss.xml",
    trustTier: "verified",
    notes: "UK headline feed for local and national signal cards."
  },
  {
    id: "uk-home-office",
    name: "UK Home Office / GOV.UK",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["UK"],
    url: "https://www.gov.uk/government/organisations/home-office",
    trustTier: "official",
    notes: "Official update page for immigration, visas, right-to-work, ETA, and sponsor policy. Link and monitor responsibly."
  },
  {
    id: "uscis-alerts",
    name: "USCIS News and Alerts",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["USA"],
    url: "https://www.uscis.gov/newsroom",
    trustTier: "official",
    notes: "Official US immigration notices and alerts. Use source-based briefs only."
  },
  {
    id: "ircc-news",
    name: "IRCC Canada Notices",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Canada"],
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html",
    trustTier: "official",
    notes: "Official Canadian immigration updates and announcements."
  },
  {
    id: "australia-home-affairs",
    name: "Australia Department of Home Affairs",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Australia"],
    url: "https://immi.homeaffairs.gov.au/news-media/archive",
    trustTier: "official",
    notes: "Official Australian immigration and border policy updates."
  },
  {
    id: "germany-foreign-office",
    name: "Germany Federal Foreign Office",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Germany", "Europe"],
    url: "https://www.auswaertiges-amt.de/en/visa-service",
    trustTier: "official",
    notes: "Official Germany visa and consular information. Listed and monitored without scraping full content."
  },
  {
    id: "india-immigration",
    name: "India Bureau of Immigration",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["India"],
    url: "https://boi.gov.in/",
    trustTier: "official",
    notes: "Official India immigration information and update entry point."
  },
  {
    id: "china-visa",
    name: "China Visa Application Service",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["China"],
    url: "https://www.visaforchina.cn/",
    trustTier: "official",
    notes: "Official visa service entry point for China-related visa updates where available."
  },
  {
    id: "malaysia-immigration",
    name: "Immigration Department of Malaysia",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Malaysia"],
    url: "https://www.imi.gov.my/",
    trustTier: "official",
    notes: "Official Malaysia immigration information and notices."
  },
  {
    id: "github-search",
    name: "GitHub Search API",
    mode: "api",
    category: "GitHub Trends",
    regions: ["Global"],
    url: "https://docs.github.com/en/rest/search/search",
    apiProvider: "github",
    trustTier: "verified",
    notes: "Creates developer trends from repository search queries because GitHub has no official Trending API endpoint."
  },
  {
    id: "youtube-data-api",
    name: "YouTube Data API",
    mode: "api",
    category: "Video Briefs",
    regions: ["Global"],
    url: "https://developers.google.com/youtube/v3",
    apiProvider: "youtube",
    trustTier: "verified",
    notes: "Future provider for selected channel and playlist explainers."
  },
  {
    id: "openalex",
    name: "OpenAlex",
    mode: "api",
    category: "Research & Science",
    regions: ["Global"],
    url: "https://openalex.org/",
    apiProvider: "openalex",
    trustTier: "verified",
    notes: "Open metadata source for research and science discovery."
  },
  {
    id: "wirecutter",
    name: "Wirecutter",
    mode: "directory_only",
    category: "Product Reviews",
    regions: ["USA", "Global"],
    url: "https://www.nytimes.com/wirecutter/",
    trustTier: "directory",
    notes: "Directory-only unless a licensed or permitted feed is configured."
  },
  {
    id: "reuters",
    name: "Reuters",
    mode: "directory_only",
    category: "World",
    regions: ["Global"],
    url: "https://www.reuters.com/",
    trustTier: "directory",
    notes: "Directory-only without a licensed API or permitted feed."
  }
];
