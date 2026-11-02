# Deploying to Vercel

The site is Astro with the Vercel adapter. Pages are static (prerendered at build); four small functions run on demand: `/api/brief`, `/api/live`, and the 410 responses for old WordPress URLs.

## First deploy

1. Push this repo to GitHub (private is fine).
2. In Vercel, **Add New → Project → Import** the repo. Vercel detects Astro; leave the build settings at their defaults (`npm run build`, output handled by the adapter).
3. **Settings → General → Node.js Version: 22.x or 24.x.** Astro 7 needs Node ≥ 22.23.
4. Deploy. With no environment variables set, the site runs on the bundled seed content. `/admin` explains how to connect the CMS, the brief form falls back to a pre-filled email, and the live badge stays hidden.

`npm run build` first runs `scripts/prepare-media.mjs`, which turns `content/raw/` into responsive WebP files in `public/media/` (about two minutes on a cold build).

## Environment variables

Set these in **Vercel → Settings → Environment Variables** (Production and Preview). They are all optional; see `.env.example`.

| Variable | What it switches on |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` | Content from the CMS, and the editor at `/admin` |
| `SANITY_WRITE_TOKEN` | Reading the private brief inbox setting, and saving brief copies to the CMS |
| `RESEND_API_KEY`, `BRIEF_FROM_EMAIL` | Emailing briefs to the inbox staff set in the CMS |
| `YOUTUBE_API_KEY` | The "live now" badge |
| `PUBLIC_SITE_URL` | Canonical URLs and the sitemap (defaults to `https://fbf.studio`) |

Redeploy after changing variables.

## Rebuilding when staff publish

Pages are static, so a CMS change appears after the next build. Connect the two once:

1. Vercel → **Settings → Git → Deploy Hooks**: create a hook named `sanity` on the production branch and copy its URL.
2. sanity.io/manage → your project → **API → Webhooks → Create**: paste the URL, trigger on create/update/delete, filter `!(_id in path("drafts.**")) && _type != "briefSubmission"`.

A publish then rebuilds the site, which takes about a minute.

## Domain

Vercel → **Settings → Domains → Add** `fbf.studio` and `www.fbf.studio`, then follow the DNS records Vercel shows. Keep the old WordPress host running until DNS has switched.

## Old URLs

| Old | New | How |
|---|---|---|
| `/works/`, `/category/work/` | `/work` | 301 (`src/lib/redirects.mjs`) |
| `/sample-page/`, `/welcome/` | `/` | 301 |
| `/work/{slug}/` | `/work/{slug}` | 308 (trailing-slash strip; permanent, treated like a 301 by search engines) |
| `/feed`, `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php` | — | 410 Gone (`src/lib/gone.ts`) |

URLs with a trailing slash take two hops (`/works/` → `/works` → `/work`). Both are permanent.

## Plan note

Vercel's Hobby plan is for non-commercial use. It's fine for the preview; the live studio site should be on Pro.

## Docker / Dokploy (not used for now)

The original brief asked for a Docker static build for Dokploy. With Vercel chosen for now it isn't set up. Switching later means replacing `@astrojs/vercel` with `@astrojs/node` (for the two API routes) and adding a Dockerfile.
