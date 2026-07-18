"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { useCurrency } from "../CurrencyContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage(): React.ReactElement {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { format } = useCurrency();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("IN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = cart ?? [];
  const subtotalUSD = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 text-black flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">No items to checkout</h1>
        <p className="text-sm text-gray-600 mb-4">Add some products to your cart before checking out.</p>
        <button onClick={() => router.push("/")} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Browse products
        </button>
      </main>
    );
  }

  const handlePlaceOrder = async () => {
    if (!fullName || !email || !addressLine1 || !city || !postalCode) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Razorpay order
      const razorpayRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotalUSD }),
      });

      if (!razorpayRes.ok) {
        setError("Failed to initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency } = await razorpayRes.json();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "VYRA",
        description: "Premium Streetwear",
        order_id: orderId,
        prefill: {
          name: fullName,
          email,
        },
        theme: { color: "#000000" },
        handler: async (response: any) => {
          // 3. Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyRes.ok) {
            setError("Payment verification failed. Contact support.");
            setLoading(false);
            return;
          }

          // 4. Create order in Supabase + submit to Printify
          const vyraOrderId = `VY${Date.now().toString().slice(-8).toUpperCase()}`;
          const orderPayload = {
            id: vyraOrderId,
            status: "CONFIRMED",
            items,
            totals: { subtotalUSD, shippingUSD: 0, totalUSD: subtotalUSD },
            customer: { email, fullName },
            shippingAddress: { addressLine1, addressLine2, city, state, postalCode, country },
          };

          await fetch("/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
          });

          localStorage.setItem("vyra_last_order_id", vyraOrderId);

          // 5. Send confirmation email
          try {
            await fetch("/api/send-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                fullName,
                items,
                total: subtotalUSD.toFixed(2),
                orderId: vyraOrderId,
                address: { line1: addressLine1, line2: addressLine2, city, postalCode, country },
              }),
            });
          } catch (e) {
            console.error("Email failed:", e);
          }

          clearCart();
          router.push(`/order-status?id=${vyraOrderId}`);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
        <span className="text-sm text-gray-600">{items.length} item{items.length > 1 ? "s" : ""} in cart</span>
      </header>

      <section className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        {/* Left: shipping */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full name <span className="text-red-500">*</span></label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email address <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address line 1 <span className="text-red-500">*</span></label>
                <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="Street, house no." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address line 2 (optional)</label>
                <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="Apartment, landmark" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="Hyderabad" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="Telangana" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Postal code <span className="text-red-500">*</span></label>
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black" placeholder="500001" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-black">
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="CA">Canada</option>
                    <option value="EU">European Union</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <aside className="bg-white border border-gray-200 rounded-lg p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`} className="flex justify-between text-sm text-gray-800">
                <div>
                  <p>{item.name}</p>
                  {(item.size || item.color) && (
                    <p className="text-xs text-gray-500">
                      {item.size && <>Size: {item.size}</>}
                      {item.size && item.color && " · "}
                      {item.color && <>Color: {item.color}</>}
                    </p>
                  )}
                </div>
                <p>{item.quantity} × {format(item.price)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>{format(subtotalUSD)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Shipping</span>
            <span>Calculated at shipping stage</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900 mb-4">
            <span>Total</span>
            <span>{format(subtotalUSD)}</span>
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : `Pay ${format(subtotalUSD)}`}
          </button>

          <p className="mt-3 text-xs text-gray-400 text-center">🔒 Secured by Razorpay</p>
        </aside>
      </section>
    </main>
  );
}

