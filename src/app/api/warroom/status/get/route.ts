import { getAgentStatus } from "@/lib/db/warroom";
import { NextResponse } from "next/server";

export async function GET() {
    const status = getAgentStatus();
    return NextResponse.json(status || { state: "idle", current_task_title: null, updated_at: null });
}
