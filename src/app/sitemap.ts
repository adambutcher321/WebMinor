import type { MetadataRoute } from "next";
import { trades } from "@/data/trades";
import { towns } from "@/data/towns";
import { publishedCaseStudies } from "@/data/case-studies";
import { posts } from "@/data/blog";

const BASE_URL = "https://www.webminor.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/free-website-review`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/case-studies`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/web-design`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/local-seo`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/google-business-profile`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/lead-generation`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/cookies`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Individual case studies — only rows that have passed the publish gate;
  // the detail route 404s the rest, so advertising them would be dead URLs.
  const caseStudyPages: MetadataRoute.Sitemap = publishedCaseStudies.map((cs) => ({
    url: `${BASE_URL}/case-studies/${cs.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Town index pages (12)
  const townPages: MetadataRoute.Sitemap = towns.map((town) => ({
    url: `${BASE_URL}/web-design/${town.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Trade x Town pages (48)
  const tradeTownPages: MetadataRoute.Sitemap = towns.flatMap((town) =>
    trades.map((trade) => ({
      url: `${BASE_URL}/web-design/${town.slug}/${trade.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // Blog posts carry a real date, so they are the only entries with lastModified.
  // Everything else omits it: a build timestamp on every URL tells Google nothing.
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...caseStudyPages, ...townPages, ...tradeTownPages];
}
