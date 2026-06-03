import type { Metadata } from "next";
import { SensitivityDisclaimer } from "@/components/sensitivity-disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimer for Choyis news briefings."
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Disclaimer</h1>
      <SensitivityDisclaimer />
      <div className="premium-panel space-y-5 p-6 leading-7 text-muted-foreground">
        <p>SignalBrief pages are not replacements for full publisher articles, official notices, legal advice, immigration advice, medical advice, financial advice, or professional judgement.</p>
        <p>AI features, when introduced later, must be grounded in source metadata or official material and must not invent facts.</p>
        <p>For visa, immigration, health, legal, finance, and policy matters, always verify from the official source before acting.</p>
      </div>
    </div>
  );
}
