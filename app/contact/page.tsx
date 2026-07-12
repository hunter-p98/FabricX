// app/contact/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage(): React.ReactElement {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors"
          >
            Back
          </button>
          <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl tracking-tight text-gray-900">
            VYRA
          </h1>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-12">
        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-sm text-gray-500 mb-8">
              Have a question about your order, a product, or anything else? We usually respond within 24 hours.
            </p>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-black transition-colors ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-black transition-colors ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="you@email.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-black transition-colors bg-white ${errors.subject ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select a subject</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Shipping Question">Shipping Question</option>
                  <option value="Refund Request">Refund Request</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Other">Other</option>
                </select>
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: "" })); }}
                  rows={5}
                  className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-black transition-colors resize-none ${errors.message ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Tell us how we can help..."
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              {submitError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "📧", label: "Email", value: "vyrastore07@gmail.com" },
                { icon: "⏰", label: "Response Time", value: "Within 24 hours" },
                { icon: "📦", label: "Order Issues", value: "Priority support" },
              ].map((item) => (
                <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm text-gray-800 font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-6">✅</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h2>
            <p className="text-sm text-gray-500 mb-8">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
