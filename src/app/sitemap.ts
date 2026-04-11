import type { MetadataRoute } from "next";
import { CAT_DATA, DOG_DATA } from "../lib/wikiData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pet-eto.vercel.app";

  const staticPages = [
    { url: base, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/feed`, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${base}/wiki`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/wiki/cat`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/wiki/dog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/community`, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/auth/login`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${base}/auth/signup`, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const catBreeds = CAT_DATA.breeds.map((b) => ({
    url: `${base}/wiki/cat/${b.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const dogBreeds = DOG_DATA.breeds.map((b) => ({
    url: `${base}/wiki/dog/${b.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...catBreeds, ...dogBreeds];
}
