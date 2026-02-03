"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface AddTaskModalProps {
    project: string;
}

export function AddTaskModal({ project }: AddTaskModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-primary"
            >
                <Plus className="w-4 h-4" />
                Add Task
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <div
                        className="relative z-10 w-full max-w-lg mx-4 card-glass p-6 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-heading text-lg">Add New Task</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5 text-muted" />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            className="space-y-4"
                            action="/api/warroom/task"
                            method="post"
                        >
                            <input type="hidden" name="project" value={project} />

                            <div>
                                <label className="block text-sm font-medium mb-2">Task Title *</label>
                                <input
                                    name="title"
                                    placeholder="What needs to be done?"
                                    required
                                    className="input w-full"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Add more details (optional)"
                                    rows={3}
                                    className="input w-full resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Priority</label>
                                <select name="priority" className="select w-full" defaultValue="medium">
                                    <option value="high">🔴 High Priority</option>
                                    <option value="medium">🟡 Medium Priority</option>
                                    <option value="low">🟢 Low Priority</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    <Plus className="w-4 h-4" />
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
