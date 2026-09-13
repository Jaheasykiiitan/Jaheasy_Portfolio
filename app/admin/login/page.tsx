"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "wrong password");
      }
    } catch {
      setError("network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
      >
        <h1 className="text-sm tracking-[0.25em] uppercase opacity-60 text-center">
          Admin login
        </h1>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          autoFocus
          className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm tracking-widest outline-none focus:border-white/60 transition"
        />
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-white/20 py-3 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition disabled:opacity-40"
        >
          {loading ? "..." : "enter"}
        </button>
      </form>
    </div>
  );
}