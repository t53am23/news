import { BriefingPanel } from "@/components/briefing-panel";
import { CategoryTabs } from "@/components/category-tabs";
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

  const topics = [
    { title: "United Kingdom", href: "/local/uk", items: feed.filter((brief) => brief.country === "UK" || brief.region === "UK").slice(0, 2) },
    { title: "World", href: "/world-news", items: byCategory("World").slice(0, 2) },
    { title: "Business", href: "/startups-business", items: byCategory("Startups & Business").slice(0, 2) },
    { title: "Tech", href: "/ai-technology", items: [...byCategory("AI & Technology"), ...byCategory("GitHub Trends")].slice(0, 2) }
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-4 sm:px-6 lg:px-8">
      <CategoryTabs />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-5">
          <HeroStory brief={hero} />
          <FeatureCards />
          <MoreNewsSection items={moreNews} />
          <TopicCards topics={topics} />
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <BriefingPanel />
        </div>
      </div>
    </div>
  );
}
