"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const topTabs = [
  { title: "For You", href: "/" },
  { title: "World", href: "/world-news" },
  { title: "Local", href: "/local-news" },
  { title: "Visa", href: "/visa-immigration-watch" },
  { title: "Students", href: "/students-study-abroad" },
  { title: "Work", href: "/work-cos-sponsorship" },
  { title: "Policy", href: "/politics-policy" },
  { title: "AI & Tech", href: "/ai-technology" },
  { title: "Cyber", href: "/cybersecurity" },
  { title: "Developers", href: "/developer-trends" },
  { title: "Video", href: "/video-briefs" }
];

export function CategoryTabs() {
  const pathname = usePathname();

  return (
    <nav className="-mx-3 overflow-x-auto border-b border-border/70 px-3 pb-3 sm:mx-0 sm:px-0" aria-label="Topic navigation">
      <div className="flex min-w-max gap-2 pr-2 sm:pr-0">
        {topTabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/80 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
