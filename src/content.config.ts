// Markdown content collections.
// Each .md file is one entry: settings in the frontmatter (between the --- lines), and an optional
// write-up below it. Pages CMS edits both (see .pages.yml) — the editor's "Body" is the write-up.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const tone = z.enum(['claret', 'oxford', 'teal', 'ink']).catch('ink');
// Empty values from the CMS ("" or null) count as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const flag = z.preprocess(blank, z.boolean().default(false));
const optionalText = z
  .string()
  .optional()
  .nullable()
  .transform((v) => (v && v.trim() !== '' ? v : undefined));

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.preprocess(blank, z.string().default('')),
    summary: z.preprocess(blank, z.string().default('')),
    order: z.preprocess(blank, z.coerce.number().default(99)), // position on the home page (lowest first)
    tone: z.preprocess(blank, tone.default('ink')),  // colour block when there's no image
    image: optionalText,                    // e.g. /images/tone-and-voice.jpg
    imageAlt: optionalText,
    blockText: optionalText,                // big text on the colour block
    tags: z.preprocess(
      blank,
      z.array(z.object({ label: z.string(), tone: z.preprocess(blank, tone.default('ink')) })).default([]),
    ),
    link: optionalText,                     // external link, used when there's no write-up
    linkLabel: optionalText,
    draft: flag,                            // hide from the site
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    source: optionalText,                   // where it was published, e.g. "Medium"
    date: z.preprocess(blank, z.coerce.date().optional()),
    link: optionalText,                     // external link, used when there's no write-up
    draft: flag,
  }),
});

export const collections = { projects, writing };
