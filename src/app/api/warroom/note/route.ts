import { NextResponse } from "next/server";

import { actorFromReq } from "@/lib/db/log";
import { createNote } from "@/lib/db/warroom";

export async function POST(req: Request) {
  const form = await req.formData();
  const project = (form.get("project") || "") as "kampeyn" | "organizesd";
  const body = String(form.get("body") || "").trim();

  if (!project || !body) {
    return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
  }

  createNote({ project, body, actor: actorFromReq(req) });
  return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
}
