import type { SignalBrief } from "@/lib/types";

type FetchContentOptions = {
  source?: string;
  query?: string;
};

export async function fetchLiveContent({ source = "bbc-world-rss", query = "world" }: FetchContentOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return { items: [] as SignalBrief[], cache: "mock", error: "NEXT_PUBLIC_SUPABASE_URL is not configured" };

  const endpoint = `${supabaseUrl}/functions/v1/fetch-content?source=${encodeURIComponent(source)}&q=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {
    next: { revalidate: 900 }
  });

  if (!response.ok) {
    return { items: [] as SignalBrief[], cache: "error", error: `Fetch failed with ${response.status}` };
  }

  return response.json() as Promise<{ items: SignalBrief[]; cache?: string; error?: string }>;
}
