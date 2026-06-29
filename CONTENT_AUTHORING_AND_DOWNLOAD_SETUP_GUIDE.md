# The Forensic Brief Content Authoring and Download Setup Guide

This guide documents the **current repo architecture** for adding and publishing content in **The Forensic Brief**.

It covers:

- metadata/content separation for Incidents and Artifacts
- source-safe publishing rules
- how clean public routes are generated
- how to add new Incidents, Artifacts, Essays, Observations, and Books
- how Cloudflare R2 downloads must be configured
- how current index-page sorting and filter behavior works
- how to validate before publishing

This guide is written against the current implementation in:

- [src/content/config.ts](C:/Azi/Blog_Proj/src/content/config.ts)
- [src/utils/contentEntries.ts](C:/Azi/Blog_Proj/src/utils/contentEntries.ts)
- [src/pages/incidents/index.astro](C:/Azi/Blog_Proj/src/pages/incidents/index.astro)
- [src/pages/incidents/[slug].astro](C:/Azi/Blog_Proj/src/pages/incidents/[slug].astro)
- [src/pages/artifacts/index.astro](C:/Azi/Blog_Proj/src/pages/artifacts/index.astro)
- [src/pages/artifacts/[slug].astro](C:/Azi/Blog_Proj/src/pages/artifacts/[slug].astro)
- [src/pages/books/[slug].astro](C:/Azi/Blog_Proj/src/pages/books/[slug].astro)
- [src/pages/essays/index.astro](C:/Azi/Blog_Proj/src/pages/essays/index.astro)
- [scripts/validate-content-links.mjs](C:/Azi/Blog_Proj/scripts/validate-content-links.mjs)
- [scripts/smoke-check.mjs](C:/Azi/Blog_Proj/scripts/smoke-check.mjs)

## 1. Current Content Architecture

The site has five content collections:

- `incidents`
- `essays`
- `observations`
- `artifacts`
- `books`

The architecture is **not the same for every collection**.

### Essays, Observations, and Books

These remain single-file content entries:

- `src/content/essays/<slug>.mdx`
- `src/content/observations/<slug>.mdx`
- `src/content/books/<slug>.mdx`

The same file contains:

- frontmatter metadata
- body content

### Incidents

Incidents now use **metadata/content separation**:

- `src/content/incidents/<slug>-metadata.md`
- `src/content/incidents/<slug>-content.mdx`

Example:

- [src/content/incidents/samsung-chatgpt-one-way-door-metadata.md](C:/Azi/Blog_Proj/src/content/incidents/samsung-chatgpt-one-way-door-metadata.md)
- [src/content/incidents/samsung-chatgpt-one-way-door-content.mdx](C:/Azi/Blog_Proj/src/content/incidents/samsung-chatgpt-one-way-door-content.mdx)

### Artifacts

Artifacts also use **metadata/content separation**:

- `src/content/artifacts/<slug>-metadata.md`
- `src/content/artifacts/<slug>-content.mdx`

Example:

- [src/content/artifacts/mris-template-metadata.md](C:/Azi/Blog_Proj/src/content/artifacts/mris-template-metadata.md)
- [src/content/artifacts/mris-template-content.mdx](C:/Azi/Blog_Proj/src/content/artifacts/mris-template-content.mdx)

## 2. What Metadata Files Control

For separated collections, the `*-metadata.md` file controls:

- title
- slug
- status
- date
- `dateLabel` if used
- `updated`
- summary
- author
- tags
- featured state
- filters/sorting metadata
- related content metadata
- downloads for Artifacts
- the `contentFile` reference

Metadata files drive:

- index cards
- collection listings
- RSS/feed inclusion
- topic-page inclusion
- sitemap inclusion
- search inclusion
- clean route generation

## 3. What Content Files Control

For separated collections, the `*-content.mdx` file controls:

- long-form article body
- full readable detail-page content
- structured MDX body sections
- inline artifact preview/body content

Content files do **not** control whether a card appears in a listing.  
That is controlled by the metadata file and its `status`.

## 4. Clean Public Routes

Public routes must always use the **clean slug only**.

### Valid public routes

- `/incidents/<slug>/`
- `/artifacts/<slug>/`
- `/essays/<slug>/`
- `/observations/<slug>/`
- `/books/<slug>/`

### These routes must never be generated

- `/incidents/<slug>-metadata/`
- `/incidents/<slug>-content/`
- `/artifacts/<slug>-metadata/`
- `/artifacts/<slug>-content/`

The route helper in [src/utils/contentEntries.ts](C:/Azi/Blog_Proj/src/utils/contentEntries.ts) strips `-metadata` and `-content` from clean slugs.

## 5. How Index and Detail Pages Work

### Incidents

- index page reads only metadata entries from [src/content/incidents](C:/Azi/Blog_Proj/src/content/incidents)
- detail page loads the metadata entry plus its paired `contentFile`

Current implementation:

- [src/pages/incidents/index.astro](C:/Azi/Blog_Proj/src/pages/incidents/index.astro)
- [src/pages/incidents/[slug].astro](C:/Azi/Blog_Proj/src/pages/incidents/[slug].astro)

### Artifacts

- index page reads only metadata entries from [src/content/artifacts](C:/Azi/Blog_Proj/src/content/artifacts)
- detail page loads the metadata entry plus its paired `contentFile`

Current implementation:

- [src/pages/artifacts/index.astro](C:/Azi/Blog_Proj/src/pages/artifacts/index.astro)
- [src/pages/artifacts/[slug].astro](C:/Azi/Blog_Proj/src/pages/artifacts/[slug].astro)

### Draft behavior

Draft items must not appear in:

- index pages
- sitemap
- RSS/feed output
- topic pages
- search output

## 6. Source-Backed Publishing Rules

Only publish what is source-backed.

Allowed sources:

- TDD-backed information
- approved sample material
- mentor-approved values
- verified R2 URLs

Do not:

- invent metadata
- infer severity, domain, version, or date
- guess source URLs
- use generated placeholder prose
- publish uncertain metadata

If required metadata is missing:

- keep the item as `draft`

If the body content is missing:

- keep the item as `draft`
- or only render a safe metadata shell if the architecture explicitly supports it

Never publish guessed values just to satisfy schema requirements.

## 7. Shared Frontmatter Basics

Shared fields in [src/content/config.ts](C:/Azi/Blog_Proj/src/content/config.ts) include:

```yaml
title: string
date: date
dateLabel: string (optional)
updated: date (optional)
summary: string
author: string
tags: string[]
status: published | draft
featured: boolean
heroImage: string (optional)
ogImage: string (optional)
```

Published items require more fields than drafts.  
If the entry is incomplete, keep it as `draft`.

## 8. How to Add a New Incident

### Step 1: Create the metadata file

Create:

- `src/content/incidents/<slug>-metadata.md`

### Step 2: Create the content file

Create:

- `src/content/incidents/<slug>-content.mdx`

### Step 3: Add metadata frontmatter

Use this pattern:

```yaml
---
title: "Approved incident title"
slug: "approved-incident-slug"
status: "draft"
date: 2026-06-01
dateLabel: "Source-backed human-readable date"
summary: "Exact approved card summary or excerpt"
author: "Dr. Anandkumar Prakasam"
tags: []
featured: false
contentFile: "approved-incident-slug-content.mdx"
systems: []
---
```

### Step 4: Add optional fields only when source-backed

Examples:

```yaml
severity: "high"
domain: "semiconductor engineering"
incidentDate: 2023-04-01
incidentDateLabel: "April 2023"
sources:
  - label: "Source label"
    url: "https://..."
timeline:
  - date: 2023-04-01
    event: "Exact/source-backed event"
rootCause: "Exact/source-backed root cause"
contributoryFactors:
  - "Exact/source-backed factor"
relatedPatterns: []
relatedEssays: []
corroboration: "Exact/source-backed corroboration"
```

### Step 5: Add the long-form body

Write the readable detail-page body in:

- `src/content/incidents/<slug>-content.mdx`

### Step 6: Keep it draft until fully source-backed

Important:

- keep `status: draft` until all required published metadata is source-backed
- do not publish guessed severity/domain/date/source URLs
- use `dateLabel` or `incidentDateLabel` only when that text is source-backed

## 9. How to Add a New Artifact

### Step 1: Create the metadata file

Create:

- `src/content/artifacts/<slug>-metadata.md`

### Step 2: Create the content file

Create:

- `src/content/artifacts/<slug>-content.mdx`

### Step 3: Add metadata frontmatter

Use this pattern:

```yaml
---
title: "Approved artifact title"
slug: "approved-artifact-slug"
status: "draft"
date: 2026-06-01
summary: "Approved source-backed summary"
author: "Dr. Anandkumar Prakasam"
tags: []
featured: false
artifactType: "template"
license: "CC BY 4.0"
relatedEssays: []
relatedBook: ""
inlinePreview: true
contentFile: "approved-artifact-slug-content.mdx"
downloads: []
---
```

### Step 4: Add optional fields only when source-backed

Example:

```yaml
version: "1.0"
```

### Step 5: Add downloads only when R2-backed and verified

Example:

```yaml
downloads:
  - format: "PDF"
    url: "https://files.theforensicbrief.com/artifacts/example-v1.pdf"
    sizeKB: 120
```

### Step 6: Write the body content

Place the full readable body in:

- `src/content/artifacts/<slug>-content.mdx`

### Step 7: Follow the production download rules

- never use `/public/artifacts/...` for production downloads
- never use `r2_uploads/...` in published metadata
- only use `https://files.theforensicbrief.com/...` after the file returns `200 OK`
- draft artifacts may keep empty `downloads: []`

## 10. How to Add a New Essay

Essays remain single-file entries:

- `src/content/essays/<slug>.mdx`

Current essay behavior:

- `/essays/` has **no category filter**
- `/essays/` uses a **Series dropdown**
- `/essays/patterns/` remains a separate route

### Standard essay example

```yaml
---
title: "Approved essay title"
date: 2026-06-01
summary: "Approved source-backed summary"
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
category: "essay"
series: "out-of-bounds"
seriesNo: 1
---
```

### Pattern essay example

```yaml
---
title: "Approved pattern title"
date: 2026-06-01
summary: "Approved source-backed pattern summary"
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
category: "pattern"
patternId: "P-EXAMPLE"
signature: "Exact/source-backed signature"
metric: "Exact/source-backed metric"
relatedIncidents: []
---
```

## 11. How to Add a New Observation

Observations remain single-file entries:

- `src/content/observations/<slug>.mdx`

Example:

```yaml
---
title: "Approved observation title"
date: 2026-06-01
summary: "Approved source-backed summary"
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
observationStatus: preliminary
---
```

## 12. How to Add a New Book

Books remain single-file entries:

- `src/content/books/<slug>.mdx`

Important current book behavior:

- book pages **do not render Table of Contents**
- book pages render **Description** only when source-backed `description` or `blurb` exists
- if `description` and `blurb` are missing, the section is skipped
- PDF, sample, and Amazon actions remain unavailable until verified inputs exist

Example:

```yaml
---
title: "Approved book title"
date: 2026-06-01
summary: "Approved source-backed summary"
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
cover: "https://files.theforensicbrief.com/books/example-front-cover.jpg"
backCover: "https://files.theforensicbrief.com/books/example-back-cover.jpg"
series: "human-in-control"
blurb: "Approved source-backed blurb"
description: "Approved source-backed description"
pdfUrl: "https://files.theforensicbrief.com/books/example.pdf"
pdfSizeMB: 0
amazonUrl: ""
---
```

Do not:

- invent book description text
- invent blurb text
- invent Amazon URLs
- invent ISBNs
- invent page counts
- invent book PDFs

## 13. R2 Download Setup

Published downloadable assets must be R2-backed.

Current public domain:

- `https://files.theforensicbrief.com`

### Correct process

1. Generate or receive the approved asset.
2. Upload it to Cloudflare R2.
3. Verify the public URL:

```powershell
curl.exe -I https://files.theforensicbrief.com/artifacts/<file-name>
```

4. Only after `200 OK`, add that URL to metadata.
5. Run validation/build/tests.

### Production metadata must never use

- `/public/artifacts/...`
- `r2_uploads/...`
- `localhost`
- `file://`
- `C:\`

### Artifact download example

```yaml
downloads:
  - format: "PDF"
    url: "https://files.theforensicbrief.com/artifacts/example-v1.pdf"
    sizeKB: 120
```

### Book asset examples

```yaml
cover: "https://files.theforensicbrief.com/books/example-front-cover.jpg"
backCover: "https://files.theforensicbrief.com/books/example-back-cover.jpg"
pdfUrl: "https://files.theforensicbrief.com/books/example.pdf"
```

## 14. How Uploaded Files Link to Pages

Uploaded files are not discovered automatically.  
They are linked through metadata fields.

For example:

- Artifact download buttons come from `downloads[]` in the artifact metadata file
- Book cover images come from `cover` and `backCover`
- Book PDF actions come from `pdfUrl`

If the URL is wrong or unreachable, the live page will show an unavailable state or no active link.

## 15. Current Index Sorting and Filter Behavior

Current UI and sorting rules:

- Incidents page has **no filters**
- Artifacts page has **no filters**
- Essays page has **no category filter**
- Essays page uses a **Series dropdown**
- `/essays/patterns/` still exists
- index pages sort **newest first**

Current shared sort helper:

- [src/utils/contentEntries.ts](C:/Azi/Blog_Proj/src/utils/contentEntries.ts)

Sort priority:

1. `date`, newest first
2. fallback to `updated`, newest first
3. stable title sort if no valid date exists

This rule is used for:

- `/incidents/`
- `/artifacts/`
- `/essays/`
- `/observations/`
- `/books/`
- `/topics/[tag]/`
- home page recent/featured sections
- date-sorted feeds

Series pages still use `seriesNo` because that ordering is sequence-based, not recency-based.

## 16. Validation Commands

Run all required checks before publishing:

```powershell
npm run build
npm run validate:content
npm run test:e2e
```

Also use these verification commands:

```powershell
Select-String -Path .\dist\**\*.html -Pattern "-metadata","-content","r2_uploads","public/artifacts","Ã¢â‚¬â€" -SimpleMatch
```

Expected:

- no public `-metadata` routes
- no public `-content` routes
- no `r2_uploads`
- no `public/artifacts` production downloads
- no encoding issue `Ã¢â‚¬â€`

## 17. Validation Rules Already Enforced in Repo

Current validation scripts check for:

- no public metadata/content routes
- no `r2_uploads` leakage
- no local `/public/artifacts` production download links
- no placeholder book prose
- no removed Table of Contents on book pages
- no old essays category filter
- no incident/artifact filter rows on index pages
- active R2 artifact downloads for currently published artifact pages

See:

- [scripts/validate-content-links.mjs](C:/Azi/Blog_Proj/scripts/validate-content-links.mjs)
- [scripts/smoke-check.mjs](C:/Azi/Blog_Proj/scripts/smoke-check.mjs)

## 18. Practical Publishing Workflow

Use this sequence for new work:

1. Gather source-backed material.
2. Choose the correct collection.
3. Create metadata/content split files for Incidents or Artifacts.
4. Create single-file entries for Essays, Observations, or Books.
5. Keep the item `draft` until all required published fields are source-backed.
6. Upload approved public assets to R2 if needed.
7. Verify R2 URLs with `curl.exe -I`.
8. Run:

```powershell
npm run build
npm run validate:content
npm run test:e2e
```

9. Check:

```powershell
git status --short
```

10. Commit only intended files.

## 19. Common Failure Cases

### Problem: metadata route appears publicly

Cause:

- incorrect route logic or content file naming

Check:

- clean slug generation in [src/utils/contentEntries.ts](C:/Azi/Blog_Proj/src/utils/contentEntries.ts)
- validation output from [scripts/validate-content-links.mjs](C:/Azi/Blog_Proj/scripts/validate-content-links.mjs)

### Problem: detail page shows no long-form body

Cause:

- `contentFile` is missing
- `contentFile` name does not match the real file
- content body file does not exist

### Problem: artifact download does not appear

Cause:

- download URL is not R2-backed
- file is not public
- file does not return `200 OK`
- metadata was updated before the asset was reachable

### Problem: book description does not render

Cause:

- `description` is missing
- `blurb` is missing
- values were intentionally left empty because no source-backed copy exists

### Problem: draft item does not show in search or sitemap

Cause:

- this is correct behavior

## 20. Current Examples to Reuse Carefully

Incident metadata/content pair:

- [src/content/incidents/samsung-chatgpt-one-way-door-metadata.md](C:/Azi/Blog_Proj/src/content/incidents/samsung-chatgpt-one-way-door-metadata.md)
- [src/content/incidents/samsung-chatgpt-one-way-door-content.mdx](C:/Azi/Blog_Proj/src/content/incidents/samsung-chatgpt-one-way-door-content.mdx)

Artifact metadata/content pair:

- [src/content/artifacts/mris-template-metadata.md](C:/Azi/Blog_Proj/src/content/artifacts/mris-template-metadata.md)
- [src/content/artifacts/mris-template-content.mdx](C:/Azi/Blog_Proj/src/content/artifacts/mris-template-content.mdx)

Essay example:

- [src/content/essays/whitebox-red-teaming.mdx](C:/Azi/Blog_Proj/src/content/essays/whitebox-red-teaming.mdx)

Pattern example:

- [src/content/essays/detection-drop-line-600.mdx](C:/Azi/Blog_Proj/src/content/essays/detection-drop-line-600.mdx)

Observation example:

- [src/content/observations/the-attack-that-left-no-fingerprints.mdx](C:/Azi/Blog_Proj/src/content/observations/the-attack-that-left-no-fingerprints.mdx)

Book example:

- [src/content/books/human-in-control.mdx](C:/Azi/Blog_Proj/src/content/books/human-in-control.mdx)

## 21. Final Rule

If you remember only one operational rule, use this:

- metadata controls whether an Incident or Artifact is published, listed, searchable, and routable
- content files control the long-form body for Incidents and Artifacts
- public pages must use clean slugs only
- downloadable files must be verified R2 URLs
- missing or uncertain metadata means the item stays `draft`
