import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const collections = await Promise.all([
    getCollection('incidents', ({ data }) => data.status === 'published'),
    getCollection('essays', ({ data }) => data.status === 'published'),
    getCollection('observations', ({ data }) => data.status === 'published'),
    getCollection('artifacts', ({ data }) => data.status === 'published'),
    getCollection('books', ({ data }) => data.status === 'published'),
  ]);

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
    '/topics/human-oversight/',
    '/topics/eu-ai-act/',
    '/topics/automation-bias/',
    ...collections.flatMap((items, index) => items.map((item) => {
      const names = ['incidents', 'essays', 'observations', 'artifacts', 'books'] as const;
      return `/${names[index]}/${item.id.replace(/\.(md|mdx)$/, '')}/`;
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${new URL(url, context.site).href}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } });
}
