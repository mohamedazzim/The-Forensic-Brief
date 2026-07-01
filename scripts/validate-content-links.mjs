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
validateMetadataPairs('essays');
validateMetadataPairs('observations');

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
assert(existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door', 'index.html')), 'Published Samsung incident route should be generated');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door-metadata', 'index.html')), 'Incident metadata route should not be generated');
assert(!existsSync(join(dist, 'incidents', 'samsung-chatgpt-one-way-door-content', 'index.html')), 'Incident content route should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'decision-envelope', 'index.html')), 'Draft Decision Envelope should not be generated');
assert(existsSync(join(dist, 'artifacts', 'six-dimensions-maturity-scorecard', 'index.html')), 'Published Six Dimensions route should be generated');
assert(!existsSync(join(dist, 'artifacts', 'mris-template-metadata', 'index.html')), 'Artifact metadata route should not be generated');
assert(!existsSync(join(dist, 'artifacts', 'mris-template-content', 'index.html')), 'Artifact content route should not be generated');
assert(!existsSync(join(dist, 'essays', 'hitl-is-not-oversight-metadata', 'index.html')), 'Essay metadata route should not be generated');
assert(!existsSync(join(dist, 'essays', 'hitl-is-not-oversight-content', 'index.html')), 'Essay content route should not be generated');
assert(!existsSync(join(dist, 'essays', 'detection-drop-line-600-metadata', 'index.html')), 'Pattern metadata route should not be generated');
assert(!existsSync(join(dist, 'essays', 'detection-drop-line-600-content', 'index.html')), 'Pattern content route should not be generated');
assert(existsSync(join(dist, 'essays', 'whitebox-red-teaming', 'index.html')), 'Published Whitebox essay route should be generated');
assert(!existsSync(join(dist, 'essays', 'whitebox-red-teaming-metadata', 'index.html')), 'Whitebox metadata route should not be generated');
assert(!existsSync(join(dist, 'essays', 'whitebox-red-teaming-content', 'index.html')), 'Whitebox content route should not be generated');
assert(existsSync(join(dist, 'observations', 'the-attack-that-left-no-fingerprints', 'index.html')), 'Published observation route should be generated');
assert(!existsSync(join(dist, 'observations', 'the-attack-that-left-no-fingerprints-metadata', 'index.html')), 'Observation metadata route should not be generated');
assert(!existsSync(join(dist, 'observations', 'the-attack-that-left-no-fingerprints-content', 'index.html')), 'Observation content route should not be generated');

assertJsonLd('index.html', ['"@type":"WebSite"', '"@type":"Organization"']);
assertJsonLd(join('incidents', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('observations', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('topics', 'index.html'), ['"@type":"CollectionPage"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('essays', 'hitl-is-not-oversight', 'index.html'), ['"@type":"Article"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('artifacts', 'mris-template', 'index.html'), ['"@type":"CreativeWork"', '"@type":"BreadcrumbList"']);
assertJsonLd(join('books', 'human-in-control', 'index.html'), ['"@type":"Book"', '"@type":"BreadcrumbList"']);

const htmlFiles = walk(dist, (f) => f.endsWith('.html'));
const html = htmlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

assert(!html.includes('theforensicbriefazzim.substack.com'), 'Generated HTML should not include the removed Substack URL');
assert(!html.includes('Subscribe on Substack'), 'Generated HTML should not include old Substack CTA copy');
assert(!html.includes('Newsletter signup is not configured yet'), 'Generated HTML should not include disabled newsletter filler');
assert(!html.includes('PDF preview coming soon'), 'Generated HTML should not include removed PDF preview placeholder');
assert(!html.includes('/incidents/air-canada-chatbot-refund/'), 'Generated HTML should not link to unsupported incident content');
assert(html.includes('/incidents/samsung-chatgpt-one-way-door/'), 'Generated HTML should link to the published Samsung incident');
assert(!html.includes('/artifacts/pa-01-six-dimensions-maturity-scorecard.pdf'), 'Generated HTML should not reference local production artifact files');
assert(html.includes('/artifacts/six-dimensions-maturity-scorecard/'), 'Generated HTML should link to the published Six Dimensions artifact');
assert(html.includes('/essays/whitebox-red-teaming/'), 'Generated HTML should link to the published Whitebox essay');
assert(html.includes('/observations/the-attack-that-left-no-fingerprints/'), 'Generated HTML should link to the published observation');
assert(!html.includes('-metadata/'), 'Generated HTML should not expose metadata routes');
assert(!html.includes('-content/'), 'Generated HTML should not expose content routes');
assert(!html.includes('r2_uploads/'), 'Generated HTML should not expose r2_uploads paths');
assert(!html.includes('topic-slug'), 'Generated HTML should not expose placeholder topic slugs');
assert(!html.includes('Table of Contents'), 'Generated HTML should not expose the removed book table of contents block');
assert(!html.includes('Placeholder: approved descriptive copy for this book has not been supplied yet.'), 'Generated HTML should not expose placeholder book copy');
assert(!html.includes('Placeholder book record using the approved front and back cover images while the manuscript package is still being prepared.'), 'Generated HTML should not expose placeholder book summary copy');
assert(!html.includes('Category:'), 'Generated HTML should not expose the removed essays category filter row');

const essaysIndexHtml = readHtml(join('essays', 'index.html'));
assert(essaysIndexHtml.includes('id="series-filter"'), 'Essays index should render the series dropdown');
assert(essaysIndexHtml.includes('<label for="series-filter"'), 'Essays index should render an accessible series filter label');
assert(essaysIndexHtml.includes('Human in Control'), 'Essays index should include the Human in Control series option');
assert(essaysIndexHtml.includes('Out of Bounds'), 'Essays index should include the Out of Bounds series option');
assert(essaysIndexHtml.includes('Patterns'), 'Essays index should preserve the Patterns section heading');
assert(essaysIndexHtml.includes('/essays/whitebox-red-teaming/'), 'Essays index should link to the published Whitebox essay');
assert(!essaysIndexHtml.includes('Category:'), 'Essays index should not render the removed category filter row');

const incidentsIndexHtml = readHtml(join('incidents', 'index.html'));
assert(incidentsIndexHtml.includes('Incidents'), 'Incidents index should still render');
assert(incidentsIndexHtml.includes('/incidents/samsung-chatgpt-one-way-door/'), 'Incidents index should link to the published Samsung incident');
assert(incidentsIndexHtml.includes('The One-Way Door: How Samsung Lost Its Source Code to a Machine That Cannot Forget'), 'Incidents index should render the Samsung incident title');
assert(incidentsIndexHtml.includes('April 2023 (company-wide ban, early May 2023)'), 'Incidents index should render the Samsung display date');
assert(incidentsIndexHtml.includes('Incident'), 'Incidents index should render a safe generic incident category when structured forensic labels are absent');
assert(!incidentsIndexHtml.includes('undefined'), 'Incidents index should not render undefined labels');
assert(!incidentsIndexHtml.includes('null'), 'Incidents index should not render null labels');
assert(!incidentsIndexHtml.includes('Severity:'), 'Incidents index should not render the removed severity filter row');
assert(!incidentsIndexHtml.includes('Domain:'), 'Incidents index should not render the removed domain filter row');
assert(!incidentsIndexHtml.includes('Vendor:'), 'Incidents index should not render the removed vendor filter row');

const samsungIncidentHtml = readHtml(join('incidents', 'samsung-chatgpt-one-way-door', 'index.html'));
assert(samsungIncidentHtml.includes('April 2023 (company-wide ban, early May 2023)'), 'Samsung detail page should render the source-backed display date');
assert(samsungIncidentHtml.includes('Samsung, ChatGPT'), 'Samsung detail page should render the source-backed systems list');
assert(samsungIncidentHtml.includes('Within roughly twenty days of letting its semiconductor engineers use ChatGPT'), 'Samsung detail page should render the source-backed excerpt');
assert(samsungIncidentHtml.includes('Why this incident, and why this chapter'), 'Samsung detail page should render the paired content body');
assert(!samsungIncidentHtml.includes('undefined'), 'Samsung detail page should not render undefined labels');
assert(!samsungIncidentHtml.includes('null'), 'Samsung detail page should not render null labels');

const artifactsIndexHtml = readHtml(join('artifacts', 'index.html'));
assert(artifactsIndexHtml.includes('Artifacts'), 'Artifacts index should still render');
assert(artifactsIndexHtml.includes('/artifacts/six-dimensions-maturity-scorecard/'), 'Artifacts index should link to the published Six Dimensions route');
assert(!artifactsIndexHtml.includes('Type:'), 'Artifacts index should not render the removed type filter row');
assert(!artifactsIndexHtml.includes('Topic:'), 'Artifacts index should not render the removed topic filter row');
assert(!artifactsIndexHtml.includes('Format:'), 'Artifacts index should not render the removed format filter row');

const whiteboxEssayHtml = readHtml(join('essays', 'whitebox-red-teaming', 'index.html'));
assert(whiteboxEssayHtml.includes('From Guessing to Proving: The Case for Whitebox Red Teaming'), 'Whitebox essay detail page should render the source-backed title');
assert(whiteboxEssayHtml.includes('The default: testing in the dark'), 'Whitebox essay detail page should render the paired content body');
assert(!whiteboxEssayHtml.includes('undefined'), 'Whitebox essay detail page should not render undefined values');
assert(!whiteboxEssayHtml.includes('null'), 'Whitebox essay detail page should not render null values');

const observationHtml = readHtml(join('observations', 'the-attack-that-left-no-fingerprints', 'index.html'));
assert(observationHtml.includes('The Precedence Lattice'), 'Observation detail page should render the paired content body');
assert(!observationHtml.includes('undefined'), 'Observation detail page should not render undefined values');
assert(!observationHtml.includes('null'), 'Observation detail page should not render null values');

const sixDimensionsHtml = readHtml(join('artifacts', 'six-dimensions-maturity-scorecard', 'index.html'));
assert(sixDimensionsHtml.includes('The Six Dimensions - Maturity Scorecard'), 'Six Dimensions detail page should render the source-backed title');
assert(sixDimensionsHtml.includes('Downloads unavailable'), 'Six Dimensions detail page should render a safe unavailable download state until R2 upload is active');
assert(sixDimensionsHtml.includes('Why this exists (necessity)'), 'Six Dimensions detail page should render the paired content body');
assert(!sixDimensionsHtml.includes('undefined'), 'Six Dimensions detail page should not render undefined values');
assert(!sixDimensionsHtml.includes('null'), 'Six Dimensions detail page should not render null values');

const bookPageHtml = readHtml(join('books', 'human-in-control', 'index.html'));
assert(!bookPageHtml.includes('Table of Contents'), 'Book detail page should not render a Table of Contents section');
assert(!bookPageHtml.includes('Placeholder'), 'Book detail page should not render placeholder book prose');
assert(bookPageHtml.includes('PDF unavailable'), 'Book detail page should keep the safe PDF unavailable state');
assert(bookPageHtml.includes('Amazon link unavailable'), 'Book detail page should keep the safe Amazon unavailable state');
assert(!bookPageHtml.includes('<h2>Description</h2>'), 'Book detail page should skip Description when no source-backed description exists');
assert(bookPageHtml.includes('Front cover'), 'Book detail page should expose the front cover inline');
assert(bookPageHtml.includes('Back cover'), 'Book detail page should expose the back cover inline');
assert(!bookPageHtml.includes('book-cover-dialog'), 'Book detail page should not expose the cover modal');
assert(!bookPageHtml.includes('Close cover preview'), 'Book detail page should not expose the modal close button');

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
