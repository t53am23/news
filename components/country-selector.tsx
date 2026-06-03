import Link from "next/link";
import { MapPin } from "lucide-react";
import { countries } from "@/lib/source-registry";
import { slugify } from "@/lib/utils";

export function CountrySelector({ active = "Global" }: { active?: string }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-primary" />
        Local lens
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {countries.map((country) => {
          const isActive = country === active;
          return (
            <Link
              key={country}
              href={country === "Global" ? "/local-news" : `/local/${slugify(country)}`}
              className={
                isActive
                  ? "whitespace-nowrap rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
                  : "whitespace-nowrap rounded-full border border-border bg-background px-3.5 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }
            >
              {country}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
