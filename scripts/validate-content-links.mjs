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

function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\r\n]+)["']?`, 'm'));
  return match ? match[1].trim() : '';
}

function validateMetadataPairs(collectionDir) {
  const dir = join(src, 'content', collectionDir);
  const metadataFiles = walk(dir, (file) => file.endsWith('-metadata.md') || file.endsWith('-metadata.mdx'));

  for (const file of metadataFiles) {
    const raw = readFileSync(file, 'utf8');
    const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert(frontmatterMatch, `${file} is missing frontmatter`);

    const frontmatter = frontmatterMatch[1];
    const status = frontmatterValue(frontmatter, 'status');
    const slug = frontmatterValue(frontmatter, 'slug');
    const contentFile = frontmatterValue(frontmatter, 'contentFile');

    assert(slug, `${file} is missing slug`);

    if (status === 'published') {
      assert(contentFile, `${file} is missing contentFile`);
      assert(existsSync(join(dir, contentFile)), `${file} references missing content file: ${contentFile}`);
    } else if (contentFile) {
      assert(existsSync(join(dir, contentFile)), `${file} references missing content file: ${contentFile}`);
    }
  }
}

const srcFiles = walk(src, (f) => /\.(mdx?|astro|ts|js|mjs|json)$/.test(f));
srcFiles.forEach(checkTextFile);
validateMetadataPairs('incidents');
validateMetadataPairs('artifacts');

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
  'essays/index.html',
  'essays/hitl-is-not-oversight/index.html',
  'essays/detection-drop-line-600/index.html',
  'essays/whitebox-red-teaming/index.html',
  'observations/index.html',
  'observations/the-attack-that-left-no-fingerprints/index.html',
  'artifacts/index.html',
  'artifacts/mris-template/index.html',
  'books/index.html',
  'books/human-in-control/index.html',
];

requiredFiles.forEach((path) => assert(existsSync(join(dist, path)), `Missing generated file: ${path}`));

assert(!existsSync(join(dist, 'incidents', 'air-canada-chatbot-refund', 'index.html')), 'Unsupported Air Canada incident route should not be generated');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door', 'index.html')), 'Draft Samsung incident route should not be generated');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door-metadata', 'index.html')), 'Incident metadata route should not be generated');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door-content', 'index.html')), 'Incident content route should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'decision-envelope', 'index.html')), 'Draft Decision Envelope should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'six-dimensions-maturity-scorecard', 'index.html')), 'Draft Six Dimensions route should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'mris-template-metadata', 'index.html')), 'Artifact metadata route should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'mris-template-content', 'index.html')), 'Artifact content route should not be generated');

assertJsonLd('index.html', ['"@type":"WebSite"', '"@type":"Organization"']);
assertJsonLd(join('incidents', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('observations', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('topics', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'hitl-is-not-oversight', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'whitebox-red-teaming', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('observations', 'the-attack-that-left-no-fingerprints', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'mris-template', 'index.html'), ['"@type":"CreativeWork"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('books', 'human-in-control', 'index.html'), ['"@type":"Book"', '"@type":"BreadcrumbList"']);

const htmlFiles = walk(dist, (f) => f.endsWith('.html'));
const html = htmlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

assert(!html.includes('theforensicbriefazzim.substack.com'), 'Generated HTML should not include the removed Substack URL');
assert(!html.includes('Subscribe on Substack'), 'Generated HTML should not include old Substack CTA copy');
assert(!html.includes('Newsletter signup is not configured yet'), 'Generated HTML should not include disabled newsletter filler');
assert(!html.includes('PDF preview coming soon'), 'Generated HTML should not include removed PDF preview placeholder');
assert(!html.includes('/incidents/air-canada-chatbot-refund/'), 'Generated HTML should not link to unsupported incident content');
assert(!html.includes('/incidents/samsung-chatgpt-one-way-door/'), 'Generated HTML should not link to draft Samsung incident content');
assert(!html.includes('/artifacts/pa-01-six-dimensions-maturity-scorecard.pdf'), 'Generated HTML should not reference local production artifact files');
assert(!html.includes('/artifacts/six-dimensions-maturity-scorecard/'), 'Generated HTML should not link to draft Six Dimensions artifact content');
assert(!html.includes('-metadata/'), 'Generated HTML should not expose metadata routes');
assert(!html.includes('-content/'), 'Generated HTML should not expose content routes');
assert(!html.includes('r2_uploads/'), 'Generated HTML should not expose r2_uploads paths');
assert(!html.includes('Table of Contents'), 'Generated HTML should not expose the removed book table of contents block');
assert(!html.includes('Placeholder: approved descriptive copy for this book has not been supplied yet.'), 'Generated HTML should not expose placeholder book copy');
assert(!html.includes('Placeholder book record using the approved front and back cover images while the manuscript package is still being prepared.'), 'Generated HTML should not expose placeholder book summary copy');

const bookPageHtml = readHtml(join('books', 'human-in-control', 'index.html'));
assert(!bookPageHtml.includes('Table of Contents'), 'Book detail page should not render a Table of Contents section');
assert(!bookPageHtml.includes('Placeholder'), 'Book detail page should not render placeholder book prose');
assert(bookPageHtml.includes('PDF unavailable'), 'Book detail page should keep the safe PDF unavailable state');
assert(bookPageHtml.includes('Amazon link unavailable'), 'Book detail page should keep the safe Amazon unavailable state');
assert(!bookPageHtml.includes('<h2>Description</h2>'), 'Book detail page should skip Description when no source-backed description exists');

const artifactPages = [
  join('artifacts', 'mris-template', 'index.html'),
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
