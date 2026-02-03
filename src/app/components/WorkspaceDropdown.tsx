"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Zap, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const WORKSPACES = [
    { id: "kampeyn", name: "Kampeyn", href: "/kampeyn", icon: Zap },
    { id: "organizesd", name: "Organize SD", href: "/organizesd", icon: Users },
];

export function WorkspaceDropdown() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine current workspace
    const currentWorkspace = WORKSPACES.find((w) => pathname.startsWith(w.href)) || WORKSPACES[0];
    const CurrentIcon = currentWorkspace.icon;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (href: string) => {
        setIsOpen(false);
        router.push(href);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-cta)] transition-colors cursor-pointer"
            >
                <CurrentIcon className="w-4 h-4 text-cta" />
                <span className="font-medium text-sm">{currentWorkspace.name}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-xl z-50 overflow-hidden">
                    {WORKSPACES.map((workspace) => {
                        const Icon = workspace.icon;
                        const isActive = workspace.id === currentWorkspace.id;
                        return (
                            <button
                                key={workspace.id}
                                onClick={() => handleSelect(workspace.href)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${isActive
                                        ? "bg-[rgba(34,197,94,0.1)] text-cta"
                                        : "hover:bg-[var(--color-background)]"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-cta" : "text-muted"}`} />
                                <span className="text-sm font-medium">{workspace.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
