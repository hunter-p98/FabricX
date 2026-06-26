// app/wishlist/page.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { useCurrency } from "../CurrencyContext";
import { useProducts } from "../ProductsContext";

export default function WishlistPage(): JSX.Element {
  const router = useRouter();
  const { wishlist, toggleWishlist, isInWishlist, addItem } = useCart();
  const { products } = useProducts();
  const { format } = useCurrency();

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlist.includes(String(p.id))),
    [products, wishlist]
  );

  const handleAddToCart = (p: any) => {
    const firstVariantPrice =
      p.variants && p.variants.length > 0 ? p.variants[0].price / 100 : 30;

    addItem({
      id: String(p.id),
      name: p.title,
      price: firstVariantPrice,
      size: "Default",
    });
  };

  if (!wishlistProducts.length) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-sm text-gray-600 mb-4">
          Tap the heart icon on any product to save it for later.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold"
        >
          Browse products
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black hover:text-black transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your wishlist</h1>
        </div>
        <button
          onClick={() => router.push("/cart")}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm hover:border-black hover:text-black transition-colors"
        >
          Go to cart
        </button>
      </header>

      <section className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((p) => {
            const mainImage =
              p.images?.find((img: any) => img.is_default)?.src ??
              p.images?.[0]?.src ??
              "https://via.placeholder.com/200";

            const firstVariantPrice =
              p.variants && p.variants.length > 0
                ? p.variants[0].price / 100
                : 30;

            return (
              <div
                key={p.id}
                className="group border border-gray-200 p-3 rounded-lg bg-white transition duration-200 hover:shadow-md hover:border-black relative"
              >
                {/* Wishlist heart */}
                <button
                  onClick={() => toggleWishlist(String(p.id))}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white"
                  aria-label="Toggle wishlist"
                >
                  <span className="text-gray-900 text-sm">
                    {isInWishlist(String(p.id)) ? "♥" : "♡"}
                  </span>
                </button>

                <div
                  className="mb-2 rounded border border-gray-200 overflow-hidden w-full h-48 bg-white cursor-pointer"
                  onClick={() => router.push(`/product/${p.id}`)}
                >
                  <img
                    src={mainImage}
                    alt={p.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h2 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
                  {p.title}
                </h2>
                <p className="text-gray-800 font-semibold text-sm mt-1">
                  {format(firstVariantPrice)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="flex-1 bg-black text-white px-2 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-900 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => router.push(`/product/${p.id}`)}
                    className="flex-1 border border-black text-black px-2 py-1.5 rounded-md text-xs font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
