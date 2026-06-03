import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, json, normalizeGithub, normalizeGNews, normalizeGuardian, normalizeRss } from "../_shared/normalizers.ts";
import { edgeSources } from "../_shared/sources.ts";

const cacheTtlMs = 15 * 60 * 1000;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(request.url);
  const sourceId = url.searchParams.get("source") ?? "bbc-world-rss";
  const query = url.searchParams.get("q") ?? "world";
  const source = edgeSources.find((item) => item.id === sourceId);

  if (!source) return json({ error: "Unknown source" }, { status: 404 });
  if (source.mode === "directory_only" || source.mode === "official_update_page" || source.mode === "community_trend") {
    return json({
      source,
      items: [],
      message: source.mode === "community_trend"
        ? "This source is treated as community pulse only and is not mixed with verified news."
        : "This source is linked or monitored only. Full content is not scraped."
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = supabaseUrl && serviceRole ? createClient(supabaseUrl, serviceRole) : null;
  const cacheKey = `source:${sourceId}:q:${query}`;

  if (supabase) {
    const { data } = await supabase.from("content_cache").select("payload, fetched_at").eq("cache_key", cacheKey).maybeSingle();
    const fetchedAt = data?.fetched_at ? new Date(data.fetched_at).getTime() : 0;
    if (data?.payload && Date.now() - fetchedAt < cacheTtlMs) {
      return json({ source, items: data.payload, cache: "hit" });
    }
  }

  let items = [];

  if (source.mode === "rss" && source.feedUrl) {
    const response = await fetch(source.feedUrl, { headers: { "User-Agent": "ChoyisNewsBot/0.1 metadata-only" } });
    const xml = await response.text();
    items = normalizeRss(xml, source);
  }

  if (source.apiProvider === "guardian") {
    const apiKey = Deno.env.get("GUARDIAN_API_KEY");
    if (!apiKey) return json({ error: "GUARDIAN_API_KEY is not configured" }, { status: 500 });
    const endpoint = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&show-fields=trailText,thumbnail&api-key=${apiKey}`;
    const payload = await fetch(endpoint).then((response) => response.json());
    items = normalizeGuardian(payload, source);
  }

  if (source.apiProvider === "gnews") {
    const apiKey = Deno.env.get("GNEWS_API_KEY");
    if (!apiKey) return json({ error: "GNEWS_API_KEY is not configured" }, { status: 500 });
    const endpoint = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${apiKey}`;
    const payload = await fetch(endpoint).then((response) => response.json());
    items = normalizeGNews(payload, source);
  }

  if (source.apiProvider === "github") {
    const token = Deno.env.get("GITHUB_TOKEN");
    const endpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=15`;
    const payload = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }).then((response) => response.json());
    items = normalizeGithub(payload, source);
  }

  if (supabase) {
    await supabase.from("content_cache").upsert({
      cache_key: cacheKey,
      payload: items,
      fetched_at: new Date().toISOString()
    });
  }

  return json({ source, items, cache: "miss" });
});
