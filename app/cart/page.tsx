// app/cart/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { useCurrency } from "../CurrencyContext";

export default function CartPage(): React.ReactElement {
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();
  const { format } = useCurrency();

  const subtotalUSD = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!cart.length) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-sm text-gray-600 mb-4">
          Add some VYRA pieces to your cart to see them here.
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
          <h1 className="text-2xl font-bold text-gray-900">Your cart</h1>
        </div>
        <span className="text-sm text-gray-600">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </span>
      </header>

      <section className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`}
              className="flex items-center justify-between gap-4 border border-gray-200 bg-white rounded-lg p-4"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-sm text-gray-900">
                  {item.name}
                </h2>
                {(item.size || item.color) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.size && <>Size: {item.size}</>}
                    {item.size && item.color && " · "}
                    {item.color && <>Color: {item.color}</>}
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  {format(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="px-3 py-1 text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-3 py-1 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="bg-white border border-gray-200 rounded-lg p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order summary
          </h2>
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>{format(subtotalUSD)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900 mb-4">
            <span>Total</span>
            <span>{format(subtotalUSD)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold"
          >
            Checkout
          </button>
        </aside>
      </section>
    </main>
  );
}

