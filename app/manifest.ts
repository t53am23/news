import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Choyis news",
    short_name: "Choyis",
    description: "Premium news, policy, visa, and trend intelligence briefings.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1118",
    theme_color: "#2f7cf6",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ]
  };
}
