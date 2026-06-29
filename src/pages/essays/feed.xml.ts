import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => data.status === 'published');

  const items = essays
    .filter((item) => item.data.date)
    .sort((a, b) => b.data.date!.valueOf() - a.data.date!.valueOf())
    .map((item) => ({
      title: item.data.title,
      pubDate: item.data.date!,
      description: item.data.summary || '',
      link: `/essays/${item.id.replace(/\.(md|mdx)$/, '')}/`,
    }));

  return rss({
    title: 'The Forensic Brief - Essays',
    description: 'Long-form analysis of AI failure patterns and governance frameworks.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
