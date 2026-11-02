// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';
import { legacyRedirects } from './src/lib/redirects.mjs';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';

/**
 * The CMS editor lives at /admin. Until a Sanity project is connected,
 * /admin explains how to connect one instead of failing the build.
 * @type {import('astro').AstroIntegration}
 */
const adminPlaceholder = {
  name: 'fbf-admin-placeholder',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({ pattern: '/admin', entrypoint: './src/fallback/admin.astro', prerender: true });
    },
  },
};

export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://fbf.studio',
  output: 'static',
  adapter: vercel({ imageService: false }),
  trailingSlash: 'never',
  redirects: legacyRedirects,
  // One less round trip before first paint: the whole stylesheet is ~9 KB compressed.
  build: { inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    ...(projectId
      ? [
          sanity({ projectId, dataset, useCdn: false, apiVersion: '2026-10-01', studioBasePath: '/admin' }),
          react(),
        ]
      : [adminPlaceholder]),
    sitemap({ filter: (page) => !page.includes('/admin') && !page.includes('/playground') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
