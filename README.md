# fbf.studio

The website for Frame by Frame Studio, a creative studio in Addis Ababa. Built with Astro 7, Tailwind 4 and Sanity (editor at `/admin`), and deployed on Vercel.

Design direction A, "Lightbox": the site is an animator's desk, with paper, pencil, onion skins and motion on twos.

## Run it locally

Needs **Node 22.23 or newer**.

```bash
npm install
npm run dev
```

Open http://localhost:4321. The first run takes about two minutes longer while it turns `content/raw/` into responsive images in `public/media/`; after that it is instant.

Without a `.env`, everything runs on the built-in seed content. Copy `.env.example` to `.env` to connect the CMS, email and the live badge.

| Command | What it does |
|---|---|
| `npm run dev` | Media variants (if missing), then the dev server |
| `npm run build` | Media variants, then production build into `.vercel/output` |
| `npm run check` | Type-check |
| `npm run media` | Rebuild `public/media/` from `content/raw/` |
| `npm run seed:export` | Write `content/seed.ndjson` for importing the starter content into Sanity |

## Where things are

| Path | What |
|---|---|
| `src/pages/` | Routes: `/`, `/work`, `/work/[slug]`, `/services`, `/about`, `/contact`, `/playground`, `/api/*` |
| `src/components/` | Page sections, by area (`home/`, `work/`, `contact/`, `about/`) |
| `src/motion/` | Every interaction: `flipbook.ts`, `cursor.ts`, `magnetic.ts`, `reel.ts`, `work-grid.ts`, `morph.ts`, `onion.ts`, `brief.ts`, `gif-toy.ts`, `pencil-test.ts` |
| `src/lib/content.ts` | The one place pages get content from (Sanity, else seed) |
| `src/data/seed/` | Starter content cleaned from the old site |
| `sanity/` + `sanity.config.ts` | CMS schema and editor layout |
| `src/styles/` | Design tokens (`global.css`) and site-wide motion (`motion.css`) |
| `content/raw/` | Original media from the old site, with `CATALOG.md` |
| `explorations/` | The two hero mocks from the direction round |

## Docs

- [Feature walkthrough](docs/walkthrough.md): every P0/P1/P2 feature, and how to try it
- [Deploying to Vercel](docs/deploy.md): setup, environment variables, redirects, domain
- [The content editor](docs/cms.md): Sanity setup, starter-content import, brief emails
- [Design tokens](docs/design-tokens.md): colour (with contrast ratios), type, motion
- [Open questions](docs/open-questions.md): what the studio still needs to supply
- [Content inventory](docs/content-inventory.md), [design directions](docs/design-directions.md), [changelog](docs/CHANGELOG.md)
