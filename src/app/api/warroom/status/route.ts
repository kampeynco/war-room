import { NextResponse } from "next/server";

import { actorFromReq } from "@/lib/db/log";
import { logAction } from "@/lib/db/log";
import { setAgentStatus } from "@/lib/db/warroom";

export async function POST(req: Request) {
  const form = await req.formData();
  const state = (form.get("state") || "idle") as "working" | "idle" | "offline";
  const currentTaskTitle = String(form.get("current_task_title") || "").trim();

  setAgentStatus(state, { currentTaskTitle: currentTaskTitle || null });
  logAction({
    actor: actorFromReq(req),
    action: `status set → ${state}`,
    meta: { currentTaskTitle: currentTaskTitle || null },
  });

  return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
}
