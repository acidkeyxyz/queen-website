import type { CollectionEntry } from 'astro:content';

export type Block = CollectionEntry<'pages'>['data']['blocks'][number];
export type BlockOf<T extends Block['type']> = Extract<Block, { type: T }>;
export type Sample = CollectionEntry<'modules'>['data']['sample'];
