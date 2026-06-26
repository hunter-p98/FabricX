"use client";
import { useRouter } from "next/navigation";

export default function ShippingPolicyPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm">
        <button onClick={() => router.push("/")} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors">Back</button>
        <h1 className="font-[family-name:var(--font-exo2)] text-3xl tracking-tight text-gray-900">VYRA</h1>
      </header>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shipping Policy</h2>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Where We Ship</h3>
            <p>VYRA ships worldwide. Our primary markets are the United States, Australia, and Canada. We also ship to most other countries globally.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Time</h3>
            <p>Every product is made on demand. After your order is placed it takes 2 to 5 business days for your item to be printed, quality checked, and packed before it is handed to the shipping carrier.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delivery Times</h3>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>United States:</strong> 5 to 10 business days after processing</li>
              <li><strong>Australia:</strong> 7 to 14 business days after processing</li>
              <li><strong>Canada:</strong> 7 to 14 business days after processing</li>
              <li><strong>United Kingdom:</strong> 5 to 10 business days after processing</li>
              <li><strong>Rest of World:</strong> 10 to 20 business days after processing</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Shipping Costs</h3>
            <p>VYRA offers free worldwide shipping on all orders. No minimum order required.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Order Tracking</h3>
            <p>Once your order is shipped you will receive a tracking number via email. You can use this to track your package directly on the carrier's website. Tracking information may take 24 to 48 hours to update after shipment.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Lost or Delayed Orders</h3>
            <p>If your order has not arrived within the estimated delivery window please contact us at support@vyra.com with your order ID. We will investigate and either resend your order or issue a full refund.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Customs and Duties</h3>
            <p>International orders may be subject to customs fees or import duties depending on your country. These charges are the responsibility of the customer and are not included in the product price or shipping cost.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Questions?</h3>
            <p>Contact us at support@vyra.com and we will respond within 24 hours.</p>
          </div>
        </div>
      </section>
    </main>
  );
}