import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Img } from './types';

export const projectId: string | undefined = import.meta.env.PUBLIC_SANITY_PROJECT_ID || undefined;
export const dataset: string = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2026-10-01';

export const cmsConnected = Boolean(projectId);

/** Read client for published content. Null until a Sanity project is configured. */
export const sanity: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'published' })
  : null;

/** Server-only client that can read private documents and write brief submissions. */
export function writeClient(): SanityClient | null {
  const token = import.meta.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token, perspective: 'published' });
}

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

/** The GROQ projection every image field is fetched with. */
export const IMAGE = `{alt, crop, hotspot, asset->{_id, url, metadata{lqip, dimensions{width, height}}}}`;

export type SanityImage = {
  alt?: string;
  crop?: unknown;
  hotspot?: unknown;
  asset?: { _id: string; url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
};

export function sanityImg(image: SanityImage | null | undefined, fallbackAlt = ''): Img | undefined {
  if (!builder || !image?.asset) return undefined;
  const { width = 1600, height = 900 } = image.asset.metadata?.dimensions ?? {};
  const widths = [...new Set([480, 960, 1600].filter((w) => w < width).concat(Math.min(width, 1920)))];
  const url = (w: number) => builder.image(image).width(w).fit('max').auto('format').quality(75).url();
  return {
    src: url(widths.find((w) => w >= 960) ?? widths.at(-1)!),
    srcset: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width,
    height,
    alt: image.alt ?? fallbackAlt,
    lqip: image.asset.metadata?.lqip,
  };
}
