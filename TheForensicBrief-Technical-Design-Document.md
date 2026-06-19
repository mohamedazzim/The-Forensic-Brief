# The Forensic Brief — Website Technical Design Document

**Version 1.1 · 18 June 2026**
**Prepared for:** design and development team
**Owner:** Dr. Anandkumar Prakasam
**Domain:** theforensicbrief.com

> **Changes in v1.1:** Removed **Patterns** as a top-level tab. Patterns are now a **category within Essays** with a distinct structured template (§3.3, §4.4, §5.3). Added a new top-level **Artifacts** section (after Observations) for reusable AI-governance templates such as the Decision Envelope, the MRIS template, and the EU AI Act Risk Classification (§3, §4.7–4.8, §5.5). Navigation, URLs, content model, page types, phases, and appendices updated to match.

---

## 1. Purpose and scope

The Forensic Brief is currently a single-page prototype with a flat navigation (Incidents · Patterns · Red Teaming · Observations · About · Disclaimer). This document specifies a rebuild into a structured, multi-section publication that hosts these kinds of content under one editorial identity:

1. **Incidents** — evidence-based post-mortems of documented AI failures.
2. **Essays** — the author's long-form writing, organised into five named series, each tied to a book. **Patterns** are a *category* within Essays: short, structured failure-signature analyses that render with a distinct template (§4.4).
3. **Books** — free PDF downloads plus links to purchase the hardcopy on Amazon.
4. **Observations** — preliminary field notes ("lab notebook").
5. **Artifacts** — reusable, downloadable AI-governance templates and tools (Decision Envelope, MRIS template, EU AI Act Risk Classification, and others), each linked to the essay that explains it.

The site is the **canonical home** for all original writing. LinkedIn and Medium link back to it; SEO authority and the email list must accrue here. (This requirement comes from the publication's content-distribution strategy and drives several decisions below, especially canonical URLs and performance.)

### 1.1 Goals

- A clear information architecture that scales as content volume grows (30+ essays already drafted, plus a growing incident catalogue and a library of governance artifacts).
- A fast, secure, low-maintenance, low-cost platform — target hosting cost ≈ **$0/month**.
- A refined version of the current editorial/serif aesthetic — restrained, journal-like, credible.
- **Markdown-driven authoring**: the author writes `.md`/`.mdx` files; the site renders them. No database, no CMS admin to maintain.
- Publication-grade typography, including **justified body text** done correctly.
- Strong SEO and Core Web Vitals; proper canonical handling for syndication.
- An email-capture (newsletter) path on every relevant page.

### 1.2 Non-goals (at launch)

- No reader comments (deferred; see §9.4).
- No user accounts, paywalls, or e-commerce — books are free to download; hardcopy sales are handled entirely by Amazon; artifacts are free.
- No database-backed CMS. (Revisit only if non-technical editors are added later.)

---

## 2. Technology stack

| Layer | Choice | Why |
|---|---|---|
| **Framework / SSG** | **Astro** (static output) | Content-first, ships zero JS by default → excellent Core Web Vitals and SEO. Native Markdown/MDX **Content Collections** with type-safe front-matter — a perfect fit for Markdown authoring. React components can be embedded where interactivity is genuinely needed (island architecture). |
| **Hosting** | **Cloudflare Pages** | Free tier with unlimited bandwidth and no egress fees; git-push-to-deploy; preview deployments per branch; up to 20,000 files on free. |
| **Large file storage** | **Cloudflare R2** | Book PDFs and downloadable artifact files (PDF/DOCX/XLSX). 10 GB free, **zero egress**, then $0.015/GB/mo. Keeps the site repo lightweight. |
| **Search** | **Pagefind** | Static, build-time full-text search index; runs entirely client-side; no server or third-party dependency. |
| **Newsletter** | **Buttondown** (recommended) or ConvertKit | Embeddable form on a static site; Buttondown is low-cost/indie-friendly with a free tier; ConvertKit if richer automation is wanted later. (Final pick is the author's — see §9.3.) |
| **Analytics** | **Cloudflare Web Analytics** | Free, privacy-friendly, no cookie banner required. |
| **DNS / CDN** | **Cloudflare** | Same vendor as Pages/R2; the apex domain points here. |
| **Source control / CI** | **Git** (GitHub or GitLab) | Cloudflare Pages builds on every push; PR preview URLs for review. |

**Astro itself is free and open-source.** There is no paid framework tier. Cloudflare's free tier is permanent and production-grade; the only realistic future charge is R2 storage if book PDFs and artifact files collectively exceed 10 GB (cents per GB). See §12 for the cost model.

> **ASP.NET alternative (not recommended for this project):** the team could instead render Markdown via ASP.NET Core + Markdig on the author's existing hosting at zero marginal cost. It works, but for a static content publication it is heavier to build and maintain, needs a CDN bolted in front for comparable performance, and gains nothing the Astro path lacks. Documented here only for completeness; the chosen path is Astro.

---

## 3. Information architecture

### 3.1 Primary navigation (recommended)

A five-item content nav plus an About link. Order is deliberate:

```
Incidents   Essays   Books   Observations   Artifacts          About
```

**Rationale for the order:**

1. **Incidents** lead. They are the publication's differentiator, they match the masthead ("Post-Incident Analysis of AI Failure"), and case studies attract search traffic and citations.
2. **Essays** are the thought-leadership engine and the landing target for all LinkedIn/Medium traffic. This section also houses **Patterns** as a category with its own structured layout (§4.4), keeping all written analysis in one place.
3. **Books** are the credibility and conversion asset; readers who value the essays convert here.
4. **Observations** are preliminary field notes — valuable but the lightest content class.
5. **Artifacts** are the practitioner's toolbox — the reusable templates and tools the essays produce, gathered in one place for download and reuse. Placed last (per owner preference) as the "come back to it" resource.

**About** (with **Disclaimer** and **Methodology**) sits to the right / in the footer as utility navigation.

### 3.2 Answers to the IA questions

- **Separate Essays and Books tabs?** **Yes to both.** They are distinct reader intents (read vs. acquire) and distinct content models (Markdown article vs. PDF + purchase link).
- **Patterns as a top-level tab?** **No — removed.** Patterns become a **category within Essays** (front-matter `category: "pattern"`), rendered with a distinct structured template (§4.4). This keeps all writing under one section, removes a tab, and still preserves the patterns' specialised presentation. They are reachable via the Essays index filter and a category landing page at `/essays/patterns/`.
- **A new Artifacts tab?** **Yes — added after Observations.** Artifacts are reusable governance templates/tools (Decision Envelope, MRIS template, EU AI Act Risk Classification, oversight audits, assumption registers, friction-budget tables, etc.). Each artifact links back to the essay that explains it, and each essay links forward to its artifact.
- **Where does Red Teaming go?** It is **not** a tab. It is a cross-cutting **topic tag** with its own landing page (`/topics/red-teaming/`) and may also be the subject of a `pattern`-category essay. See §3.3.
- **What order is preferred?** Incidents → Essays → Books → Observations → Artifacts, as above.

### 3.3 Patterns and Red Teaming after the change

**Patterns** are short, structured analyses of recurring failure signatures (e.g., "security detection drops to zero past line 600"). They now live inside the Essays collection, distinguished by `category: "pattern"`, and:

- render with the **Pattern template** (§4.4), not the prose essay template;
- appear in the Essays index with a "Pattern" label and can be filtered to a category view at `/essays/patterns/`;
- carry pattern-specific front-matter (pattern ID, the measurable signature, related incidents) — see §5.3.

**Red Teaming** is handled as a **cross-cutting topic tag** (`red-teaming`) rather than any kind of section. Its auto-generated page at `/topics/red-teaming/` aggregates everything tagged across the site — narrative essays (the entire "Out of Bounds" series, the Whitebox essay), pattern-category essays, and incidents. The same mechanism serves other cross-cutting topics: `eu-ai-act`, `dpdp`, `human-oversight`, `provenance`, `agentic-ai` (§3.6).

### 3.4 Nav scalability note

Five content items plus About is comfortable. If the bar ever feels crowded as content grows, the lightest items (Observations) can later fold into a small "More ▾" menu; Incidents, Essays, Books, and Artifacts should remain primary. No grouping is needed at launch.

### 3.5 URL structure

Clean, stable, human-readable, lower-case, hyphenated. Stable slugs matter because these are the canonical URLs that LinkedIn/Medium link to — they must not change after publication.

| Content | URL pattern | Example |
|---|---|---|
| Home | `/` | |
| Incidents index | `/incidents/` | |
| Incident | `/incidents/{slug}/` | `/incidents/air-canada-chatbot-refund/` |
| Essays index | `/essays/` | |
| Essay series index | `/essays/{series}/` | `/essays/human-in-control/` |
| Patterns category index | `/essays/patterns/` | |
| Essay or pattern (item) | `/essays/{slug}/` | `/essays/hitl-is-not-oversight/`, `/essays/detection-drop-line-600/` |
| Books index | `/books/` | |
| Book | `/books/{slug}/` | `/books/human-in-control/` |
| Observations index | `/observations/` | |
| Observation | `/observations/{slug}/` | |
| **Artifacts index** | `/artifacts/` | |
| **Artifact** | `/artifacts/{slug}/` | `/artifacts/decision-envelope/`, `/artifacts/mris-template/`, `/artifacts/eu-ai-act-risk-classification/` |
| Topic (tag) page | `/topics/{tag}/` | `/topics/red-teaming/` |
| About / Methodology / Disclaimer | `/about/`, `/methodology/`, `/disclaimer/` | |

Notes: essays and pattern items share the `/essays/{slug}/` namespace (slugs are unique within the collection); the series and `/essays/patterns/` pages provide grouped browsing. Redirects from the old prototype's hash anchors (`/#patterns`, `/#observations`, `/#redteaming`) and any old `/patterns/*` paths must be configured (§11).

### 3.6 Taxonomy

Three classification systems:

1. **Series** (Essays only): Human-in-Control · Out of Bounds · Accountable Autonomy · The Six Dimensions · The Burden. Each maps 1:1 to a book.
2. **Category** (Essays only): `essay` (default, prose) | `pattern` (structured failure-signature template).
3. **Topics / tags** (cross-cutting, any content type): e.g. `red-teaming`, `eu-ai-act`, `dpdp`, `human-oversight`, `provenance`, `automation-bias`, `agentic-ai`, `audit-trail`. Each gets a landing page at `/topics/{tag}/`.

Artifacts additionally carry an **artifact type** (template · checklist · table · framework · worksheet · audit) used for grouping in the Artifacts index. Keep the tag vocabulary small (15–25 tags); the build should warn on tags outside the controlled list to prevent sprawl.

---

## 4. Page types and layouts

All pages share the editorial design system (§6).

### 4.1 Home

A curated entry point, not an auto-dump of latest posts.

- Masthead: "THE FORENSIC BRIEF" wordmark + tagline "Post-Incident Analysis of AI Failure".
- A featured **Incident** (large card).
- A featured **Essay** (current/most recent in the active series).
- A short **Books** strip (covers).
- A compact **Artifacts** strip (the newest/most useful templates) and a small **Observations** list.
- One newsletter call-to-action block.
- Restrained — generous whitespace, no carousel, no clutter.

### 4.2 Section index pages (Incidents, Essays, Books, Observations, Artifacts)

- Section title + one-line description.
- Filter/sort controls where useful: Incidents by date/vendor/domain; **Essays by series and by category (Essays / Patterns)**; Artifacts by type/topic.
- A consistent **card** component (title, dek, date, type/category label, "Read →" / "Open →").
- Pagination or load-more once a section exceeds ~20 items.

### 4.3 Article page (narrative Essays and Observations)

The core reading experience. Layout:

- Eyebrow (series/type label) · Title · Dek/subtitle · byline · date · reading time.
- **Article body** with justified typography (§6.3), constrained to an optimal measure (~66–72 characters per line).
- Footnotes/citations support.
- "Series navigation" for essays: previous / next in series, plus a link to the related book **and a link to the essay's Artifact** where one exists.
- **Related content** block (by shared tags/series).
- Newsletter CTA at the end.
- The page **is** canonical; no rel=canonical pointing elsewhere.

### 4.4 Pattern page (Essays with `category: "pattern"`)

A distinct, structured template — not flowing prose:

- Header: "PATTERN" eyebrow · pattern title · pattern ID · date.
- **The signature** — a concise statement of the recurring failure and its **measurable metric** (e.g., "0% detection past line 600").
- **Where it shows up** — systems/contexts.
- **Evidence** — the observations or incidents it was extracted from (links to related Incidents).
- **What to measure / how to test** — the practitioner takeaway.
- **Related** essays and the relevant **Artifact** (if the pattern has a companion template/checklist).
- Compact, scannable, evidence-forward — closer to a structured analysis card than an article.

### 4.5 Incident page (specialised)

Incidents use a forensic structure (evidence, timeline, root cause, contributory factors):

- Header: incident title · date · systems/vendors · domain · severity.
- **Summary** ("what happened").
- **Structured timeline** (rendered from front-matter — see §5.2).
- **Root cause** and **contributory factors**.
- **Evidence / sources** list (with links and corroboration note).
- Related patterns and essays.
- The methodology disclaimer snippet.

### 4.6 Book page (specialised)

- Cover image (prominent).
- Title · series association · blurb.
- **Table of contents.**
- Primary actions: **Download the PDF (free)** [served from R2] and **Buy the hardcopy on Amazon** [outbound link, `rel="sponsored noopener"`].
- Optional **"Look inside"**: inline PDF.js sample viewer or sample-PDF link.
- Link to the matching essay series.

### 4.7 Artifacts index

- Section title + one-line description ("Reusable templates and tools for AI governance — free to download and adapt.").
- Cards grouped or filterable by **artifact type** (Templates · Checklists · Tables · Frameworks · Worksheets · Audits) and by **topic** (EU AI Act · DPDP · Oversight · Provenance · …).
- Each card: title, one-line purpose, type label, available formats (PDF/DOCX/XLSX), "Open →".

### 4.8 Artifact detail page

- Header: artifact title · type · version · last-updated.
- **What it is** and **when/how to use it** (short explanatory prose).
- **Inline preview** where the artifact is tabular/checklist-style (rendered directly in MDX so it's readable without downloading).
- **Download buttons** for each available format (served from R2), each showing the file size.
- **Related essay(s)** that introduce/explain the artifact, and the related **book**.
- **License** (e.g., CC BY 4.0) to encourage reuse and citation.

### 4.9 Topic / tag pages

Auto-generated at `/topics/{tag}/`; list every item carrying that tag across all collections (incidents, essays incl. patterns, observations, artifacts), newest first, with type labels (e.g., the `red-teaming` page shows essays + patterns + any artifacts together).

### 4.10 Utility pages

About, Methodology, Disclaimer — static MDX pages. Methodology is split out from the current About text because it is substantive and citable.

---

## 5. Content model (Markdown front-matter schemas)

Implemented as Astro **Content Collections** with schema validation (Zod). The build fails on invalid/missing required fields — this protects content integrity without a database. Schemas below are the source of truth for the author's `.md`/`.mdx` files.

### 5.1 Shared fields (all content types)

```yaml
title: string                 # required
slug: string                  # required, stable, URL-safe
date: date                    # required (publication date)
updated: date                 # optional
summary: string               # required (dek / meta description, ~160 chars)
author: string                # default "Dr. Anandkumar Prakasam"
tags: string[]                # from controlled vocabulary
status: "draft" | "published" # default "draft"; drafts excluded from prod build
featured: boolean             # optional; surfaces on home
heroImage: string             # optional; path or R2 URL
ogImage: string               # optional; auto-generated if absent (§8.4)
```

### 5.2 Incident (extends shared)

```yaml
incidentDate: date            # when the failure occurred
systems: string[]             # vendors / products involved
domain: string                # e.g. "customer service", "lending"
severity: "low" | "moderate" | "high" | "critical"
corroboration: string         # the independent corroborating signal
sources:
  - label: string
    url: string
timeline:
  - date: date
    event: string
rootCause: string
contributoryFactors: string[]
relatedPatterns: string[]     # slugs (essays with category: pattern)
relatedEssays: string[]       # slugs
```

### 5.3 Essay (extends shared) — includes the Pattern category

A single `essays` collection with a `category` discriminator. Pattern-category items require the pattern fields and render with the Pattern template (§4.4).

```yaml
category: "essay" | "pattern"  # default "essay"
series: "human-in-control" | "out-of-bounds" | "accountable-autonomy"
      | "six-dimensions" | "the-burden"          # optional for patterns
seriesNo: number               # order within series (essays)
readingTime: number            # minutes (auto-computable)
book: string                   # slug of related book
artifact: string               # slug of the related Artifact, if any
prev: string                   # optional explicit slug (one-back)
next: string                   # optional explicit slug (one-forward)
linkedinUrl: string            # optional
mediumUrl: string              # optional (syndication copy)
patentSensitive: boolean       # editorial flag; aids review, no render effect

# --- required only when category: "pattern" ---
patternId: string              # e.g. "P-CONTEXT-DECAY"
signature: string              # the recurring failure, stated concisely
metric: string                 # the measurable signature
relatedIncidents: string[]     # slugs
```

### 5.4 Observation (extends shared)

```yaml
observationStatus: "preliminary" | "ongoing" | "resolved"
```

### 5.5 Artifact (extends shared)

```yaml
artifactType: "template" | "checklist" | "table" | "framework"
            | "worksheet" | "audit"
version: string                # templates are versioned, e.g. "1.0"
relatedEssays: string[]        # the essay(s) that explain it
relatedBook: string            # optional
inlinePreview: boolean         # render the artifact inline in MDX
license: string                # e.g. "CC BY 4.0"
downloads:                     # one or more formats
  - format: "PDF" | "DOCX" | "XLSX" | "Markdown"
    url: string                # R2 (or /public for small files)
    sizeKB: number
```

### 5.6 Book (extends shared)

```yaml
cover: string                 # cover image (R2 or local)
series: string                # related series slug
blurb: string
toc: string[]                 # chapter titles
pdfUrl: string                # R2 URL of the free PDF
pdfSizeMB: number             # shown next to the download button
amazonUrl: string             # hardcopy purchase link
isbn: string                  # optional
pages: number                 # optional
```

---

## 6. Design system

Direction: **keep the current editorial/serif aesthetic, refined.** The look should read like a serious independent journal — restrained, text-forward, credible — not like a tech startup blog.

### 6.1 Typography

- **Headings / wordmark:** a high-quality serif with editorial character (transitional/old-style serif similar to the current prototype). Self-host the webfont (woff2); no Google Fonts CDN call.
- **Body:** a readable serif at a comfortable size (≈ 19–20px base, line-height ≈ 1.6).
- **UI / metadata / labels:** a restrained sans-serif (eyebrows, dates, nav, captions) for contrast against the serif body.
- **Measure:** constrain article body to ~66–72 characters per line (≈ 38–42rem max-width).
- **Scale:** define a modular type scale (≈ 1.2–1.25 ratio) and document each step.

### 6.2 Colour and texture

- Near-black ink on warm off-white paper (not pure #000 on #fff).
- One restrained accent (the current muted brown/oxblood link colour works well) used sparingly for links and key actions.
- Hairline rules and generous whitespace as the primary structural devices.
- Light theme first; dark theme optional, later.

### 6.3 Justified body text (explicit requirement)

Body paragraphs in article/essay/incident pages are justified, done the right way:

```css
.article-body p {
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  text-wrap: pretty;          /* progressive enhancement */
}
.article-body { hanging-punctuation: first; } /* progressive enhancement */
```

Requirements and guard-rails:

- The root element **must** set `lang` (e.g., `<html lang="en">`) so the browser hyphenates correctly. Justification **without** hyphenation produces "rivers" of white space and is not acceptable.
- On narrow viewports (< ~600px), **fall back to left-aligned** body text:

```css
@media (max-width: 600px) {
  .article-body p { text-align: left; hyphens: manual; }
}
```

- Justification applies to flowing prose only — never to headings, lists, captions, code, tables, or the structured Pattern/Artifact templates.
- Per-section overrides (centred pull-quotes, right-aligned epigraphs) use inline HTML or MDX components with utility classes (`.text-center`, `.text-right`) — available to the author without leaving Markdown.

### 6.4 Components (design + build)

A small, consistent set: site header/nav, footer, content **card**, article header, **pattern block** (signature/metric/evidence), structured **timeline**, **citation/source list**, **series navigator** (prev/next + book + artifact link), **book actions** (download + Amazon), **artifact actions** (multi-format download + license), **inline artifact preview** (table/checklist), **newsletter CTA**, **tag chip**, **search box/results**, pagination. Document each with states (default/hover/focus) and responsive behaviour.

### 6.5 Responsive and accessibility

- Mobile-first; single-column reading on small screens.
- **WCAG 2.2 AA**: body-text contrast ≥ 4.5:1; visible focus states; semantic landmarks; alt text; keyboard-navigable nav, search, filters, and PDF viewer; respects `prefers-reduced-motion`.
- Hit targets ≥ 44px; skip-to-content link.

---

## 7. Functional requirements

1. **Markdown/MDX rendering** with the schemas in §5; drafts excluded from production builds.
2. **Search** (Pagefind): full-text across all published content (incidents, essays, patterns, observations, artifacts); results show type label and dek; keyboard accessible.
3. **Filtering / sorting** on index pages: Incidents (date/vendor/domain); **Essays (series + category Essays/Patterns)**; Artifacts (type/topic).
4. **Related content** derived from shared series/tags; essay ↔ artifact cross-links resolved from front-matter.
5. **Series navigation** for essays (prev/next + book + artifact links), driven by `series` + `seriesNo`.
6. **Topic pages** auto-generated for every tag in the controlled vocabulary.
7. **Artifacts**: multi-format downloads from R2 (PDF/DOCX/XLSX/Markdown); optional inline preview for tabular/checklist artifacts; version + license shown.
8. **PDF books**: free download from R2; optional inline PDF.js sample viewer; Amazon outbound button.
9. **Newsletter capture**: embedded form in the article footer CTA and on section/home pages; double opt-in; success/error states; no layout shift.
10. **RSS/Atom feeds**: a global feed and per-section/per-series feeds.
11. **Sitemap.xml** and **robots.txt**, auto-generated.
12. **404** and search-driven recovery.

---

## 8. SEO, performance, and social

### 8.1 Canonical strategy (critical)

Every page is self-canonical (`<link rel="canonical" href="self">`). The site is the canonical origin; syndicated copies on Medium/LinkedIn point *here*. **Never** emit a canonical tag pointing off-site. This is the technical backbone of the publication's distribution strategy — SEO equity must consolidate on theforensicbrief.com.

### 8.2 Performance budget (Core Web Vitals)

- LCP < 2.0s, CLS < 0.05, INP < 200ms on a mid-range mobile device over 4G.
- Zero render-blocking JS on article pages (Astro ships none by default; keep islands minimal).
- Self-hosted woff2 fonts with `font-display: swap`; preload the primary body font.
- Responsive images (Astro `<Image>`), lazy-loaded below the fold; explicit width/height to prevent CLS.

### 8.3 Structured data

- `Article`/`BlogPosting` JSON-LD on narrative essays/observations; an `Article` (or `Report`-style) schema on incidents and pattern items; `Book` JSON-LD on book pages; `HowTo`/`CreativeWork` as appropriate on artifacts; `BreadcrumbList` site-wide; `Organization`/`WebSite` with search action on home.

### 8.4 Social cards

- Auto-generated Open Graph / Twitter images per item at build (Astro OG-image generation), using the masthead, title, and series/type/category label — consistent branding across LinkedIn shares without manual design per post.

---

## 9. Specific decisions and integrations

### 9.1 Books and Artifacts / file pipeline

- Book PDFs and downloadable artifact files (PDF/DOCX/XLSX) stored in a Cloudflare R2 bucket; pages link to the R2 URL (or a Pages redirect for clean `/books/{slug}/download` and `/artifacts/{slug}/download` paths).
- Repo stays light: **binary files are not committed to git.**
- Track downloads via Cloudflare Web Analytics events on download links.

### 9.2 Amazon links

- Hardcopy purchase is fully external. If the author later joins Amazon Associates, append the affiliate tag and add the required affiliate disclosure to the Disclaimer page.

### 9.3 Newsletter provider

- **Recommended: Buttondown** — indie-friendly, free tier, clean embeddable form, Markdown-native; good for a single-author publication.
- **Alternative: ConvertKit/Kit** — if richer automations/sequences are wanted later.
- Implementation is provider-agnostic: a single newsletter component wraps the embed so the provider can be swapped without touching page templates.

### 9.4 Comments

- **Off at launch.** Some content is sensitive (e.g., essays touching self-harm boundaries); unmoderated comments are a liability. If added later, use **Giscus** (GitHub-discussions-backed, no database) with moderation, and a per-page front-matter flag to disable comments on sensitive essays.

### 9.5 Analytics

- Cloudflare Web Analytics (free, cookieless). No Google Analytics, no cookie-consent banner required.

---

## 10. Non-functional requirements

- **Security:** static site → minimal attack surface. Enforce HTTPS, HSTS, a strict Content-Security-Policy, `X-Content-Type-Options`, sensible `Referrer-Policy` via Cloudflare. No server-side secrets in the repo.
- **Privacy:** cookieless analytics; newsletter handled by the provider under its own consent; document data handling on the Disclaimer/Privacy page.
- **Accessibility:** WCAG 2.2 AA (§6.5), validated in CI (e.g., axe).
- **Maintainability:** all content in Markdown/MDX; design tokens centralised (CSS custom properties); component library documented.
- **Performance budgets** enforced in CI (Lighthouse CI thresholds).
- **Browser support:** current and previous major versions of evergreen browsers; graceful degradation of progressive-enhancement CSS.

---

## 11. Build, deploy, and authoring workflow

1. **Repo:** Git. Content in `/src/content/{incidents,essays,observations,artifacts,books}/*.md(x)`; assets in `/public` (small) or R2 (large/PDF/templates).
2. **Authoring:** the author writes Markdown locally (or in the Git web editor), sets front-matter per §5, opens a branch/PR. (Pattern items are essays with `category: pattern`; artifacts go in the artifacts collection.)
3. **Preview:** Cloudflare Pages builds a **preview URL** per PR for review (design + content).
4. **Publish:** merge to `main` → production build and deploy. `status: published` with a `date` ≤ today includes the item.
5. **Search index** (Pagefind) and feeds/sitemap regenerate on every build.
6. **CI checks:** schema validation, broken-link check, Lighthouse CI budgets, accessibility scan.

### 11.1 Migration from the current prototype

- Port existing content (the Air Canada **incident**; the "line 600" item as a **pattern-category essay**; About; Disclaimer) into the new collections.
- Move the About text into **About** + a separate **Methodology** page.
- Add **301 redirects** from old hash anchors (`/#incidents`, `/#patterns`, `/#redteaming`, `/#observations`) and any old `/patterns/*` paths to the new URLs (patterns → `/essays/{slug}/` or `/essays/patterns/`).
- Migrate the ~30 drafted essays into `/src/content/essays/` with series/category front-matter.
- Seed the **Artifacts** section from the reusable artifacts the essays already define (e.g., the oversight 3-question audit, friction-budget table, assumption register, MRIS template, Decision Envelope, EU AI Act Risk Classification, stop-readiness audit, demonstrability self-audit), each cross-linked to its essay.

---

## 12. Cost model

| Item | Cost |
|---|---|
| Astro (framework) | $0 (open-source) |
| Cloudflare Pages (hosting) | $0 (free tier; unlimited bandwidth) |
| Cloudflare R2 (PDFs + artifact files, ≤ 10 GB) | $0; then $0.015/GB/mo, zero egress |
| Cloudflare Web Analytics | $0 |
| Pagefind (search) | $0 |
| Newsletter (Buttondown) | $0 on free tier; paid only past the free subscriber cap |
| Domain | already owned (~$10/yr at renewal) |
| **Recurring total** | **≈ $0/month** |

Optional future spend: Cloudflare Pro (~$20/mo) for WAF/image optimisation/faster builds — not required; adopt only with a concrete reason.

---

## 13. Phased delivery

**Phase 1 — Foundation (MVP).** Astro scaffold; design system + typography (incl. justified body); header/nav/footer; home; **Incidents** and **Essays** collections (with the narrative *and* Pattern templates); content migration; Cloudflare Pages deploy; canonical/SEO basics; sitemap/RSS. *Outcome: the site is live with real content.*

**Phase 2 — Full IA.** **Books** (R2 + download + Amazon), **Observations**, **Artifacts** (collection, index, detail, multi-format downloads, inline previews), search (Pagefind), newsletter integration, related-content + series/artifact cross-links, topic tag pages, structured data, OG-image generation.

**Phase 3 — Polish.** Filtering/sorting UI, PDF inline sample viewer, performance/accessibility hardening in CI, optional dark theme, analytics dashboards/events.

---

## 14. Open items for sign-off

1. Confirm newsletter provider (Buttondown recommended).
2. Provide/approve final webfonts (heading serif, body serif, UI sans) and confirm self-hosting licences.
3. Approve the controlled tag vocabulary (15–25 tags) before content migration.
4. Confirm the five series → five books mapping and book metadata (covers, Amazon URLs, PDF files) as books become available.
5. **Confirm the initial Artifacts list and the download formats per artifact** (e.g., MRIS template as DOCX + PDF; EU AI Act Risk Classification as XLSX; Decision Envelope as PDF), and the reuse **license** (CC BY 4.0 suggested).

---

## Appendix A — Example front-matter

**Narrative essay:**
```yaml
---
title: "HITL Is Not Oversight If the Human Has No Work"
slug: "hitl-is-not-oversight"
date: 2026-06-23
summary: "Why 'human-in-the-loop' has become the most comforting lie in AI governance — and how to fix it."
category: "essay"
series: "human-in-control"
seriesNo: 1
readingTime: 8
book: "human-in-control"
artifact: "blind-acceptance-rate-audit"
tags: ["human-oversight", "eu-ai-act", "automation-bias"]
next: "blind-acceptance-rate"
status: published
featured: true
---
```

**Pattern-category essay:**
```yaml
---
title: "Security Detection Drops to Zero Past Line 600 in LLM Code Review"
slug: "detection-drop-line-600"
date: 2026-05-15
summary: "LLM code reviewers caught 78% of issues in the first 200 lines and 0% past line 600 — across five PRs."
category: "pattern"
patternId: "P-ATTENTION-DECAY"
signature: "Detection accuracy collapses with input position in long diffs."
metric: "0% issue detection past line 600 (vs 78% in first 200 lines)"
relatedIncidents: []
tags: ["red-teaming", "llm-security"]
status: published
---
```

## Appendix B — Example artifact front-matter

```yaml
---
title: "MRIS — Model Residual-Risk Information Sheet (Template)"
slug: "mris-template"
date: 2026-09-09
summary: "A bill-of-lading-style disclosure template for handing off an AI model's residual risks downstream."
artifactType: "template"
version: "1.0"
relatedEssays: ["mris-the-missing-disclosure"]
relatedBook: "out-of-bounds"
inlinePreview: true
license: "CC BY 4.0"
tags: ["mris", "provenance", "ai-governance"]
downloads:
  - format: "DOCX"
    url: "https://files.theforensicbrief.com/artifacts/mris-template-v1.docx"
    sizeKB: 86
  - format: "PDF"
    url: "https://files.theforensicbrief.com/artifacts/mris-template-v1.pdf"
    sizeKB: 120
status: published
featured: true
---
```

## Appendix C — Example folder structure

```
/
├─ src/
│  ├─ content/
│  │  ├─ incidents/      *.mdx
│  │  ├─ essays/         *.mdx   (category: essay | pattern)
│  │  ├─ observations/   *.mdx
│  │  ├─ artifacts/      *.mdx
│  │  └─ books/          *.mdx
│  ├─ components/        (cards, pattern-block, timeline, series-nav,
│  │                      artifact-actions, newsletter, etc.)
│  ├─ layouts/           (Base, Article, Pattern, Incident, Book, Artifact)
│  ├─ pages/             (index, section indexes, [slug], essays/patterns,
│  │                      artifacts/[slug], topics/[tag])
│  └─ styles/            (tokens.css, typography.css)
├─ public/               (favicons, small images, fonts)
└─ astro.config.mjs
```

## Appendix D — Navigation map

```
The Forensic Brief (/)
├─ Incidents (/incidents/)
│   └─ {incident} (/incidents/{slug}/)
├─ Essays (/essays/)
│   ├─ Human-in-Control (/essays/human-in-control/)
│   ├─ Out of Bounds (/essays/out-of-bounds/)
│   ├─ Accountable Autonomy (/essays/accountable-autonomy/)
│   ├─ The Six Dimensions (/essays/six-dimensions/)
│   ├─ The Burden (/essays/the-burden/)
│   ├─ Patterns (category) (/essays/patterns/)
│   └─ {essay | pattern} (/essays/{slug}/)
├─ Books (/books/)
│   └─ {book} (/books/{slug}/)
├─ Observations (/observations/)
│   └─ {observation} (/observations/{slug}/)
├─ Artifacts (/artifacts/)
│   └─ {artifact} (/artifacts/{slug}/)     ← Decision Envelope, MRIS template,
│                                             EU AI Act Risk Classification, …
├─ Topics (/topics/{tag}/)                 ← cross-cutting tags (incl. red-teaming)
└─ About (/about/) · Methodology (/methodology/) · Disclaimer (/disclaimer/)
```
