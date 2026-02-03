"use client";

import {
    CheckCircle,
    Clock,
    CircleDot,
    ArrowUp,
    ArrowRight as ArrowRightIcon,
    ArrowDown,
} from "lucide-react";
import { AddTaskModal } from "./AddTaskModal";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

const STATUS_CONFIG = {
    todo: { label: "To Do", icon: CircleDot, color: "text-muted" },
    in_progress: { label: "In Progress", icon: Clock, color: "text-[#3B82F6]" },
    done: { label: "Done", icon: CheckCircle, color: "text-cta" },
};

const PRIORITY_CONFIG = {
    high: { label: "High", icon: ArrowUp, color: "text-[#EF4444]", bg: "bg-[rgba(239,68,68,0.15)]" },
    medium: { label: "Medium", icon: ArrowRightIcon, color: "text-[#EAB308]", bg: "bg-[rgba(234,179,8,0.15)]" },
    low: { label: "Low", icon: ArrowDown, color: "text-[#22C55E]", bg: "bg-[rgba(34,197,94,0.15)]" },
};

interface TasksScreenProps {
    project: string;
    title: string;
    tasks: any[];
}

export function TasksScreen({ project, title, tasks }: TasksScreenProps) {
    const grouped = {
        todo: tasks.filter((t: any) => t.status === "todo"),
        in_progress: tasks.filter((t: any) => t.status === "in_progress"),
        done: tasks.filter((t: any) => t.status === "done"),
    };

    const byPriority = (items: any[]) => ({
        high: items.filter((t) => t.priority === "high"),
        medium: items.filter((t) => t.priority === "medium"),
        low: items.filter((t) => t.priority === "low"),
    });

    return (
        <div className="space-y-8">
            {/* Header with workspace dropdown */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-heading text-3xl">{title}</h1>
                    <p className="text-muted mt-2">Manage tasks for this workspace</p>
                </div>
                <WorkspaceDropdown />
            </header>

            {/* Kanban Board */}
            <section className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-muted" />
                        <span className="text-heading">Kanban Board</span>
                    </div>

                    <AddTaskModal project={project} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {(["todo", "in_progress", "done"] as const).map((statusKey) => {
                        const config = STATUS_CONFIG[statusKey];
                        const StatusIcon = config.icon;
                        const bucket = byPriority(grouped[statusKey]);
                        const totalCount = grouped[statusKey].length;

                        return (
                            <div key={statusKey} className="kanban-column">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                        <span className="text-sm font-medium">{config.label}</span>
                                    </div>
                                    <span className="badge badge-muted">{totalCount}</span>
                                </div>

                                <div className="space-y-4">
                                    {(["high", "medium", "low"] as const).map((priorityKey) => {
                                        const prioConfig = PRIORITY_CONFIG[priorityKey];
                                        const PrioIcon = prioConfig.icon;
                                        const items = bucket[priorityKey];

                                        if (items.length === 0) return null;

                                        return (
                                            <div key={priorityKey}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`p-1 rounded ${prioConfig.bg}`}>
                                                        <PrioIcon className={`w-3 h-3 ${prioConfig.color}`} />
                                                    </div>
                                                    <span className="text-xs text-muted">{prioConfig.label}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {items.map((task: any) => (
                                                        <div key={task.id} className="kanban-card">
                                                            <div className="font-medium text-sm">{task.title}</div>
                                                            {task.description && (
                                                                <div className="text-xs text-muted mt-1">{task.description}</div>
                                                            )}
                                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
                                                                <span className="text-[11px] text-muted">#{task.id}</span>
                                                                <form
                                                                    action="/api/warroom/task/status"
                                                                    method="post"
                                                                    className="flex items-center gap-1.5"
                                                                >
                                                                    <input type="hidden" name="id" value={task.id} />
                                                                    <select
                                                                        name="status"
                                                                        defaultValue={task.status}
                                                                        className="select text-xs py-0.5 px-1.5"
                                                                    >
                                                                        <option value="todo">To Do</option>
                                                                        <option value="in_progress">In Progress</option>
                                                                        <option value="done">Done</option>
                                                                    </select>
                                                                    <button className="btn btn-ghost text-xs py-0.5 px-2">
                                                                        Move
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {totalCount === 0 && (
                                        <div className="text-center py-8 text-sm text-muted">
                                            No tasks
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
