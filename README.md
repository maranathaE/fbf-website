# fbf.studio redesign

Redesign of the Frame by Frame Studio website (Addis Ababa).

**Status:** milestone 1, inventory and design directions. Waiting for direction and stack approval before any build.

| Path | What |
|---|---|
| `docs/content-inventory.md` | Every page, copy block, case study, client logo, contact detail and redirect from the live site |
| `docs/design-directions.md` | Two visual directions (palette, type, motion, hero concept) |
| `docs/open-questions.md` | Content and asset gaps for the studio to answer |
| `docs/CHANGELOG.md` | Running log per milestone |
| `content/raw/` | Original media downloaded from the old site, with `CATALOG.md` |
| `content/case-studies.raw.json` | Structured data for all 21 case studies |
| `explorations/` | Static, interactive hero mocks for each direction |

## Viewing the hero mocks

The mocks load stills from `content/raw/`, so serve the repo root rather than opening the files directly:

```bash
python -m http.server 4321
```

Then open http://localhost:4321/explorations/a-lightbox.html and http://localhost:4321/explorations/b-edit-bay.html.

Setup, development, build and Dokploy deploy instructions will be added once the stack is confirmed.
