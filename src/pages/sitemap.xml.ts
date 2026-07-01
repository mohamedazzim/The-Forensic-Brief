import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { hasContentFiles } from '../utils/hasContentFiles';
import { entrySlug } from '../utils/contentEntries';

export async function GET(context: APIContext) {
  let books = [];
  if (hasContentFiles('books')) {
    books = await getCollection('books', ({ data }) => data.status === 'published');
  }

  const collections = await Promise.all([
    getCollection('incidents', ({ data }) => data.status === 'published'),
    getCollection('essays', ({ data }) => data.status === 'published'),
    getCollection('observations', ({ data }) => data.status === 'published'),
    getCollection('artifacts', ({ data }) => data.status === 'published'),
    Promise.resolve(books),
  ]);

  const topicSet = new Set<string>();
  collections.slice(0, 4).flat().forEach((item) => {
    item.data.tags?.forEach((tag: string) => topicSet.add(tag));
  });

  const urls = [
    '/',
    '/search/',
    '/incidents/',
    '/essays/',
    '/essays/patterns/',
    '/books/',
    '/observations/',
    '/artifacts/',
    '/about/',
    '/methodology/',
    '/disclaimer/',
    '/topics/',
    ...[...topicSet].sort((a, b) => a.localeCompare(b)).map((tag) => `/topics/${tag}/`),
    ...collections.flatMap((items, index) => items.map((item) => {
      const names = ['incidents', 'essays', 'observations', 'artifacts', 'books'] as const;
      return `/${names[index]}/${entrySlug(item)}/`;
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${new URL(url, context.site).href}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } });
}
