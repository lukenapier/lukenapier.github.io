import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    tags: z.array(z.string()).default([]),
    folder: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { notes };
