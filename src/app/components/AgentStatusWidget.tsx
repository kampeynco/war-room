"use client";

import { useEffect, useState } from "react";

interface AgentStatus {
    state: "working" | "idle" | "offline";
    current_task_title: string | null;
    updated_at: string | null;
}

const STATUS_CONFIG = {
    working: {
        emoji: "🤖",
        label: "Working",
        badgeClass: "badge-success",
        description: "OpenClaw is active",
    },
    idle: {
        emoji: "😴",
        label: "Idle",
        badgeClass: "badge-warning",
        description: "Awaiting instructions",
    },
    offline: {
        emoji: "💤",
        label: "Offline",
        badgeClass: "badge-muted",
        description: "OpenClaw is offline",
    },
};

interface AgentStatusWidgetProps {
    compact?: boolean;
}

export function AgentStatusWidget({ compact = false }: AgentStatusWidgetProps) {
    const [status, setStatus] = useState<AgentStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch("/api/warroom/status/get");
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                }
            } catch (error) {
                console.error("Failed to fetch agent status:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStatus();
        // Poll every 5 seconds to keep status up to date
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentState = status?.state || "idle";
    const config = STATUS_CONFIG[currentState];

    if (loading) {
        return (
            <div className="flex flex-col items-center text-center">
                <div className={`${compact ? "text-2xl" : "text-4xl"} mb-2 animate-pulse`}>🤖</div>
                {!compact && <span className="badge badge-muted">Loading...</span>}
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex flex-col items-center text-center" title={`${config.label}: ${config.description}`}>
                <div className="text-2xl" role="img" aria-label={config.label}>
                    {config.emoji}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-2" role="img" aria-label={config.label}>
                {config.emoji}
            </div>
            <span className={`badge ${config.badgeClass}`}>{config.label}</span>
            <p className="text-xs text-muted mt-2">{config.description}</p>
            {status?.current_task_title && currentState === "working" && (
                <p className="text-xs text-cta mt-1 truncate max-w-full">
                    {status.current_task_title}
                </p>
            )}
        </div>
    );
}
