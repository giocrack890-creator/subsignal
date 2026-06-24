import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/auth/urls";

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/onboarding", "/settings", "/signals", "/keywords", "/drafts", "/analytics"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
