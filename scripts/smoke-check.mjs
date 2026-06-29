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
  'incidents/feed.xml',
  'incidents/samsung-chatgpt-one-way-door/index.html',
  'essays/index.html',
  'essays/feed.xml',
  'essays/patterns/index.html',
  'essays/detection-drop-line-600/index.html',
  'essays/human-in-control/feed.xml',
  'essays/whitebox-red-teaming/index.html',
  'books/index.html',
  'books/human-in-control/index.html',
  'artifacts/index.html',
  'artifacts/mris-template/index.html',
  'artifacts/six-dimensions-maturity-scorecard/index.html',
  'observations/index.html',
  'observations/the-attack-that-left-no-fingerprints/index.html',
  'topics/red-teaming/index.html',
  'sitemap.xml',
  'feed.xml',
  'rss.xml',
  'robots.txt',
];

routes.forEach((route) => assert(existsSync(join(dist, route)), `Missing route: ${route}`));

assert(!existsSync(join(dist, 'incidents', 'air-canada-chatbot-refund', 'index.html')), 'Unsupported Air Canada route should not exist');
assert(!existsSync(join(dist, 'artifacts', 'decision-envelope', 'index.html')), 'Draft Decision Envelope route should not exist');

const searchHtml = readFileSync(join(dist, 'search/index.html'), 'utf8');
assert(searchHtml.includes('Search'), 'Search page missing title');
assert(searchHtml.includes('Search the publication'), 'Search input missing');

assert(readdirSync(join(dist, 'pagefind')).length > 0, 'Pagefind output missing');

const countMatches = (text, pattern) => (text.match(pattern) || []).length;

const pagesWithoutNewsletterLeak = [
  'index.html',
  'essays/hitl-is-not-oversight/index.html',
  'observations/index.html',
  'essays/index.html',
  'artifacts/index.html',
];

pagesWithoutNewsletterLeak.forEach((route) => {
  const pageHtml = readFileSync(join(dist, route), 'utf8');
  assert(!pageHtml.includes('theforensicbriefazzim.substack.com'), `${route} still contains removed Substack URL`);
  assert(!pageHtml.includes('Subscribe on Substack'), `${route} still contains old newsletter CTA text`);
  assert(!pageHtml.includes('Newsletter signup is not configured yet'), `${route} still shows disabled newsletter copy`);
  assert(!pageHtml.includes('newsletter-form'), `${route} still contains form-based newsletter markup`);
});

const artifactPages = [
  'artifacts/mris-template/index.html',
];

for (const route of artifactPages) {
  const pageHtml = readFileSync(join(dist, route), 'utf8');
  assert(!pageHtml.includes('PDF preview coming soon'), `${route} should not expose the old PDF preview placeholder`);
}

const page404 = readFileSync(join(dist, '404.html'), 'utf8');
assert(page404.includes('/search/'), '404 page missing explicit search link');
assert(page404.includes('Return to Home'), '404 page missing home link');

const booksIndex = readFileSync(join(dist, 'books/index.html'), 'utf8');
assert(booksIndex.includes('href="/books/human-in-control/"'), 'Books index should link to the Human in Control detail page');

const patternPage = readFileSync(join(dist, 'essays/detection-drop-line-600/index.html'), 'utf8');
assert(patternPage.includes('P-ATTENTION-DECAY'), 'Pattern page missing pattern identifier');
assert(countMatches(patternPage, /<h1\b/g) === 1, 'Pattern page should expose exactly one H1');

const bookPage = readFileSync(join(dist, 'books/human-in-control/index.html'), 'utf8');
assert(bookPage.includes('human-in-control-front-cover.jpg'), 'Book detail page should expose the front cover image');
assert(bookPage.includes('human-in-control-back-cover.jpg'), 'Book detail page should expose the back cover image');

console.log('smoke-check passed');
