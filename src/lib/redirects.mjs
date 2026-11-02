// 301s from the old WordPress site (see docs/content-inventory.md §7).
// Case-study slugs are kept 1:1, so /work/{slug}/ only loses its trailing slash.
// /feed, /wp-admin and /wp-login.php answer 410 from src/pages (see src/lib/gone.ts).

/** @type {Record<string, { status: 301; destination: string }>} */
export const legacyRedirects = {
  '/works': { status: 301, destination: '/work' },
  '/category/work': { status: 301, destination: '/work' },
  '/sample-page': { status: 301, destination: '/' },
  '/welcome': { status: 301, destination: '/' },
};
