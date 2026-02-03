import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "warroom.sqlite");

let db: Database.Database | null = null;

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

function initSchema(conn: Database.Database) {
  conn.exec(`
    PRAGMA journal_mode=WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project TEXT NOT NULL CHECK (project IN ('kampeyn','organizesd')),
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL CHECK (priority IN ('high','medium','low')),
      status TEXT NOT NULL CHECK (status IN ('todo','in_progress','done')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_project_status_priority_created
      ON tasks(project, status, priority, created_at);

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project TEXT NOT NULL CHECK (project IN ('kampeyn','organizesd')),
      body TEXT NOT NULL,
      seen INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      seen_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_notes_project_seen_created
      ON notes(project, seen, created_at);

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      project TEXT,
      meta_json TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_activity_ts
      ON activity_log(ts);

    CREATE TABLE IF NOT EXISTS agent_status (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      state TEXT NOT NULL CHECK (state IN ('working','idle','offline')),
      current_task_id INTEGER,
      current_task_title TEXT,
      active_subagents_json TEXT,
      updated_at TEXT NOT NULL
    );

    INSERT OR IGNORE INTO agent_status (id, state, updated_at)
      VALUES (1, 'idle', datetime('now'));
  `);
}

export function getDb() {
  if (db) return db;
  ensureDir();
  db = new Database(DB_PATH);
  initSchema(db);
  return db;
}

export function nowIso() {
  return new Date().toISOString();
}
