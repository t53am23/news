import Link from "next/link";
import { footerLinks } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <p>(c) 2026 Choyis news. Source-based intelligence briefings with publisher attribution.</p>
        <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
