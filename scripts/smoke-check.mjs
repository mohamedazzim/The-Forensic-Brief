import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const routes = [
  'index.html',
  'search/index.html',
  'incidents/index.html',
  'essays/index.html',
  'essays/patterns/index.html',
  'books/index.html',
  'artifacts/index.html',
  'observations/index.html',
  'topics/red-teaming/index.html',
  'sitemap.xml',
  'feed.xml',
  'rss.xml',
  'robots.txt',
];

routes.forEach((route) => assert(existsSync(join(dist, route)), `Missing route: ${route}`));

const html = readFileSync(join(dist, 'search/index.html'), 'utf8');
assert(html.includes('Search'), 'Search page missing title');
assert(html.includes('Search the publication'), 'Search input missing');

assert(readdirSync(join(dist, 'pagefind')).length > 0, 'Pagefind output missing');

const newsletterPages = [
  'index.html',
  'essays/hitl-is-not-oversight/index.html',
  'incidents/air-canada-chatbot-refund/index.html',
  'observations/index.html',
  'essays/index.html',
  'artifacts/index.html',
];

newsletterPages.forEach((route) => {
  const pageHtml = readFileSync(join(dist, route), 'utf8');
  assert(pageHtml.includes('theforensicbriefazzim.substack.com'), `${route} missing Substack URL`);
  assert(pageHtml.includes('Subscribe on Substack'), `${route} missing newsletter CTA text`);
  assert(!pageHtml.includes('Newsletter signup is not configured yet'), `${route} still shows disabled newsletter copy`);
  assert(!pageHtml.includes('newsletter-form'), `${route} still contains form-based newsletter markup`);
});

console.log('smoke-check passed');
