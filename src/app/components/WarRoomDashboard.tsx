import Link from "next/link";
import {
  CheckCircle,
  Clock,
  CircleDot,
  FileText,
  MessageSquare,
  Plus,
  ChevronRight,
  ArrowUp,
  ArrowRight as ArrowRightIcon,
  ArrowDown,
  Eye,
  EyeOff,
  Bot
} from "lucide-react";

import { listMarkdownDocs, type DocRef } from "@/lib/fs-docs";
import { listActivity, listNotes, listTasks } from "@/lib/db/warroom";
import type { ProjectKey } from "@/lib/db/warroom";
import { AddTaskModal } from "./AddTaskModal";
import { Timeline, type TimelineItem } from "./Timeline";
import { WorkspaceDropdown } from "./WorkspaceDropdown";
import { AgentStatusWidget } from "./AgentStatusWidget";

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

export default async function WarRoomDashboard({
  project,
  title,
  docsDir,
  docsBasePath,
}: {
  project: ProjectKey;
  title: string;
  docsDir: string;
  docsBasePath: string;
}) {
  const [tasks, notes, activity, docs] = await Promise.all([
    listTasks(project),
    listNotes(project),
    listActivity(project, 50),
    listMarkdownDocs(docsDir),
  ]);

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
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-heading text-3xl">{title}</h1>
          <p className="text-muted mt-2">
            Live war room dashboard with tasks, notes, activity log, and docs.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="card px-4 py-3">
            <div className="text-xs text-muted mb-2">Agent status</div>
            <AgentStatusWidget compact={false} />
          </div>
          <WorkspaceDropdown />
        </div>
      </header>

      {/* Two-column layout: Kanban left, Activity right */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Kanban Board - Left Column */}
        <section id="tasks" className="card">
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

        {/* Agent Activity Timeline - Right Column */}
        <section className="h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-muted" />
            <span className="text-heading">Agent Activity</span>
          </div>

          {activity.length === 0 ? (
            <div className="text-sm text-muted text-center py-8">No agent activity yet.</div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto pr-2">
              <Timeline
                items={activity.map((item: any) => ({
                  id: String(item.id),
                  title: item.action,
                  description: `by ${item.actor}`,
                  timestamp: item.ts,
                  status: "completed" as const,
                } as TimelineItem))}
                variant="compact"
              />
            </div>
          )}
        </section>
      </div>

      {/* Notes and Docs below */}
      <div className="space-y-6 mt-6">
        {/* Notes Inbox */}
        <section id="notes" className="card">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-muted" />
            <span className="text-heading">Notes Inbox</span>
          </div>

          <form className="space-y-3 mb-4" action="/api/warroom/note" method="post">
            <input type="hidden" name="project" value={project} />
            <textarea
              name="body"
              required
              rows={3}
              placeholder="Drop a note or request..."
              className="input resize-none"
            />
            <button className="btn btn-secondary w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </form>

          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {notes.length === 0 ? (
              <div className="text-sm text-muted text-center py-4 col-span-full">No notes yet.</div>
            ) : (
              notes.map((note: any) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border ${note.seen
                    ? "bg-[var(--color-background)] border-[var(--color-border)]"
                    : "bg-[rgba(34,197,94,0.05)] border-[var(--color-cta)]"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {note.seen ? (
                      <Eye className="w-3.5 h-3.5 text-muted" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-cta" />
                    )}
                    <span className={`text-xs ${note.seen ? "text-muted" : "text-cta font-medium"}`}>
                      {note.seen ? "Seen" : "New"}
                    </span>
                    <span className="text-xs text-muted ml-auto">{note.created_at}</span>
                  </div>
                  <div className="text-sm">{note.body}</div>
                  {!note.seen && (
                    <form action="/api/warroom/note/seen" method="post" className="mt-2">
                      <input type="hidden" name="id" value={note.id} />
                      <button className="btn btn-ghost text-xs py-1 px-2">
                        Mark as seen
                      </button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Docs & Deliverables */}
        <section id="docs" className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-muted" />
            <span className="text-heading">Docs & Deliverables</span>
          </div>

          {docs.length === 0 ? (
            <div className="text-sm text-muted text-center py-8">No docs found.</div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {docs.map((doc: DocRef) => (
                <Link
                  key={doc.relPath}
                  href={`${docsBasePath}/${doc.slug.join("/")}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-cta)] transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-[rgba(59,130,246,0.15)]">
                    <FileText className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{doc.relPath}</div>
                    <div className="text-xs text-muted">Open doc</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-cta transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
