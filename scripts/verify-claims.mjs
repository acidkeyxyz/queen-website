import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = process.env.MODULE_DOCS || path.join(root, '..', 'queen-webapp', 'docs', 'modules');
const map = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'claims-map.json'), 'utf8'));
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const dir = (d) => fs.readdirSync(path.join(root, 'src/content', d, 'es-mx')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));

const flat = (o) => (typeof o === 'string' ? [o] : Array.isArray(o) ? o.flatMap(flat) : o && typeof o === 'object' ? Object.values(o).flatMap(flat) : []);
const modules = Object.fromEntries(dir('modules').map((k) => [k, readJson(path.join(root, 'src/content/modules/es-mx', k + '.json'))]));
const pages = Object.fromEntries(dir('pages').map((k) => [k, readJson(path.join(root, 'src/content/pages/es-mx', k + '.json'))]));
const siteText = (key) => flat(modules[key] || pages[key]).join('\n').toLowerCase();

const guides = {};
for (const f of fs.readdirSync(docsDir).filter((x) => x.endsWith('.md') && !x.startsWith('_') && x !== 'README.md')) {
  guides[f.replace(/\.md$/, '')] = fs.readFileSync(path.join(docsDir, f), 'utf8');
}

const fails = [];
const warns = [];
const ok = [];

for (const key of Object.keys(modules)) {
  if (!map.pages[key]) fails.push(`page "${key}" has no entry in docs/claims-map.json -> pages`);
}
for (const [key, ids] of Object.entries(map.pages)) {
  if (!modules[key]) fails.push(`claims-map names page "${key}" that does not exist`);
  for (const id of ids) if (!guides[id]) fails.push(`page "${key}" maps to guide "${id}" which does not exist in ${docsDir}`);
}

const covered = new Set(Object.values(map.pages).flat());
for (const id of Object.keys(guides)) {
  if (!covered.has(id) && !map.notOnSite[id]) fails.push(`guide "${id}" is documented but not on the site and has no reason in notOnSite`);
}
for (const [id, why] of Object.entries(map.notOnSite)) {
  if (!guides[id]) fails.push(`notOnSite names guide "${id}" that does not exist`);
  else if (covered.has(id)) warns.push(`guide "${id}" is both on the site and in notOnSite (${why})`);
}

for (const e of map.evidence) {
  if (!siteText(e.page).includes(e.phrase.toLowerCase())) { fails.push(`evidence out of date: page "${e.page}" no longer says "${e.phrase}"`); continue; }
  if (!guides[e.guide] || !guides[e.guide].includes(e.mustContain)) fails.push(`UNBACKED claim: page "${e.page}" says "${e.phrase}" but guide "${e.guide}" never says "${e.mustContain}"`);
  else ok.push(`${e.page}: "${e.phrase}" <- ${e.guide}`);
}

for (const b of map.banned) {
  for (const key of [...Object.keys(modules), ...Object.keys(pages)]) {
    if (b.allowedIn.includes(key)) continue;
    if (siteText(key).includes(b.term.toLowerCase())) fails.push(`banned term "${b.term}" on "${key}" (${b.why})`);
  }
}

const catalog = (guides.taskCatalogList.match(/\*\*Especialista\*\* \(([^)]*)\)/) || [])[1];
const catalogCount = catalog ? catalog.split(/,| o /).map((s) => s.trim()).filter(Boolean).length : 0;
const statsSrc = fs.readFileSync(path.join(root, 'src/components/blocks/Stats.astro'), 'utf8');
const shown = Number((statsSrc.match(/specialists:\s*(\d+)/) || [])[1]);
if (!catalogCount || catalogCount !== shown) fails.push(`specialists counter is ${shown} but the task catalog guide lists ${catalogCount}`);
else ok.push(`specialists counter ${shown} = task catalog guide`);

const stages = Object.values(modules).filter((m) => m.stage !== false).length;
const journey = pages.home.blocks.find((b) => b.type === 'journey');
if (journey && journey.stages.length !== stages) fails.push(`journey has ${journey.stages.length} stages but ${stages} module pages are stages`);
else ok.push(`journey stages ${stages} = module pages with stage`);

for (const u of map.unverified) warns.push(`UNVERIFIED (kept on purpose): ${u.page}: ${u.claim} -> ${u.todo}`);

console.log(`Checked ${Object.keys(modules).length} module pages against ${Object.keys(guides).length} guides in ${docsDir}\n`);
if (process.argv.includes('--verbose')) ok.forEach((l) => console.log('  ok   ' + l));
warns.forEach((l) => console.log('  warn ' + l));
fails.forEach((l) => console.log('  FAIL ' + l));
console.log(`\n${ok.length} backed claims, ${warns.length} warnings, ${fails.length} failures`);
process.exit(fails.length ? 1 : 0);
