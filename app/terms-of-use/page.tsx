import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Choyis news."
};

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Terms of Use</h1>
      <div className="premium-panel space-y-5 p-6 leading-7 text-muted-foreground">
        <p>Choyis news provides short source-based summaries, metadata, links, and intelligence-style context. Original publisher content belongs to the original publishers.</p>
        <p>Users should open and verify original sources for complete details. Choyis news does not provide legal, immigration, medical, financial, or professional advice.</p>
        <p>Automated source fetching must respect API terms, RSS permissions, robots guidance, and copyright restrictions.</p>
      </div>
    </div>
  );
}
