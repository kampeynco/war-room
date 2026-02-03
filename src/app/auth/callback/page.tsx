"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = getSupabaseClient();

                // Get the hash from the URL (contains access_token, refresh_token, etc.)
                const hash = window.location.hash;

                if (hash) {
                    // Parse the hash to extract tokens
                    const params = new URLSearchParams(hash.substring(1));
                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");

                    if (accessToken && refreshToken) {
                        // Set the session manually
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (error) {
                            setError(error.message);
                            return;
                        }

                        // Redirect to dashboard
                        router.push("/dashboard");
                        return;
                    }
                }

                // Check if we already have a session
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    router.push("/dashboard");
                    return;
                }

                // No tokens and no session - something went wrong
                setError("No authentication tokens found. Please try again.");
            } catch (err: any) {
                setError(err?.message || "Authentication failed");
            }
        };

        handleCallback();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="card max-w-md w-full text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                    <p className="text-red-400 mt-4">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="btn btn-secondary mt-4"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="card max-w-md w-full text-center">
                <Loader2 className="w-8 h-8 text-cta animate-spin mx-auto" />
                <p className="text-muted mt-4">Signing you in...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="card max-w-md w-full text-center">
                    <Loader2 className="w-8 h-8 text-cta animate-spin mx-auto" />
                    <p className="text-muted mt-4">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
