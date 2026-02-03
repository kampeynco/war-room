"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Briefcase, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface ProfileData {
    full_name: string;
    company: string;
    role: string;
}

export default function ProfileSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        company: "",
        role: "",
    });

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const supabase = getSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push("/");
                    return;
                }

                // Check if profile exists and is completed
                const { data: existingProfile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (existingProfile?.onboarding_completed) {
                    // Already completed onboarding - go to dashboard
                    router.push("/dashboard");
                    return;
                }

                // Pre-fill with existing data if any
                if (existingProfile) {
                    setProfile({
                        full_name: existingProfile.full_name || "",
                        company: existingProfile.company || "",
                        role: existingProfile.role || "",
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error("Error checking profile:", err);
                setLoading(false);
            }
        };

        checkProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("Not authenticated");
                setSaving(false);
                return;
            }

            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    full_name: profile.full_name,
                    company: profile.company,
                    role: profile.role,
                    onboarding_completed: true,
                })
                .eq("id", user.id);

            if (updateError) {
                setError(updateError.message);
                setSaving(false);
                return;
            }

            // Success - redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err?.message || "Failed to save profile");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="card max-w-md w-full text-center">
                    <Loader2 className="w-8 h-8 text-cta animate-spin mx-auto" />
                    <p className="text-muted mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="card max-w-lg w-full">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[rgba(34,197,94,0.15)]">
                        <User className="w-5 h-5 text-cta" />
                    </div>
                    <div>
                        <div className="text-xs text-muted">Welcome to War Room</div>
                        <h1 className="text-heading text-2xl">Complete Your Profile</h1>
                    </div>
                </div>
                <p className="text-muted mb-6">Tell us a bit about yourself to get started.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs text-muted flex items-center gap-1.5 mb-1.5">
                            <User className="w-3.5 h-3.5" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            className="input"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            placeholder="Your full name"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-muted flex items-center gap-1.5 mb-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            Company
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                            placeholder="Your company name (optional)"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-muted flex items-center gap-1.5 mb-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            Role
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={profile.role}
                            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                            placeholder="Your role or title (optional)"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={saving || !profile.full_name}
                        className="btn btn-primary w-full"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            "Continue to Dashboard"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
