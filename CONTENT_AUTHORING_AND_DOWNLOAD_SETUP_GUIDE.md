# The Forensic Brief Content Authoring and Download Setup Guide

This document explains, end to end, how to create and publish content for **The Forensic Brief** static Astro site.

It covers:

- how each content type works
- where each file goes
- how to write frontmatter
- how to keep content source-backed
- how artifacts and books use Cloudflare R2 downloads
- how to validate before publishing
- how to troubleshoot common failures

This guide is written against the **current repo implementation** in:

- [package.json](C:\Azi\Blog_Proj\package.json)
- [src/content/config.ts](C:\Azi\Blog_Proj\src\content\config.ts)

## 1. Site Architecture Overview

The site is built with **Astro** and stores content as Markdown or MDX files under [src/content](C:\Azi\Blog_Proj\src\content).

Current content collections:

- `incidents`
- `essays`
- `observations`
- `artifacts`
- `books`

Each content file:

1. lives in the correct collection folder
2. contains frontmatter at the top
3. contains body content below frontmatter
4. is validated by the schema in [src/content/config.ts](C:\Azi\Blog_Proj\src\content\config.ts)
5. is published only if `status: published`

## 2. High-Level Publishing Workflow

Use this workflow for any new content item.

### Step 1: Prepare the source material

Before writing anything into the repo, gather the real source material:

- manuscript or article text
- dates
- title
- summary/dek
- tags
- related content links
- download files if applicable
- book cover files if applicable

Do not invent:

- incident facts
- book blurbs
- Amazon URLs
- ISBNs
- download files
- file sizes
- publication dates

If information is missing:

- keep the content as `draft`
- or leave optional fields blank
- or hide unavailable actions honestly

### Step 2: Choose the right content type

Pick one of:

- Incident
- Essay
- Pattern essay
- Observation
- Artifact
- Book

### Step 3: Create the content file

Create the file in the correct folder:

- Incidents: [src/content/incidents](C:\Azi\Blog_Proj\src\content\incidents)
- Essays: [src/content/essays](C:\Azi\Blog_Proj\src\content\essays)
- Observations: [src/content/observations](C:\Azi\Blog_Proj\src\content\observations)
- Artifacts: [src/content/artifacts](C:\Azi\Blog_Proj\src\content\artifacts)
- Books: [src/content/books](C:\Azi\Blog_Proj\src\content\books)

Use lowercase, hyphenated file names:

- `samsung-chatgpt-one-way-door.mdx`
- `whitebox-red-teaming.mdx`
- `mris-template.mdx`

### Step 4: Add frontmatter

Frontmatter is the metadata block at the top of the file between `---` lines.

Example:

```md
---
title: "Example Title"
date: 2026-06-01
summary: "Example summary."
status: draft
---
```

### Step 5: Add body content

Write the actual content below the frontmatter.

Use Markdown or MDX.

### Step 6: Upload download assets if needed

Only artifacts and books usually need R2 asset uploads.

### Step 7: Validate locally

Run:

```powershell
npm run build
npm run validate:content
npm run test:e2e
```

### Step 8: Commit and push

If all checks pass:

```powershell
git add src/content ...
git commit -m "Add new content"
git push origin master
```

Cloudflare Pages will then rebuild the site.

## 3. Repo Paths You Need to Know

### Content source folders

- [src/content/incidents](C:\Azi\Blog_Proj\src\content\incidents)
- [src/content/essays](C:\Azi\Blog_Proj\src\content\essays)
- [src/content/observations](C:\Azi\Blog_Proj\src\content\observations)
- [src/content/artifacts](C:\Azi\Blog_Proj\src\content\artifacts)
- [src/content/books](C:\Azi\Blog_Proj\src\content\books)

### Validation and build scripts

- [package.json](C:\Azi\Blog_Proj\package.json)
- [scripts/validate-content-links.mjs](C:\Azi\Blog_Proj\scripts\validate-content-links.mjs)
- [scripts/smoke-check.mjs](C:\Azi\Blog_Proj\scripts\smoke-check.mjs)

### Schema definition

- [src/content/config.ts](C:\Azi\Blog_Proj\src\content\config.ts)

### Download URL config reference

- [src/config/downloads.ts](C:\Azi\Blog_Proj\src\config\downloads.ts)

## 4. Shared Frontmatter Rules

All content types are based on shared fields defined in [src/content/config.ts](C:\Azi\Blog_Proj\src\content\config.ts).

### Shared fields for published items

```yaml
title: string
date: date
dateLabel: string (optional)
updated: date (optional)
summary: string
author: string
tags: string[]
status: published
featured: boolean
heroImage: string (optional)
ogImage: string (optional)
```

### Shared fields for draft items

Draft entries allow more missing fields.

Important rule:

- if the content is incomplete, use `status: draft`
- if the content is complete and should go live, use `status: published`

## 5. INCIDENT Content Guide

### Purpose

Use an **incident** for a documented AI failure case.

### Folder

- [src/content/incidents](C:\Azi\Blog_Proj\src\content\incidents)

### URL pattern

File:

- `src/content/incidents/some-incident.mdx`

Route:

- `/incidents/some-incident/`

### Published incident schema

Required fields:

```yaml
title
date
summary
status: published
incidentDate
systems
domain
severity
corroboration
sources
timeline
rootCause
contributoryFactors
```

### Incident template

```md
---
title: "Incident Title"
date: 2026-06-25
dateLabel: "25 June 2026"
summary: "Short factual description of what happened."
author: "Dr. Anandkumar Prakasam"
tags: ["provenance"]
status: published
featured: true

incidentDate: 2023-04-01
incidentDateLabel: "April 2023"
systems: ["Vendor", "Product"]
domain: "customer service"
severity: "high"
corroboration: "A short corroborating signal."

sources:
  - label: "Primary source"
    url: "https://example.com"

timeline:
  - date: 2023-04-01
    label: "April 2023"
    event: "The triggering event."
  - date: 2023-04-05
    label: "Five days later"
    event: "The next important event."

rootCause: "One sentence root cause."
contributoryFactors:
  - "Factor one"
  - "Factor two"

relatedPatterns: []
relatedEssays: []
---

## Summary

Write the incident narrative here.

## Evidence

Document the supporting evidence here.

## Analysis

Explain the failure and governance implications here.
```

### Notes

- `severity` must be one of:
  - `low`
  - `moderate`
  - `high`
  - `critical`
- `systems` is an array
- `sources` must be structured
- `timeline` must be structured

### Current example

- [src/content/incidents/samsung-chatgpt-one-way-door.mdx](C:\Azi\Blog_Proj\src\content\incidents\samsung-chatgpt-one-way-door.mdx)

## 6. ESSAY Content Guide

### Purpose

Use an **essay** for long-form analysis.

There are two essay modes:

- standard essay
- pattern essay

### Folder

- [src/content/essays](C:\Azi\Blog_Proj\src\content\essays)

### URL pattern

File:

- `src/content/essays/example-essay.mdx`

Route:

- `/essays/example-essay/`

### Series values

Allowed `series` values:

- `human-in-control`
- `out-of-bounds`
- `accountable-autonomy`
- `six-dimensions`
- `the-burden`

### Standard essay template

```md
---
title: "Essay Title"
date: 2026-06-01
dateLabel: "June 2026"
summary: "Short essay summary."
author: "Dr. Anandkumar Prakasam"
tags: ["red-teaming"]
status: published
featured: true

category: "essay"
series: "out-of-bounds"
seriesNo: 1
readingTime: 8
book: "human-in-control"
artifact: "decision-envelope"
prev: "previous-slug"
next: "next-slug"
linkedinUrl: "https://www.linkedin.com/..."
mediumUrl: "https://medium.com/..."
patentSensitive: false
---

Essay body here.
```

### Pattern essay template

Use this when `category: "pattern"`.

Required extra fields for published patterns:

- `patternId`
- `signature`
- `metric`

Template:

```md
---
title: "Pattern Title"
date: 2026-05-15
summary: "Short structured pattern summary."
author: "Dr. Anandkumar Prakasam"
tags: ["llm-security"]
status: published
featured: false

category: "pattern"
patternId: "P-ATTENTION-DECAY"
signature: "The recurring failure."
metric: "Measured signature."
relatedIncidents: ["incident-slug"]
---

## Where It Appears

...

## Evidence

...

## What To Measure

...
```

### Current examples

- Standard essay:
  - [src/content/essays/whitebox-red-teaming.mdx](C:\Azi\Blog_Proj\src\content\essays\whitebox-red-teaming.mdx)
- Pattern essay:
  - [src/content/essays/detection-drop-line-600.mdx](C:\Azi\Blog_Proj\src\content\essays\detection-drop-line-600.mdx)

## 7. OBSERVATION Content Guide

### Purpose

Use an **observation** for shorter field-note-style material.

### Folder

- [src/content/observations](C:\Azi\Blog_Proj\src\content\observations)

### URL pattern

- `/observations/{slug}/`

### Required published field

- `observationStatus`

Allowed values:

- `preliminary`
- `ongoing`
- `resolved`

### Observation template

```md
---
title: "Observation Title"
date: 2026-06-01
dateLabel: "June 2026"
summary: "Short observation summary."
author: "Dr. Anandkumar Prakasam"
tags: []
status: published
featured: false
observationStatus: preliminary
---

Observation content here.
```

### Current example

- [src/content/observations/the-attack-that-left-no-fingerprints.mdx](C:\Azi\Blog_Proj\src\content\observations\the-attack-that-left-no-fingerprints.mdx)

## 8. ARTIFACT Content Guide

### Purpose

Use an **artifact** for downloadable governance tools:

- templates
- checklists
- tables
- frameworks
- worksheets
- audits

### Folder

- [src/content/artifacts](C:\Azi\Blog_Proj\src\content\artifacts)

### URL pattern

- `/artifacts/{slug}/`

### Allowed artifact types

- `template`
- `checklist`
- `table`
- `framework`
- `worksheet`
- `audit`

### Allowed download formats

- `PDF`
- `DOCX`
- `XLSX`
- `Markdown`

### Required published fields

```yaml
title
date
summary
status: published
artifactType
version
downloads (minimum 1)
```

### Artifact template

```md
---
title: "Artifact Title"
date: 2026-06-01
dateLabel: "June 2026"
summary: "What this artifact does."
author: "Dr. Anandkumar Prakasam"
tags: ["ai-governance"]
status: published
featured: true

artifactType: worksheet
version: "1.0"
relatedEssays: ["essay-slug"]
relatedBook: "human-in-control"
inlinePreview: true
license: "CC BY 4.0"

downloads:
  - format: "PDF"
    url: "https://files.theforensicbrief.com/artifacts/example-v1.pdf"
    sizeKB: 95
  - format: "DOCX"
    url: "https://files.theforensicbrief.com/artifacts/example-v1.docx"
    sizeKB: 36
---

## What it is

...

## When to use it

...

## How to use it

...
```

### Current examples

- [src/content/artifacts/six-dimensions-maturity-scorecard.mdx](C:\Azi\Blog_Proj\src\content\artifacts\six-dimensions-maturity-scorecard.mdx)
- [src/content/artifacts/mris-template.mdx](C:\Azi\Blog_Proj\src\content\artifacts\mris-template.mdx)

## 9. BOOK Content Guide

### Purpose

Use a **book** entry for:

- book landing page
- cover display
- optional back cover preview
- PDF action
- Amazon action
- table of contents

### Folder

- [src/content/books](C:\Azi\Blog_Proj\src\content\books)

### URL pattern

- `/books/{slug}/`

### Required published fields

```yaml
title
date
summary
status: published
cover
series
blurb
toc
pdfUrl
pdfSizeMB
amazonUrl
```

### Book template

```md
---
title: "Book Title"
date: 2026-06-29
summary: "Short book summary."
author: "Dr. Anandkumar Prakasam"
tags: []
status: published
featured: true

cover: "https://files.theforensicbrief.com/books/book-front-cover.jpg"
coverAvailable: true
backCover: "https://files.theforensicbrief.com/books/book-back-cover.jpg"
backCoverAvailable: true

series: "human-in-control"
blurb: "Approved book blurb here."
toc:
  - "Chapter One"
  - "Chapter Two"

pdfUrl: "https://files.theforensicbrief.com/books/book.pdf"
pdfSizeMB: 2.4
amazonUrl: "https://www.amazon.com/..."
isbn: "978-..."
pages: 180
---

Book body here.
```

### Current example

- [src/content/books/human-in-control.mdx](C:\Azi\Blog_Proj\src\content\books\human-in-control.mdx)

### Important book rules

- do not invent Amazon URLs
- do not invent ISBNs
- do not invent page counts
- do not publish fake PDFs
- if the PDF does not exist, keep the state honest

## 10. Utility Pages

Utility pages are not in `src/content`. They are standalone Astro pages:

- [src/pages/about.astro](C:\Azi\Blog_Proj\src\pages\about.astro)
- [src/pages/methodology.astro](C:\Azi\Blog_Proj\src\pages\methodology.astro)
- [src/pages/disclaimer.astro](C:\Azi\Blog_Proj\src\pages\disclaimer.astro)

Use these for static informational content that is not part of the content collections.

## 11. How Cloudflare R2 Downloads Work

This is the most important section for downloadable files.

### Core rule

Content pages and downloadable files are different things:

- Markdown/MDX content files live in the repo
- downloadable binaries or public assets live in R2

You do **not** upload `.md` source files to R2 just to make content render on the site.

You **do** upload files like:

- PDF
- DOCX
- XLSX
- cover JPG/PNG
- sample PDF

when the site must serve them as downloadable or display assets.

## 12. What Goes to R2 and What Stays in Git

### Stays in git / repo

These are authoring source files:

- incident `.mdx`
- essay `.mdx`
- observation `.mdx`
- artifact `.mdx`
- book `.mdx`
- small site code and layouts

### Goes to R2

These are public file assets:

- artifact PDFs
- artifact DOCX files
- artifact XLSX files
- book PDFs
- book cover images
- back cover images
- optional preview/sample files

## 13. R2 Naming Convention

Be consistent with names.

### Artifact naming examples

```text
artifacts/decision-envelope-v1.pdf
artifacts/decision-envelope-v1.docx
artifacts/mris-template-v1.pdf
artifacts/mris-template-v1.docx
artifacts/mris-template-v1.xlsx
artifacts/six-dimensions-maturity-scorecard-v1.pdf
```

### Book naming examples

```text
books/human-in-control-front-cover.jpg
books/human-in-control-back-cover.jpg
books/human-in-control.pdf
```

### Public URL pattern

The repo currently uses:

```text
https://files.theforensicbrief.com
```

So:

```text
artifacts/six-dimensions-maturity-scorecard-v1.pdf
```

becomes:

```text
https://files.theforensicbrief.com/artifacts/six-dimensions-maturity-scorecard-v1.pdf
```

## 14. End-to-End Artifact Download Setup

This is the full artifact-download workflow.

### Step 1: Prepare the artifact content file

Create:

- [src/content/artifacts/your-artifact.mdx](C:\Azi\Blog_Proj\src\content\artifacts)

Example frontmatter:

```yaml
downloads:
  - format: "PDF"
    url: "https://files.theforensicbrief.com/artifacts/your-artifact-v1.pdf"
    sizeKB: 95
```

### Step 2: Upload the real file to R2

Upload the real file to your R2 bucket using the exact object path:

```text
artifacts/your-artifact-v1.pdf
```

### Step 3: Verify the file is reachable

Run:

```powershell
curl.exe -I https://files.theforensicbrief.com/artifacts/your-artifact-v1.pdf
```

Expected:

```text
HTTP/1.1 200 OK
```

If you get:

- `404 Not Found`
- `403 Forbidden`

do not publish that URL yet.

### Step 4: Put the verified URL into frontmatter

Update the artifact file so the URL matches the real upload exactly.

### Step 5: Rebuild the site

Run:

```powershell
npm run build
```

Important:

The artifact page checks file availability during build.

That means:

- if you upload the R2 file after the last deploy, the live page will still show the old state
- you must trigger a new build and deploy

### Step 6: Run repo checks

```powershell
npm run validate:content
npm run test:e2e
```

### Step 7: Commit and push

```powershell
git add src/content/artifacts/your-artifact.mdx
git commit -m "Enable artifact download"
git push origin master
```

### Step 8: Wait for Cloudflare Pages to deploy

After deployment, open the artifact route and confirm the button appears.

## 15. End-to-End Book Download and Cover Setup

### Step 1: Prepare book content file

Create:

- [src/content/books/your-book.mdx](C:\Azi\Blog_Proj\src\content\books)

### Step 2: Upload front cover

Example object key:

```text
books/your-book-front-cover.jpg
```

### Step 3: Upload back cover

Example object key:

```text
books/your-book-back-cover.jpg
```

### Step 4: Upload PDF if available

Example object key:

```text
books/your-book.pdf
```

### Step 5: Verify each uploaded file

```powershell
curl.exe -I https://files.theforensicbrief.com/books/your-book-front-cover.jpg
curl.exe -I https://files.theforensicbrief.com/books/your-book-back-cover.jpg
curl.exe -I https://files.theforensicbrief.com/books/your-book.pdf
```

### Step 6: Add exact URLs to frontmatter

```yaml
cover: "https://files.theforensicbrief.com/books/your-book-front-cover.jpg"
backCover: "https://files.theforensicbrief.com/books/your-book-back-cover.jpg"
pdfUrl: "https://files.theforensicbrief.com/books/your-book.pdf"
```

### Step 7: Keep unavailable states honest

If the PDF is not real yet:

- do not fake it
- do not put a made-up URL
- keep the book draft
- or keep the action unavailable

### Step 8: Build, validate, test, push

```powershell
npm run build
npm run validate:content
npm run test:e2e
git add src/content/books/your-book.mdx
git commit -m "Add book entry"
git push origin master
```

## 16. How Pages Are Linked to Uploaded Files

Uploaded files are linked through **frontmatter URLs**, not automatically by folder name.

Example:

- content file:
  - [src/content/artifacts/six-dimensions-maturity-scorecard.mdx](C:\Azi\Blog_Proj\src\content\artifacts\six-dimensions-maturity-scorecard.mdx)
- download URL in frontmatter:
  - `https://files.theforensicbrief.com/artifacts/six-dimensions-maturity-scorecard-v1.pdf`
- live page:
  - `/artifacts/six-dimensions-maturity-scorecard/`

The page becomes downloadable because the content file explicitly includes that URL.

## 17. How to Read and Reuse Existing Content Files

Before creating new content, inspect current examples.

Recommended references:

### Incident example

- [src/content/incidents/samsung-chatgpt-one-way-door.mdx](C:\Azi\Blog_Proj\src\content\incidents\samsung-chatgpt-one-way-door.mdx)

### Essay examples

- [src/content/essays/whitebox-red-teaming.mdx](C:\Azi\Blog_Proj\src\content\essays\whitebox-red-teaming.mdx)
- [src/content/essays/detection-drop-line-600.mdx](C:\Azi\Blog_Proj\src\content\essays\detection-drop-line-600.mdx)

### Observation example

- [src/content/observations/the-attack-that-left-no-fingerprints.mdx](C:\Azi\Blog_Proj\src\content\observations\the-attack-that-left-no-fingerprints.mdx)

### Artifact examples

- [src/content/artifacts/six-dimensions-maturity-scorecard.mdx](C:\Azi\Blog_Proj\src\content\artifacts\six-dimensions-maturity-scorecard.mdx)
- [src/content/artifacts/mris-template.mdx](C:\Azi\Blog_Proj\src\content\artifacts\mris-template.mdx)

### Book example

- [src/content/books/human-in-control.mdx](C:\Azi\Blog_Proj\src\content\books\human-in-control.mdx)

## 18. Validation Commands

The project currently uses these scripts:

### Build

```powershell
npm run build
```

What it does:

- builds Astro static output
- generates `dist`
- runs Pagefind search indexing

### Content validation

```powershell
npm run validate:content
```

What it checks:

- required generated routes
- placeholder/fake text removal
- expected HTML output
- active download links for certain artifact pages

### Smoke / e2e check

```powershell
npm run test:e2e
```

What it checks:

- route presence
- search page
- books and artifacts routes
- pattern page
- newsletter leak regression
- other basic production expectations

## 19. Common Failure Cases

### Problem: page does not appear

Possible causes:

- file is in wrong folder
- frontmatter is invalid
- `status: draft`
- filename does not match expected slug

### Problem: build fails with schema error

Possible causes:

- missing required published fields
- invalid enum value
- malformed YAML frontmatter

Fix:

- compare with [src/content/config.ts](C:\Azi\Blog_Proj\src\content\config.ts)
- set `status: draft` until required fields are complete

### Problem: download button does not show

Possible causes:

- file uploaded to R2 after last deploy
- wrong R2 file path
- URL in frontmatter does not exactly match upload
- file returns `404`

Fix:

1. verify with `curl.exe -I`
2. update frontmatter if needed
3. rebuild and redeploy

### Problem: download exists in R2 but live page still says unavailable

Cause:

- the site is static
- availability was checked during an earlier build

Fix:

1. confirm `200 OK`
2. make a repo change if needed
3. rebuild
4. push
5. wait for Pages deploy

### Problem: book cover image broken

Possible causes:

- wrong R2 key
- wrong frontmatter URL
- file not public

Fix:

```powershell
curl.exe -I https://files.theforensicbrief.com/books/your-book-front-cover.jpg
```

### Problem: Markdown source file was uploaded to R2 but page still missing

Cause:

- content source files do not render from R2
- the site reads content from `src/content`, not from the R2 bucket

Fix:

- keep the `.md` or `.mdx` file in the repo
- only upload binary/download assets to R2

## 20. Recommended Content Creation Checklist

For any new item:

### Editorial checklist

- content is source-backed
- title is final
- date is real
- summary is concise and factual
- no fake placeholders
- no invented metadata

### Technical checklist

- file is in correct collection folder
- frontmatter matches schema
- `status` is correct
- routes and related slugs are correct
- download URLs match real uploaded files

### Validation checklist

```powershell
curl.exe -I <each R2 asset URL>
npm run build
npm run validate:content
npm run test:e2e
git status --short
```

## 21. Quick Starter Templates

### Incident starter

```md
---
title: "..."
date: 2026-06-01
summary: "..."
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
incidentDate: 2026-06-01
systems: []
domain: "..."
severity: "moderate"
corroboration: "..."
sources:
  - label: "..."
    url: "https://..."
timeline:
  - date: 2026-06-01
    event: "..."
rootCause: "..."
contributoryFactors:
  - "..."
relatedPatterns: []
relatedEssays: []
---

...
```

### Essay starter

```md
---
title: "..."
date: 2026-06-01
summary: "..."
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
category: "essay"
series: "out-of-bounds"
seriesNo: 1
---

...
```

### Pattern starter

```md
---
title: "..."
date: 2026-06-01
summary: "..."
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
category: "pattern"
patternId: "P-..."
signature: "..."
metric: "..."
relatedIncidents: []
---

...
```

### Observation starter

```md
---
title: "..."
date: 2026-06-01
summary: "..."
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
observationStatus: preliminary
---

...
```

### Artifact starter

```md
---
title: "..."
date: 2026-06-01
summary: "..."
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
artifactType: template
version: "1.0"
relatedEssays: []
inlinePreview: true
license: "CC BY 4.0"
downloads: []
---

...
```

### Book starter

```md
---
title: "..."
date: 2026-06-01
summary: "..."
author: "Dr. Anandkumar Prakasam"
tags: []
status: draft
featured: false
cover: "https://files.theforensicbrief.com/books/example-front-cover.jpg"
backCover: "https://files.theforensicbrief.com/books/example-back-cover.jpg"
series: "human-in-control"
blurb: "..."
toc:
  - "..."
pdfUrl: "https://files.theforensicbrief.com/books/example.pdf"
pdfSizeMB: 0
amazonUrl: ""
---

...
```

## 22. Final Practical Rule

If you remember only one thing, remember this:

- **content text lives in `src/content`**
- **downloadable files and large public assets live in R2**
- **the page links work only when the content frontmatter points to a real uploaded R2 file**
- **after uploading to R2, you still need a new build/deploy if the site checked availability during the old build**

