"use client";
import { useRouter } from "next/navigation";

export default function RefundPolicyPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm">
        <button onClick={() => router.push("/")} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors">Back</button>
        <h1 className="font-[family-name:var(--font-exo2)] text-3xl tracking-tight text-gray-900">VYRA</h1>
      </header>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h2>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Policy</h3>
            <p>Every VYRA product is made on demand specifically for you. Because of this we do not accept returns or exchanges for reasons such as wrong size ordered or change of mind. However we are fully committed to making things right if something goes wrong on our end.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Eligible for Refund or Replacement</h3>
            <p className="mb-3">You are eligible for a full refund or free replacement if:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>The product arrives damaged or defective</li>
              <li>The product has a manufacturing defect such as wrong print or misaligned design</li>
              <li>You received the wrong item</li>
              <li>The product was lost in transit and never delivered</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How to Request a Refund</h3>
            <p className="mb-3">Contact us within 14 days of receiving your order:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Email us at support@vyra.com</li>
              <li>Include your order ID</li>
              <li>Attach a clear photo of the issue</li>
            </ul>
            <p className="mt-3">We will respond within 24 hours and resolve your issue as quickly as possible.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Not Eligible for Refund</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Wrong size ordered by the customer</li>
              <li>Change of mind after order is placed</li>
              <li>Slight color variations due to screen display differences</li>
              <li>Requests made after 14 days of delivery</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Refund Timeline</h3>
            <p>Once your refund is approved it will be processed within 5 to 10 business days back to your original payment method.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Questions?</h3>
            <p>Reach out to us at support@vyra.com and we will get back to you within 24 hours.</p>
          </div>
        </div>
      </section>
    </main>
  );
}