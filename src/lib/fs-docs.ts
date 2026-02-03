import fs from "node:fs/promises";
import path from "node:path";

export type DocRef = {
  slug: string[];
  title: string;
  relPath: string;
};

function titleFromFilename(filename: string) {
  const base = filename.replace(/\.md$/i, "");
  return base.replace(/[-_]+/g, " ");
}

export async function listMarkdownDocs(rootDir: string): Promise<DocRef[]> {
  async function walk(dir: string, parts: string[]): Promise<DocRef[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out: DocRef[] = [];
    for (const ent of entries) {
      if (ent.name.startsWith(".")) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        out.push(...(await walk(full, [...parts, ent.name])));
        continue;
      }
      if (!ent.isFile()) continue;
      if (!/\.md$/i.test(ent.name)) continue;

      out.push({
        slug: [...parts, ent.name.replace(/\.md$/i, "")],
        title: titleFromFilename(ent.name),
        relPath: path.join(...parts, ent.name),
      });
    }
    return out;
  }

  const docs = await walk(rootDir, []);
  docs.sort((a, b) => a.relPath.localeCompare(b.relPath));
  return docs;
}

export async function readMarkdownDoc(rootDir: string, slug: string[]) {
  const rel = path.join(...slug) + ".md";
  const full = path.join(rootDir, rel);
  const content = await fs.readFile(full, "utf8");
  return { relPath: rel, content };
}
