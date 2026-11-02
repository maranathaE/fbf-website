// One-off: draws public/og.png (1200×630), the default social share image.
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const still = await sharp(path.join(root, 'content/raw/2021/07/01-23.jpg')).resize(640, 470, { fit: 'cover' }).png().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f2ede3"/>
  <rect x="500" y="60" width="664" height="510" rx="10" fill="#fbf8f1"/>
  <circle cx="160" cy="300" r="72" fill="#50bdae"/>
  <ellipse cx="160" cy="300" rx="72" ry="72" fill="none" stroke="#1d1b18" stroke-width="4"/>
  <rect x="70" y="380" width="180" height="12" fill="#f50979"/>
  <text x="70" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="#1d1b18">frame by frame</text>
  <text x="70" y="515" font-family="Courier New, monospace" font-size="22" fill="#5b554c">Creative studio · Addis Ababa</text>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: still, left: 512, top: 80 }]).png({ compressionLevel: 9 }).toFile(path.join(root, 'public/og.png'));
console.log('public/og.png written');
