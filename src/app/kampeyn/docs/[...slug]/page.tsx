import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { readMarkdownDoc } from "@/lib/fs-docs";
import { KAMPEYN_DOCS_DIR } from "@/lib/paths";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = await readMarkdownDoc(KAMPEYN_DOCS_DIR, slug);

  return (
    <div className="space-y-4">
      <div className="text-sm">
        <Link className="hover:underline" href="/kampeyn">
          ← Back to Kampeyn
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 text-xs text-zinc-500">{doc.relPath}</div>
        <article className="prose max-w-none">
          <ReactMarkdown>{doc.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
