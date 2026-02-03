"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string>("");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = getSupabaseClient();

                // Capture URL info for debugging
                const fullUrl = window.location.href;
                const hash = window.location.hash;
                const search = window.location.search;

                setDebug(`URL: ${fullUrl.substring(0, 100)}...`);

                // Method 1: Check for tokens in URL hash (implicit flow)
                if (hash && (hash.includes("access_token") || hash.includes("refresh_token"))) {
                    const params = new URLSearchParams(hash.substring(1));
                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");

                    if (accessToken && refreshToken) {
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (error) {
                            setError(`Session error: ${error.message}`);
                            return;
                        }

                        router.push("/dashboard");
                        return;
                    }
                }

                // Method 2: Check for authorization code in query params (PKCE flow)
                const urlParams = new URLSearchParams(search);
                const code = urlParams.get("code");

                if (code) {
                    // Exchange the code for a session
                    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                    if (error) {
                        setError(`Code exchange error: ${error.message}`);
                        return;
                    }

                    if (data.session) {
                        router.push("/dashboard");
                        return;
                    }
                }

                // Method 3: Let Supabase handle it automatically via onAuthStateChange
                // Wait a moment for Supabase to process tokens
                await new Promise(resolve => setTimeout(resolve, 1000));

                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    router.push("/dashboard");
                    return;
                }

                // If we get here, no valid auth found
                setError("No authentication tokens found. The link may have expired.");
            } catch (err: any) {
                setError(`Error: ${err?.message || "Authentication failed"}`);
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
                    {debug && <p className="text-xs text-muted mt-2 break-all">{debug}</p>}
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
                {debug && <p className="text-xs text-muted/50 mt-2 break-all">{debug}</p>}
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
