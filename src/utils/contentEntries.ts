export function stripContentExtension(value: string): string {
  return value.replace(/\.(md|mdx)$/i, '');
}

export function entrySlug(entry: { id: string; slug?: string; data?: { slug?: string } }): string {
  return entry.slug || entry.data?.slug || stripContentExtension(entry.id).replace(/-(metadata|content)$/i, '');
}

type SortableEntry = {
  data?: {
    date?: Date | string;
    updated?: Date | string;
    title?: string;
  };
};

function sortTimestamp(value?: Date | string): number {
  if (!value) return Number.NaN;
  if (value instanceof Date) return value.valueOf();

  const parsed = new Date(value).valueOf();
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export function sortNewestFirst<T extends SortableEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const aTime = sortTimestamp(a.data?.date) || sortTimestamp(a.data?.updated) || 0;
    const bTime = sortTimestamp(b.data?.date) || sortTimestamp(b.data?.updated) || 0;

    if (bTime !== aTime) return bTime - aTime;

    return String(a.data?.title ?? '').localeCompare(String(b.data?.title ?? ''));
  });
}
