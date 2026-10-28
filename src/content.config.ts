import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const byPath = ({ entry }: { entry: string }) => entry.replace(/\.json$/, '');

const icon = z.enum([
  'quote', 'car', 'garage', 'wrench', 'paint', 'shield', 'cash', 'loyalty', 'chart', 'users', 'branch',
  'whatsapp', 'check', 'arrow', 'chat', 'calendar', 'cloud', 'upload', 'lock', 'phone', 'mail', 'menu', 'close', 'phoneDevice', 'eye',
]);
const link = z.object({ label: z.string(), href: z.string() });
const faq = z.object({ q: z.string(), a: z.string() });
const titled = z.object({ title: z.string(), text: z.string() });
const tone = z.enum(['ok', 'warn', 'info', 'idle']).default('idle');
const sample = z.object({
  title: z.string(),
  badge: z.string().optional(),
  rows: z.array(z.object({ label: z.string(), value: z.string(), tone })).min(2),
});

const blocks = z.array(
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('hero'),
      eyebrow: z.string(),
      title: z.string(),
      lede: z.string(),
      primary: link,
      secondary: link,
      note: z.string(),
      pills: z.array(z.string()),
      stack: z.array(sample).length(3),
    }),
    z.object({
      type: z.literal('problem'),
      title: z.string(),
      lede: z.string(),
      before: z.object({ title: z.string(), items: z.array(z.string()).min(3) }),
      after: z.object({ title: z.string(), items: z.array(z.string()).min(3) }),
    }),
    z.object({
      type: z.literal('journey'),
      title: z.string(),
      lede: z.string(),
      stages: z.array(z.object({ module: z.string(), label: z.string(), text: z.string() })).min(3),
    }),
    z.object({
      type: z.literal('modules'),
      title: z.string(),
      lede: z.string(),
      showAll: z.boolean().default(false),
    }),
    z.object({
      type: z.literal('features'),
      title: z.string(),
      lede: z.string(),
      items: z.array(z.object({ icon, title: z.string(), text: z.string() })).min(3),
    }),
    z.object({
      type: z.literal('stats'),
      title: z.string(),
      items: z
        .array(
          z
            .object({
              value: z.string().optional(),
              counter: z.enum(['modules', 'specialists']).optional(),
              label: z.string(),
            })
            .refine((s) => Boolean(s.value) !== Boolean(s.counter), 'stat: usa value o counter, no ambos'),
        )
        .min(3),
    }),
    z.object({
      type: z.literal('pricing'),
      title: z.string(),
      lede: z.string(),
      footnote: z.string(),
      plans: z
        .array(
          z.object({
            key: z.enum(['FREE', 'TEAM', 'ENTERPRISE']),
            name: z.string(),
            price: z.string(),
            unit: z.string(),
            users: z.string(),
            branches: z.string(),
            featured: z.boolean().default(false),
            features: z.array(z.string()).min(2),
            cta: link,
          }),
        )
        .length(3),
    }),
    z.object({ type: z.literal('faq'), title: z.string(), items: z.array(faq).min(3) }),
    z.object({ type: z.literal('cta'), title: z.string(), text: z.string(), primary: link, secondary: link }),
    z.object({ type: z.literal('contact'), title: z.string(), text: z.string() }),
    z.object({
      type: z.literal('prose'),
      sections: z.array(z.object({ title: z.string().optional(), paragraphs: z.array(z.string()).min(1) })).min(1),
    }),
  ]),
);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages', generateId: byPath }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]*$/, 'slug: minúsculas, números y guiones'),
    view: z.enum(['home', 'page']).default('page'),
    nav: z.boolean().default(false),
    order: z.number().default(99),
    title: z.string(),
    seoTitle: z.string().max(70),
    seoDescription: z.string().min(70).max(160),
    noindex: z.boolean().default(false),
    blocks,
  }),
});

const modules = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/modules', generateId: byPath }),
  schema: z.object({
    order: z.number(),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug: minúsculas, números y guiones'),
    icon,
    cardTitle: z.string(),
    cardTagline: z.string(),
    title: z.string(),
    lede: z.string(),
    seoTitle: z.string().max(70),
    seoDescription: z.string().min(70).max(160),
    keywords: z.array(z.string()).default([]),
    highlights: z.array(titled).min(3),
    idealFor: z.array(z.string()).default([]),
    sample,
    faqs: z.array(faq).min(3),
  }),
});

export const collections = { pages, modules };
