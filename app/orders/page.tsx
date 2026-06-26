// app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrency } from "../CurrencyContext";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

type StoredOrder = {
  id: string;
  date: string;
  status: string;
  paymentMethod: "cod" | "card";
  customer: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
};

const ORDERS_KEY = "vyra_orders_v1";

export default function OrdersPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { format, currency, setCurrency } = useCurrency();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const newOrderId = searchParams.get("new");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return;
    try {
      const parsed: StoredOrder[] = JSON.parse(raw);
      setOrders(parsed);
    } catch {
      // ignore
    }
  }, []);

  // Auto expand newest order if coming from checkout
  useEffect(() => {
    if (newOrderId) setExpandedId(newOrderId);
  }, [newOrderId]);

  const statusColor = (status: string) => {
    if (status.includes("COD")) return "bg-yellow-100 text-yellow-800";
    if (status.includes("Processing")) return "bg-blue-100 text-blue-800";
    if (status.includes("Shipped")) return "bg-purple-100 text-purple-800";
    if (status.includes("Delivered")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 text-black flex flex-col items-center justify-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-sm text-gray-600 mb-6">
          Your orders will appear here once you place one.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold"
        >
          Start shopping
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-800" />
          </button>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-widest text-gray-900">
            VYRA
          </h1>
          <span className="text-sm text-gray-500">/ Orders</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-gray-600">
            Prices shown in {currency}
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white text-gray-800"
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

      <section className="max-w-3xl mx-auto p-6 space-y-4">
        <p className="text-sm text-gray-500">
          {orders.length} order{orders.length > 1 ? "s" : ""} placed
        </p>

        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const isNew = order.id === newOrderId;
          const date = new Date(order.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={order.id}
              className={`bg-white rounded-xl border transition-all ${
                isNew
                  ? "border-black shadow-md"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {/* Order header row */}
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer"
                onClick={() =>
                  setExpandedId(isExpanded ? null : order.id)
                }
              >
                <div className="space-y-1">
                  {isNew && (
                    <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mb-1">
                      ✓ Order placed successfully
                    </span>
                  )}
                  <p className="text-xs text-gray-400 font-mono">{order.id}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    {" · "}
                    {order.items.map((i) => i.name).join(", ").slice(0, 40)}
                    {order.items.map((i) => i.name).join(", ").length > 40 ? "..." : ""}
                  </p>
                  <p className="text-xs text-gray-500">Placed on {date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <p className="text-base font-bold text-gray-900">
                    {format(order.subtotal)}
                  </p>
                  <span className="text-gray-400 text-sm">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded order details */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-4">

                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Items
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start text-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && " · "}
                              {item.color && `Color: ${item.color}`}
                              {" · "}Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900">
                            {format(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Shipping to
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.customer.fullName}
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.customer.addressLine1}
                      {order.customer.addressLine2
                        ? `, ${order.customer.addressLine2}`
                        : ""}
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.customer.city} — {order.customer.postalCode}
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.customer.country}
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Contact
                    </p>
                    <p className="text-sm text-gray-700">{order.customer.email}</p>
                    <p className="text-sm text-gray-700">{order.customer.phone}</p>
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Payment
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.paymentMethod === "cod"
                        ? "💵 Cash on delivery"
                        : "💳 Online payment"}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">
                      Order total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {format(order.subtotal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}