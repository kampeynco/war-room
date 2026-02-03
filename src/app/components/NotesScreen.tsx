"use client";

import {
    MessageSquare,
    Plus,
    Eye,
    EyeOff
} from "lucide-react";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

interface NotesScreenProps {
    project: string;
    title: string;
    notes: any[];
}

export function NotesScreen({ project, title, notes }: NotesScreenProps) {
    return (
        <div className="space-y-8">
            {/* Header with workspace dropdown */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-heading text-3xl">{title}</h1>
                    <p className="text-muted mt-2">Notes and requests for this workspace</p>
                </div>
                <WorkspaceDropdown />
            </header>

            {/* Notes Inbox */}
            <section className="card">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-muted" />
                    <span className="text-heading">Notes Inbox</span>
                </div>

                <form className="space-y-3 mb-6" action="/api/warroom/note" method="post">
                    <input type="hidden" name="project" value={project} />
                    <textarea
                        name="body"
                        required
                        rows={4}
                        placeholder="Drop a note or request..."
                        className="input resize-none"
                    />
                    <button className="btn btn-primary w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Add Note
                    </button>
                </form>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {notes.length === 0 ? (
                        <div className="text-sm text-muted text-center py-8 col-span-full">No notes yet.</div>
                    ) : (
                        notes.map((note: any) => (
                            <div
                                key={note.id}
                                className={`p-4 rounded-lg border ${note.seen
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
                                    <form action="/api/warroom/note/seen" method="post" className="mt-3">
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
        </div>
    );
}
