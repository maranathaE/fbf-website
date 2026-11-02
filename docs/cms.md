# The content editor (Sanity)

Staff edit the site at **fbf.studio/admin**. It's Sanity Studio, embedded in the site. People sign in with their email or a Google account; only invited people can edit.

## What staff can edit

| In the editor | Shows up on |
|---|---|
| **Projects**: title, client, services, format, year, description, optional brief / approach / result, YouTube ID, optional hover loop video, cover, frames, credits, "featured" | `/work`, `/work/{slug}`, home grid, reel playlist |
| **Clients**: name, logo, "show on the client wall" | Home client marquee, project credits |
| **Team**: name, nickname, role, photo, bio, "currently at the studio", order | `/about` |
| **Services**: title, summary, body, formats, illustration | `/services`, home |
| **Timeline**: date, title, text, image, linked project | `/about` behind-the-scenes timeline |
| **Site settings**: hero title, intros, process stages and example project, showreel (YouTube ID + chapters), contact details, socials, YouTube channel and live badge, brief-form budget and timeline options, thank-you message | Everywhere |
| **Brief inbox**: where briefs are emailed, whether to keep a copy in the editor, email subject prefix | `/api/brief` |
| **Briefs received**: read-only copies of every brief | Staff only |

Empty fields fall back to the starter content, so a half-filled editor never breaks a page.

**Privacy:** the brief inbox setting and the received briefs use private document IDs (`secrets.…`, `briefs.…`). Sanity never serves those from its public API; only logged-in staff and the site's server (with `SANITY_WRITE_TOKEN`) can read them.

## One-time setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage), with a dataset called `production`.
2. In Vercel, set `PUBLIC_SANITY_PROJECT_ID` (and `PUBLIC_SANITY_DATASET=production`), then redeploy.
3. In sanity.io/manage → **API → CORS origins**, add `https://fbf.studio`, your Vercel preview URL and `http://localhost:4322`, each **with credentials allowed**.
4. Import the starter content, with all 21 projects, the team, logos and copy:

   ```bash
   npm run seed:export
   npx sanity dataset import content/seed.ndjson production
   ```

   This uploads the images from `content/raw/` too. Run it from a machine that has the repo; `content/seed.ndjson` is generated and not committed.
5. Create a token: **API → Tokens → Add**, with Editor permissions. Set it as `SANITY_WRITE_TOKEN` in Vercel.
6. Invite staff: **Members → Invite**. The Editor role is enough for content; keep Administrator for one or two people.
7. Set up the rebuild webhook (see `docs/deploy.md`).

## Brief emails

1. Create a [Resend](https://resend.com) account and verify the `fbf.studio` domain (Resend shows the DNS records to add).
2. Set `RESEND_API_KEY` and `BRIEF_FROM_EMAIL` (e.g. `Frame by Frame <briefs@fbf.studio>`) in Vercel.
3. In the editor, open **Brief inbox** and list the addresses that should get briefs.

The reply-to on each email is the person who sent the brief, so staff can just hit reply. If email isn't set up but the CMS is, briefs are still saved under **Briefs received**. If neither works, the form offers the visitor a pre-filled email instead, so no brief is lost.
