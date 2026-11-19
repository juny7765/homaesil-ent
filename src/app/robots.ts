import type { MetadataRoute } from "next";
import { CLINIC } from "@/lib/content";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/"] }, sitemap: `${CLINIC.site}/sitemap.xml` };
}
