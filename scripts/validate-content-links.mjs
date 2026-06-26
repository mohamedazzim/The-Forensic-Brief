import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
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
  assert(!txt.includes('è‡ªåŠ¨ç”Ÿæˆ'), `${path} contains garbled text`);
}

const srcFiles = walk(src, (f) => /\.(mdx?|astro|ts|js|mjs|json)$/.test(f));
srcFiles.forEach(checkTextFile);

const htmlFiles = existsSync(dist) ? walk(dist, (f) => f.endsWith('.html')) : [];
const html = htmlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
const requiredPaths = ['/sitemap.xml', '/feed.xml', '/rss.xml', '/robots.txt', '/search/', '/pagefind/'];
requiredPaths.forEach((p) => assert(html.includes(p) || existsSync(join(dist, p.replace(/^\//, ''))), `Missing required path reference or file: ${p}`));

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

const missingLinkPatterns = [
  '/essays/blind-acceptance-rate/',
  '/artifacts/blind-acceptance-rate-audit/',
  '/essays/detection-drop-line-600/',
  '/books/out-of-bounds/',
  '/topics/red-teaming/',
];

missingLinkPatterns.forEach((pattern) => {
  assert(!html.includes(pattern) || existsSync(join(dist, pattern.replace(/^\//, ''), 'index.html')), `Broken internal link reference: ${pattern}`);
});

assertJsonLd('index.html', ['"@type":"WebSite"', '"@type":"Organization"']);
assertJsonLd(join('incidents', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('books', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('observations', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('topics', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('topics', 'red-teaming', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'patterns', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'hitl-is-not-oversight', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('incidents', 'air-canada-chatbot-refund', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('books', 'human-in-control', 'index.html'), ['"@type":"Book"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'decision-envelope', 'index.html'), ['"@type":"CreativeWork"', '"@type":"BreadcrumbList"']);

const emptyImages = [...html.matchAll(/<(meta|img)[^>]+(?:og:image|twitter:image|src)=["']([^"']*)["']/gi)]
  .filter((m) => !m[2]);
assert(emptyImages.length === 0, 'Empty image metadata or src found');

console.log('validate:content passed');
