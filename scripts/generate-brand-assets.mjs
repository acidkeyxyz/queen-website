import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const MASTER = 'src/assets/brand/yuriapp-logo-master.png';
export const iconSizes = { 'favicon-32.png': 32, 'icon-96.png': 96, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 };

export const buildOgSvg = ({ lines }) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="g" cx="0.3" cy="0.5" r="0.9"><stop offset="0" stop-color="#3b38ad"/><stop offset="1" stop-color="#18176a"/></radialGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<text x="600" y="270" font-family="Helvetica, Arial, sans-serif" font-size="58" font-weight="700" fill="#f7f6ff">${lines[0]}</text>
<text x="600" y="340" font-family="Helvetica, Arial, sans-serif" font-size="58" font-weight="700" fill="#e2ab69">${lines[1]}</text>
<text x="600" y="440" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#d4d3f3">${lines[2]}</text>
</svg>`;

const main = async () => {
  const trimmed = await sharp(MASTER).trim({ threshold: 10 }).png().toBuffer();
  for (const [file, size] of Object.entries(iconSizes)) {
    await sharp(trimmed).resize(size, size).png({ compressionLevel: 9 }).toFile(`public/brand/${file}`);
  }
  const business = JSON.parse(readFileSync('src/content/business.json', 'utf8'));
  const svg = buildOgSvg({ lines: ['Cada auto del taller,', 'del presupuesto a la entrega', `${business.name} · Hojalatería, pintura y llantas`] });
  const logo = await sharp(trimmed).resize(420, 420).png().toBuffer();
  await sharp(Buffer.from(svg)).composite([{ input: logo, left: 110, top: 105 }]).jpeg({ quality: 88 }).toFile('public/og-default.jpg');
};

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) await main();
