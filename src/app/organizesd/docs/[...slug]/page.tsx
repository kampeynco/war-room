import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { readMarkdownDoc } from "@/lib/fs-docs";
import { ORGANIZESD_DIR } from "@/lib/paths";

export default async function OrganizeSdDocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = await readMarkdownDoc(ORGANIZESD_DIR, slug);

  return (
    <div className="space-y-4">
      <div className="text-sm">
        <Link className="hover:underline" href="/organizesd">
          ← Back to Organize SD
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
