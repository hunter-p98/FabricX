"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  created_at: string;
  status: string;
  customer: { fullName: string; email: string };
  totals: { totalUSD: number };
  items: { name: string; quantity: number; price: number }[];
  shipping_address: { city: string; country: string };
  tracking_number?: string;
  tracking_url?: string;
};

type Product = {
  id: string;
  title: string;
  visible: boolean;
  variants: { price: number }[];
  images: { src: string }[];
};

type Tab = "overview" | "orders" | "products" | "customers";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
      ]);
      if (ordersRes.status === 401 || productsRes.status === 401) {
        router.push("/admin");
        return;
      }
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      setOrders(ordersData.orders ?? []);
      setProducts(productsData.products ?? []);
      setLoading(false);
    };
    fetchAll();
  }, [router]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.totalUSD ?? 0), 0);

  const now = new Date();
  const monthlyRevenue = orders
    .filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + (o.totals?.totalUSD ?? 0), 0);

  const totalOrders = orders.length;
  const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED").length;
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  const customers = Array.from(
    new Map(orders.map((o) => [o.customer?.email, o.customer])).values()
  ).filter(Boolean);

  const topProducts = orders
    .flatMap((o) => o.items ?? [])
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] ?? 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const topProductsSorted = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const statusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-blue-100 text-blue-700";
      case "PROCESSING": return "bg-yellow-100 text-yellow-700";
      case "SHIPPED": return "bg-purple-100 text-purple-700";
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">VYRA Admin</h1>
          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-xs text-gray-500 hover:text-black transition-colors">
            View Store
          </button>
          <button
            onClick={handleLogout}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {(["overview", "orders", "products", "customers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
                { label: "This Month", value: `$${monthlyRevenue.toFixed(2)}` },
                { label: "Total Orders", value: totalOrders },
                { label: "Delivered", value: deliveredOrders },
              ].map((stat) => (
                <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Status breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Status Breakdown</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Confirmed", count: confirmedOrders, color: "bg-blue-100 text-blue-700" },
                  { label: "Processing", count: orders.filter((o) => o.status === "PROCESSING").length, color: "bg-yellow-100 text-yellow-700" },
                  { label: "Shipped", count: shippedOrders, color: "bg-purple-100 text-purple-700" },
                  { label: "Delivered", count: deliveredOrders, color: "bg-green-100 text-green-700" },
                  { label: "Cancelled", count: orders.filter((o) => o.status === "CANCELLED").length, color: "bg-red-100 text-red-700" },
                ].map((s) => (
                  <div key={s.label} className={`px-4 py-2 rounded-lg text-sm font-medium ${s.color}`}>
                    {s.label}: {s.count}
                  </div>
                ))}
              </div>
            </div>

            {/* Top products */}
            {topProductsSorted.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Selling Products</h2>
                <div className="space-y-2">
                  {topProductsSorted.map(([name, qty]) => (
                    <div key={name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 truncate flex-1 mr-4">{name}</span>
                      <span className="font-semibold text-gray-900">{qty} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{o.customer?.fullName ?? "—"}</p>
                      <p className="text-xs text-gray-500">{o.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(o.status)}`}>{o.status}</span>
                      <span className="font-semibold">${o.totals?.totalUSD?.toFixed(2) ?? "0.00"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">All Orders ({totalOrders})</h2>
            </div>
            {orders.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
                No orders yet.
              </div>
            )}
            {orders.map((o) => (
              <div key={o.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{o.customer?.fullName ?? "—"}</p>
                      <p className="text-xs text-gray-500">{o.id} · {new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(o.status)}`}>{o.status}</span>
                    <span className="text-sm font-bold">${o.totals?.totalUSD?.toFixed(2) ?? "0.00"}</span>
                    <span className="text-gray-400 text-xs">{expandedOrder === o.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expandedOrder === o.id && (
                  <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Customer</p>
                      <p className="text-sm text-gray-800">{o.customer?.fullName}</p>
                      <p className="text-sm text-gray-600">{o.customer?.email}</p>
                      <p className="text-sm text-gray-600">{o.shipping_address?.city}, {o.shipping_address?.country}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Items</p>
                      <div className="space-y-1">
                        {(o.items ?? []).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.name} × {item.quantity}</span>
                            <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {o.tracking_url && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Tracking</p>
                        <p className="text-sm text-gray-700">#{o.tracking_number}</p>
                        <a href={o.tracking_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                          Track Package
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Products ({products.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {products.map((p) => {
                const image = p.images?.[0]?.src ?? "";
                const price = p.variants?.[0]?.price ? p.variants[0].price / 100 : 0;
                return (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3">
                    {image && (
                      <img src={image} alt={p.title} className="w-full h-32 object-contain rounded mb-2 border border-gray-100" />
                    )}
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{p.title}</p>
                    <p className="text-sm font-bold text-gray-800">${price.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${p.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.visible ? "Published" : "Draft"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Customers */}
        {tab === "customers" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customers ({customers.length})</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {customers.length === 0 && (
                <p className="text-sm text-gray-500 p-6 text-center">No customers yet.</p>
              )}
              {customers.map((c, i) => {
                const customerOrders = orders.filter((o) => o.customer?.email === c?.email);
                const totalSpent = customerOrders.reduce((sum, o) => sum + (o.totals?.totalUSD ?? 0), 0);
                return (
                  <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c?.fullName}</p>
                      <p className="text-xs text-gray-500">{c?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{customerOrders.length} order{customerOrders.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}