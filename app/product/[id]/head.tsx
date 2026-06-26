// app/product/[id]/head.tsx
import type { Metadata } from "next";

// Helper: fetch product details on the server
async function fetchProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  const res = await fetch(`${baseUrl}/api/fabricx/products`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  const products = Array.isArray(data?.data) ? data.data : [];

  return products.find((p: any) => String(p.id) === String(id)) ?? null;
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.id);

  if (!product) {
    return {
      title: "Product not found – FabricX",
      description: "This product is no longer available on FabricX.",
    };
  }

  const title = `${product.title} | FabricX`;
  const description =
    (product.description as string | undefined)?.slice(0, 150) ||
    "Explore this FabricX streetwear piece, printed on demand and shipped worldwide.";

  const base = new URL("https://your-domain.com");
  const url = new URL(`/product/${params.id}`, base).toString();

  const mainImage =
    product.images?.[0]?.src ??
    "https://your-domain.com/default-og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "product",
      siteName: "FabricX",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}