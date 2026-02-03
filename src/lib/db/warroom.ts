import { getDb, nowIso } from "./sqlite";
import { logAction } from "./log";

export type ProjectKey = "kampeyn" | "organizesd";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: number;
  project: ProjectKey;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  project: ProjectKey;
  body: string;
  seen: number;
  created_at: string;
  seen_at: string | null;
}

export function listTasks(project: ProjectKey) {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM tasks
       WHERE project = ?
       ORDER BY CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
                datetime(created_at) ASC`
    )
    .all(project);
}

export function listNotes(project: ProjectKey) {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM notes
       WHERE project = ?
       ORDER BY seen ASC, datetime(created_at) DESC`
    )
    .all(project);
}

export function listActivity(project?: ProjectKey, limit = 50) {
  const db = getDb();
  if (!project) {
    return db
      .prepare(
        `SELECT * FROM activity_log
         ORDER BY datetime(ts) DESC
         LIMIT ?`
      )
      .all(limit);
  }
  return db
    .prepare(
      `SELECT * FROM activity_log
       WHERE project = ?
       ORDER BY datetime(ts) DESC
       LIMIT ?`
    )
    .all(project, limit);
}

export function getAgentStatus() {
  const db = getDb();
  return db.prepare("SELECT * FROM agent_status WHERE id = 1").get();
}

export function setAgentStatus(state: "working" | "idle" | "offline", meta?: {
  currentTaskId?: number | null;
  currentTaskTitle?: string | null;
  activeSubagents?: unknown;
}) {
  const db = getDb();
  db.prepare(
    `UPDATE agent_status
     SET state = @state,
         current_task_id = @current_task_id,
         current_task_title = @current_task_title,
         active_subagents_json = @active_subagents_json,
         updated_at = @updated_at
     WHERE id = 1`
  ).run({
    state,
    current_task_id: meta?.currentTaskId ?? null,
    current_task_title: meta?.currentTaskTitle ?? null,
    active_subagents_json: meta?.activeSubagents ? JSON.stringify(meta.activeSubagents) : null,
    updated_at: nowIso(),
  });
}

export function createTask(opts: {
  project: ProjectKey;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  actor: string;
}) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO tasks (project, title, description, priority, status, created_at, updated_at)
     VALUES (@project, @title, @description, @priority, 'todo', @created_at, @updated_at)`
  );
  const now = nowIso();
  const info = stmt.run({
    project: opts.project,
    title: opts.title,
    description: opts.description ?? null,
    priority: opts.priority,
    created_at: now,
    updated_at: now,
  });
  logAction({
    actor: opts.actor,
    action: `created task: ${opts.title}`,
    project: opts.project,
    meta: { id: info.lastInsertRowid, priority: opts.priority },
  });
  return info.lastInsertRowid;
}

export function updateTaskStatus(opts: {
  id: number;
  status: TaskStatus;
  actor: string;
}) {
  const db = getDb();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(opts.id) as Task | undefined;
  if (!task) return;
  db.prepare(
    `UPDATE tasks
     SET status = @status,
         updated_at = @updated_at
     WHERE id = @id`
  ).run({
    id: opts.id,
    status: opts.status,
    updated_at: nowIso(),
  });
  logAction({
    actor: opts.actor,
    action: `moved task: ${task.title} → ${opts.status}`,
    project: task.project,
    meta: { id: opts.id, status: opts.status },
  });
}

export function createNote(opts: {
  project: ProjectKey;
  body: string;
  actor: string;
}) {
  const db = getDb();
  const now = nowIso();
  const info = db
    .prepare(
      `INSERT INTO notes (project, body, seen, created_at, seen_at)
       VALUES (@project, @body, 0, @created_at, NULL)`
    )
    .run({
      project: opts.project,
      body: opts.body,
      created_at: now,
    });
  logAction({
    actor: opts.actor,
    action: `added note`,
    project: opts.project,
    meta: { id: info.lastInsertRowid },
  });
  return info.lastInsertRowid;
}

export function markNoteSeen(opts: { id: number; actor: string }) {
  const db = getDb();
  const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(opts.id) as Note | undefined;
  if (!note) return;
  db.prepare(
    `UPDATE notes
     SET seen = 1,
         seen_at = @seen_at
     WHERE id = @id`
  ).run({ id: opts.id, seen_at: nowIso() });
  logAction({
    actor: opts.actor,
    action: `marked note seen`,
    project: note.project,
    meta: { id: opts.id },
  });
}
