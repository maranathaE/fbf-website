# Design directions

Two directions, each with a clickable hero mock in `/explorations/`. Open them straight from disk; no build is needed.

## Brand anchor (from the existing logo)

The current logo (`FBF-Logo-Animaion-2.0-Mod.gif`, 20 frames at 40 ms) is itself an animation exercise. A **teal ball bounces** with squash and stretch and a pale **onion-skin ghost** trailing it, over a **magenta ground line**, beside a stacked, bold, lowercase **"frame / by / frame"** wordmark. Both directions keep the logo and its colors:

| Brand token | Hex | Where in the logo |
|---|---|---|
| `fbf-teal` | `#50BDAE` | the ball |
| `fbf-magenta` | `#F50979` | the ground line |
| `fbf-onion` | `#CFEBC5` | onion-skin ghost |
| `fbf-ink` | `#060606` | wordmark |

The logo should be rebuilt as SVG + GSAP (or Lottie), replacing the 514 KB GIF. That alone saves half a megabyte on every page.

Both directions share some fixed points:
- The site has to prove motion within 3 seconds and then step aside for the work.
- Ethiopic script support (Noto Sans Ethiopic) so titles like *Addis Sew Negn / አዲስ ሰው ነኝ* and *Kibir Be'Aryam* can be set properly.
- A monospace "frame counter" voice for small UI labels (frames, timecode, credits).
- Reduced motion: the hero shows a static key frame and the counter stays visible.

---

## A. Lightbox: the animator's desk

**Idea:** the site is a sheet of animation paper on a lightbox. Pencils, peg holes, onion skins, the dope sheet. It's handmade, warm and a little imperfect, much like the studio's own voice ("we do all our works with love").

**Palette**
| Token | Hex | Use |
|---|---|---|
| `paper` | `#F2EDE3` | page background (animation bond) |
| `paper-shade` | `#E6DFD1` | cards, lightbox glow edge |
| `graphite` | `#1D1B18` | text, clean line |
| `fbf-teal` | `#50BDAE` | the ball, primary accent, links |
| `fbf-magenta` | `#F50979` | ground line, CTAs, "key" frame markers |
| `fbf-onion` | `#CFEBC5` | onion skins, hover washes |
| `col-blue` | `#3D63DD` | rough-sketch layer only (Col-Erase blue pencil) |
| `ochre` | `#E3A33B` | rare highlight (*Marriage Laws* palette, Meskel daisies) |
| Dark mode | graphite `#16130F` paper, lightbox glow `#FFF6E2` at 6% | "lights off" lightbox |

**Type pairing**
- Display: **Fraunces** (variable; uses the `SOFT` and `WONK` axes, which can be animated so headlines "boil")
- Text/UI: **Instrument Sans**
- Labels: **JetBrains Mono** (frame numbers, credits)

**Motion personality: "on twos".** Motion is stepped at 12 fps (`steps()` and GSAP `SteppedEase`) rather than buttery tweening. Lines boil slightly through 3 alternating SVG turbulence seeds. Elements arrive with squash and stretch, and key poses hold for a beat. Blue roughs appear first, then graphite cleans up over them, so every reveal replays the Concept → Design → Execution story in small.

**Hero concept: "The first exercise."** The logo's own bouncing ball, drawn in pencil (the first thing every animator learns), bounces across a sheet pinned to a peg bar. Scroll or drag scrubs it frame by frame, and the two previous frames show as blue onion skins. The ball's last bounce squashes into the "o" of *Frame by Frame*. The `FRAME 012 / 048` dope-sheet counter sits bottom-right. In production the procedural ball is replaced by a real hand-drawn sequence from Naol and the team, rendered as a WebP sprite sheet.

**Strengths:** it's unmistakably *animation*, warm and human, and very different from typical dark agency sites. The Concept → Design → Execution scroll story, the onion-skin viewer and the draw-a-frame toy all grow naturally from this world.
**Risks:** it leans toward animation, so Live Streaming and Production work must not feel bolted on. That's handled by giving their case studies a "contact sheet" treatment.

Mock: [`explorations/a-lightbox.html`](../explorations/a-lightbox.html)

---

## B. Edit Bay: film strip & broadcast

**Idea:** the site is the studio's edit suite and control room. A film strip runs through a projector gate, SMPTE timecode ticks, and a tally light glows when they're live. It's cinematic and confident, and it puts the client work first: the hero is literally built from their frames.

**Palette**
| Token | Hex | Use |
|---|---|---|
| `bay` | `#0F0F11` | background |
| `bay-raised` | `#1A1A1E` | panels, strip base |
| `leader` | `#EDE6D6` | text, film-leader cream |
| `fbf-teal` | `#50BDAE` | primary accent, focus rings, playhead |
| `fbf-magenta` | `#F50979` | chapter markers, cuts, CTAs |
| `meskel` | `#F6B800` | rare highlight (Meskel daisy / *adey abeba* yellow) |
| `tally` | `#FF3B30` | "Live" only: reserved, never decorative |
| Light mode | leader `#EDE6D6` background, bay text | for long-read pages (About, case-study text) |

**Type pairing**
- Display: **Archivo** (variable width 62–125; headings widen and narrow on scroll like a frame stretching)
- Text/UI: **Archivo** at normal width (one family with two personalities)
- Labels: **JetBrains Mono** (timecode `00:00:12:07`, frame counters, credits)

**Motion personality: "24p, cut on action."** Moves are fast and decisive with expo-out easing, and hard cuts are preferred to fades. Interactions snap to frames (the strip clicks from sprocket to sprocket). Lenis gives smooth scroll, but content lands on whole frames. Sound-design cues (optional, off by default) would be shutter clicks.

**Hero concept: "The gate."** A vertical 35 mm film strip made of real stills from the work (WFP, UN Women, IFRC, Balenjeraye, Kibir Be'Aryam…) runs through a projector gate in the center of the screen. Scroll, drag or swipe advances it frame by frame. The frame in the gate is shown large, with its project name and client burned in like a slate. Timecode and `FRAME 03 / 12` tick in the corner. Clicking the gate frame opens that case study. Real video chunks can replace the stills later.

**Strengths:** the work is visible from second one, all three services (animation, production and live) fit naturally, and the "Live now" tally badge feels native. It carries the most weight with institutional clients such as WFP, UN Women and AU.
**Risks:** dark cinematic portfolios are common, so it needs the Addis colour notes and Ethiopic type to stay distinct. It also depends on good source frames; some 2019-era stills are soft.

Mock: [`explorations/b-edit-bay.html`](../explorations/b-edit-bay.html)

---

## Recommendation

**A (Lightbox)** is more ownable and tells the "frame by frame" story better. **B (Edit Bay)** puts the client work forward faster. A hybrid also works: A's paper and lightbox world for the brand and process sections, with B's film-strip gate reused as the showreel and work browser. The pick is yours.
