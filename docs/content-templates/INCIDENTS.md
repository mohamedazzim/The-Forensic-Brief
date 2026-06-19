# Incidents Collection

This directory contains incident reports documenting AI failures.

## File Naming

Use kebab-case for filenames:
```
air-canada-chatbot-refund.mdx
uber-self-driving-fatality.mdx
```

## Required Frontmatter

```yaml
---
title: "Incident Title"
date: 2024-02-12
summary: "Brief description (max 200 chars)"
incidentDate: 2024-02-12
systems: ["Vendor Name", "Product Name"]
domain: "customer service"
severity: "high"
corroboration: "Independent source confirming the incident"
sources:
  - label: "Source Name"
    url: "https://example.com/source"
timeline:
  - date: 2024-02-12
    event: "What happened"
rootCause: "Primary failure condition"
contributoryFactors:
  - "Factor 1"
  - "Factor 2"
relatedPatterns: []
relatedEssays: []
status: published
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Incident title |
| date | date | Yes | Publication date |
| summary | string | Yes | Brief description (max 200 chars) |
| incidentDate | date | Yes | When the failure occurred |
| systems | string[] | Yes | Vendors/products involved |
| domain | string | Yes | e.g., "customer service", "lending" |
| severity | enum | Yes | "low" \| "moderate" \| "high" \| "critical" |
| corroboration | string | Yes | Independent confirming signal |
| sources | object[] | Yes | Label and URL for each source |
| timeline | object[] | Yes | Date and event for each entry |
| rootCause | string | Yes | Primary failure condition |
| contributoryFactors | string[] | Yes | Additional contributing factors |
| relatedPatterns | string[] | No | Slugs of related pattern essays |
| relatedEssays | string[] | No | Slugs of related essays |
| status | enum | Yes | "draft" \| "published" |
| tags | string[] | No | Topic tags |
| featured | boolean | No | Show on homepage |
| author | string | No | Defaults to Dr. Anandkumar Prakasam |

## Severity Levels

- **critical**: System failure with significant harm
- **high**: Major failure with documented impact
- **moderate**: Notable failure with limited impact
- **low**: Minor failure or near-miss

## Example

See `air-canada-chatbot-refund.mdx` for a complete example.
