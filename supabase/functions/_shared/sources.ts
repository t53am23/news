import type { EdgeSource } from "./types.ts";

export const edgeSources: EdgeSource[] = [
  {
    id: "country-local-api",
    name: "Country Local Headlines",
    mode: "api",
    category: "Local",
    regions: ["Global", "Local"],
    language: "Multi-language",
    sourceType: "news_publisher",
    contentCategories: ["Local", "Business", "Politics", "Technology", "Lifestyle"],
    url: "https://gnews.io/",
    apiProvider: "gnews",
    trustTier: "verified"
  },
  {
    id: "guardian-open-platform",
    name: "The Guardian Open Platform",
    mode: "api",
    category: "World",
    regions: ["Global", "UK"],
    url: "https://open-platform.theguardian.com/",
    apiProvider: "guardian",
    trustTier: "verified"
  },
  {
    id: "gnews",
    name: "GNews",
    mode: "api",
    category: "Global Headlines",
    regions: ["Global", "Local"],
    url: "https://gnews.io/",
    apiProvider: "gnews",
    trustTier: "verified"
  },
  {
    id: "bbc-world-rss",
    name: "BBC World RSS",
    mode: "rss",
    category: "World",
    regions: ["Global", "UK"],
    url: "https://www.bbc.com/news/world",
    feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    trustTier: "verified"
  },
  {
    id: "bbc-uk-rss",
    name: "BBC UK RSS",
    mode: "rss",
    category: "Local",
    regions: ["UK"],
    url: "https://www.bbc.com/news/uk",
    feedUrl: "https://feeds.bbci.co.uk/news/uk/rss.xml",
    trustTier: "verified"
  },
  {
    id: "github-search",
    name: "GitHub Search API",
    mode: "api",
    category: "GitHub Trends",
    regions: ["Global"],
    url: "https://docs.github.com/en/rest/search/search",
    apiProvider: "github",
    trustTier: "verified"
  },
  {
    id: "uk-home-office",
    name: "UK Home Office / GOV.UK",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["UK"],
    url: "https://www.gov.uk/government/organisations/home-office",
    trustTier: "official"
  },
  {
    id: "uscis-alerts",
    name: "USCIS News and Alerts",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["USA"],
    url: "https://www.uscis.gov/newsroom",
    trustTier: "official"
  },
  {
    id: "ircc-news",
    name: "IRCC Canada Notices",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Canada"],
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html",
    trustTier: "official"
  },
  {
    id: "australia-home-affairs",
    name: "Australia Department of Home Affairs",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Australia"],
    url: "https://immi.homeaffairs.gov.au/news-media/archive",
    trustTier: "official"
  },
  {
    id: "germany-foreign-office",
    name: "Germany Federal Foreign Office",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Germany", "Europe"],
    url: "https://www.auswaertiges-amt.de/en/visa-service",
    trustTier: "official"
  },
  {
    id: "india-immigration",
    name: "India Bureau of Immigration",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["India"],
    url: "https://boi.gov.in/",
    trustTier: "official"
  },
  {
    id: "china-visa",
    name: "China Visa Application Service",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["China"],
    url: "https://www.visaforchina.cn/",
    trustTier: "official"
  },
  {
    id: "malaysia-immigration",
    name: "Immigration Department of Malaysia",
    mode: "official_update_page",
    category: "Visa & Immigration",
    regions: ["Malaysia"],
    url: "https://www.imi.gov.my/",
    trustTier: "official"
  }
];
