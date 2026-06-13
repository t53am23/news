import Link from "next/link";
import { Bell, ChevronDown, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function DesktopNav() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1720px] items-center gap-3 px-3 py-3 sm:px-5 xl:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate text-lg font-semibold">Choyis news</span>
          </Link>
          <div className="hidden min-w-0 flex-1 sm:flex sm:justify-center">
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
