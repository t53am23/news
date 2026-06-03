import Link from "next/link";
import { mobileNav } from "@/lib/navigation";

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/70 bg-card/95 px-3 py-2 shadow-premium backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-4 gap-1">
        {mobileNav.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
