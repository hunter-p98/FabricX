"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../CartContext";
import { useCurrency } from "../../CurrencyContext";
import { useProducts } from "../../ProductsContext";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

type ColorSwatch = { name: string; hex?: string };

function resolveOptionId(raw: any): number | null {
  if (typeof raw === "number") return raw;
  if (typeof raw === "object" && raw !== null && typeof raw.id === "number") return raw.id;
  return null;
}

export default function ProductPageClient(): React.ReactElement {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { currency, setCurrency, format } = useCurrency();
  const { products, loading } = useProducts();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(params.id)) ?? null,
    [products, params.id]
  );

  const options = product?.options ?? [];
  const variants = (product?.variants as any[]) ?? [];
  const images = product?.images ?? [];

  const colorOptIndex = useMemo(() => {
    if (!Array.isArray(options)) return -1;
    return options.findIndex((o: any) => {
      const type = o.type?.toLowerCase?.() ?? "";
      const name = o.name?.toLowerCase?.() ?? "";
      return type.includes("color") || name.includes("color");
    });
  }, [options]);

  const sizeOptIndex = useMemo(
    () => options.findIndex((o: any) => o.type?.toLowerCase() === "size" || o.name?.toLowerCase() === "size"),
    [options]
  );

  const { colorById, sizeById } = useMemo(() => {
    const result = {
      colorById: new Map<number, { title: string; hex?: string }>(),
      sizeById: new Map<number, { title: string }>(),
    };
    if (colorOptIndex !== -1) {
      const values = options[colorOptIndex]?.values;
      if (Array.isArray(values)) {
        values.forEach((v: any) => {
          if (!v || typeof v.id !== "number") return;
          result.colorById.set(v.id, {
            title: v.title ?? "",
            hex: Array.isArray(v.colors) && v.colors.length > 0 ? v.colors[0] : undefined,
          });
        });
      }
    }
    if (sizeOptIndex !== -1) {
      const values = options[sizeOptIndex]?.values;
      if (Array.isArray(values)) {
        values.forEach((v: any) => {
          if (!v || typeof v.id !== "number") return;
          result.sizeById.set(v.id, { title: v.title ?? "" });
        });
      }
    }
    return result;
  }, [options, colorOptIndex, sizeOptIndex]);

  const colorOptions: ColorSwatch[] = useMemo(() => {
    if (colorOptIndex === -1 || !colorById.size) return [];
    const seen = new Map<string, ColorSwatch>();
    variants.forEach((v: any) => {
      const enabled = v.is_enabled === undefined ? true : v.is_enabled !== false;
      if (!enabled) return;
      const opts = Array.isArray(v.options) ? v.options : [];
      const colorId = resolveOptionId(opts[colorOptIndex]);
      if (colorId === null) return;
      const entry = colorById.get(colorId);
      if (!entry) return;
      const title = entry.title?.trim();
      if (!title || seen.has(title)) return;
      seen.set(title, { name: title, hex: entry.hex });
    });
    return Array.from(seen.values());
  }, [variants, colorOptIndex, colorById]);

  const sizeOptions: string[] = useMemo(() => {
    if (sizeOptIndex === -1 || !sizeById.size) return [];
    const seen = new Map<string, string>();
    variants.forEach((v: any) => {
      const enabled = v.is_enabled === undefined ? true : v.is_enabled !== false;
      if (!enabled) return;
      const opts = Array.isArray(v.options) ? v.options : [];
      const sizeId = resolveOptionId(opts[sizeOptIndex]);
      if (sizeId === null) return;
      const entry = sizeById.get(sizeId);
      if (!entry) return;
      const title = entry.title?.trim();
      if (!title || seen.has(title)) return;
      seen.set(title, title);
    });
    return Array.from(seen.values());
  }, [variants, sizeOptIndex, sizeById]);

  const activeVariant = useMemo(() => {
    if (!product || !variants.length) return null;
    return variants.find((v: any) => {
      const enabled = v.is_enabled === undefined ? true : v.is_enabled !== false;
      if (!enabled) return false;
      const opts = Array.isArray(v.options) ? v.options : [];
      let colorTitle: string | null = null;
      if (colorOptIndex !== -1) {
        const colorId = resolveOptionId(opts[colorOptIndex]);
        if (colorId !== null) colorTitle = colorById.get(colorId)?.title?.trim() ?? null;
      }
      let sizeTitle: string | null = null;
      if (sizeOptIndex !== -1) {
        const sizeId = resolveOptionId(opts[sizeOptIndex]);
        if (sizeId !== null) sizeTitle = sizeById.get(sizeId)?.title?.trim() ?? null;
      }
      const colorMatch = selectedColor == null || colorOptIndex === -1 ? true : colorTitle === selectedColor;
      const sizeMatch = selectedSize == null || sizeOptIndex === -1 ? true : sizeTitle === selectedSize;
      return colorMatch && sizeMatch;
    }) || null;
  }, [product, variants, selectedColor, selectedSize, colorOptIndex, sizeOptIndex, colorById, sizeById]);

  if (loading && !product) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <p className="mb-4 text-xl">Product not found.</p>
        <button onClick={() => router.push("/")} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
          Back to Home
        </button>
      </main>
    );
  }

  const imagesArr = images ?? [];
  const mainImage = imagesArr[selectedImageIndex]?.src ?? "";

  const handleAddToCart = () => {
    if (!selectedSize && sizeOptions.length) { alert("Please select a size before adding to cart."); return; }
    if (!selectedColor && colorOptions.length) { alert("Please select a color before adding to cart."); return; }
    const variant = activeVariant || variants[0];
    if (!variant) { alert("Unable to find any variant for this product."); return; }
    addItem({
      id: String(product.id),
      name: product.title,
      price: variant.price != null ? variant.price / 100 : 0,
      size: selectedSize,
      color: selectedColor,
      variantId: variant.id,
    } as any);
  };

  const handleBuyNow = () => { handleAddToCart(); router.push("/checkout"); };

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="font-[family-name:var(--font-exo2)] text-4xl tracking-tight text-gray-900">VYRA</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-gray-600">Prices shown in {currency}</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white text-gray-800 max-w-[220px]"
          >
            <option value="USD">USD - US dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="INR">INR - Indian rupee</option>
            <option value="GBP">GBP - Pound sterling</option>
            <option value="JPY">JPY - Japanese yen</option>
            <option value="AUD">AUD - Australian dollar</option>
            <option value="CAD">CAD - Canadian dollar</option>
            <option value="CHF">CHF - Swiss franc</option>
          </select>
        </div>
      </header>

      <section className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="relative bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center mb-4 min-h-[400px]">
            <button
              onClick={() => toggleWishlist(String(product.id))}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm z-10"
              aria-label="Toggle wishlist"
            >
              <span className="text-gray-900 text-2xl">{isInWishlist(String(product.id)) ? "♥" : "♡"}</span>
            </button>
            {mainImage ? (
              <div className="relative w-full h-[400px]">
                <Image
                  src={mainImage}
                  alt={`${product.title} VYRA streetwear`}
                  fill
                  className="object-contain rounded"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
          </div>
          {imagesArr.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {imagesArr.map((img, index) => (
                <button
                  key={img.src + index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border rounded-lg p-1 flex-shrink-0 ${index === selectedImageIndex ? "border-yellow-500" : "border-gray-200"}`}
                >
                  <div className="relative h-20 w-20">
                    <Image
                      src={img.src}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2>
          {activeVariant && (
            <p className="text-3xl font-extrabold text-gray-900">{format(activeVariant.price / 100)}</p>
          )}

          {colorOptions.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color, index) => {
                  const isSelected = selectedColor === color.name;
                  const hasHex = !!color.hex;
                  return (
                    <button
                      key={`${color.name}-${index}`}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-full border transition-all ${isSelected ? "border-black bg-black/5" : "border-gray-300 hover:border-black"}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full border border-gray-300 ${hasHex ? "" : "bg-gray-200"}`}
                        style={hasHex ? { backgroundColor: color.hex } : {}}
                      />
                      <span className="text-xs text-gray-900">{color.name}</span>
                    </button>
                  );
                })}
              </div>
              {selectedColor && <p className="mt-2 text-sm text-green-600">Selected color: {selectedColor}</p>}
            </div>
          )}

          {sizeOptions.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Size</h3>
                <button type="button" onClick={() => setShowSizeGuide(true)} className="text-xs px-3 py-1 rounded-full border border-gray-400 text-gray-800 hover:border-black transition-colors">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((size, index) => (
                  <button
                    key={`${size}-${index}`}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedSize === size ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-300 hover:border-black"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && <p className="mt-2 text-sm text-green-600">Selected size: {selectedSize}</p>}
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Product details</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description && product.description.trim().length > 0
                ? product.description
                : `This ${product.title} is part of the VYRA streetwear collection. Premium construction, soft feel, and everyday comfort.`}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold">
                <ShoppingCartIcon className="h-5 w-5" />
                Add to cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold">
                Order now
              </button>
            </div>
          </div>

          {showSizeGuide && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Size guide</h3>
                <table className="w-full text-xs text-gray-700 mb-4 border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-2 py-1 text-left">Size</th>
                      <th className="border px-2 py-1 text-left">Chest (in)</th>
                      <th className="border px-2 py-1 text-left">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[["S","34-36","27"],["M","38-40","28"],["L","42-44","29"],["XL","46-48","30"]].map(([s,c,l]) => (
                      <tr key={s}>
                        <td className="border px-2 py-1">{s}</td>
                        <td className="border px-2 py-1">{c}</td>
                        <td className="border px-2 py-1">{l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={() => setShowSizeGuide(false)} className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
