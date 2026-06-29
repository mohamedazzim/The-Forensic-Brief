import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const src = join(root, 'src');

function walk(dir, filter = () => true, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function checkTextFile(path) {
  const txt = readFileSync(path, 'utf8');
  assert(!txt.includes('XXXXXXXXXX'), `${path} contains XXXXXXXXXX`);
  assert(!txt.includes('978-0-00-000000-0'), `${path} contains fake ISBN`);
  assert(!txt.includes('自动生成'), `${path} contains removed placeholder text`);
}

const srcFiles = walk(src, (f) => /\.(mdx?|astro|ts|js|mjs|json)$/.test(f));
srcFiles.forEach(checkTextFile);

function readHtml(relativePath) {
  const filePath = join(dist, relativePath);
  assert(existsSync(filePath), `Missing generated file: ${relativePath}`);
  return readFileSync(filePath, 'utf8');
}

function assertJsonLd(relativePath, patterns) {
  const pageHtml = readHtml(relativePath);
  patterns.forEach((pattern) => {
    assert(pageHtml.includes(pattern), `${relativePath} missing JSON-LD token: ${pattern}`);
  });
}

async function remoteAvailable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

const requiredFiles = [
  'index.html',
  '404.html',
  'feed.xml',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
  'search/index.html',
  'incidents/index.html',
  'incidents/samsung-chatgpt-one-way-door/index.html',
  'essays/index.html',
  'essays/hitl-is-not-oversight/index.html',
  'essays/detection-drop-line-600/index.html',
  'essays/whitebox-red-teaming/index.html',
  'observations/index.html',
  'observations/the-attack-that-left-no-fingerprints/index.html',
  'artifacts/index.html',
  'artifacts/mris-template/index.html',
  'artifacts/six-dimensions-maturity-scorecard/index.html',
  'books/index.html',
  'books/human-in-control/index.html',
];

requiredFiles.forEach((path) => assert(existsSync(join(dist, path)), `Missing generated file: ${path}`));

assert(!existsSync(join(dist, 'incidents', 'air-canada-chatbot-refund', 'index.html')), 'Unsupported Air Canada incident route should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'decision-envelope', 'index.html')), 'Draft Decision Envelope should not be generated');

assertJsonLd('index.html', ['"@type":"WebSite"', '"@type":"Organization"']);
assertJsonLd(join('incidents', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('observations', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('topics', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'hitl-is-not-oversight', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'whitebox-red-teaming', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('incidents', 'samsung-chatgpt-one-way-door', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('observations', 'the-attack-that-left-no-fingerprints', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'mris-template', 'index.html'), ['"@type":"CreativeWork"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'six-dimensions-maturity-scorecard', 'index.html'), ['"@type":"CreativeWork"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('books', 'human-in-control', 'index.html'), ['"@type":"Book"', '"@type":"BreadcrumbList"']);

const htmlFiles = walk(dist, (f) => f.endsWith('.html'));
const html = htmlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

assert(!html.includes('theforensicbriefazzim.substack.com'), 'Generated HTML should not include the removed Substack URL');
assert(!html.includes('Subscribe on Substack'), 'Generated HTML should not include old Substack CTA copy');
assert(!html.includes('Newsletter signup is not configured yet'), 'Generated HTML should not include disabled newsletter filler');
assert(!html.includes('PDF preview coming soon'), 'Generated HTML should not include removed PDF preview placeholder');
assert(!html.includes('/incidents/air-canada-chatbot-refund/'), 'Generated HTML should not link to unsupported incident content');
assert(!html.includes('/artifacts/pa-01-six-dimensions-maturity-scorecard.pdf'), 'Generated HTML should not reference local production artifact files');

const artifactPages = [
  join('artifacts', 'mris-template', 'index.html'),
  join('artifacts', 'six-dimensions-maturity-scorecard', 'index.html'),
];

for (const route of artifactPages) {
  const artifactHtml = readHtml(route);
  const downloadLinks = [...artifactHtml.matchAll(/href="(https:\/\/files\.theforensicbrief\.com\/artifacts\/[^"]+)"/g)].map((match) => match[1]);
  for (const url of downloadLinks) {
    const available = await remoteAvailable(url);
    assert(available, `${route} exposes an active download link to an unreachable asset: ${url}`);
  }
}

const emptyImages = [...html.matchAll(/<(meta|img)[^>]+(?:og:image|twitter:image|src)=["']([^"']*)["']/gi)]
  .filter((m) => !m[2]);
assert(emptyImages.length === 0, 'Empty image metadata or src found');

console.log('validate:content passed');
