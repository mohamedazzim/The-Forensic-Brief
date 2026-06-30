import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { entrySlug } from '../../../utils/contentEntries';

const seriesNames = ['human-in-control', 'out-of-bounds', 'accountable-autonomy', 'six-dimensions', 'the-burden'] as const;

export async function getStaticPaths() {
  return seriesNames.map((series) => ({
    params: { series },
    props: { series },
  }));
}

export async function GET(context: APIContext) {
  const series = context.params.series as (typeof seriesNames)[number];
  const essays = await getCollection('essays', ({ data }) => data.status === 'published' && data.category === 'essay' && data.series === series);

  const items = essays
    .filter((item) => item.data.date)
    .sort((a, b) => (a.data.seriesNo ?? 0) - (b.data.seriesNo ?? 0))
    .map((item) => ({
      title: item.data.title,
      pubDate: item.data.date!,
      description: item.data.summary || '',
      link: `/essays/${entrySlug(item)}/`,
    }));

  return rss({
    title: `The Forensic Brief - ${series} series`,
    description: `Essays in the ${series} series.`,
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
