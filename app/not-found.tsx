import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-16 text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Brief not found</h1>
        <p className="mt-4 text-muted-foreground">This signal may have expired, moved, or is waiting for live source data.</p>
        <Button asChild className="mt-6">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
