import { getDb, nowIso } from "./sqlite";

export function logAction(opts: {
  actor: string;
  action: string;
  project?: "kampeyn" | "organizesd";
  meta?: unknown;
}) {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO activity_log (ts, actor, action, project, meta_json) VALUES (@ts, @actor, @action, @project, @meta_json)"
  );
  stmt.run({
    ts: nowIso(),
    actor: opts.actor,
    action: opts.action,
    project: opts.project ?? null,
    meta_json: opts.meta ? JSON.stringify(opts.meta) : null,
  });
}

export function actorFromReq(req: Request) {
  return (
    req.headers.get("x-actor") ||
    req.headers.get("x-user") ||
    req.headers.get("x-forwarded-user") ||
    "lenox"
  ).slice(0, 80);
}
