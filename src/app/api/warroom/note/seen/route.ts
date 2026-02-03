import { NextResponse } from "next/server";

import { actorFromReq } from "@/lib/db/log";
import { markNoteSeen } from "@/lib/db/warroom";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = Number(form.get("id") || 0);

  if (!id) {
    return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
  }

  markNoteSeen({ id, actor: actorFromReq(req) });
  return NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
}
