import { NextResponse } from "next/server";

import { actorFromReq } from "@/lib/db/log";
import { logAction } from "@/lib/db/log";

export async function POST(req: Request) {
  const body = await req.formData();
  const project = (body.get("project") || "") as "kampeyn" | "organizesd" | "";
  const action = String(body.get("action") || "").trim();
  const metaRaw = body.get("meta");

  if (!action) {
    return NextResponse.json({ ok: false, error: "Missing action" }, { status: 400 });
  }

  let meta: unknown = undefined;
  if (metaRaw) {
    try {
      meta = JSON.parse(String(metaRaw));
    } catch {
      meta = { raw: String(metaRaw) };
    }
  }

  logAction({
    actor: actorFromReq(req),
    action,
    project: project || undefined,
    meta,
  });

  return NextResponse.json({ ok: true });
}
