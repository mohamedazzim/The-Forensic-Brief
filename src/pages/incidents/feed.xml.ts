import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { entrySlug, sortNewestFirst } from '../../utils/contentEntries';

export async function GET(context: APIContext) {
  const incidents = await getCollection('incidents', ({ data }) => data.status === 'published');

  const items = sortNewestFirst(
    incidents.filter((item) => item.data.date || item.data.sortDate || item.data.updated)
  )
    .map((item) => ({
      title: item.data.title,
      pubDate: item.data.date ?? item.data.sortDate ?? item.data.updated!,
      description: item.data.summary || item.data.excerpt || '',
      link: `/incidents/${entrySlug(item)}/`,
    }));

  return rss({
    title: 'The Forensic Brief - Incidents',
    description: 'Documented AI failure events with evidence-based post-mortems.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
