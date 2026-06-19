# Artifacts Collection

This directory contains reusable AI governance templates and tools.

## File Naming

Use kebab-case for filenames:
```
decision-envelope.mdx
mris-template.mdx
```

## Required Frontmatter

```yaml
---
title: "Decision Envelope"
slug: "decision-envelope"
description: "Standardized format for recording AI system decisions."
type: "template"
fileType: "markdown"
fileUrl: "https://files.theforensicbrief.com/artifacts/decision-envelope.md"
updatedAt: 2026-05-22
version: "1.0"
relatedEssays: ["hitl-is-not-oversight"]
tags: ["decision-making", "human-oversight"]
status: published
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Artifact title |
| slug | string | Yes | URL slug |
| description | string | Yes | Brief description |
| type | enum | Yes | "template" \| "checklist" \| "framework" \| "scorecard" |
| fileType | enum | Yes | "markdown" \| "csv" \| "json" \| "pdf" |
| fileUrl | string | Yes | R2 URL for download |
| downloadFormats | string[] | No | Available formats |
| updatedAt | date | Yes | Last update date |
| version | string | No | Version number |
| relatedEssays | string[] | No | Slugs of related essays |
| tags | string[] | No | Topic tags |
| status | enum | Yes | "draft" \| "published" |

## Artifact Types

- **template**: Fill-in-the-blank templates
- **checklist**: Step-by-step verification lists
- **framework**: Structured decision frameworks
- **scorecard**: Scoring and evaluation tools

## R2 Storage

Artifact files are stored in Cloudflare R2:
```
https://files.theforensicbrief.com/artifacts/decision-envelope.md
https://files.theforensicbrief.com/artifacts/mris-template.md
```

## Examples

See `decision-envelope.mdx` and `mris-template.mdx` for complete examples.
