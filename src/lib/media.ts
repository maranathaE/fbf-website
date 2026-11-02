import manifest from '../data/media-manifest.json';
import type { Img } from './types';

type Entry = { width: number; height: number; widths: number[]; lqip?: string };
const media = manifest as Record<string, Entry>;

/** A seed image: a path inside content/raw/, processed by scripts/prepare-media.mjs. */
export function seedImg(path: string, alt: string): Img {
  const entry = media[path];
  if (!entry) throw new Error(`media: ${path} is missing from src/data/media-manifest.json (run npm run media)`);
  const base = '/media/' + path.replace(/\.(jpe?g|png)$/i, '');
  const largest = entry.widths.at(-1)!;
  const fallback = entry.widths.find((w) => w >= 960) ?? largest;
  return {
    src: `${base}-${fallback}.webp`,
    srcset: entry.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    width: entry.width,
    height: entry.height,
    alt,
    lqip: entry.lqip,
  };
}
