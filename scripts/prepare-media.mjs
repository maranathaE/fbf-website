// Turns the originals in content/raw/ into responsive WebP variants under public/media/
// and writes src/data/media-manifest.json (dimensions, variant widths, tiny blur placeholder).
// Runs before every build; files that already exist are skipped, so it is fast after the first run.
import { mkdir, readdir, stat, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const RAW = path.join(root, 'content/raw');
const OUT = path.join(root, 'public/media');
const MANIFEST = path.join(root, 'src/data/media-manifest.json');
const WIDTHS = [480, 960, 1600];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) yield p;
  }
}

const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
const manifest = {};
let made = 0;

for await (const file of walk(RAW)) {
  const rel = path.relative(RAW, file).replaceAll('\\', '/');
  const base = rel.replace(/\.(jpe?g|png)$/i, '');
  const { mtimeMs } = await stat(file);
  const meta = await sharp(file).metadata();
  const w = meta.autoOrient?.width ?? meta.width;
  const h = meta.autoOrient?.height ?? meta.height;
  const widths = [...new Set([...WIDTHS.filter((x) => x < w), Math.min(w, 1920)])].sort((a, b) => a - b);

  await mkdir(path.join(OUT, path.dirname(rel)), { recursive: true });
  for (const width of widths) {
    const out = path.join(OUT, `${base}-${width}.webp`);
    if (existsSync(out) && previous[rel]?.mtime === mtimeMs) continue;
    await sharp(file).rotate().resize({ width }).webp({ quality: 74, effort: 5 }).toFile(out);
    made++;
  }

  const lqip =
    previous[rel]?.mtime === mtimeMs && previous[rel]?.lqip
      ? previous[rel].lqip
      : 'data:image/webp;base64,' +
        (await sharp(file).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()).toString('base64');

  manifest[rel] = { width: w, height: h, widths, lqip, mtime: mtimeMs };
}

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
console.log(`media: ${Object.keys(manifest).length} originals, ${made} variants written`);
