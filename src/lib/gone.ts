import type { APIRoute } from 'astro';

/** 410 Gone for old WordPress endpoints, so search engines drop them instead of retrying. */
export const gone: APIRoute = () =>
  new Response('Gone. This was part of the old WordPress site.\n', {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, s-maxage=86400' },
  });
