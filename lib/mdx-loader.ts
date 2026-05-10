// Stub MDX loader. Real implementation lands in Phase 3.
// Will use next-mdx-remote + gray-matter to parse content/*.mdx.

export type MdxDoc = {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
};

export async function loadMdx(_slug: string): Promise<MdxDoc | null> {
  return null;
}

export async function listMdxSlugs(): Promise<string[]> {
  return [];
}
