import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const incidents = await getCollection('incidents', ({ data }) => data.status === 'published');
  const essays = await getCollection('essays', ({ data }) => data.status === 'published');

  const items = [...incidents, ...essays]
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((item) => {
      const collection = item.collection as 'incidents' | 'essays';
      return {
        title: item.data.title,
        pubDate: item.data.date,
        description: item.data.summary,
        link: `/${collection}/${item.id.replace(/\.(md|mdx)$/, '')}/`,
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
