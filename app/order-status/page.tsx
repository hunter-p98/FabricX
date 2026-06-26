"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrency } from "../CurrencyContext";

type OrderStatus = "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type StoredOrder = {
  id: string;
  created_at?: string;
  status: OrderStatus;
  tracking_url?: string;
  tracking_number?: string;
  carrier?: string;
  items: {
    id: number;
    name: string;
    price: number;
    size?: string;
    color?: string;
    quantity: number;
  }[];
  totals: {
    subtotalUSD: number;
    shippingUSD: number;
    totalUSD: number;
  };
  customer: {
    email: string;
    fullName: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

const STATUS_STEPS: OrderStatus[] = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  CONFIRMED: "Your order is confirmed and being sent to our print partner.",
  PROCESSING: "Your items are being printed and prepared for shipment.",
  SHIPPED: "Your package is on its way!",
  DELIVERED: "Your order has been delivered. Enjoy your VYRA pieces!",
  CANCELLED: "This order has been cancelled.",
};

export default function OrderStatusPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { format, currency, setCurrency } = useCurrency();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const orderId =
    searchParams.get("id") ??
    (typeof window !== "undefined"
      ? localStorage.getItem("vyra_last_order_id")
      : null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data: StoredOrder = await res.json();
        setOrder(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 text-black flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading your order...</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen bg-gray-50 text-black flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-sm text-gray-600 mb-4">
          We could not find that order. Please check your confirmation email.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          Back to home
        </button>
      </main>
    );
  }

  const createdDate = new Date(order.created_at ?? "").toLocaleString();
  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order status</h1>
          <p className="text-xs text-gray-600 mt-1">
            Order {order.id} - Placed on {createdDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as never)}
            className="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white text-gray-800"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </header>

      <section className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Delivery progress</h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-600 text-xl">X</span>
              <div>
                <p className="font-semibold text-red-700">Order Cancelled</p>
                <p className="text-sm text-red-600">This order has been cancelled.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isLast = index === STATUS_STEPS.length - 1;
                  return (
                    <div key={step} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${isCompleted ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                          {isCompleted ? "v" : index + 1}
                        </div>
                        <span className="mt-1 text-xs text-gray-700 text-center">
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`h-px flex-1 transition-colors ${index < currentStepIndex ? "bg-black" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {STATUS_DESCRIPTIONS[order.status]}
              </p>
            </>
          )}

          {order.tracking_url && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-1">Tracking info</p>
              {order.carrier && (
                <p className="text-xs text-gray-600 mb-1">Carrier: {order.carrier}</p>
              )}
              {order.tracking_number && (
                <p className="text-xs text-gray-600 mb-2">Tracking number: {order.tracking_number}</p>
              )}
              <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="inline-block text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                Track your package
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">What you ordered</h2>
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.quantity}`} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.size && <span className="mr-2">Size: {item.size}</span>}
                        {item.color && <span className="mr-2">Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-sm text-gray-800">{format(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">Shipping details</h2>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-semibold">{order.customer.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="text-xs text-gray-500 mt-2">Confirmation sent to {order.customer.email}</p>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Order summary</h2>
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span>Items ({order.items.length})</span>
                <span>{format(order.totals.subtotalUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-700">{order.totals.shippingUSD === 0 ? "Free" : format(order.totals.shippingUSD)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-1">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold">Order total</span>
                <span className="text-base font-bold">{format(order.totals.totalUSD)}</span>
              </div>
              <button onClick={() => router.push("/orders")} className="w-full bg-black text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors">
                View order history
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}