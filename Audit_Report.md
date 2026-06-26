# The Forensic Brief Website Audit Report

Audit date: 26 June 2026  
Target: https://the-forensic-brief.pages.dev/  
Design reference: `TheForensicBrief-Technical-Design-Document.md` v1.1  
Method: Playwright crawl of same-origin navigation, expected design-doc routes, download-like links, images, buttons, console errors, SEO metadata, and 390px mobile viewport.

Live verification addendum:

- The deployed Pages site is still behind the current hardening branch.
- Confirmed live passes: home page, incidents index/detail, essays index, `/essays/patterns/`, `/essays/human-in-control/`, books index/detail, artifacts index/detail, observations, about, methodology, disclaimer, `/topics/human-oversight/`, `/topics/eu-ai-act/`, `/topics/automation-bias/`, `/404`, `/rss.xml`, and `/robots.txt`.
- Confirmed live failures: `/search/`, `/search/?q=oversight`, `/sitemap.xml`, `/feed.xml`, `/topics/red-teaming/`, `/essays/out-of-bounds/`, `/essays/accountable-autonomy/`, `/essays/six-dimensions/`, and `/essays/the-burden/`.
- Live incident filters for severity, domain, and vendor are present.
- Live related-content labels render as titles, not raw slugs.
- The live home page does not currently expose a newsletter CTA in the observed DOM snapshot.

Summary evidence:

- Pages and route variants visited: 63
- Same-origin links inspected: 940
- External/download-like links inspected: 16
- Missing expected routes: 9
- Broken same-origin link targets: 13
- JavaScript/page errors: 0 uncaught page errors, 13 console 404 errors
- Broken images: 1 unique R2 cover image
- Forms found: 3 newsletter forms
- Buttons found/tested: 3 Subscribe buttons

| Requirement | Expected | Actual | Status | Priority | Recommendation |
|---|---|---|---|---|---|
| Primary navigation | Top nav ordered Incidents, Essays, Books, Observations, Artifacts, About. | Navigation exists in correct order across tested desktop/mobile pages. | ✅ Completed | High | Keep as baseline and add active/current-page state if not already present. |
| Visit every accessible page | All same-origin linked pages should return valid content. | 63 pages/route variants crawled. Several linked targets returned 404. | ⚠ Partially Completed | High | Fix broken linked routes before adding more content. |
| Home page | Curated masthead, featured Incident, Essay, Books strip, Artifacts strip, Observations list, newsletter CTA. | Home includes masthead and key section content with newsletter. No images on home, no structured data. | ⚠ Partially Completed | High | Add richer featured cards, visual book/artifact strip assets, and WebSite/Organization JSON-LD. |
| Incidents index | Section title, description, cards, filtering by date/vendor/domain. | `/incidents/` exists with linked query filters. Query variants load but appear to keep the same index content and canonical. | ⚠ Partially Completed | High | Implement real filter/sort state and validate output changes per query. |
| Incident detail page | Forensic structure: summary, timeline, root cause, factors, evidence, related content, methodology snippet. | Two incident pages exist and include related/evidence signals plus Article JSON-LD. Newsletter is absent. | ⚠ Partially Completed | High | Add full forensic sections consistently, methodology disclaimer snippet, and footer CTA. |
| Essays index | Section title, description, filters by series and category, cards. | `/essays/` exists with series/category links. Series landing pages and patterns page 404. Query filters appear non-functional. | ⚠ Partially Completed | Critical | Build series/category landing pages and ensure filters actually constrain results. |
| Essay detail page | Article header, justified prose on desktop, related content, series prev/next, book/artifact links, newsletter CTA. | Two essay pages exist with related, prev/next text, JSON-LD, newsletter. Body text is left-aligned on desktop, not justified. Some prev/next/related targets are 404. | ⚠ Partially Completed | Critical | Fix typography, repair series navigation data, and ensure every generated related link resolves. |
| Pattern category | `/essays/patterns/` and pattern items using structured Pattern template. | `/essays/patterns/` returns 404. Linked pattern `/essays/detection-drop-line-600/` returns 404. | ❌ Missing | Critical | Implement pattern collection routing and the structured Pattern template. |
| Essay series pages | `/essays/{series}/` pages for all five series. | All five expected series routes return 404. | ❌ Missing | Critical | Generate series index pages for human-in-control, out-of-bounds, accountable-autonomy, six-dimensions, and the-burden. |
| Books index | Books section with covers, free PDF and Amazon paths. | `/books/` exists. One R2 cover image fails, one demo image loads. | ⚠ Partially Completed | High | Replace placeholders with real book metadata/assets and ensure all covers load. |
| Book detail | Cover, title, blurb, TOC, PDF download, Amazon hardcopy, related essay series. | `/books/human-in-control/` exists with cover/action links. PDF host fails. Amazon links use placeholder/example ASINs. `/books/out-of-bounds/` is linked but 404. | 🐞 Bug | Critical | Upload PDFs/covers to accessible storage, replace Amazon placeholders, and remove or create missing book routes. |
| Observations index | Section page with preliminary field notes. | `/observations/` exists and links to two observation details. | ✅ Completed | Medium | Add newsletter CTA and structured data for observation details. |
| Observation detail | Article layout with related content and publication metadata. | Two observation pages exist, related content detected. No JSON-LD. Newsletter absent. | ⚠ Partially Completed | Medium | Add BlogPosting/Article JSON-LD and footer CTA. |
| Artifacts index | Artifacts section with type/topic filtering and downloadable tools. | `/artifacts/` exists with type query links and three artifact detail pages. Query filters appear to keep the same content. | ⚠ Partially Completed | High | Implement real filtering by artifact type and topic. |
| Artifact detail | Header, type/version, use guidance, inline preview, multi-format downloads, related essays/books, license. | Three artifact detail pages exist with related text and download links. JSON-LD missing. Download files fail. One linked artifact is missing. | 🐞 Bug | Critical | Fix artifact file hosting, create missing artifact pages, add CreativeWork/HowTo JSON-LD, and verify license/version display. |
| Topic pages | Auto-generated `/topics/{tag}/`, including `/topics/red-teaming/`. | Several topic pages exist, but expected `/topics/red-teaming/` returns 404. | ⚠ Partially Completed | High | Generate all controlled-vocabulary topic pages, especially red-teaming. |
| Search | Pagefind search across all published content with accessible results. | Only home contains a search-like input; no site search UI/results found on sections/articles. | ❌ Missing | Critical | Add Pagefind index, search page/component, result labels, keyboard navigation, and empty/error states. |
| Related Articles | Related content derived from shared tags/series. | Related blocks detected on incident, essay, observation, and artifact details. Some related links return 404. | 🐞 Bug | High | Add build-time link validation for related slugs and fail builds on broken references. |
| Previous/Next navigation | Essays should have prev/next within series plus book/artifact links. | Prev/next text detected on essay pages. Linked next/artifact/book targets include 404s. | 🐞 Bug | Critical | Resolve series metadata and verify every prev/next/artifact/book slug at build time. |
| Newsletter | CTA on home, article footers, and relevant section pages; provider-backed form with success/error states. | Newsletter forms exist on home and two essays only. Input has no `name`; form action is current page GET; clicking Subscribe changes nothing. | 🐞 Bug | Critical | Integrate Buttondown/selected provider through one component with named email field, submit handling, success/error states, and placement on all required pages. |
| Buttons | Every button should perform a visible or semantic action. | Only three Subscribe buttons found. All were clickable but produced no URL/text/state change. | 🐞 Bug | High | Convert newsletter buttons to real submit controls and add automated interaction tests. |
| Download links | Book PDFs and artifact files should be downloadable from R2 or clean redirect paths. | All R2 file probes failed with timeout or ECONNRESET. Amazon placeholders/examples are present and sometimes 404. | 🐞 Bug | Critical | Verify R2 DNS/bucket/CORS/public access, upload files, and use real Amazon URLs. |
| Missing pages | All URLs in design-doc IA and all linked internal pages should exist. | 13 broken same-origin targets, including series pages, patterns, sitemap, feed, pattern item, artifact, essay, and book. | 🐞 Bug | Critical | Add static route generation and run a broken-link check in CI. |
| Missing images | Images should load with alt text and dimensions. | R2 cover image `human-in-control-cover.jpg` fails with natural size 0. Alt text is present. | 🐞 Bug | High | Fix file hosting or replace the image source; keep explicit dimensions and alt text. |
| JavaScript errors | No uncaught errors or console errors on valid pages. | No uncaught page errors. 13 console errors were 404 resource/page loads during expected and linked route checks. | ⚠ Partially Completed | Medium | Treat console 404s as release blockers through Playwright smoke tests. |
| SEO canonical | Every page should be self-canonical and never canonicalize off-site. | Pages canonicalize to `https://theforensicbrief.com/...` while crawled host is `pages.dev`. This is likely intended for production but not self-canonical on the tested deployment. 404 pages canonicalize to `/404/`. | ⚠ Partially Completed | High | Use production custom domain for final audit or make preview canonical behavior environment-aware. |
| SEO metadata | Meta description, OG/Twitter cards, generated OG images. | Descriptions and OG titles exist on HTML pages. `og:image` is empty everywhere. | ⚠ Partially Completed | High | Generate branded OG images per page and populate `og:image`/Twitter image. |
| Structured data | Article/Report/Book/CreativeWork/BreadcrumbList/Organization/WebSite schemas. | JSON-LD exists on incident, essay, and book pages only. Missing on home, section pages, observations, artifacts, topic pages, breadcrumbs. | ⚠ Partially Completed | High | Add schema coverage per page type and validate with rich-results tooling. |
| Sitemap and robots | `sitemap.xml`, `robots.txt`, RSS/Atom feeds. | `robots.txt` and `rss.xml` return 200. `sitemap.xml` returns 404. `feed.xml` returns 404. | 🐞 Bug | Critical | Generate `sitemap.xml`; either add `feed.xml` alias or remove links/references to it. |
| 404 recovery | 404 page should help users recover, preferably with search. | 404 page exists. Search-driven recovery is unavailable because search is missing. | ⚠ Partially Completed | Medium | Add search box and section links to 404 page. |
| Typography | Article body justified on desktop with hyphenation; left-aligned under 600px. | Desktop article/incident body computed as `left`; mobile body also left/start. `html lang="en"` exists. | ⚠ Partially Completed | Medium | Apply `.article-body p { text-align: justify; hyphens: auto; }` on desktop and mobile override below 600px. |
| Accessibility basics | Semantic landmarks, skip link, keyboard navigation, visible focus, 44px targets. | Skip link and `lang=en` detected. No axe scan performed. Search/filter/newsletter accessibility incomplete. | ⚠ Partially Completed | Medium | Add axe CI, keyboard tests for filters/search/newsletter, and visible focus audit. |
| Mobile responsiveness | Single-column mobile, no horizontal overflow. | Tested 390px viewport showed no horizontal overflow on core routes. Missing routes still render as 404. | ✅ Completed | Medium | Retest after missing pages and search UI are implemented. |
| Performance/Core Web Vitals | Static pages, minimal JS, optimized images/fonts, LCP/CLS/INP budgets. | No Lighthouse run was performed. Low JS footprint implied, but broken images/downloads and external Unsplash/R2 assets need validation. | ⚠ Partially Completed | Medium | Add Lighthouse CI with stated budgets and fix image delivery. |
| Security/privacy headers | HTTPS, HSTS, CSP, content-type, referrer policy, no secrets. | Not fully header-audited in this crawl. HTTPS works. | ⚠ Partially Completed | Medium | Add a header audit and configure Cloudflare security headers. |
| Content model completeness | Markdown collections for incidents, essays, observations, artifacts, books with validated cross-links. | Deployed content exists for several collections, but broken generated links indicate missing schema/cross-link validation. | ⚠ Partially Completed | Critical | Add Zod validation plus slug reference checks for related, prev/next, book, artifact, and downloads. |

Overall implementation percentage: **58%**

Rationale: the foundational IA, main sections, several detail templates, mobile baseline, RSS, robots, and partial structured content are present. Critical launch requirements remain incomplete or broken: search, newsletter integration, pattern/series pages, sitemap, downloads, file assets, several internal links, complete SEO/social metadata, and build-time validation.
