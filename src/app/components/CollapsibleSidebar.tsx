"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckSquare, MessageSquare, FileText, LogOut } from "lucide-react";
import { AgentStatusWidget } from "./AgentStatusWidget";
import { getSupabaseClient } from "@/lib/supabase/client";

const navItems = [
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/notes", label: "Notes", icon: MessageSquare },
    { path: "/docs", label: "Documents", icon: FileText },
];

export function CollapsibleSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // Determine current workspace base
    const getWorkspaceBase = () => {
        if (pathname.startsWith("/kampeyn")) return "/kampeyn";
        if (pathname.startsWith("/organizesd")) return "/organizesd";
        return "/kampeyn"; // Default to kampeyn
    };

    const workspaceBase = getWorkspaceBase();

    const handleSignOut = async () => {
        try {
            const supabase = getSupabaseClient();
            await supabase.auth.signOut();
            // Clear any remaining auth cookies
            document.cookie.split(";").forEach((c) => {
                const name = c.split("=")[0].trim();
                if (name.includes("supabase") || name.includes("sb-")) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            });
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
            router.push("/");
        }
    };

    return (
        <aside
            className="sidebar hidden lg:flex flex-col transition-all duration-300 ease-in-out"
            style={{ width: "80px" }}
        >
            {/* Agent Status at Top - compact only */}
            <div className="mb-6 px-2 py-3 flex flex-col items-center">
                <AgentStatusWidget compact />
            </div>

            {/* Navigation - icons only */}
            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const href = `${workspaceBase}${item.path}`;
                    const isActive = pathname === href || pathname.startsWith(href + "/");

                    return (
                        <Link
                            key={item.path}
                            href={href}
                            className={`sidebar-link justify-center px-2 ${isActive ? "bg-[rgba(34,197,94,0.1)] text-cta" : ""}`}
                            title={item.label}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-cta" : ""}`} />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pb-4 flex flex-col items-center">
                <button
                    onClick={handleSignOut}
                    className="sidebar-link justify-center px-2 text-muted hover:text-red-400 cursor-pointer"
                    title="Sign out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
