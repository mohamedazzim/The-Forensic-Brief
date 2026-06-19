# Books Collection

This directory contains book entries for free PDF downloads and Amazon hardcopy links.

## File Naming

Use kebab-case for filenames:
```
human-in-control.mdx
accountable-autonomy.mdx
```

## Required Frontmatter

```yaml
---
title: "Human in Control"
author: "Dr. Anandkumar Prakasam"
description: "A practical guide to human oversight of AI systems."
coverImage: "/covers/human-in-control.jpg"
samplePdf: "https://files.theforensicbrief.com/books/human-in-control-sample.pdf"
fullPdf: "https://files.theforensicbrief.com/books/human-in-control.pdf"
amazonUrl: "https://amazon.com/dp/XXXXX"
status: published
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Book title |
| author | string | Yes | Author name |
| description | string | Yes | Brief book description |
| coverImage | string | Yes | Path to cover image in public/ |
| samplePdf | string | Yes | R2 URL for sample chapter PDF |
| fullPdf | string | Yes | R2 URL for full PDF |
| amazonUrl | string | No | Amazon hardcopy link |
| status | enum | Yes | "draft" \| "published" |

## File Structure

```
public/
├── covers/
│   ├── human-in-control.jpg
│   └── accountable-autonomy.jpg
└── fonts/
    └── *.woff2
```

## R2 Storage

PDF files are stored in Cloudflare R2:
```
https://files.theforensicbrief.com/books/human-in-control-sample.pdf
https://files.theforensicbrief.com/books/human-in-control.pdf
```

## Example

See `human-in-control.mdx` for a complete example.
