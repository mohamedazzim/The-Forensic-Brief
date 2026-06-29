import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sharedPublished = {
  title: z.string(),
  date: z.date(),
  dateLabel: z.string().optional(),
  updated: z.date().optional(),
  summary: z.string().max(200),
  author: z.string().default('Dr. Anandkumar Prakasam'),
  tags: z.array(z.string()).default([]),
  status: z.literal('published'),
  featured: z.boolean().default(false),
  heroImage: z.string().optional(),
  ogImage: z.string().optional(),
};

const sharedDraft = {
  title: z.string(),
  date: z.date().optional(),
  dateLabel: z.string().optional(),
  updated: z.date().optional(),
  summary: z.string().max(200).optional(),
  author: z.string().default('Dr. Anandkumar Prakasam'),
  tags: z.array(z.string()).default([]),
  status: z.literal('draft'),
  featured: z.boolean().default(false),
  heroImage: z.string().optional(),
  ogImage: z.string().optional(),
};

const incidents = defineCollection({
  loader: glob({
    base: './src/content/incidents',
    pattern: ['**/*-metadata.md', '**/*-metadata.mdx'],
  }),
  schema: z.union([
    z.object({
      ...sharedPublished,
      contentFile: z.string(),
      incidentDate: z.date(),
      incidentDateLabel: z.string().optional(),
      systems: z.array(z.string()),
      domain: z.string(),
      severity: z.enum(['low', 'moderate', 'high', 'critical']),
      corroboration: z.string(),
      sources: z.array(z.object({
        label: z.string(),
        url: z.string(),
      })),
      timeline: z.array(z.object({
        date: z.date(),
        label: z.string().optional(),
        event: z.string(),
      })),
      rootCause: z.string(),
      contributoryFactors: z.array(z.string()),
      relatedPatterns: z.array(z.string()).default([]),
      relatedEssays: z.array(z.string()).default([]),
    }),
    z.object({
      ...sharedDraft,
      contentFile: z.string().optional(),
      incidentDate: z.date().optional(),
      incidentDateLabel: z.string().optional(),
      systems: z.array(z.string()).default([]),
      domain: z.string().optional(),
      severity: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
      corroboration: z.string().optional(),
      sources: z.array(z.object({
        label: z.string(),
        url: z.string().optional(),
      })).default([]),
      timeline: z.array(z.object({
        date: z.date().optional(),
        label: z.string().optional(),
        event: z.string(),
      })).default([]),
      rootCause: z.string().optional(),
      contributoryFactors: z.array(z.string()).default([]),
      relatedPatterns: z.array(z.string()).default([]),
      relatedEssays: z.array(z.string()).default([]),
    }),
  ]),
});

const essays = defineCollection({
  type: 'content',
  glob: '**/*.{md,mdx}',
  schema: z.union([
    z.object({
      ...sharedPublished,
      category: z.enum(['essay', 'pattern']).default('essay'),
      series: z.enum([
        'human-in-control',
        'out-of-bounds',
        'accountable-autonomy',
        'six-dimensions',
        'the-burden',
      ]).optional(),
      seriesNo: z.number().optional(),
      readingTime: z.number().optional(),
      book: z.string().optional(),
      artifact: z.string().optional(),
      prev: z.string().optional(),
      next: z.string().optional(),
      linkedinUrl: z.string().optional(),
      mediumUrl: z.string().optional(),
      patentSensitive: z.boolean().default(false),
      patternId: z.string().optional(),
      signature: z.string().optional(),
      metric: z.string().optional(),
      relatedIncidents: z.array(z.string()).default([]),
    }).superRefine((data, ctx) => {
      if (data.category === 'pattern') {
        if (!data.patternId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'patternId is required for published pattern essays', path: ['patternId'] });
        if (!data.signature) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'signature is required for published pattern essays', path: ['signature'] });
        if (!data.metric) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'metric is required for published pattern essays', path: ['metric'] });
      }
    }),
    z.object({
      ...sharedDraft,
      category: z.enum(['essay', 'pattern']).default('essay'),
      series: z.enum([
        'human-in-control',
        'out-of-bounds',
        'accountable-autonomy',
        'six-dimensions',
        'the-burden',
      ]).optional(),
      seriesNo: z.number().optional(),
      readingTime: z.number().optional(),
      book: z.string().optional(),
      artifact: z.string().optional(),
      prev: z.string().optional(),
      next: z.string().optional(),
      linkedinUrl: z.string().optional(),
      mediumUrl: z.string().optional(),
      patentSensitive: z.boolean().default(false),
      patternId: z.string().optional(),
      signature: z.string().optional(),
      metric: z.string().optional(),
      relatedIncidents: z.array(z.string()).default([]),
    }),
  ]),
});

const observations = defineCollection({
  type: 'content',
  glob: '**/*.{md,mdx}',
  schema: z.union([
    z.object({
      ...sharedPublished,
      observationStatus: z.enum(['preliminary', 'ongoing', 'resolved']),
    }),
    z.object({
      ...sharedDraft,
      observationStatus: z.enum(['preliminary', 'ongoing', 'resolved']).optional(),
    }),
  ]),
});

const artifacts = defineCollection({
  loader: glob({
    base: './src/content/artifacts',
    pattern: ['**/*-metadata.md', '**/*-metadata.mdx'],
  }),
  schema: z.union([
    z.object({
      ...sharedPublished,
      contentFile: z.string(),
      artifactType: z.enum(['template', 'checklist', 'table', 'framework', 'worksheet', 'audit']),
      version: z.string(),
      relatedEssays: z.array(z.string()).default([]),
      relatedBook: z.string().optional(),
      inlinePreview: z.boolean().default(false),
      license: z.string().default('CC BY 4.0'),
      downloads: z.array(z.object({
        format: z.enum(['PDF', 'DOCX', 'XLSX', 'Markdown']),
        url: z.string(),
        sizeKB: z.number(),
      })).min(1),
    }),
    z.object({
      ...sharedDraft,
      contentFile: z.string().optional(),
      artifactType: z.enum(['template', 'checklist', 'table', 'framework', 'worksheet', 'audit']).optional(),
      version: z.string().optional(),
      relatedEssays: z.array(z.string()).default([]),
      relatedBook: z.string().optional(),
      inlinePreview: z.boolean().default(false),
      license: z.string().default('CC BY 4.0'),
      downloads: z.array(z.object({
        format: z.enum(['PDF', 'DOCX', 'XLSX', 'Markdown']),
        url: z.string(),
        sizeKB: z.number(),
      })).default([]),
    }),
  ]),
});

const books = defineCollection({
  type: 'content',
  glob: '**/*.{md,mdx}',
  schema: z.union([
    z.object({
      ...sharedPublished,
      cover: z.string(),
      coverAvailable: z.boolean().optional(),
      backCover: z.string().optional(),
      backCoverAvailable: z.boolean().optional(),
      series: z.string(),
      blurb: z.string(),
      toc: z.array(z.string()),
      pdfUrl: z.string(),
      pdfSizeMB: z.number(),
      amazonUrl: z.string(),
      isbn: z.string().optional(),
      pages: z.number().optional(),
    }),
    z.object({
      ...sharedDraft,
      cover: z.string().optional(),
      coverAvailable: z.boolean().optional(),
      backCover: z.string().optional(),
      backCoverAvailable: z.boolean().optional(),
      series: z.string().optional(),
      blurb: z.string().optional(),
      toc: z.array(z.string()).default([]),
      pdfUrl: z.string().optional(),
      pdfSizeMB: z.number().optional(),
      amazonUrl: z.string().optional(),
      isbn: z.string().optional(),
      pages: z.number().optional(),
    }),
  ]),
});

export const collections = {
  incidents,
  essays,
  observations,
  artifacts,
  books,
};
