"use client";

import { useRouter } from "next/navigation";

export default function AboutPage(): JSX.Element {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:border-black transition-colors"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">VYRA</h1>
        <div className="w-20" />
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
          Our Story
        </p>
        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Wear What You Are
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          VYRA was built for people who don't follow trends — they set them.
          We make premium streetwear that's printed on demand, shipped
          worldwide, and designed to last beyond the season.
        </p>
      </section>

      <div className="border-t border-gray-100" />

      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            icon: "🎨",
            title: "Designed With Intent",
            desc: "Every graphic, every cut, every colorway is deliberate. No filler, no fast fashion.",
          },
          {
            icon: "📦",
            title: "Printed On Demand",
            desc: "We only print what's ordered. No waste, no overstock — just your piece, made for you.",
          },
          {
            icon: "🌍",
            title: "Ships Worldwide",
            desc: "Wherever you are, VYRA ships to you. Global reach, local feel.",
          },
        ].map((item) => (
          <div key={item.title} className="text-center space-y-3">
            <div className="text-4xl">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      <div className="border-t border-gray-100" />

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
          Mission
        </p>
        <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
          "To make quality streetwear accessible to everyone — no middlemen,
          no markups, just great pieces shipped straight to your door."
        </p>
      </section>

      <div className="border-t border-gray-100" />

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
          Get In Touch
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Questions? We're here.
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Reach out anytime — we usually reply within 24 hours.
        </p>
<button
  onClick={() => window.location.href = "mailto:vyrastore07@gmail.com"}
  className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
>
  vyrastore07@gmail.com
</button>
      </section>

      <footer className="border-t border-gray-200 p-6 text-center text-xs text-gray-400">
        2025 VYRA. All rights reserved.
      </footer>
    </main>
  );
}