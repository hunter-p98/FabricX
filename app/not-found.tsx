"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-8xl font-bold tracking-tight mb-4">404</h1>
      <p className="text-gray-400 text-lg mb-2 tracking-widest uppercase">Page Not Found</p>
      <p className="text-gray-600 text-sm mb-10 text-center max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="bg-white text-black px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-200 transition-colors"
        >
          Go Home
        </button>
        <button
          onClick={() => router.back()}
          className="border border-gray-700 text-gray-400 px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:border-white hover:text-white transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}