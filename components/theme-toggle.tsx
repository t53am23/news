"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <Button
      aria-label="Toggle light and dark mode"
      variant="secondary"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden"
    >
      <Sun className="h-4 w-4 text-amber-400 dark:opacity-100" />
      <Moon className="h-4 w-4 text-blue-500 dark:text-blue-200" />
    </Button>
  );
}
