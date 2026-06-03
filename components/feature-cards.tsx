import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, GraduationCap, Scale } from "lucide-react";

const featureCards = [
  {
    title: "Visa Alerts",
    description: "Latest immigration updates",
    href: "/visa-immigration-watch",
    icon: FileText,
    tone: "text-amber-500 bg-amber-500/10"
  },
  {
    title: "Policy Watch",
    description: "New laws and government announcements",
    href: "/politics-policy",
    icon: Scale,
    tone: "text-blue-500 bg-blue-500/10"
  },
  {
    title: "Student Hub",
    description: "Study abroad and education news",
    href: "/students-study-abroad",
    icon: GraduationCap,
    tone: "text-emerald-500 bg-emerald-500/10"
  },
  {
    title: "Business Pulse",
    description: "Markets, economy and companies",
    href: "/startups-business",
    icon: BriefcaseBusiness,
    tone: "text-violet-500 bg-violet-500/10"
  }
];

export function FeatureCards() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {featureCards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40"
        >
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${card.tone}`}>
            <card.icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-sm font-semibold">
              {card.title}
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-1 block line-clamp-1 text-xs text-muted-foreground">{card.description}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
