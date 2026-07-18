import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "./CurrencyContext";
import { CartProvider } from "./CartContext";
import { ProductsProvider } from "./ProductsContext";

const BASE_URL = "https://vyrastore.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VYRA - Wear Love. Wear Memories.",
    template: "%s | VYRA",
  },
  description:
    "VYRA turns your favorite moments into wearable pieces. Custom graphic tees, hoodies, and more, printed on demand and shipped worldwide.",
  keywords: [
    "streetwear",
    "print on demand",
    "graphic tees",
    "hoodies",
    "VYRA",
    "custom clothing",
    "online fashion store",
    "personalized clothing",
    "wear love wear memories",
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
    title: "VYRA - Wear Love. Wear Memories.",
    description:
      "VYRA turns your favorite moments into wearable pieces. Printed on demand, shipped worldwide.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "VYRA - Wear Love. Wear Memories.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VYRA - Wear Love. Wear Memories.",
    description:
      "VYRA turns your favorite moments into wearable pieces. Printed on demand, shipped worldwide.",
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
        <meta name="google-site-verification" content="R-YhPaIsZtHPY6_fue0BqKgh4QOYpM0tHYVy6cdptIY" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="VYRA" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
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
