import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cardTitle: z.string(),
      metaTitle: z.string(),
      description: z.string(),
      intro: z.string(),
      summary: z.string(),
      order: z.number(),
      icon: z.string(),
      image: image(),
      imageAlt: z.string(),
      deviceImage: image(),
      deviceAlt: z.string(),
      highlights: z.array(z.string()),
      faqs: z.array(faq),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      metaTitle: z.string(),
      description: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      category: z.string(),
      readTime: z.number(),
      image: image(),
      imageAlt: z.string(),
      related: z.array(z.string()).default([]),
      faqs: z.array(faq).default([]),
    }),
});

export const collections = { services, blog };
