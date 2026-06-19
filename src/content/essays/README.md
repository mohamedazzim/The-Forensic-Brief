# Essays Collection

This directory contains essays and pattern-category analyses.

## File Naming

Use kebab-case for filenames:
```
hitl-is-not-oversight.mdx
detection-drop-line-600.mdx
```

## Required Frontmatter

### Narrative Essay

```yaml
---
title: "Essay Title"
date: 2026-06-20
summary: "Brief description (max 200 chars)"
category: "essay"
series: "human-in-control"
seriesNo: 1
readingTime: 8
book: "human-in-control"
artifact: "decision-envelope"
tags: ["human-oversight", "eu-ai-act"]
status: published
---
```

### Pattern Category

```yaml
---
title: "Pattern Title"
date: 2026-06-20
summary: "Brief description (max 200 chars)"
category: "pattern"
patternId: "P-ATTENTION-DECAY"
signature: "Recurring failure signature"
metric: "Measurable metric"
relatedIncidents: ["air-canada-chatbot-refund"]
tags: ["red-teaming", "llm-security"]
status: published
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Essay title |
| date | date | Yes | Publication date |
| summary | string | Yes | Brief description (max 200 chars) |
| category | enum | Yes | "essay" \| "pattern" |
| series | enum | No | "human-in-control" \| "out-of-bounds" \| "accountable-autonomy" \| "six-dimensions" \| "the-burden" |
| seriesNo | number | No | Order within series |
| readingTime | number | No | Estimated minutes |
| book | string | No | Slug of related book |
| artifact | string | No | Slug of related artifact |
| prev | string | No | Slug of previous essay in series |
| next | string | No | Slug of next essay in series |
| patternId | string | Pattern | Pattern identifier (e.g., "P-CONTEXT-DECAY") |
| signature | string | Pattern | Recurring failure description |
| metric | string | Pattern | Measurable signature |
| relatedIncidents | string[] | Pattern | Slugs of related incidents |
| tags | string[] | No | Topic tags |
| status | enum | Yes | "draft" \| "published" |
| featured | boolean | No | Show on homepage |
| author | string | No | Defaults to Dr. Anandkumar Prakasam |

## Series

1. **human-in-control** - Human oversight in AI systems
2. **out-of-bounds** - AI failures at boundaries
3. **accountable-autonomy** - Accountability frameworks
4. **six-dimensions** - Six dimensions of AI governance
5. **the-burden** - Burden of AI failures

## Example

See `hitl-is-not-oversight.mdx` for a complete example.
