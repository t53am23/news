import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Choyis news."
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Choyis news is designed to collect the minimum data needed to operate the service. The first version does not require login.</p>
      <p>Saved items and lightweight preferences can be stored locally in your browser. API keys and server-side provider tokens must never be exposed to the frontend.</p>
      <p>Analytics, if added, should be privacy-conscious and documented before production launch.</p>
    </LegalPage>
  );
}

function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <div className="premium-panel space-y-5 p-6 leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}
