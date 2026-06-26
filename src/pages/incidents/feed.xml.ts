import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const incidents = await getCollection('incidents', ({ data }) => data.status === 'published');

  const items = incidents
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.summary,
      link: `/incidents/${item.id.replace(/\.(md|mdx)$/, '')}/`,
    }));

  return rss({
    title: 'The Forensic Brief - Incidents',
    description: 'Documented AI failure events with evidence-based post-mortems.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
