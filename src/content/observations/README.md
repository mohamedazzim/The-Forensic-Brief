# Observations Collection

This directory contains preliminary field notes and research findings.

## File Naming

Use kebab-case for filenames:
```
context-window-decay.mdx
attention-primacy.mdx
```

## Required Frontmatter

```yaml
---
title: "Observation Title"
slug: "observation-slug"
date: 2026-06-15
summary: "Brief description (max 200 chars)"
status: published
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Observation title |
| slug | string | Yes | URL slug |
| date | date | Yes | Publication date |
| summary | string | Yes | Brief description (max 200 chars) |
| status | enum | Yes | "draft" \| "published" |

## Purpose

Observations are:
- Preliminary field notes
- Lab notebook entries
- Not yet fully researched incidents
- Early signals that may become incidents later

## Content Guidelines

- Write in first person
- Include specific examples
- Link to related incidents when available
- Mark as draft until fully researched

## Example

See `context-window-decay.mdx` for a complete example.
