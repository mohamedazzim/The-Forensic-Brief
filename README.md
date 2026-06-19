# The Forensic Brief

**Post-Incident Analysis of AI Failure**

A structured, multi-section publication hosting evidence-based AI failure post-mortems, long-form essays, governance templates, and field observations — built with Astro and deployed on Cloudflare Pages.

![Framework](https://img.shields.io/badge/Astro-5.7-FF5D01?logo=astro)
![Hosting](https://img.shields.io/badge/Cloudflare-Pages-F48120?logo=cloudflare)
![License](https://img.shields.io/badge/License-CC%20BY%204.0-blue)

---

## Live Site

**[theforensicbrief.com](https://theforensicbrief.com)**

---

## What This Is

The Forensic Brief is an independent AI governance publication that documents real AI failures with forensic rigor. Every incident is sourced, every pattern is measurable, every artifact is reusable.

### Content Sections

| Section | Description |
|---------|-------------|
| **Incidents** | Evidence-based post-mortems of documented AI failures |
| **Essays** | Long-form analysis organized into five named series |
| **Patterns** | Recurring failure signatures with measurable metrics |
| **Books** | Free PDF downloads + Amazon hardcopy links |
| **Observations** | Preliminary field notes and research findings |
| **Artifacts** | Reusable AI-governance templates and tools |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro](https://astro.build/) (static output) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |
| File Storage | [Cloudflare R2](https://www.cloudflare.com/products/r2/) |
| Search | [Pagefind](https://pagefind.app/) (client-side) |
| Analytics | [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) |
| Newsletter | Buttondown or ConvertKit (configurable) |
| Fonts | Self-hosted Lora + Playfair Display (woff2) |

---

## Design System

The site uses an **old bond-sheet aesthetic** — warm parchment background with ruled-paper texture, serif typography, and justified body text.

### Typography

- **Headings:** Playfair Display (600 weight)
- **Body:** Lora (400 weight), justified with hyphenation
- **Measure:** 66ch max-width for optimal readability
- **Scale:** 1.25 modular ratio

### Colors

```css
--bg: #f0ebe2;           /* Warm parchment */
--bg-card: #faf7f2;      /* Card surfaces */
--text-primary: #1a2535;  /* Near-black ink */
--border: #c8c0b4;        /* Warm brown rules */
--line-gap: 32px;         /* Ruled-paper spacing */
```

---

## Project Structure

```
/
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/            # Centralized configuration
│   ├── content/           # Content collections (MDX)
│   │   ├── incidents/
│   │   ├── essays/
│   │   ├── books/
│   │   ├── artifacts/
│   │   └── observations/
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages
│   └── styles/            # CSS (tokens, typography, global)
├── public/                # Static assets
│   ├── fonts/             # Self-hosted woff2 fonts
│   ├── favicon.svg
│   └── robots.txt
├── docs/                  # Content templates
│   └── content-templates/
├── .github/workflows/     # CI configuration
└── astro.config.mjs       # Astro configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
git clone https://github.com/mohamedazzim/The-Forensic-Brief.git
cd The-Forensic-Brief
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:4321/](http://localhost:4321/)

### Build

```bash
npm run build
```

Generates static output in `dist/` with Pagefind search index.

### Preview

```bash
npm run preview
```

---

## Content Authoring

All content is written in MDX with Zod-validated frontmatter.

### Adding an Incident

Create `src/content/incidents/your-incident.mdx`:

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
tags: ["human-oversight", "automation-bias"]
status: published
---
```

### Adding an Essay

Create `src/content/essays/your-essay.mdx`:

```yaml
---
title: "Essay Title"
date: 2026-06-20
summary: "Brief description"
category: "essay"
series: "human-in-control"
seriesNo: 1
readingTime: 8
book: "human-in-control"
artifact: "artifact-slug"
tags: ["human-oversight"]
status: published
---
```

### Adding a Pattern

Same as an essay, but with `category: "pattern"` and pattern-specific fields:

```yaml
---
title: "Pattern Title"
date: 2026-06-20
summary: "Brief description"
category: "pattern"
patternId: "P-CONTEXT-DECAY"
signature: "Recurring failure description"
metric: "Measurable signature"
relatedIncidents: ["incident-slug"]
tags: ["red-teaming"]
status: published
---
```

### Content Templates

See `docs/content-templates/` for complete frontmatter schemas:

- `INCIDENTS.md` — Incident frontmatter reference
- `ESSAYS.md` — Essay and pattern frontmatter reference
- `BOOKS.md` — Book frontmatter reference
- `ARTIFACTS.md` — Artifact frontmatter reference
- `OBSERVATIONS.md` — Observation frontmatter reference

---

## Deployment

### Cloudflare Pages

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | 20 |

### Deploy Steps

1. Push to GitHub
2. Connect repository in Cloudflare Dashboard → Pages
3. Configure build settings as above
4. Deploy

See `CLOUDFLARE_PAGES.md` for detailed instructions.

---

## Configuration

### Fonts

Font files are in `public/fonts/`. The `@font-face` declarations in `src/styles/typography.css` are active and point to local files.

### R2 Storage

Book PDFs and artifact files are stored in Cloudflare R2. Update `src/config/downloads.ts` with your bucket URLs.

### Newsletter

The newsletter component is provider-agnostic. Update the `action` URL in `src/components/NewsletterCTA.astro` with your Buttondown or ConvertKit endpoint.

### Analytics

Add your Cloudflare Web Analytics token to `src/components/Analytics.astro`.

---

## Documentation

| Document | Purpose |
|----------|---------|
| `DEPLOYMENT.md` | Cloudflare Pages deployment guide |
| `CLOUDFLARE_PAGES.md` | Exact deployment values |
| `R2_SETUP.md` | Cloudflare R2 bucket setup |
| `FONTS_SETUP.md` | Self-hosted font activation |
| `NEWSLETTER_SETUP.md` | Newsletter provider wiring |
| `ANALYTICS_SETUP.md` | Cloudflare Web Analytics setup |
| `LAUNCH_CHECKLIST.md` | Pre-launch verification |
| `development_report.md` | Forensic audit report |

---

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Foundation, design system, content collections |
| Phase 2 | ✅ Complete | Books, artifacts, observations, search, newsletter |
| Phase 3 | ✅ Complete | Filtering, accessibility, CI, performance |
| Phase 4 | ✅ Complete | Launch readiness, production wiring |
| Phase 5 | ✅ Complete | Deployment documentation |
| Phase 6 | ✅ Complete | Content migration templates |
| Phase 7 | ✅ Complete | Final deployment verification |

---

## License

Content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Code is open source. See repository for details.

---

## Author

**Dr. Anandkumar Prakasam**

Post-Incident Analysis of AI Failure
