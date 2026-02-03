"use client";

import { usePathname } from "next/navigation";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

export function SidebarWrapper() {
    const pathname = usePathname();

    // Hide sidebar on login page
    if (pathname === "/login") {
        return null;
    }

    return <CollapsibleSidebar />;
}
