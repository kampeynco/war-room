import Link from "next/link";
import { ArrowRight, Zap, Users, CheckCircle, FileText, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-heading text-3xl">Welcome to War Room</h1>
        <p className="text-muted mt-2">
          Internal command center for docs, status, and execution.
        </p>
      </header>

      {/* Quick Access Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        <Link href="/kampeyn" className="card card-interactive group">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-[rgba(34,197,94,0.15)]">
              <Zap className="w-6 h-6 text-cta" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted group-hover:text-cta transition-colors" />
          </div>
          <h2 className="text-heading text-xl mt-4">Kampeyn War Room</h2>
          <p className="text-sm text-muted mt-2">
            Core product development, strategy, and execution tracking.
          </p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-xs text-muted">
              <CheckCircle className="w-4 h-4" />
              <span>Tasks</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <FileText className="w-4 h-4" />
              <span>Docs</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </div>
          </div>
        </Link>

        <Link href="/organizesd" className="card card-interactive group">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.15)]">
              <Users className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted group-hover:text-cta transition-colors" />
          </div>
          <h2 className="text-heading text-xl mt-4">Organize SD War Room</h2>
          <p className="text-sm text-muted mt-2">
            Community organizing project tracking and deliverables.
          </p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-xs text-muted">
              <CheckCircle className="w-4 h-4" />
              <span>Tasks</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <FileText className="w-4 h-4" />
              <span>Docs</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </div>
          </div>
        </Link>
      </section>

      {/* What's Live Section */}
      <section className="card">
        <h2 className="text-heading text-lg flex items-center gap-2">
          <span className="status-dot status-working" />
          What's Live Right Now
        </h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
            <CheckCircle className="w-5 h-5 text-cta mt-0.5" />
            <div>
              <p className="text-sm font-medium">War Room Dashboards</p>
              <p className="text-xs text-muted mt-1">
                Status panel, kanban board, activity log, and notes inbox for each project.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
            <FileText className="w-5 h-5 text-[#3B82F6] mt-0.5" />
            <div>
              <p className="text-sm font-medium">Docs & Deliverables Viewer</p>
              <p className="text-xs text-muted mt-1">
                Browse and view markdown documentation for both Kampeyn and Organize SD.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
