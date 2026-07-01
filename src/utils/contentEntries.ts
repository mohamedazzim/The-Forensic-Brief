export function stripContentExtension(value: string): string {
  return value.replace(/\.(md|mdx)$/i, '');
}

export function entrySlug(entry: { id: string; slug?: string; data?: { slug?: string } }): string {
  return entry.slug || entry.data?.slug || stripContentExtension(entry.id).replace(/-(metadata|content)$/i, '');
}

type DateFields = {
  date?: Date | string;
  sortDate?: Date | string;
  updated?: Date | string;
  displayDate?: string;
  dateLabel?: string;
};

type SortableEntry = {
  data?: DateFields & {
    title?: string;
  };
};

function sortTimestamp(value?: Date | string): number {
  if (!value) return Number.NaN;
  if (value instanceof Date) return value.valueOf();

  const parsed = new Date(value).valueOf();
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export function resolveSortDate(data?: DateFields): Date | undefined {
  const timestamp =
    sortTimestamp(data?.sortDate)
    || sortTimestamp(data?.date)
    || sortTimestamp(data?.updated);

  return timestamp ? new Date(timestamp) : undefined;
}

export function formatEntryDate(data?: DateFields): string {
  return data?.displayDate
    || data?.dateLabel
    || resolveSortDate(data)?.toISOString().split('T')[0]
    || '';
}

export function sortNewestFirst<T extends SortableEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const aTime = sortTimestamp(a.data?.sortDate) || sortTimestamp(a.data?.date) || sortTimestamp(a.data?.updated) || 0;
    const bTime = sortTimestamp(b.data?.sortDate) || sortTimestamp(b.data?.date) || sortTimestamp(b.data?.updated) || 0;

    if (bTime !== aTime) return bTime - aTime;

    return String(a.data?.title ?? '').localeCompare(String(b.data?.title ?? ''));
  });
}
