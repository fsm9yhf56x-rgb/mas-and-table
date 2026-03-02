import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://masandtable.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/experiences`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const [experiencesResult, blogResult] = await Promise.allSettled([
    supabase.from("experiences").select("slug, updated_at").eq("is_published", true),
    supabase.from("blog_posts").select("slug, published_at").eq("is_published", true),
  ]);

  const experiencePages: MetadataRoute.Sitemap =
    experiencesResult.status === "fulfilled"
      ? (experiencesResult.value.data ?? []).map((exp) => ({
          url: `${BASE_URL}/experiences/${exp.slug}`,
          lastModified: new Date(exp.updated_at ?? new Date()),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }))
      : [];

  const blogPages: MetadataRoute.Sitemap =
    blogResult.status === "fulfilled"
      ? (blogResult.value.data ?? []).map((post) => ({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.published_at ?? new Date()),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : [];

  return [...staticPages, ...experiencePages, ...blogPages];
}