import { NextResponse } from "next/server";
import { getProviderStatusEntries, getSourceDirectoryEntriesWithStatus } from "@/lib/live";

export async function GET() {
  return NextResponse.json(
    {
      providers: getProviderStatusEntries(),
      sources: getSourceDirectoryEntriesWithStatus()
    },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=300" } }
  );
}
