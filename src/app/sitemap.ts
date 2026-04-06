import type { MetadataRoute } from "next";
import { SITE_CONTENT_LAST_MODIFIED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE_CONTENT_LAST_MODIFIED);
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/crisis-advisory`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/restructuring`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/financial-structuring`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/strategic-mentoring`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
