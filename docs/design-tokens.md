# Design tokens: Direction A, "Lightbox"

Defined once in `src/styles/global.css` (`:root` and the dark-mode override), and exposed to Tailwind through `@theme`, e.g. `bg-paper` and `text-magenta-ink`.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#F2EDE3` | `#16130F` | Page background, with a faint paper-tooth noise |
| `sheet` | `#FBF8F1` | `#2A251E` | Cards and "sheets" on the lightbox |
| `ink` | `#1D1B18` | `#F2EDE3` | Body text |
| `ink-soft` | `#5B554C` | `#A79F92` | Secondary text |
| `teal` | `#50BDAE` | same | Brand ball, decoration only |
| `teal-ink` | `#1C7468` | `#50BDAE` | Teal **text** |
| `magenta` | `#F50979` | same | Brand line, decoration only |
| `magenta-ink` | `#C80063` | `#FF4D9D` | Primary buttons and magenta **text** |
| `onion` | `#CFEBC5` | same | Onion-skin fills, text selection |
| `pencil` | `#3D63DD` | `#7D98F0` | Focus rings, construction lines, "previous" onion skin |
| `tally` | `#E5322B` | same | Live badge only |

### Contrast (WCAG 2.2 AA)

| Pair | Ratio | Passes |
|---|---|---|
| ink on paper | 14.7 | AAA |
| ink-soft on paper | 6.3 | AA |
| teal-ink on paper | 4.8 | AA |
| magenta-ink on paper | 4.95 | AA |
| white on magenta-ink (buttons) | 5.8 | AA |
| raw teal on paper | 1.95 | ✗: decoration only |
| raw magenta, white text on it | 4.0 | ✗ for small text: hence `magenta-ink` |
| dark: ink on paper | 15.9 | AAA |
| dark: magenta-ink on paper | 6.0 | AA |

## Type

| Role | Face | Notes |
|---|---|---|
| Display (`font-display`) | Fraunces Variable, weight axis | Headlines, margin notes. 36 KB, preloaded |
| Text (`font-sans`) | Instrument Sans Variable | Body and UI. 30 KB, preloaded |
| Mono (`font-mono`) | JetBrains Mono Variable | Frame counters, timecodes, labels |

Sizes: `text-display` = clamp(2.5rem, 6.2vw, 5.75rem), `text-title` = clamp(2rem, 4vw, 3.5rem), `text-lede` = clamp(1rem, 1.35vw, 1.1875rem). All fonts are self-hosted, with no Google Fonts requests.

## Motion

- **On twos:** UI transitions use `steps()` easing, so movement reads as held drawings rather than tweens. The base unit is one drawing at 12 fps, 83 ms.
- **Line boil:** three SVG turbulence filters (`#boil-0..2`) cycled at 8 fps for "alive" pencil lines.
- **Page transitions:** native cross-document View Transitions. The old page lifts off the pegs in 4 steps (320 ms).
- **Reduced motion:** every animation stops. The hero shows its final frame, the morph shows all three stages side by side, the marquee becomes a static wall, and smooth scrolling and the cursor are off.
