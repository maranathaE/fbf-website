// Concept → Design → Execution, drawn from one real frame of the studio's work.
// The frame is redrawn as a graphite sketch (edge detection), then as flat colour with ink lines
// (a 6-colour palette from k-means), then shown as the final render. Scroll wipes between the
// stages in 8 held steps with a ragged pencil edge, while the matching stage text lights up.
import { clamp, reducedMotion, whenNear } from './lifecycle';

const STAGES = ['SKETCH', 'FLAT', 'FINAL'] as const;

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Graphite sketch: Sobel edges on luminance, laid on paper with a little tooth. */
function sketch(src: ImageData, paper: [number, number, number]) {
  const { width: w, height: h, data } = src;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  const out = new ImageData(w, h);
  let seed = 7;
  const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 10;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let g = 0;
      if (x > 0 && y > 0 && x < w - 1 && y < h - 1) {
        const a = lum[i - w - 1], b = lum[i - w], c = lum[i - w + 1], d = lum[i - 1], f = lum[i + 1], gg = lum[i + w - 1], hh = lum[i + w], k = lum[i + w + 1];
        const gx = -a - 2 * d - gg + c + 2 * f + k;
        const gy = -a - 2 * b - c + gg + 2 * hh + k;
        g = Math.min(1, Math.hypot(gx, gy) / 260);
      }
      const shade = Math.pow(g, 0.8) * 0.92 + (1 - lum[i] / 255) * 0.1; // lines plus a whisper of tone
      const n = noise();
      out.data[i * 4] = paper[0] * (1 - shade) + 30 * shade + n;
      out.data[i * 4 + 1] = paper[1] * (1 - shade) + 32 * shade + n;
      out.data[i * 4 + 2] = paper[2] * (1 - shade) + 40 * shade + n;
      out.data[i * 4 + 3] = 255;
    }
  }
  return { image: out, lum };
}

/** Flat colour: k-means palette of 6, then ink lines where the sketch is strongest. */
function flat(src: ImageData, lum: Float32Array) {
  const { width: w, height: h, data } = src;
  const k = 6;
  const sample: number[][] = [];
  for (let i = 0; i < w * h; i += 37) sample.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  let centers = Array.from({ length: k }, (_, j) => sample[Math.floor(((j + 0.5) / k) * sample.length)].slice());
  for (let iter = 0; iter < 8; iter++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const p of sample) {
      let best = 0, bd = Infinity;
      centers.forEach((c, j) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bd) (bd = d), (best = j);
      });
      const s = sums[best];
      s[0] += p[0], s[1] += p[1], s[2] += p[2], s[3]++;
    }
    centers = sums.map((s, j) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : centers[j]));
  }
  const out = new ImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    let best = centers[0], bd = Infinity;
    for (const c of centers) {
      const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
      if (d < bd) (bd = d), (best = c);
    }
    // ink line where neighbouring luminance jumps
    const x = i % w;
    const edge = x > 0 && i > w ? Math.abs(lum[i] - lum[i - 1]) + Math.abs(lum[i] - lum[i - w]) : 0;
    const ink = edge > 46 ? 0.85 : 0;
    out.data[i * 4] = best[0] * (1 - ink) + 25 * ink;
    out.data[i * 4 + 1] = best[1] * (1 - ink) + 23 * ink;
    out.data[i * 4 + 2] = best[2] * (1 - ink) + 20 * ink;
    out.data[i * 4 + 3] = 255;
  }
  return out;
}

export async function initMorph(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-morph-canvas]')!;
  const label = root.querySelector<HTMLElement>('[data-morph-label]')!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-stage]')];
  const statics = [...root.querySelectorAll<HTMLCanvasElement>('[data-morph-static]')];
  const img = new Image();
  img.decoding = 'async';
  img.src = root.dataset.src!;
  await img.decode();

  const W = Math.min(960, img.naturalWidth);
  const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const base = makeCanvas(W, H).getContext('2d', { willReadFrequently: true })!;
  base.drawImage(img, 0, 0, W, H);
  const src = base.getImageData(0, 0, W, H);
  const paper: [number, number, number] = [251, 248, 241];
  const sk = sketch(src, paper);
  const layers = [sk.image, flat(src, sk.lum), src].map((data) => {
    const c = makeCanvas(W, H);
    c.getContext('2d')!.putImageData(data, 0, 0);
    return c;
  });

  // Reduced motion: the three stages side by side, no scroll-driven wipe.
  if (reducedMotion()) {
    statics.forEach((c, i) => {
      c.width = W;
      c.height = H;
      c.getContext('2d')!.drawImage(layers[i], 0, 0);
    });
    root.classList.add('is-static');
    return;
  }

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  let jag = 1;
  const edge = (t: number, y: number) => t * (W + 40) - 20 + Math.sin(y * 0.09 + jag) * 9 + Math.sin(y * 0.023 + jag * 2) * 14;

  let last = -1;
  const render = (p: number) => {
    // 0–.3 sketch, .3–.38 wipe, .38–.64 flat, .64–.72 wipe, .72–1 final
    const zones = [[0.3, 0.38], [0.64, 0.72]];
    let stage = 0, wipe = 0;
    if (p >= zones[0][0]) stage = 1;
    if (p >= zones[1][0]) stage = 2;
    const z = zones[stage - 1];
    if (z && p < z[1]) {
      wipe = Math.floor(((p - z[0]) / (z[1] - z[0])) * 8) / 8; // eight held drawings
      stage -= 1;
    }
    const key = stage * 10 + wipe;
    if (key === last) return;
    last = key;
    jag = (jag + 1.7) % 6;
    ctx.drawImage(layers[stage], 0, 0);
    if (wipe > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let y = 0; y <= H; y += 6) ctx.lineTo(edge(wipe, y), y);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(layers[stage + 1], 0, 0);
      ctx.restore();
      ctx.beginPath();
      for (let y = 0; y <= H; y += 6) y ? ctx.lineTo(edge(wipe, y), y) : ctx.moveTo(edge(wipe, y), y);
      ctx.strokeStyle = 'rgba(29,27,24,.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    const active = wipe > 0.5 ? stage + 1 : stage;
    label.textContent = STAGES[active];
    steps.forEach((s, i) => s.classList.toggle('is-active', i === active));
  };

  const onScroll = () => {
    const r = root.getBoundingClientRect();
    const range = root.offsetHeight - innerHeight;
    render(clamp(-r.top / range, 0, 1));
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
}

export function setupMorph() {
  document.querySelectorAll<HTMLElement>('[data-morph]').forEach((root) => whenNear(root, () => initMorph(root), '600px'));
}
