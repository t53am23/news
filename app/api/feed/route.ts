import { NextRequest, NextResponse } from "next/server";
import { getHomePageData, getLocalCountryFeed, getSectionFeed, getVisaCountryFeed } from "@/lib/live";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  const country = searchParams.get("country") || undefined;
  const region = searchParams.get("region") || undefined;
  const city = searchParams.get("city") || undefined;
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "18");

  if (!section || section === "home") {
    const data = await getHomePageData();
    return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=300" } });
  }

  if (section === "local-country" && country) {
    const data = await getLocalCountryFeed(country, { region, city, page, pageSize });
    return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=300" } });
  }

  if (section === "visa-country" && country) {
    const data = await getVisaCountryFeed(country, { page, pageSize });
    return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=600" } });
  }

  const data = await getSectionFeed(section, { country, region, city, page, pageSize });
  return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=300" } });
}
