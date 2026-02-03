"use client";

import { usePathname } from "next/navigation";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

export function SidebarWrapper() {
    const pathname = usePathname();

    // Hide sidebar on homepage (login page) and auth routes
    if (pathname === "/" || pathname.startsWith("/auth")) {
        return null;
    }

    return <CollapsibleSidebar />;
}
