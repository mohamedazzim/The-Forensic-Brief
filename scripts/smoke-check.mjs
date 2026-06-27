import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function remoteAvailable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

const routes = [
  'index.html',
  'search/index.html',
  'incidents/index.html',
  'incidents/feed.xml',
  'essays/index.html',
  'essays/feed.xml',
  'essays/patterns/index.html',
  'essays/detection-drop-line-600/index.html',
  'essays/human-in-control/feed.xml',
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

const countMatches = (text, pattern) => (text.match(pattern) || []).length;

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

const incidentPage = readFileSync(join(dist, 'incidents/air-canada-chatbot-refund/index.html'), 'utf8');
assert(incidentPage.includes('Methodology'), 'Incident page missing methodology snippet');
assert(countMatches(incidentPage, /<h1\b/g) === 1, 'Incident page should expose exactly one H1');

const artifactPages = [
  'artifacts/mris-template/index.html',
  'artifacts/decision-envelope/index.html',
];

for (const route of artifactPages) {
  const pageHtml = readFileSync(join(dist, route), 'utf8');
  assert(pageHtml.includes('Download:'), `${route} missing artifact download header`);
  assert(pageHtml.includes('unavailable') || pageHtml.includes('href="https://files.theforensicbrief.com/artifacts/'), `${route} should either show unavailable downloads or active R2 links`);
  assert(!pageHtml.includes('PDF preview coming soon'), `${route} should not expose the old PDF preview placeholder`);
}

const page404 = readFileSync(join(dist, '404.html'), 'utf8');
assert(page404.includes('/search/'), '404 page missing explicit search link');
assert(page404.includes('Return to Home'), '404 page missing home link');

const bookPage = readFileSync(join(dist, 'books/human-in-control/index.html'), 'utf8');
const booksIndex = readFileSync(join(dist, 'books/index.html'), 'utf8');
assert(booksIndex.includes('book-grid'), 'Books index missing grid layout');
assert(booksIndex.includes('href="/books/human-in-control/"') || booksIndex.includes('href="/books/human-in-control/index.html"'), 'Books index missing book detail link');

const coverUrl = 'https://files.theforensicbrief.com/books/human-in-control-front-cover.jpg';
const backCoverUrl = 'https://files.theforensicbrief.com/books/human-in-control-back-cover.jpg';
const pdfUrl = 'https://files.theforensicbrief.com/books/human-in-control.pdf';
const [coverAvailable, pdfAvailable] = await Promise.all([
  remoteAvailable(coverUrl),
  remoteAvailable(pdfUrl),
]);

if (coverAvailable) {
  assert(bookPage.includes(coverUrl), 'Book page missing cover image when asset is reachable');
} else {
  assert(bookPage.includes('Cover unavailable'), 'Book page missing cover fallback when asset is unreachable');
  assert(!bookPage.includes(coverUrl), 'Book page should not render a broken cover image');
}

const backCoverAvailable = await remoteAvailable(backCoverUrl);
if (backCoverAvailable) {
  assert(bookPage.includes(backCoverUrl), 'Book page missing back cover image when asset is reachable');
  assert(bookPage.includes('data-cover-preview-trigger'), 'Book page missing back cover preview trigger when asset is reachable');
  assert(bookPage.includes('book-cover-dialog'), 'Book page missing back cover dialog when asset is reachable');
}

assert(countMatches(bookPage, /<h1\b/g) === 1, 'Book page should expose exactly one H1');

if (pdfAvailable) {
  assert(bookPage.includes('Download PDF (2.4 MB)'), 'Book page missing active PDF download when asset is reachable');
} else {
  assert(bookPage.includes('PDF unavailable'), 'Book page missing disabled PDF state when asset is unreachable');
  assert(!bookPage.includes(pdfUrl), 'Book page should not render an active broken PDF link');
}

assert(!bookPage.includes('PDF preview coming soon'), 'Book page should not expose the old preview placeholder');

const patternPage = readFileSync(join(dist, 'essays/detection-drop-line-600/index.html'), 'utf8');
assert(patternPage.includes('P-ATTENTION-DECAY'), 'Pattern page missing pattern identifier');
assert(countMatches(patternPage, /<h1\b/g) === 1, 'Pattern page should expose exactly one H1');

console.log('smoke-check passed');
