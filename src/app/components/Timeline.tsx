import * as React from "react";
import {
    Check,
    Clock,
    X,
    Bot,
} from "lucide-react";

export interface TimelineItem {
    id: string;
    title: string;
    description?: string;
    timestamp?: string;
    status?: "default" | "completed" | "active" | "pending" | "error";
    icon?: React.ReactNode;
}

export interface TimelineProps {
    items: TimelineItem[];
    className?: string;
    showConnectors?: boolean;
    showTimestamps?: boolean;
    variant?: "default" | "compact" | "spacious";
}

function getStatusIcon(status: TimelineItem["status"]) {
    switch (status) {
        case "completed":
            return <Check className="h-3 w-3" />;
        case "active":
            return <Clock className="h-3 w-3" />;
        case "pending":
            return <Clock className="h-3 w-3" />;
        case "error":
            return <X className="h-3 w-3" />;
        default:
            return <Bot className="h-3 w-3" />;
    }
}

const statusStyles = {
    default: "border-[var(--color-border)] text-muted bg-[var(--color-background)]",
    completed: "border-[var(--color-cta)] bg-[var(--color-cta)] text-[var(--color-primary)]",
    active: "border-[var(--color-cta)] bg-[var(--color-background)] text-cta animate-pulse",
    pending: "border-[var(--color-border)] text-muted bg-[var(--color-background)] opacity-50",
    error: "border-[#EF4444] bg-[#EF4444] text-white",
};

const connectorStatusStyles = {
    default: "bg-[var(--color-border)]",
    completed: "bg-[var(--color-cta)]",
    active: "bg-[var(--color-cta)]",
    pending: "bg-[var(--color-border)] opacity-30",
    error: "bg-[#EF4444]",
};

const variantGap = {
    default: "gap-4",
    compact: "gap-2",
    spacious: "gap-6",
};

export function Timeline({
    items,
    className = "",
    showConnectors = true,
    showTimestamps = true,
    variant = "default",
}: TimelineProps) {
    return (
        <div className={`relative flex flex-col ${variantGap[variant]} ${className}`}>
            {items.map((item, index) => (
                <div key={item.id} className="relative flex gap-3 pb-2">
                    {/* Connector Line */}
                    {showConnectors && index < items.length - 1 && (
                        <div
                            className={`absolute left-3 top-9 h-full w-px ${connectorStatusStyles[item.status || "default"]}`}
                        />
                    )}

                    {/* Icon */}
                    <div className="relative z-10 flex shrink-0">
                        <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium ${statusStyles[item.status || "default"]}`}
                        >
                            {item.icon || getStatusIcon(item.status)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        {/* Timestamp */}
                        {showTimestamps && item.timestamp && (
                            <time className="text-xs text-muted">{item.timestamp}</time>
                        )}

                        {/* Title */}
                        <h3 className="font-medium text-sm leading-tight">{item.title}</h3>

                        {/* Description */}
                        {item.description && (
                            <p className="text-xs text-muted leading-relaxed">
                                {item.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
