export type ProviderId =
  | "newsdata"
  | "gnews"
  | "newsapi"
  | "eventregistry"
  | "guardian"
  | "githubSearch"
  | "githubTrending"
  | "rssSources"
  | "officialFeeds"
  | "cyberFeeds"
  | "mediastack";

export type SectionRule = {
  id: string;
  title: string;
  category: string;
  providers: ProviderId[];
  keywords: string[];
  tags: string[];
  providerCategory?: string;
  language?: string;
  countries?: string[];
  allowGitHub?: boolean;
  officialFirst?: boolean;
  homepageLimit?: number;
  pageSize?: number;
  fallbackCategories: string[];
};

const defaultPageSize = 18;

export const sectionRules: Record<string, SectionRule> = {
  homeFeatured: {
    id: "homeFeatured",
    title: "Today's Briefing",
    category: "Featured",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi", "eventregistry"],
    keywords: ["breaking news", "global policy", "technology", "world affairs"],
    tags: ["breaking", "featured", "global"],
    providerCategory: "world",
    officialFirst: false,
    homepageLimit: 4,
    pageSize: defaultPageSize,
    fallbackCategories: ["World", "Politics & Policy", "AI & Technology"]
  },
  homeTopUpdates: {
    id: "homeTopUpdates",
    title: "Top Updates",
    category: "Updates",
    providers: ["rssSources", "officialFeeds", "guardian", "newsdata", "gnews", "newsapi"],
    keywords: ["latest updates", "today news"],
    tags: ["updates", "latest"],
    providerCategory: "general",
    homepageLimit: 6,
    pageSize: defaultPageSize,
    fallbackCategories: ["World", "Local", "Politics & Policy", "Visa & Immigration"]
  },
  homeMoreNews: {
    id: "homeMoreNews",
    title: "More News",
    category: "Mixed",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi", "mediastack"],
    keywords: ["world local business policy technology"],
    tags: ["mixed", "general"],
    providerCategory: "general",
    homepageLimit: 10,
    pageSize: defaultPageSize,
    fallbackCategories: ["World", "Local", "Startups & Business", "Politics & Policy"]
  },
  homeTopics: {
    id: "homeTopics",
    title: "Your Topics",
    category: "Topics",
    providers: ["rssSources", "officialFeeds", "guardian", "newsdata", "gnews", "newsapi", "githubSearch"],
    keywords: ["world business technology local news"],
    tags: ["topics"],
    providerCategory: "general",
    homepageLimit: 12,
    pageSize: defaultPageSize,
    fallbackCategories: ["World", "Startups & Business", "AI & Technology", "Local"]
  },
  "world-news": {
    id: "world-news",
    title: "World News",
    category: "World",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi", "eventregistry", "mediastack"],
    keywords: ["world news diplomacy conflict economy breaking news"],
    tags: ["world", "global"],
    providerCategory: "world",
    pageSize: defaultPageSize,
    fallbackCategories: ["World"]
  },
  "local-news": {
    id: "local-news",
    title: "Local News",
    category: "Local",
    providers: ["rssSources", "newsdata", "gnews", "newsapi", "mediastack"],
    keywords: ["local news city region community"],
    tags: ["local", "city", "community"],
    providerCategory: "general",
    pageSize: defaultPageSize,
    fallbackCategories: ["Local"]
  },
  "visa-immigration-watch": {
    id: "visa-immigration-watch",
    title: "Visa & Immigration Watch",
    category: "Visa & Immigration",
    providers: ["officialFeeds", "guardian", "newsdata", "gnews", "newsapi"],
    keywords: ["visa immigration home office student visa work permit sponsorship border policy"],
    tags: ["visa", "immigration", "official"],
    providerCategory: "politics",
    officialFirst: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["Visa & Immigration", "Work & Sponsorship", "Students"]
  },
  "students-study-abroad": {
    id: "students-study-abroad",
    title: "Students & Study Abroad",
    category: "Students",
    providers: ["officialFeeds", "guardian", "rssSources", "newsdata", "gnews", "newsapi"],
    keywords: ["students study abroad university post study visa education"],
    tags: ["students", "education", "study abroad"],
    providerCategory: "general",
    pageSize: defaultPageSize,
    fallbackCategories: ["Students", "Visa & Immigration"]
  },
  "work-cos-sponsorship": {
    id: "work-cos-sponsorship",
    title: "Work, COS & Sponsorship",
    category: "Work & Sponsorship",
    providers: ["officialFeeds", "guardian", "newsdata", "gnews", "newsapi"],
    keywords: ["cos sponsorship skilled worker sponsor licence employer compliance right to work"],
    tags: ["work", "sponsorship", "employer compliance"],
    providerCategory: "business",
    officialFirst: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["Work & Sponsorship", "Visa & Immigration", "Politics & Policy"]
  },
  "politics-policy": {
    id: "politics-policy",
    title: "Politics & Policy",
    category: "Politics & Policy",
    providers: ["officialFeeds", "guardian", "rssSources", "newsdata", "gnews", "newsapi", "eventregistry"],
    keywords: ["politics policy regulation government legislation parliament senate"],
    tags: ["policy", "government", "regulation"],
    providerCategory: "politics",
    officialFirst: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["Politics & Policy"]
  },
  "ai-technology": {
    id: "ai-technology",
    title: "AI & Technology",
    category: "AI & Technology",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi", "eventregistry", "githubSearch"],
    keywords: ["AI technology software chips developer tools startups"],
    tags: ["AI", "technology", "software"],
    providerCategory: "technology",
    allowGitHub: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["AI & Technology", "GitHub Trends", "Developer Trends"]
  },
  "startups-business": {
    id: "startups-business",
    title: "Startups & Business",
    category: "Startups & Business",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi", "mediastack"],
    keywords: ["business startups funding economy markets operators companies investment"],
    tags: ["business", "markets", "companies"],
    providerCategory: "business",
    pageSize: defaultPageSize,
    fallbackCategories: ["Startups & Business", "Local", "Politics & Policy"]
  },
  "developer-trends": {
    id: "developer-trends",
    title: "Developer Trends",
    category: "Developer Trends",
    providers: ["githubSearch", "githubTrending", "rssSources", "newsdata", "gnews", "newsapi"],
    keywords: ["developer tools frameworks typescript python javascript open source engineering"],
    tags: ["developer", "tooling", "open source"],
    allowGitHub: true,
    providerCategory: "technology",
    pageSize: defaultPageSize,
    fallbackCategories: ["Developer Trends", "GitHub Trends", "AI & Technology"]
  },
  cybersecurity: {
    id: "cybersecurity",
    title: "Cybersecurity",
    category: "Cybersecurity",
    providers: ["cyberFeeds", "githubSearch", "rssSources", "newsdata", "gnews", "newsapi"],
    keywords: ["cybersecurity security advisory vulnerability cve ransomware incident"],
    tags: ["cybersecurity", "security", "advisory"],
    providerCategory: "technology",
    allowGitHub: true,
    officialFirst: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["Cybersecurity"]
  },
  "github-trends": {
    id: "github-trends",
    title: "GitHub Trends",
    category: "GitHub Trends",
    providers: ["githubTrending", "githubSearch"],
    keywords: ["AI tools cybersecurity tools developer tools open source TypeScript Python"],
    tags: ["GitHub", "open source", "developer tools"],
    allowGitHub: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["GitHub Trends", "Developer Trends"]
  },
  "video-briefs": {
    id: "video-briefs",
    title: "Video Briefs",
    category: "Video Briefs",
    providers: [],
    keywords: ["video explainers"],
    tags: ["video"],
    pageSize: defaultPageSize,
    fallbackCategories: ["Video Briefs"]
  },
  podcasts: {
    id: "podcasts",
    title: "Podcast Briefs",
    category: "Podcasts",
    providers: [],
    keywords: ["podcast interview episode briefing"],
    tags: ["podcast"],
    pageSize: defaultPageSize,
    fallbackCategories: ["Video Briefs"]
  },
  "product-reviews": {
    id: "product-reviews",
    title: "Product Reviews",
    category: "Product Reviews",
    providers: ["rssSources", "newsdata", "gnews", "newsapi"],
    keywords: ["review buyer guide product comparison laptop phone software"],
    tags: ["reviews", "products", "buyers"],
    providerCategory: "technology",
    pageSize: defaultPageSize,
    fallbackCategories: ["Product Reviews", "AI & Technology"]
  },
  "research-science": {
    id: "research-science",
    title: "Research & Science",
    category: "Research & Science",
    providers: ["rssSources", "newsdata", "gnews", "newsapi", "guardian"],
    keywords: ["research science study evidence public health discovery"],
    tags: ["research", "science", "evidence"],
    providerCategory: "technology",
    pageSize: defaultPageSize,
    fallbackCategories: ["Research & Science", "Health & Lifestyle"]
  },
  "health-lifestyle-updates": {
    id: "health-lifestyle-updates",
    title: "Health & Lifestyle Updates",
    category: "Health & Lifestyle",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi"],
    keywords: ["public health wellbeing health policy family planning lifestyle"],
    tags: ["health", "public health", "wellbeing"],
    providerCategory: "health",
    pageSize: defaultPageSize,
    fallbackCategories: ["Health & Lifestyle", "Research & Science"]
  },
  "human-rights": {
    id: "human-rights",
    title: "Human Rights",
    category: "Human Rights",
    providers: ["rssSources", "guardian", "newsdata", "gnews", "newsapi", "eventregistry"],
    keywords: ["human rights civil liberties public interest refugees justice accountability"],
    tags: ["human rights", "public interest", "rights"],
    providerCategory: "general",
    pageSize: defaultPageSize,
    fallbackCategories: ["Politics & Policy", "World", "Health & Lifestyle"]
  }
};

export const homeSectionOrder = [
  "visa-immigration-watch",
  "students-study-abroad",
  "work-cos-sponsorship",
  "startups-business",
  "politics-policy",
  "ai-technology",
  "developer-trends",
  "health-lifestyle-updates",
  "cybersecurity",
  "github-trends",
  "video-briefs"
] as const;

export function getSectionRule(sectionId: string) {
  return sectionRules[sectionId];
}

export function buildLocalCountryRule(country: string, region?: string, city?: string): SectionRule {
  const keywords = [city, region, country, "local news", "community", "city"].filter(Boolean) as string[];

  return {
    id: `local-${country.toLowerCase()}`,
    title: `${country} Local News`,
    category: "Local",
    providers: ["rssSources", "newsdata", "gnews", "newsapi", "mediastack"],
    keywords,
    tags: [country, region || "local", city || "city"].filter(Boolean),
    countries: [country],
    providerCategory: "general",
    pageSize: defaultPageSize,
    fallbackCategories: ["Local", "Startups & Business", "Politics & Policy", "Community Pulse"]
  };
}

export function buildVisaCountryRule(country: string): SectionRule {
  return {
    id: `visa-${country.toLowerCase()}`,
    title: `${country} Visa and Immigration`,
    category: "Visa & Immigration",
    providers: ["officialFeeds", "guardian", "newsdata", "gnews", "newsapi"],
    keywords: [country, "visa", "immigration", "student visa", "work permit", "sponsorship"],
    tags: [country, "visa", "immigration"],
    countries: [country],
    providerCategory: "politics",
    officialFirst: true,
    pageSize: defaultPageSize,
    fallbackCategories: ["Visa & Immigration", "Students", "Work & Sponsorship"]
  };
}
