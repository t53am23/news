"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveButton({ title }: { title: string }) {
  return (
    <Button aria-label={`Save ${title}`} variant="secondary" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
      <Bookmark className="h-4 w-4" />
    </Button>
  );
}
