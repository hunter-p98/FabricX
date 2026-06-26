export default function ProductJsonLd({
  id,
  title,
  description,
  image,
  price,
}: {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}) {
  const BASE_URL = "https://your-domain.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image,
    url: `${BASE_URL}/product/${id}`,
    brand: {
      "@type": "Brand",
      name: "VYRA",
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/product/${id}`,
      seller: {
        "@type": "Organization",
        name: "VYRA",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}