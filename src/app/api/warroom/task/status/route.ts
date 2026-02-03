import { NextResponse } from "next/server";

import { actorFromReq } from "@/lib/db/log";
import { updateTaskStatus } from "@/lib/db/warroom";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = Number(form.get("id") || 0);
  const status = (form.get("status") || "") as "todo" | "in_progress" | "done";

  if (!id || !status) {
    return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
  }

  updateTaskStatus({ id, status, actor: actorFromReq(req) });
  return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
}
