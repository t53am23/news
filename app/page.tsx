import { BriefingPanel } from "@/components/briefing-panel";
import { CategoryTabs } from "@/components/category-tabs";
import { CompactNewsList } from "@/components/compact-news-list";
import { FeatureCards } from "@/components/feature-cards";
import { HeroStory } from "@/components/hero-story";
import { MoreNewsSection } from "@/components/more-news-section";
import { TopicCards } from "@/components/topic-cards";
import { fetchLiveContent } from "@/lib/live-content";
import { briefs, heroBrief } from "@/lib/mock-data";

export default async function HomePage() {
  const live = await fetchLiveContent({ source: "bbc-world-rss", query: "world" });
  const feed = live.items.length ? [...live.items, ...briefs] : briefs;
  const hero = live.items[0] ?? heroBrief;
  const byCategory = (category: string) => feed.filter((brief) => brief.category === category).slice(0, 4);
  const moreNews = feed.filter((brief) => brief.id !== hero.id).slice(0, 8);
  const featuredStories = [hero, ...feed.filter((brief) => brief.id !== hero.id).slice(0, 3)];
  const lowerSections = [
    { title: "Visa & Immigration Watch", href: "/visa-immigration-watch", items: byCategory("Visa & Immigration").slice(0, 3) },
    { title: "Students & Study Abroad", href: "/students-study-abroad", items: byCategory("Students").slice(0, 3) },
    { title: "Work, COS & Sponsorship", href: "/work-cos-sponsorship", items: byCategory("Work & Sponsorship").slice(0, 3) },
    { title: "Politics & Policy", href: "/politics-policy", items: byCategory("Politics & Policy").slice(0, 3) },
    { title: "AI & Technology", href: "/ai-technology", items: byCategory("AI & Technology").slice(0, 3) },
    { title: "Cybersecurity Alerts", href: "/cybersecurity", items: byCategory("Cybersecurity").slice(0, 3) },
    { title: "GitHub Trends", href: "/github-trends", items: byCategory("GitHub Trends").slice(0, 3) },
    { title: "Video Briefs", href: "/video-briefs", items: byCategory("Video Briefs").slice(0, 3) }
  ].filter((section) => section.items.length);

  const topics = [
    { title: "United Kingdom", href: "/local/uk", items: feed.filter((brief) => brief.country === "UK" || brief.region === "UK").slice(0, 2) },
    { title: "World", href: "/world-news", items: byCategory("World").slice(0, 2) },
    { title: "Business", href: "/startups-business", items: byCategory("Startups & Business").slice(0, 2) },
    { title: "Tech", href: "/ai-technology", items: [...byCategory("AI & Technology"), ...byCategory("GitHub Trends")].slice(0, 2) }
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 px-3 py-3 sm:space-y-5 sm:px-5 sm:py-4 xl:px-6">
      <CategoryTabs />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4 sm:space-y-5">
          <HeroStory items={featuredStories} />
          <FeatureCards />
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <BriefingPanel />
        </div>
      </div>

      <MoreNewsSection items={moreNews} />
      <TopicCards topics={topics} />

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {lowerSections.map((section) => (
          <CompactNewsList key={section.title} title={section.title} href={section.href} items={section.items} />
        ))}
      </section>
    </div>
  );
}
