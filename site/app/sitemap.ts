import type { MetadataRoute } from "next";
import { components } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/* Every page the site builds: the doc pages, the component list and one page per component. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/get-started/", "/foundations/", "/components/", "/ai/", "/brand/", "/changelog/", "/roadmap/"];
  return [...pages, ...components().map((c) => `/components/${c.slug}/`)].map((p) => ({ url: `${SITE_URL}${p}` }));
}
