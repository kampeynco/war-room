"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setMessage("");
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }
      setStatus("sent");
      setMessage("Magic link sent. Check your email.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Failed to send magic link.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-md w-full">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[rgba(34,197,94,0.15)]">
            <KeyRound className="w-4 h-4 text-cta" />
          </div>
          <div>
            <div className="text-xs text-muted">War Room Access</div>
            <h1 className="text-heading text-2xl">Sign in</h1>
          </div>
        </div>
        <p className="text-muted mt-2">Use your email to receive a magic link.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-muted">Email</label>
            <input
              type="email"
              required
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <button
            className="btn btn-secondary w-full"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send magic link"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-sm ${status === "error" ? "text-red-400" : "text-cta"}`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-sm text-muted">
          <Link href="/" className="hover:underline">← Back to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
