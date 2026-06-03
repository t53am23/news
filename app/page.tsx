import { BriefingPanel } from "@/components/briefing-panel";
import { CategoryTabs } from "@/components/category-tabs";
import { CompactNewsList } from "@/components/compact-news-list";
import { FeatureCards } from "@/components/feature-cards";
import { HeroStory } from "@/components/hero-story";
import { MoreNewsSection } from "@/components/more-news-section";
import { TopicCards } from "@/components/topic-cards";
import { getHomePageData } from "@/lib/live";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 px-3 py-3 sm:space-y-5 sm:px-5 sm:py-4 xl:px-6">
      <CategoryTabs />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4 sm:space-y-5">
          <HeroStory items={data.featured} />
          <FeatureCards />
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <BriefingPanel updates={data.topUpdates} topics={data.trendingTopics} showNewsletter={data.showNewsletter} />
        </div>
      </div>

      <MoreNewsSection items={data.moreNews} />
      <TopicCards topics={data.topics} />

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {data.lowerSections.map((section) => (
          <CompactNewsList key={section.title} title={section.title} href={section.href} items={section.items} />
        ))}
      </section>
    </div>
  );
}
