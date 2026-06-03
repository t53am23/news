import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Choyis news and the SignalBrief intelligence model."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">About Choyis news</h1>
      <div className="premium-panel space-y-5 p-6 leading-7 text-muted-foreground">
        <p>
          Choyis news is a premium hybrid intelligence platform for people who need more than headlines. It combines world news, local updates, visa and immigration watch, student updates, work sponsorship policy, AI, cybersecurity, developer trends, video explainers, research, health, lifestyle, and product discovery in one daily briefing hub.
        </p>
        <p>
          The first version is live-source ready with mock data. Source adapters are designed to fetch permitted metadata and summaries through APIs, RSS feeds, official update pages, and responsible directory listings.
        </p>
      </div>
    </div>
  );
}
