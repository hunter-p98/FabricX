import type { Metadata } from "next";

const BASE_URL = "https://your-domain.com";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.PRINTIFY_BASE_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/products/${params.id}.json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error("Not found");

    const product = await res.json();
    const title = product.title ?? "VYRA Product";
    const description =
      product.description?.slice(0, 160) ||
      `Shop ${title} at VYRA — premium print-on-demand streetwear shipped worldwide.`;
    const image = product.images?.[0]?.src;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | VYRA`,
        description,
        url: `${BASE_URL}/product/${params.id}`,
        images: image ? [{ url: image, width: 800, height: 800, alt: title }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | VYRA`,
        description,
        images: image ? [image] : [],
      },
      alternates: {
        canonical: `${BASE_URL}/product/${params.id}`,
      },
    };
  } catch {
    return {
      title: "Product | VYRA",
      description: "Shop premium streetwear at VYRA.",
    };
  }
}