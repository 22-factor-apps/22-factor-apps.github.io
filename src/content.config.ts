import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const factors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/factors' }),
  schema: z.object({
    number: z.number().int().min(1).max(22),
    numeral: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    tagline: z.string().min(1),
    commandment: z.string().min(1),
    boundary: z.string().min(1),
    original: z.boolean(),
    category: z.string().min(1),
    reading: z.string().regex(/^\d+ min$/),
  }),
});

export const collections = { factors };
