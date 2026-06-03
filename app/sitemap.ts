import type { MetadataRoute } from "next";
import { briefs } from "@/lib/mock-data";
import { coreSections, visaCountries } from "@/lib/navigation";
import { countries } from "@/lib/source-registry";
import { getBaseUrl, slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const staticRoutes = ["", "source-directory", "saved-items", "about", "contact-support", "privacy-policy", "terms-of-use", "disclaimer"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...coreSections.map((section) => ({
      url: `${baseUrl}/${section.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    })),
    ...visaCountries.map((country) => ({
      url: `${baseUrl}/visa/${slugify(country)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85
    })),
    ...countries.filter((country) => country !== "Global").map((country) => ({
      url: `${baseUrl}/local/${slugify(country)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85
    })),
    ...briefs.map((brief) => ({
      url: `${baseUrl}/brief/${brief.id}`,
      lastModified: new Date(brief.publishedAt),
      changeFrequency: "daily" as const,
      priority: 0.8
    }))
  ];
}
