import { NextRequest, NextResponse } from "next/server";
import { searchFeed } from "@/lib/live";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const country = searchParams.get("country") || undefined;
  const region = searchParams.get("region") || undefined;
  const city = searchParams.get("city") || undefined;
  const category = searchParams.get("category") || undefined;
  const source = searchParams.get("source") || undefined;
  const language = searchParams.get("language") || undefined;
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "18");

  const data = await searchFeed({
    q,
    country,
    region,
    city,
    category,
    source,
    language,
    page,
    pageSize
  });

  return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=180, stale-while-revalidate=180" } });
}
