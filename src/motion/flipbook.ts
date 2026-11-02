// The hero flipbook: the logo's bouncing ball, drawn in pencil, 120 frames on twos (12 fps).
// Act 1 (frames 1–48) plays itself on load. Act 2 (49–120) is scrubbed by scroll, drag or the
// arrow keys: the ball leaps into the logo pose, the magenta line draws, the wordmark writes on.
// Onion skins show the two previous drawings (blue) and the next one (magenta), as on a lightbox.
// The sequence is procedural for now; a hand-drawn sequence can replace `frames` later (open-questions #21).
import { clamp, pad, reducedMotion } from './lifecycle';

type Frame = { x: number; y: number; sx: number; sy: number; line?: number; word?: number };

export const FPS = 12;
const G = 0.8; // ground line, as a fraction of canvas height
const R = 0.075; // ball radius unit
const X1 = 0.3; // where act 1 settles
const X2 = 0.56; // where the logo pose lands

/** Builds the 120 drawings. Exported so tests or other views can reuse the timing. */
export function buildSequence() {
  const frames: Frame[] = [];

  // Act 1: drop in from the left and settle, 48 drawings.
  {
    const hs = [0.62, 0.34, 0.15, 0.05];
    const segs = [{ h: hs[0], d: Math.sqrt(hs[0]), half: true }, ...hs.slice(1).map((h) => ({ h, d: 2 * Math.sqrt(h), half: false }))];
    const total = segs.reduce((a, s) => a + s.d, 0);
    const contacts: number[] = [];
    let acc = 0;
    for (const s of segs) contacts.push((acc += s.d));
    const yAt = (T: number) => {
      let t = T;
      for (const s of segs) {
        if (t <= s.d) {
          const u = t / s.d;
          return s.half ? G - s.h * (1 - u * u) : G - 4 * s.h * u * (1 - u);
        }
        t -= s.d;
      }
      return G;
    };
    const n = 43;
    const dt = total / n;
    for (let f = 0; f <= n; f++) {
      const T = (f / n) * total;
      const x = 0.07 + (X1 - 0.07) * Math.min(1, T / total);
      const hit = contacts.findIndex((c) => Math.abs(T - c) < dt / 2);
      if (hit >= 0) {
        const k = [0.55, 0.65, 0.78, 0.9][hit];
        frames.push({ x, y: G, sx: 1 / k, sy: k });
        continue;
      }
      const v = Math.abs(yAt(Math.min(total, T + dt)) - yAt(Math.max(0, T - dt))) / (2 * dt);
      const s = Math.min(1.32, 1 + v * 0.55);
      frames.push({ x, y: yAt(T), sx: 1 / s, sy: s });
    }
    for (const [sx, sy] of [[1.06, 0.94], [0.97, 1.03], [1, 1], [1, 1]]) frames.push({ x: X1, y: G, sx, sy });
  }
  const intro = frames.length; // 48

  // Act 2: anticipation (6), leap (24), land + line (8), wordmark (16), a little hop (12), hold (6).
  for (const k of [0.92, 0.84, 0.76, 0.7, 0.7, 0.72]) frames.push({ x: X1, y: G, sx: 1 / k, sy: k });
  for (let i = 1; i <= 24; i++) {
    const u = i / 25;
    const s = 1 + Math.abs(1 - 2 * u) * 0.3;
    frames.push({ x: X1 + (X2 - X1) * u, y: G - 4 * 0.5 * u * (1 - u), sx: 1 / s, sy: s });
  }
  const land = [[1.55, 0.55], [1.35, 0.68], [1.18, 0.82], [0.92, 1.1], [0.96, 1.05], [1.02, 0.98], [1, 1], [1, 1]];
  land.forEach(([sx, sy], i) => frames.push({ x: X2, y: G, sx, sy, line: (i + 1) / land.length }));
  for (let i = 0; i < 16; i++) frames.push({ x: X2, y: G, sx: 1, sy: 1, line: 1, word: (i + 1) / 16 });
  for (let i = 1; i <= 9; i++) {
    const u = i / 10;
    const s = 1 + Math.abs(1 - 2 * u) * 0.12;
    frames.push({ x: X2, y: G - 4 * 0.08 * u * (1 - u), sx: 1 / s, sy: s, line: 1, word: 1 });
  }
  for (const [sx, sy] of [[1.2, 0.8], [0.95, 1.05], [1, 1]]) frames.push({ x: X2, y: G, sx, sy, line: 1, word: 1 });
  for (let i = 0; i < 6; i++) frames.push({ x: X2, y: G, sx: 1, sy: 1, line: 1, word: 1 });

  const keys = [0, 12, 26, 38, 44, intro, intro + 6, intro + 18, intro + 30, intro + 38, intro + 54, frames.length - 1];
  return { frames, intro, keys: new Set(keys) };
}

interface Options {
  sheet: HTMLElement;
  canvas: HTMLCanvasElement;
  counter: HTMLElement;
  dope?: HTMLElement;
  /** Tall element whose scroll progress drives act 2. */
  scroller?: HTMLElement;
}

export function createFlipbook({ sheet, canvas, counter, dope, scroller }: Options) {
  const ctx = canvas.getContext('2d')!;
  const { frames, intro, keys } = buildSequence();
  const TOTAL = frames.length;
  const reduce = reducedMotion();
  const styles = getComputedStyle(document.documentElement);
  const css = (n: string) => styles.getPropertyValue(n).trim();
  const colors = () => ({
    ink: css('--ink'),
    teal: css('--teal'),
    magenta: css('--magenta'),
    onion: css('--onion'),
    pencil: css('--pencil'),
  });
  let c = colors();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    c = colors();
    redraw();
  });

  // ---------- pencil rendering ----------
  let W = 0, H = 0;
  const size = () => {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const rand = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
  const rgba = (hex: string, a: number) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const unit = () => Math.min(W, H * 1.6);

  function pencilEllipse(cx: number, cy: number, rx: number, ry: number, seed: number, stroke: string | null, fill: string | null, lw: number) {
    const r = rand(seed * 97 + 13);
    if (fill) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (!stroke) return;
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      const a0 = r() * Math.PI * 2, span = Math.PI * 2 + 0.35, pts = 26;
      for (let i = 0; i <= pts; i++) {
        const a = a0 + (span * i) / pts, j = 1 + (r() - 0.5) * 0.045;
        const x = cx + Math.cos(a) * rx * j, y = cy + Math.sin(a) * ry * j;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw * (pass ? 0.6 : 1);
      ctx.globalAlpha = pass ? 0.55 : 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  function pencilLine(x0: number, y0: number, x1: number, seed: number, color: string) {
    const r = rand(seed * 31 + 7);
    ctx.beginPath();
    for (let i = 0; i <= 18; i++) {
      const t = i / 18, x = x0 + (x1 - x0) * t, y = y0 + (r() - 0.5) * 1.4;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  function ball(f: Frame, seed: number, style: 'clean' | 'prev' | 'next') {
    const rx = R * unit() * f.sx * 0.62, ry = R * unit() * f.sy * 0.62;
    const cx = f.x * W, cy = f.y * H - ry;
    if (style === 'clean') pencilEllipse(cx, cy, rx, ry, seed, c.ink, c.teal, 2);
    else if (style === 'prev') pencilEllipse(cx, cy, rx, ry, seed, c.pencil, rgba(c.onion, 0.55), 1.2);
    else pencilEllipse(cx, cy, rx, ry, seed, rgba(c.magenta, 0.35), null, 1);
  }

  let boil = 0;
  function draw(i: number) {
    ctx.clearRect(0, 0, W, H);
    const f = frames[i], seed = i * 3 + boil;
    // spacing chart: a faint dashed arc through every drawing of the current act
    const act = i < intro ? frames.slice(0, intro) : frames.slice(intro);
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    act.forEach((p, k) => {
      const y = p.y * H - R * unit() * 0.62;
      k ? ctx.lineTo(p.x * W, y) : ctx.moveTo(p.x * W, y);
    });
    ctx.strokeStyle = rgba(c.pencil, 0.28);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    pencilLine(W * 0.03, G * H, W * 0.97, 5 + boil, rgba(c.ink, 0.25));
    if (f.line) {
      const lw = R * unit() * 1.5, x = f.x * W - lw / 2;
      ctx.fillStyle = c.magenta;
      ctx.fillRect(x, G * H + 2, lw * f.line, Math.max(4, H * 0.014));
    }
    if (i > 1) ball(frames[i - 2], seed - 6, 'prev');
    if (i > 0) ball(frames[i - 1], seed - 3, 'prev');
    if (i < TOTAL - 1 && !f.word) ball(frames[i + 1], seed + 3, 'next');
    ball(f, seed, 'clean');
    if (f.word) {
      const words = ['frame', 'by', 'frame'], fs = H * 0.13, x = f.x * W + R * unit() * 0.9;
      ctx.font = `700 ${fs}px "Instrument Sans Variable", system-ui, sans-serif`;
      ctx.fillStyle = c.ink;
      const chars = Math.round(f.word * 13);
      let used = 0;
      words.forEach((w, k) => {
        const take = clamp(chars - used, 0, w.length);
        used += w.length;
        ctx.fillText(w.slice(0, take), x, G * H - fs * 0.86 * (2 - k) + fs * 0.08);
      });
    }
  }

  // ---------- state: one current frame, many inputs ----------
  let cur = -1, target = 0, playing = false, last = 0, playStart = 0, dragging = false;
  const cells: HTMLElement[] = [];
  function show(i: number) {
    i = clamp(Math.round(i), 0, TOTAL - 1);
    if (i === cur) return;
    if (cells[cur]) cells[cur].removeAttribute('aria-current');
    cur = i;
    draw(i);
    counter.innerHTML = `FRAME <b>${pad(i + 1)}</b> / ${pad(TOTAL)}`;
    sheet.setAttribute('aria-valuenow', String(i + 1));
    sheet.setAttribute('aria-valuetext', `Frame ${i + 1} of ${TOTAL}`);
    cells[i]?.setAttribute('aria-current', 'true');
  }
  const redraw = () => {
    const i = cur;
    cur = -1;
    show(i);
  };

  // Time-based, so a phone that drops frames skips drawings instead of slowing the clock.
  function tick(t: number) {
    if (playing) {
      playStart ||= t;
      target = Math.min(intro - 1, Math.floor(((t - playStart) / 1000) * FPS));
      show(target);
      last = t;
      if (target >= intro - 1) playing = false;
    } else if (cur !== target && t - last >= 1000 / 30) {
      // thumbing toward the target, one or more drawings per tick
      const steps = Math.max(1, Math.floor((t - last) / (1000 / 30)));
      last = t;
      show(cur + Math.sign(target - cur) * Math.min(steps, Math.abs(target - cur)));
    } else if (cur === target) last = t;
    requestAnimationFrame(tick);
  }

  // scroll drives act 2
  if (scroller && !reduce) {
    addEventListener('scroll', () => {
      const r = scroller.getBoundingClientRect();
      const range = scroller.offsetHeight - innerHeight;
      if (range <= 0) return;
      const p = clamp(-r.top / range, 0, 1);
      if (p > 0) {
        playing = false;
        target = intro - 1 + Math.round(p * (TOTAL - intro));
      } else if (!playing && cur >= intro - 1 && !dragging) target = intro - 1;
    }, { passive: true });
  }

  // drag anywhere on the sheet
  let dragX = 0, dragFrom = 0;
  sheet.addEventListener('pointerdown', (e) => {
    dragging = true;
    dragX = e.clientX;
    dragFrom = cur;
    playing = false;
    sheet.setPointerCapture(e.pointerId);
  });
  sheet.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    target = clamp(Math.round(dragFrom + ((e.clientX - dragX) / sheet.clientWidth) * TOTAL), 0, TOTAL - 1);
  });
  const endDrag = () => (dragging = false);
  sheet.addEventListener('pointerup', endDrag);
  sheet.addEventListener('pointercancel', endDrag);

  sheet.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 12, PageDown: -12 }[e.key];
    let next: number | undefined;
    if (step) next = cur + step;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TOTAL - 1;
    if (next === undefined) return;
    e.preventDefault();
    playing = false;
    target = clamp(next, 0, TOTAL - 1);
    show(target);
  });

  // dope sheet: one cell per drawing, key poses tinted
  if (dope) {
    for (let k = 0; k < TOTAL; k++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.setAttribute('aria-hidden', 'true');
      if (keys.has(k)) b.className = 'key';
      b.title = `Frame ${k + 1}`;
      b.addEventListener('click', () => {
        playing = false;
        target = k;
        show(k);
      });
      cells.push(b);
      dope.append(b);
    }
  }

  // line boil while idle: three alternating seeds, on threes (8 fps)
  if (!reduce) {
    setInterval(() => {
      if (cur === target && !playing && !dragging && !document.hidden) {
        boil = (boil + 1) % 3;
        redraw();
      }
    }, 125);
  }

  new ResizeObserver(() => {
    size();
    redraw();
  }).observe(canvas);

  document.fonts.ready.then(() => {
    size();
    if (reduce) {
      target = TOTAL - 1;
      show(TOTAL - 1);
    } else {
      show(0);
      playing = true;
    }
    requestAnimationFrame(tick);
  });

  return { total: TOTAL, show };
}
