import Link from "next/link";
import { footerLinks } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border/70 py-6 sm:mt-12 sm:py-8">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-4 px-4 text-sm text-muted-foreground sm:px-5 xl:px-8">
        <p>(c) 2026 Choyis news. Source-based intelligence briefings with publisher attribution.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 xl:flex-nowrap xl:gap-6" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-foreground">
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
