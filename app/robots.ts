import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/cart",
          "/checkout",
          "/order-status",
          "/orders",
        ],
      },
    ],
    sitemap: "https://vyra.vercel.app/sitemap.xml",
  };
}