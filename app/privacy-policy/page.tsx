"use client";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm">
        <button onClick={() => router.push("/")} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors">Back</button>
        <h1 className="font-[family-name:var(--font-exo2)] text-3xl tracking-tight text-gray-900">VYRA</h1>
      </header>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Introduction</h3>
            <p>VYRA is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your personal data.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Information We Collect</h3>
            <p className="mb-3">When you place an order or contact us, we collect:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping address</li>
              <li>Payment information (processed securely by Payoneer — we never store card details)</li>
              <li>Order history</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How We Use Your Information</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmation and shipping updates</li>
              <li>To respond to your customer support inquiries</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Who We Share Your Data With</h3>
            <p className="mb-3">We only share your data with trusted third parties necessary to fulfill your order:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Printify</strong> — our print and fulfillment partner, receives your name and shipping address to produce and deliver your order</li>
              <li><strong>Payoneer</strong> — our payment processor, handles payment securely</li>
              <li><strong>Shipping carriers</strong> — USPS, FedEx, DHL receive your address for delivery</li>
            </ul>
            <p className="mt-3">We never sell your personal data to any third party.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cookies</h3>
            <p>Our website uses essential cookies to keep your cart and session active. We do not use advertising or tracking cookies.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Data Retention</h3>
            <p>We retain your order information for up to 2 years for legal and accounting purposes. You can request deletion of your data at any time by contacting us.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your Rights</h3>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h3>
            <p>For any privacy related questions or requests contact us at support@vyra.com and we will respond within 24 hours.</p>
          </div>
        </div>
      </section>
    </main>
  );
}