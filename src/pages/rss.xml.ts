import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { entrySlug, sortNewestFirst } from '../utils/contentEntries';

export async function GET(context: APIContext) {
  const incidents = await getCollection('incidents', ({ data }) => data.status === 'published');
  const essays = await getCollection('essays', ({ data }) => data.status === 'published');

  const items = sortNewestFirst(
    [...incidents, ...essays].filter((item) => item.data.date || item.data.updated)
  )
    .map((item) => {
      const collection = item.collection as 'incidents' | 'essays';
      return {
        title: item.data.title,
        pubDate: item.data.date ?? item.data.updated!,
        description: item.data.summary || item.data.excerpt || '',
        link: `/${collection}/${entrySlug(item)}/`,
      };
    });

  return rss({
    title: 'The Forensic Brief',
    description: 'Post-Incident Analysis of AI Failure',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
