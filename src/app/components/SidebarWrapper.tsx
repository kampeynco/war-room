"use client";

import { usePathname } from "next/navigation";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

export function SidebarWrapper() {
    const pathname = usePathname();

    // Hide sidebar on login, auth, and profile setup pages
    if (pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/profile")) {
        return null;
    }

    return <CollapsibleSidebar />;
}
