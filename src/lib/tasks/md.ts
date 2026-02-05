import fs from 'fs';
import path from 'path';

const TASKS_PATH = path.join(process.cwd(), 'tasks', 'TASKS.md');

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority?: 'high'|'medium'|'low';
  status?: 'todo'|'in_progress'|'done';
  owner?: string;
  created_at?: string;
  updated_at?: string;
  linked_memories?: string[];
}

export function readTasks(): Task[] {
  if (!fs.existsSync(TASKS_PATH)) return [];
  const raw = fs.readFileSync(TASKS_PATH, 'utf8');
  const parts = raw.split(/^---$/m).map(s=>s.trim()).filter(Boolean);
  const tasks: Task[] = [];
  for (const p of parts) {
    // parse simple key: value lines
    const lines = p.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    const obj: any = {};
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const m = line.match(/^([a-zA-Z0-9_\-]+):\s*(.*)$/);
      if (m) {
        const k = m[1];
        let v: any = m[2];
        // basic parsing
        if (v === '[]') v = [];
        else if (/^\[.*\]$/.test(v)) {
          try { v = JSON.parse(v); } catch(e) { v = v.slice(1,-1).split(',').map(s=>s.trim().replace(/^"|"$/g,'')); }
        }
        obj[k] = v;
      }
    }
    if (obj.id) tasks.push(obj as Task);
  }
  return tasks;
}

export function tasksPath() { return TASKS_PATH; }

export default readTasks;
