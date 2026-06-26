"use client";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm">
        <button onClick={() => router.push("/")} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors">Back</button>
        <h1 className="text-xl font-bold text-gray-900">VYRA</h1>
      </header>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h2>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Agreement</h3>
            <p>By accessing or placing an order on VYRA you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Products</h3>
            <p>All products are printed on demand. Colors may slightly vary from what is displayed on screen due to monitor differences. We reserve the right to discontinue any product at any time.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Orders</h3>
            <p>Once an order is placed and confirmed it cannot be cancelled or modified as production begins immediately. Please review your order carefully before placing it.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pricing</h3>
            <p>All prices are displayed in your selected currency. VYRA reserves the right to change prices at any time. Your order will be charged at the price shown at the time of purchase.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Intellectual Property</h3>
            <p>All designs, logos, and content on VYRA are the property of VYRA. You may not reproduce, distribute, or use any content without our written permission.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Limitation of Liability</h3>
            <p>VYRA is not liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our maximum liability is limited to the amount you paid for your order.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Governing Law</h3>
            <p>These terms are governed by the laws of India. Any disputes will be resolved in the courts of Hyderabad, Telangana.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contact</h3>
            <p>For any questions about these terms contact us at support@vyra.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}