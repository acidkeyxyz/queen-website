import sharp from 'sharp';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';

const MASTER = 'src/assets/brand/yuriapp-logo-master.png';
export const iconSizes = { 'favicon-32.png': 32, 'icon-96.png': 96, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 };

const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const wrap = (text, max) => {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const textLines = (lines, { x, y, size, weight, fill, gap }) =>
  lines
    .map((l, i) => `<text x="${x}" y="${y + i * gap}" font-family="Helvetica, Arial, sans-serif" font-size="${size}" ${weight ? `font-weight="${weight}"` : ''} fill="${fill}">${escapeXml(l)}</text>`)
    .join('\n');

const wrapAll = (text, max, limit) => {
  const lines = wrap(text, max);
  if (lines.length > limit) throw new Error(`Share image text does not fit (${limit} lines max): ${text}`);
  return lines;
};

export const buildOgSvg = ({ title, accent = '', subtitle = '' }) => {
  const titleLines = wrapAll(title, 24, 3);
  const accentLines = accent ? wrapAll(accent, 24, 3) : [];
  const subLines = subtitle ? wrapAll(subtitle, 40, 2) : [];
  const blockHeight = (titleLines.length + accentLines.length) * 62 + (subLines.length ? 30 + subLines.length * 36 : 0);
  const top = Math.round(315 - blockHeight / 2) + 46;
  const afterTitle = top + (titleLines.length + accentLines.length) * 62 + 14;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="g" cx="0.3" cy="0.5" r="0.9"><stop offset="0" stop-color="#3b38ad"/><stop offset="1" stop-color="#18176a"/></radialGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
${textLines(titleLines, { x: 590, y: top, size: 46, weight: 700, fill: '#f7f6ff', gap: 62 })}
${textLines(accentLines, { x: 590, y: top + titleLines.length * 62, size: 46, weight: 700, fill: '#e2ab69', gap: 62 })}
${textLines(subLines, { x: 590, y: afterTitle + 30, size: 26, fill: '#d4d3f3', gap: 36 })}
</svg>`;
};

export const collectCards = (readJson, list) => {
  const cards = [];
  for (const file of list('src/content/pages/es-mx')) {
    const page = readJson(`src/content/pages/es-mx/${file}`);
    if (page.view === 'home') continue;
    cards.push({ out: `og/${page.slug}.jpg`, title: page.title, accent: 'YuriApp', subtitle: 'ERP para talleres de hojalatería, pintura y llantas' });
  }
  for (const file of list('src/content/modules/es-mx')) {
    const mod = readJson(`src/content/modules/es-mx/${file}`);
    cards.push({ out: `og/funciones-${mod.slug}.jpg`, title: mod.cardTitle, accent: mod.cardTagline, subtitle: 'YuriApp · ERP para talleres' });
  }
  return cards;
};

const main = async () => {
  const trimmed = await sharp(MASTER).trim({ threshold: 10 }).png().toBuffer();
  for (const [file, size] of Object.entries(iconSizes)) {
    await sharp(trimmed).resize(size, size).png({ compressionLevel: 9 }).toFile(`public/brand/${file}`);
  }
  const logo = await sharp(trimmed).resize(420, 420).png().toBuffer();
  const render = (card, file) =>
    sharp(Buffer.from(buildOgSvg(card))).composite([{ input: logo, left: 110, top: 105 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(file);

  await render({ title: 'El manejo de tu taller', accent: 'al alcance de tu mano', subtitle: 'ERP para hojalatería, pintura y llantas' }, 'public/og-default.jpg');

  mkdirSync('public/og', { recursive: true });
  const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
  for (const card of collectCards(readJson, (dir) => readdirSync(dir).filter((f) => f.endsWith('.json')))) {
    await render(card, `public/${card.out}`);
  }
};

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) await main();
