import type { MetadataRoute } from "next";
import { client } from "@/lib/sanityClient";
import { allPostSlugsQuery } from "@/lib/sanityQueries";

const BASE_URL = "https://vyrastore.vercel.app";

type ProductLite = {
  id: string | number;
  updatedAt?: string | Date | null;
};

async function getAllProducts(): Promise<ProductLite[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/fabricx/products`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const candidate = data?.products ?? data;
    return Array.isArray(candidate) ? (candidate as ProductLite[]) : [];
  } catch {
    return [];
  }
}

async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const slugs: { slug: string }[] = await client.fetch(allPostSlugsQuery);
    return slugs.map((s) => s.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  const products = await getAllProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${String(product.id)}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogSlugs = await getAllBlogSlugs();
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}

