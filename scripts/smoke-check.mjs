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
  'essays/index.html',
  'essays/feed.xml',
  'essays/patterns/index.html',
  'essays/detection-drop-line-600/index.html',
  'essays/human-in-control/feed.xml',
  'books/index.html',
  'books/human-in-control/index.html',
  'artifacts/index.html',
  'artifacts/mris-template/index.html',
  'observations/index.html',
  'topics/red-teaming/index.html',
  'sitemap.xml',
  'feed.xml',
  'rss.xml',
  'robots.txt',
];

routes.forEach((route) => assert(existsSync(join(dist, route)), `Missing route: ${route}`));

assert(!existsSync(join(dist, 'incidents', 'air-canada-chatbot-refund', 'index.html')), 'Unsupported Air Canada route should not exist');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door', 'index.html')), 'Draft Samsung incident route should not exist');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door-metadata', 'index.html')), 'Incident metadata route should not exist');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door-content', 'index.html')), 'Incident content route should not exist');
assert(!existsSync(join(dist, 'artifacts', 'decision-envelope', 'index.html')), 'Draft Decision Envelope route should not exist');
assert(!existsSync(join(dist, 'artifacts', 'six-dimensions-maturity-scorecard', 'index.html')), 'Draft Six Dimensions route should not exist');
assert(!existsSync(join(dist, 'artifacts', 'mris-template-metadata', 'index.html')), 'Artifact metadata route should not exist');
assert(!existsSync(join(dist, 'artifacts', 'mris-template-content', 'index.html')), 'Artifact content route should not exist');
assert(!existsSync(join(dist, 'essays', 'hitl-is-not-oversight-metadata', 'index.html')), 'Essay metadata route should not exist');
assert(!existsSync(join(dist, 'essays', 'hitl-is-not-oversight-content', 'index.html')), 'Essay content route should not exist');
assert(!existsSync(join(dist, 'essays', 'detection-drop-line-600-metadata', 'index.html')), 'Pattern metadata route should not exist');
assert(!existsSync(join(dist, 'essays', 'detection-drop-line-600-content', 'index.html')), 'Pattern content route should not exist');
assert(!existsSync(join(dist, 'essays', 'whitebox-red-teaming', 'index.html')), 'Draft Whitebox essay route should not exist');
assert(!existsSync(join(dist, 'essays', 'whitebox-red-teaming-metadata', 'index.html')), 'Whitebox metadata route should not exist');
assert(!existsSync(join(dist, 'essays', 'whitebox-red-teaming-content', 'index.html')), 'Whitebox content route should not exist');
assert(!existsSync(join(dist, 'observations', 'the-attack-that-left-no-fingerprints', 'index.html')), 'Draft observation route should not exist');
assert(!existsSync(join(dist, 'observations', 'the-attack-that-left-no-fingerprints-metadata', 'index.html')), 'Observation metadata route should not exist');
assert(!existsSync(join(dist, 'observations', 'the-attack-that-left-no-fingerprints-content', 'index.html')), 'Observation content route should not exist');

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

const incidentsIndex = readFileSync(join(dist, 'incidents/index.html'), 'utf8');
assert(!incidentsIndex.includes('/incidents/samsung-chatgpt-one-way-door/'), 'Incidents index should not link to draft Samsung incident route');
assert(!incidentsIndex.includes('/incidents/samsung-chatgpt-one-way-door-metadata/'), 'Incidents index should not expose metadata routes');
assert(!incidentsIndex.includes('/incidents/samsung-chatgpt-one-way-door-content/'), 'Incidents index should not expose content routes');
assert(!incidentsIndex.includes('Severity:'), 'Incidents index should not render the removed severity filter row');
assert(!incidentsIndex.includes('Domain:'), 'Incidents index should not render the removed domain filter row');
assert(!incidentsIndex.includes('Vendor:'), 'Incidents index should not render the removed vendor filter row');
assert(incidentsIndex.includes('Incidents'), 'Incidents index should still render the page title');

const artifactsIndex = readFileSync(join(dist, 'artifacts/index.html'), 'utf8');
assert(artifactsIndex.includes('/artifacts/mris-template/'), 'Artifacts index should link to the clean MRIS route');
assert(!artifactsIndex.includes('/artifacts/six-dimensions-maturity-scorecard/'), 'Artifacts index should not link to draft Six Dimensions route');
assert(!artifactsIndex.includes('/artifacts/mris-template-metadata/'), 'Artifacts index should not expose metadata routes');
assert(!artifactsIndex.includes('/artifacts/mris-template-content/'), 'Artifacts index should not expose content routes');
assert(!artifactsIndex.includes('Type:'), 'Artifacts index should not render the removed type filter row');
assert(!artifactsIndex.includes('Topic:'), 'Artifacts index should not render the removed topic filter row');
assert(!artifactsIndex.includes('Format:'), 'Artifacts index should not render the removed format filter row');
assert(artifactsIndex.includes('Artifacts'), 'Artifacts index should still render the page title');

const patternPage = readFileSync(join(dist, 'essays/detection-drop-line-600/index.html'), 'utf8');
assert(patternPage.includes('P-ATTENTION-DECAY'), 'Pattern page missing pattern identifier');
assert(countMatches(patternPage, /<h1\b/g) === 1, 'Pattern page should expose exactly one H1');

const essaysIndex = readFileSync(join(dist, 'essays/index.html'), 'utf8');
assert(essaysIndex.includes('id="series-filter"'), 'Essays index should expose the series dropdown');
assert(essaysIndex.includes('<label for="series-filter"'), 'Essays index should expose an accessible series filter label');
assert(!essaysIndex.includes('Category:'), 'Essays index should not render the removed category filter row');
assert(essaysIndex.includes('Human in Control'), 'Essays index should include series options');
assert(essaysIndex.includes('Out of Bounds'), 'Essays index should include series options');
assert(!essaysIndex.includes('/essays/whitebox-red-teaming/'), 'Essays index should not render draft essay cards');
assert(essaysIndex.includes('/essays/detection-drop-line-600/'), 'Essays index should still render pattern cards');

const bookPage = readFileSync(join(dist, 'books/human-in-control/index.html'), 'utf8');
assert(bookPage.includes('human-in-control-front-cover.jpg'), 'Book detail page should expose the front cover image');
assert(bookPage.includes('human-in-control-back-cover.jpg'), 'Book detail page should expose the back cover image');
assert(bookPage.includes('Front cover'), 'Book detail page should label the front cover inline');
assert(bookPage.includes('Back cover'), 'Book detail page should label the back cover inline');
assert(!bookPage.includes('Table of Contents'), 'Book detail page should not render the removed Table of Contents section');
assert(!bookPage.includes('<h2>Description</h2>'), 'Book detail page should skip Description when no source-backed description exists');
assert(bookPage.includes('PDF unavailable'), 'Book detail page should preserve the safe PDF unavailable state');
assert(bookPage.includes('Amazon link unavailable'), 'Book detail page should preserve the safe Amazon unavailable state');
assert(!bookPage.includes('Placeholder'), 'Book detail page should not render placeholder book prose');
assert(!bookPage.includes('book-cover-dialog'), 'Book detail page should not render the cover modal');
assert(!bookPage.includes('Close cover preview'), 'Book detail page should not render the modal close button');

console.log('smoke-check passed');
