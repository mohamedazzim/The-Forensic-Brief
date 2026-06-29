export function stripContentExtension(value: string): string {
  return value.replace(/\.(md|mdx)$/i, '');
}

export function entrySlug(entry: { id: string; slug?: string; data?: { slug?: string } }): string {
  return entry.slug || entry.data?.slug || stripContentExtension(entry.id).replace(/-(metadata|content)$/i, '');
}
