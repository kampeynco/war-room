"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "authenticating">("idle");
  const [message, setMessage] = useState("");

  // Handle auth callback from magic link
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we have auth tokens in the URL (magic link callback)
      const hash = window.location.hash;
      if (hash && (hash.includes("access_token") || hash.includes("refresh_token"))) {
        setStatus("authenticating");
        setMessage("Signing you in...");

        try {
          const supabase = getSupabaseClient();
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }

          if (data.session) {
            // Successfully authenticated - redirect to dashboard
            router.push("/dashboard");
          }
        } catch (err: any) {
          setStatus("error");
          setMessage(err?.message || "Authentication failed");
        }
      }
    };

    handleAuthCallback();
  }, [router]);

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
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
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

  // Show loading spinner when authenticating
  if (status === "authenticating") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 text-cta animate-spin mx-auto" />
          <p className="text-muted mt-4">{message || "Signing you in..."}</p>
        </div>
      </div>
    );
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
      </div>
    </div>
  );
}
