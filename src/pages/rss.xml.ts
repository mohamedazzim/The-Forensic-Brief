import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { entrySlug } from '../utils/contentEntries';

export async function GET(context: APIContext) {
  const incidents = await getCollection('incidents', ({ data }) => data.status === 'published');
  const essays = await getCollection('essays', ({ data }) => data.status === 'published');

  const items = [...incidents, ...essays]
    .filter((item) => item.data.date)
    .sort((a, b) => b.data.date!.valueOf() - a.data.date!.valueOf())
    .map((item) => {
      const collection = item.collection as 'incidents' | 'essays';
      return {
        title: item.data.title,
        pubDate: item.data.date!,
        description: item.data.summary || '',
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
