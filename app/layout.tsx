import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DesktopNav } from "@/components/desktop-nav";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Providers } from "@/components/providers";
import "@/app/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Choyis news | Premium News, Policy, Visa and Trend Intelligence",
    template: "%s | Choyis news"
  },
  description:
    "A premium hybrid intelligence hub for world news, local news, visa updates, policy, AI trends, GitHub signals, cybersecurity, research, health, and video explainers.",
  applicationName: "Choyis news",
  openGraph: {
    title: "Choyis news",
    description: "Premium source-based daily briefings for news, policy, visas, AI, developers, and public-interest updates.",
    url: siteUrl,
    siteName: "Choyis news",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Choyis news",
    description: "Premium source-based daily briefings and trend intelligence."
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1118" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <DesktopNav />
          <main className="min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))] xl:pb-0">
            {children}
            <Footer />
          </main>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
