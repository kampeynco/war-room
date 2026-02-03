import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { listMarkdownDocs, type DocRef } from "@/lib/fs-docs";
import { WorkspaceDropdown } from "@/app/components/WorkspaceDropdown";
import { KAMPEYN_DOCS_DIR } from "@/lib/paths";

export default async function KampeynDocsPage() {
    const docs = await listMarkdownDocs(KAMPEYN_DOCS_DIR);
    const title = "Kampeyn Documents";
    const docsBasePath = "/kampeyn/docs";

    return (
        <div className="space-y-8">
            {/* Header with workspace dropdown */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-heading text-3xl">{title}</h1>
                    <p className="text-muted mt-2">Documents and deliverables for this workspace</p>
                </div>
                <WorkspaceDropdown />
            </header>

            {/* Docs & Deliverables */}
            <section className="card">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-muted" />
                    <span className="text-heading">Docs & Deliverables</span>
                </div>

                {docs.length === 0 ? (
                    <div className="text-sm text-muted text-center py-8">No docs found.</div>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {docs.map((doc: DocRef) => (
                            <Link
                                key={doc.relPath}
                                href={`${docsBasePath}/${doc.slug.join("/")}`}
                                className="flex items-center gap-3 p-4 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-cta)] transition-colors cursor-pointer group"
                            >
                                <div className="p-2 rounded-lg bg-[rgba(59,130,246,0.15)]">
                                    <FileText className="w-4 h-4 text-[#3B82F6]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{doc.relPath}</div>
                                    <div className="text-xs text-muted">Open doc</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-cta transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
