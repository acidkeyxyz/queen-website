import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const business = JSON.parse(readFileSync('src/content/business.json', 'utf8'));
const isBuild = process.argv.some((a) => a === 'build' || a === 'check');

export default defineConfig({
  site: business.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: { cacheDir: isBuild ? 'node_modules/.vite-build' : 'node_modules/.vite' },
  integrations: [sitemap()],
});
