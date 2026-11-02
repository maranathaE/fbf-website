# Changelog

## 2026-11-02: Milestone 1: inventory & design directions
- Crawled fbf.studio (home, about, works and all 21 `/work/*` case studies) into `docs/content-inventory.md`, with structured case-study data in `content/case-studies.raw.json`.
- Downloaded all 168 original media files (21 MB) into `content/raw/`, cataloged in `content/raw/CATALOG.md`.
- Found that the existing logo is a bouncing-ball animation, and extracted brand colors (teal `#50BDAE`, magenta `#F50979`, onion `#CFEBC5`).
- Proposed two visual directions in `docs/design-directions.md`, with interactive hero mocks in `explorations/` (A: Lightbox flipbook, B: Edit Bay film strip).
- Logged 27 content and asset gaps in `docs/open-questions.md`.
- **Paused for direction and stack approval.**

## 2026-11-02: Milestone 2: direction A, stack, tokens, shell
- Direction A ("Lightbox") chosen; stack: Astro 7 + Tailwind 4 + Sanity Studio embedded at `/admin`, deployed on Vercel (replaces the Docker/Dokploy plan for now).
- Design tokens with AA-checked "-ink" variants of the brand colours (`docs/design-tokens.md`); self-hosted Fraunces, Instrument Sans and JetBrains Mono.
- Content layer (`src/lib/content.ts`) reads Sanity when connected and falls back to seed content cleaned from the old site (`src/data/seed/`). Credits re-parsed and hand-fixed; nothing invented.
- Responsive WebP pipeline from `content/raw/` (`scripts/prepare-media.mjs`).
- Layout shell: sticky header with mobile menu, footer, skip link, SEO meta, JSON-LD, sitemap, OG image, 301/308/410 for old WordPress URLs.

## 2026-11-02: Milestone 3: pages and P0
- Pages: home, work, 21 case studies, services, about, contact, 404, `/admin` placeholder.
- P0: 120-frame flipbook hero (`FRAME 012 / 120`), chaptered reel (playlist mode until a reel exists), work grid with hover flips and GSAP Flip filters, pinned Concept→Design→Execution morph drawn from a real frame, five-step brief builder with `/api/brief` (CMS-configured inbox, Resend email, private CMS copy, mailto fallback).

## 2026-11-02: Milestone 4: P1, P2, performance
- P1: onion-skin case-study viewer, client marquee with hover cards, pencil cursor and magnetic buttons, frame-cut View Transitions (320 ms), YouTube live badge (`/api/live`).
- P2: `/playground` draw-a-frame GIF toy, behind-the-scenes timeline, Addis clock with Ethiopian time, Konami / 12-click "pencil test".
- Performance: GSAP and Lenis load only for mouse users; stylesheet inlined; smaller Fraunces file; upright hero accent so the italic font never blocks first paint.
- Local Lighthouse (mobile, simulated slow 4G, compressed static build): Performance 94–99, Accessibility 100, Best Practices 96 (the only failure is the 404 from `/api/live`, which runs only on Vercel), SEO 100. LCP 1.9–2.5 s on most pages, but 2.9 s on `/work`, where the first card image is the LCP. That needs re-measuring on the real Vercel preview.
- Docs: `README.md`, `docs/walkthrough.md`, `docs/deploy.md`, `docs/cms.md`, `docs/design-tokens.md`; `npm run seed:export` for the Sanity starter import.
