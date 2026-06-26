"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <h2 className="font-[family-name:var(--font-exo2)] text-3xl tracking-tight text-white mb-3">
            VYRA
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
            Premium streetwear, printed on demand. No excess. No waste. Just fabric and intent.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Shop</p>
          <ul className="space-y-3">
            <li><button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">T-shirts</button></li>
            <li><button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">Hoodies</button></li>
            <li><button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">Sweatshirts</button></li>
            <li><button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">New Arrivals</button></li>
            <li><button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">All Products</button></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Info</p>
          <ul className="space-y-3">
            <li><button onClick={() => router.push("/about")} className="text-sm text-gray-400 hover:text-white transition-colors">About VYRA</button></li>
            <li><button onClick={() => router.push("/contact")} className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
            <li><button onClick={() => router.push("/orders")} className="text-sm text-gray-400 hover:text-white transition-colors">Orders</button></li>
            <li><button onClick={() => router.push("/refund-policy")} className="text-sm text-gray-400 hover:text-white transition-colors">Refund Policy</button></li>
            <li><button onClick={() => router.push("/shipping-policy")} className="text-sm text-gray-400 hover:text-white transition-colors">Shipping Policy</button></li>
            <li><button onClick={() => router.push("/privacy-policy")} className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => router.push("/wishlist")} className="text-sm text-gray-400 hover:text-white transition-colors">Wishlist</button></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Follow</p>
          <ul className="space-y-3">
            <li>
              <a href="https://instagram.com/vyra.official" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                Twitter / X
              </a>
            </li>
          </ul>

          <div className="mt-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Stay updated</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-white transition-colors"
              />
              <button className="bg-white text-black px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-4 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-gray-600">{`© ${year} VYRA. All rights reserved.`}</p>
        <p className="text-xs text-gray-600">Printed on demand · Shipped worldwide</p>
      </div>
    </footer>
  );
}