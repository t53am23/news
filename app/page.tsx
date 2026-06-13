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
    <div className="mx-auto max-w-[1720px] space-y-4 px-3 py-3 sm:space-y-5 sm:px-5 sm:py-4 xl:px-8">
      <CategoryTabs />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
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

      <section className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
        {data.lowerSections.map((section) => (
          <CompactNewsList key={section.title} title={section.title} href={section.href} items={section.items} />
        ))}
      </section>
    </div>
  );
}
