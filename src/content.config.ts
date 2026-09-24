import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const journal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    authorSlug: z.string(),
    category: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    readingMinutes: z.number(),
    relatedTreatments: z.array(z.string()).default([]),
  }),
});

export const collections = { journal };
