import fs from 'fs';
import path from 'path';

const TASKS_PATH = path.join(process.cwd(), 'tasks', 'TASKS.md');

export function appendTask(task: {
  id: string;
  title: string;
  description?: string;
  priority?: 'high'|'medium'|'low';
  status?: 'todo'|'in_progress'|'done';
  owner?: string;
}) {
  const now = new Date().toISOString();
  const entry = [`---`, `# Task`, `id: ${task.id}`, `title: ${task.title}`];
  if (task.description) entry.push(`description: ${task.description}`);
  entry.push(`priority: ${task.priority ?? 'medium'}`);
  entry.push(`status: ${task.status ?? 'todo'}`);
  if (task.owner) entry.push(`owner: ${task.owner}`);
  entry.push(`created_at: ${now}`);
  entry.push(`updated_at: ${now}`);
  entry.push(`linked_memories: []`);
  entry.push(`---\n`);
  fs.appendFileSync(TASKS_PATH, entry.join('\n'));
}

export default appendTask;
