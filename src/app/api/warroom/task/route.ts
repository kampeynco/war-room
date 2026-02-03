import { NextResponse } from "next/server";

import { actorFromReq } from "@/lib/db/log";
import { createTask } from "@/lib/db/warroom";

export async function POST(req: Request) {
  const form = await req.formData();
  const project = (form.get("project") || "") as "kampeyn" | "organizesd";
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const priority = (form.get("priority") || "medium") as "high" | "medium" | "low";

  if (!project || !title) {
    return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
  }

  createTask({
    project,
    title,
    description: description || null,
    priority,
    actor: actorFromReq(req),
  });

  return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
}
