import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "./CurrencyContext";
import { CartProvider } from "./CartContext";
import { ProductsProvider } from "./ProductsContext";

const BASE_URL = "https://vyra.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VYRA – Premium Streetwear & Print-On-Demand Fashion",
    template: "%s | VYRA",
  },
  description:
    "Shop VYRA for premium streetwear, graphic tees, hoodies, and more. Printed on demand, shipped worldwide. Fresh drops, multi-currency checkout.",
  keywords: [
    "streetwear",
    "print on demand",
    "graphic tees",
    "hoodies",
    "VYRA",
    "premium streetwear",
    "custom clothing",
    "online fashion store",
    "dark aesthetic clothing",
    "independent streetwear brand",
  ],
  authors: [{ name: "VYRA", url: BASE_URL }],
  creator: "VYRA",
  publisher: "VYRA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "VYRA",
    title: "VYRA – Premium Streetwear & Print-On-Demand Fashion",
    description:
      "Shop VYRA for premium streetwear, graphic tees, hoodies, and more. Printed on demand, shipped worldwide.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "VYRA – Premium Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VYRA – Premium Streetwear & Print-On-Demand Fashion",
    description:
      "Shop VYRA for premium streetwear, graphic tees, hoodies, and more. Printed on demand, shipped worldwide.",
    images: [`${BASE_URL}/og-image.jpg`],
    creator: "@vyrastore",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={BASE_URL} />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="VYRA" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <CurrencyProvider>
          <CartProvider>
            <ProductsProvider>{children}</ProductsProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}