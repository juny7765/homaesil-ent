import type { MetadataRoute } from "next";
import { PAGES, CLINIC } from "@/lib/content";
import { getPosts } from "@/lib/cms";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    ...PAGES.map((p) => ({ url: CLINIC.site + p.url, changeFrequency: "monthly" as const, priority: p.type === "intro" ? 1 : p.type === "main" ? 0.9 : 0.7 })),
    ...posts.map((p) => ({ url: `${CLINIC.site}/health/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
