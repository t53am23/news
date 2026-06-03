import Link from "next/link";
import { Bell, ChevronDown, Sparkles } from "lucide-react";
import { primaryNav } from "@/lib/navigation";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function DesktopNav() {
  return (
    <>
      <aside className="fixed left-3 top-3 z-40 hidden h-[calc(100vh-1.5rem)] w-[15rem] flex-col rounded-3xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur-xl xl:flex">
        <Link href="/" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">Choyis news</span>
        </Link>
        <nav className="space-y-1" aria-label="Primary navigation">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <Button variant="secondary" className="mt-auto w-full">Customize feed</Button>
      </aside>

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl xl:ml-[16rem]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-3 sm:px-5 xl:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 xl:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate text-lg font-semibold">Choyis news</span>
          </Link>
          <div className="hidden min-w-0 flex-1 sm:block">
            <SearchBar />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button aria-label="Notifications" variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="secondary" className="hidden rounded-full sm:flex">
              JD <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="px-3 pb-3 sm:hidden">
          <SearchBar />
        </div>
      </header>
    </>
  );
}
