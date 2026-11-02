# Open questions

Gaps found during the inventory. Nothing below has been invented in the docs or mocks. Each item needs an answer from the studio.

## Decisions needed now
1. ~~**Design direction**~~ **Decided:** A, Lightbox. To be revisited after the studio's feedback.
2. ~~**Stack**~~ **Decided (2026-11-02):** staff will edit content themselves. Astro + TS + Tailwind, with a login-protected CMS. Proposed: Sanity, with the editing Studio embedded at `/admin`.
3. ~~**Brief-builder endpoint**~~ **Decided:** the destination is a setting staff edit in the CMS (recipient inbox, plus an option to keep a copy of each brief in the CMS). Still needed: which inbox to use by default, and a sending service (e.g. Resend) verified for fbf.studio.
4. ~~**Preview host**~~ **Decided:** deploy the preview on Vercel. The Dockerfile/Dokploy path is deferred. Still needed: the Vercel account or team to deploy under.

## Content & facts
5. **Hero headline:** the current site's "We are …" rotating words are injected by JS and weren't captured. What were they, and should we keep them?
6. **Team:** the About page lists 11 people from 2021. Who is current? New photos are needed (the current ones are 500×500 and inconsistent).
7. **Case-study structure:** the new template wants problem → approach → process frames → result. The current site has only one paragraph per project, with **no results or metrics**. Can the studio supply outcomes (views, reach, event size, client quotes) for at least 4–6 flagship projects?
8. **Duplicate video:** *Startup Ethiopia* and *Mindset* both embed YouTube `pbWoaJusCGo`. Which project is that video, and what's the correct ID for the other?
9. **Client name typo:** the Mindset case study says "Midset Consult". Confirm it should be "Mindset Consult".
10. **Service tags:** the Animation / Production / Live tags in the content inventory are my inference. Which projects included live streaming? (5th PE and Startup Ethiopia say so explicitly. What about AHIF and Tana Forum?)
11. **"More Services":** the old home page links to a services page that doesn't exist. What other services exist beyond Animation, Content Production and Live Streaming (e.g. 3D, sound design, social media management, event production)?
12. **Newer work:** everything on the site dates from 2019–2021. Is there newer work (2022–2026) to add?

## Client logos
13. Only **16** logos exist (numbering skips 12 and 14). Were two logos removed on purpose?
14. `06.-Mindset-Consult.png` shows an Ethiopic wordmark with "Sol", not "Mindset". Is it the right logo?
15. `18-tom.png` ("tom") is unidentified. Who is this client? *It is hidden from the client wall until named.*
16. **African Union, Africa 24 and DStv** appear on the wall but have no case study. What work was done for them? The animated client wall's hover cards need a project name and link for each logo.
17. Do we have permission to show every logo, especially UN agencies (WFP, UN Women, IFRC), whose brand guidelines restrict logo use?
18. Vector (SVG) versions of all logos are needed. The current files are 400×300 PNGs with mixed backgrounds.

## Media
19. **Video masters:** all work is YouTube-embedded. The hover-to-play grid, showreel chapters and hero need self-hosted H.264 + WebM loops. Can the studio supply 1080p masters (or 6–10 s loop cuts) per project?
20. **Showreel:** is there a current reel? Chapter markers need start times per project.
21. **Hero sequence:** for Direction A, can the team (Naol / Kidus) draw or render the 72-frame flipbook sequence? The mock is a procedural placeholder. For Direction B, which 10–12 frames should represent the studio?
22. **Process assets:** for the Concept → Design → Execution story and the onion-skin viewer, we need storyboard, animatic and final frames for at least one project. Which project has them archived (Kibir Be'Aryam? Marriage Laws?)?
23. **Studio space photos** for /about.
24. **Captions:** captions (VTT) for the reel are required for WCAG. Who provides the transcripts, and in which languages (English / Amharic)?

## Integrations
25. **Live badge:** confirm the YouTube channel ID (`UCUSZ0mcuSpyWL8AQ2wptZaQ`) and whether streams are also run on other platforms (Facebook Live?). A YouTube Data API key will be needed (server-side, to keep quota and key private).
26. **Map:** embedded map provider preference (static image vs Google/OSM embed). The old site used a screenshot.
27. **Twitter/X handle** `@fbfstudios_`: still active?

## Build & accounts
28. **Vercel account/team** to deploy under, and a GitHub repo to connect (or a `vercel login` on this machine).
29. **Sanity project** (free tier) and the staff to invite as editors.
30. **Resend** (or another sending service) with DNS access to verify `fbf.studio`, so brief emails don't land in spam.
31. **Budget ranges** in the brief form are placeholders in USD (`Under $5k` … `$40k +`). Should they be in ETB, USD, or both? Staff can change them under Site settings.
32. **Featured projects** (home grid and reel playlist) are my pick: Marriage Laws, Smart-face, IFRC, Kibir Be'Aryam, AHIF 2019, Balenjeraye. Staff can change them per project.
