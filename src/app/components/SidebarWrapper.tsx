"use client";

import { usePathname } from "next/navigation";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

export function SidebarWrapper() {
    const pathname = usePathname();

    // Hide sidebar on homepage (login page)
    if (pathname === "/") {
        return null;
    }

    return <CollapsibleSidebar />;
}
