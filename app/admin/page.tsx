"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">VYRA Admin</h1>
        <p className="text-xs text-gray-500 mb-6">Enter your password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-black"
        />
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </div>
    </main>
  );
}