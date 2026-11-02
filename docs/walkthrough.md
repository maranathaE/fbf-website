# Feature walkthrough

Where each feature from the brief lives, how to try it, and what is still a placeholder.

## P0

**Flipbook hero** (`/`, `src/components/home/Hero.astro`, `src/motion/flipbook.ts`)
The logo's bouncing ball, 120 pencil drawings at 12 fps with the counter `FRAME 012 / 120`. Frames 1–48 play once on load; scrolling flips frames 49–120, where the ball leaps into the logo pose, the magenta line draws and the wordmark writes on. You can also drag across the sheet, use ← → / PgUp / PgDn / Home / End (it's a focusable slider), or click the dope sheet. Onion skins show the last two drawings in blue and the next in magenta, and idle lines "boil". *Placeholder:* the drawings are procedural; the team can replace them with a hand-drawn sequence (open question 21).

**Showreel with chapter markers** (`/#reel`, `Reel.astro`, `src/motion/reel.ts`)
Click to load (no YouTube requests before that). Chapters sit in a strip under the screen, each with a progress bar. *Today* there's no reel, so it runs in playlist mode: each chapter is a featured project's film, played back to back. Once the studio uploads a reel and enters its chapter timestamps under **Site settings → Showreel**, it switches to one video with seek-to-chapter.

**Work grid** (`/work`, `WorkGrid.astro`, `src/motion/work-grid.ts`)
Hover a card (or tab to it): it flips through that project's real stills at 12 fps with a frame counter. If a project has a hover-loop video in the CMS, that plays instead. On touch, loops play when the card is on screen. Filter chips (All / Animation / Production / Live) reflow the grid with GSAP Flip in stepped motion, keep the filter in the URL (`/work?service=live`), and announce the result count to screen readers.

**Concept → Design → Execution** (`/`, `ProcessMorph.astro`, `src/motion/morph.ts`)
A pinned section. One real frame (Marriage Laws in Africa, set in the CMS) is redrawn in the browser as a graphite sketch (edge detection), then as flat colour with ink lines (6-colour k-means), then shown as the final frame. Scrolling wipes between stages in 8 held steps with a ragged pencil edge, and the matching stage text lights up. With reduced motion, the three stages sit side by side.

**Brief builder** (`/contact`, `BriefBuilder.astro`, `src/motion/brief.ts`, `/api/brief`)
Five frames: what you need → scope → the story → about you → review. Each step is checked, with an error summary that links to the field, and focus moves to each step's heading. The draft is saved in the visitor's browser until sent. It's sent to the inbox staff set in the CMS (email via Resend, and/or a copy in the CMS). If nothing is configured yet, as on the first preview, the visitor gets a pre-filled email instead. Without JavaScript it's a single form that still submits. Spam is caught by a honeypot field and a minimum fill time.

## P1

**Onion-skin case-study viewer** (`/work/{slug}`, `OnionViewer.astro`, `src/motion/onion.ts`)
Step, scrub, play (2 frames a second) or pick a thumbnail. "Onion skins" ghosts the previous frame in blue and the next in magenta over the current one, like a lightbox. Arrow keys work when the stage is focused.

**Client marquee with hover cards** (`/`, `ClientMarquee.astro`)
Two rows drifting opposite ways, pausing on hover or focus. Logos with projects are buttons; their card lists the work, with links. Logo 18 ("tom") stays hidden until identified (open question 15). With reduced motion it's a static wall.

**Custom cursor and magnetic buttons** (`src/motion/cursor.ts`, `src/motion/magnetic.ts`)
Mouse only, and off with reduced motion. A pencil ring trails the pointer at 24 fps and grows on links, showing "View", "Play" or "Drag" labels. Primary buttons lean toward the pointer and spring back. The system cursor stays visible.

**Frame-cut page transitions** (`src/styles/motion.css`)
Native View Transitions: the old page lifts off the pegs in four drawings (320 ms) while the header stays put. Browsers without support just navigate normally.

**YouTube live badge** (header, `LiveBadge.astro`, `/api/live`)
A red tally light that appears only while the channel is streaming, linking to the stream. Add `?live=demo` to any URL to see it. It needs `YOUTUBE_API_KEY`; responses are cached for a minute, at about 2,900 quota units a day.

## P2

**Draw-a-frame GIF toy** (`/playground`, `src/motion/gif-toy.ts`)
Eight sheets, four pencils, an eraser, an onion skin of the previous drawing, copy-previous, play on twos, and **Download GIF** (encoded in the browser with gifenc). Keys: `,` and `.`.

**Behind-the-scenes timeline** (`/about`, `Timeline.astro`)
An exposure-sheet layout, one column per moment, scrolling sideways. *Seeded* only with dated facts from the old site (AHIF 2019, Tana Forum 2019, site launch 2021); staff add more under **Timeline**.

**Addis ambient clock** (footer and `/contact`, `AddisClock.astro`)
The studio's local time in both the 24-hour clock and Ethiopian time (hours counted from 6 am), with "studio open / closed" worked out from the hours in Site settings. The second hand ticks on twos.

**Pencil-test easter egg** (`src/motion/pencil-test.ts`)
Type the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) or click the bouncing-ball logo 12 times (on the home page). The site turns into a graphite pencil test, with grey roughs, boiling lines and peg holes. Press Esc to "ink" it back.

## Also

- `/admin`: the CMS editor, or setup instructions until Sanity is connected.
- `/404`: "This frame never got drawn."
- Accessibility: skip link, visible focus rings, landmarks, labelled controls, live regions for dynamic changes, and full reduced-motion support.
