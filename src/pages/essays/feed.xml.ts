import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { entrySlug, sortNewestFirst } from '../../utils/contentEntries';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => data.status === 'published');

  const items = sortNewestFirst(
    essays
      .filter((item) => item.data.date || item.data.updated)
  )
    .map((item) => ({
      title: item.data.title,
      pubDate: item.data.date ?? item.data.updated!,
      description: item.data.summary || '',
      link: `/essays/${entrySlug(item)}/`,
    }));

  return rss({
    title: 'The Forensic Brief - Essays',
    description: 'Long-form analysis of AI failure patterns and governance frameworks.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
