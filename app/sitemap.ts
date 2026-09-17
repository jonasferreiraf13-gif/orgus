import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/data";
import { SITE_ORIGIN } from "@/lib/seo";
import { LINES } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_ORIGIN}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_ORIGIN}/empresa`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_ORIGIN}/catalogos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_ORIGIN}/transparencia`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_ORIGIN}/contato`, changeFrequency: "yearly", priority: 0.6 },
    ...LINES.map((line) => ({
      url: `${SITE_ORIGIN}/produtos/${line.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  try {
    const products = (
      await Promise.all(LINES.map((line) => getPublicProducts(line.value)))
    ).flat();

    return [
      ...staticEntries,
      ...products.map((product) => ({
        url: `${SITE_ORIGIN}/produto/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error("sitemap_products_failed", error);
    return staticEntries;
  }
}
