"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-16">
      <div className="w-full space-y-4 text-center">
        <ErrorState />
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
