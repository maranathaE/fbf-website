// Draw-a-frame toy: eight sheets of paper, a pencil, onion skins, and a GIF at the end.
import { applyPalette, GIFEncoder, quantize } from 'gifenc';
import { pad } from './lifecycle';

const W = 480, H = 360, FRAMES = 8;
const PAPER = '#fbf8f1';

export function initGifToy(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-toy-canvas]')!;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const strip = root.querySelector<HTMLOListElement>('[data-toy-strip]')!;
  const counter = root.querySelector<HTMLElement>('[data-toy-counter]')!;
  const onionBtn = root.querySelector<HTMLButtonElement>('[data-toy-onion]')!;
  const playBtn = root.querySelector<HTMLButtonElement>('[data-toy-play]')!;
  const status = root.querySelector<HTMLElement>('[data-toy-status]')!;
  canvas.width = W;
  canvas.height = H;

  const blank = () => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    return ctx.getImageData(0, 0, W, H);
  };
  const frames: ImageData[] = Array.from({ length: FRAMES }, blank);
  const thumbs: HTMLCanvasElement[] = [];
  let cur = 0, color = '#1d1b18', size = 4, erasing = false, onion = true, playTimer = 0;

  // ---------- frame strip ----------
  frames.forEach((_, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Frame ${i + 1}`);
    const t = document.createElement('canvas');
    t.width = 96;
    t.height = 72;
    t.setAttribute('aria-hidden', 'true');
    b.append(t);
    b.addEventListener('click', () => select(i));
    li.append(b);
    strip.append(li);
    thumbs.push(t);
  });
  const refreshThumb = (i: number) => {
    const t = thumbs[i].getContext('2d')!;
    const tmp = document.createElement('canvas');
    tmp.width = W;
    tmp.height = H;
    tmp.getContext('2d')!.putImageData(frames[i], 0, 0);
    t.drawImage(tmp, 0, 0, 96, 72);
  };

  // ---------- rendering ----------
  const tint = (img: ImageData, rgb: [number, number, number], alpha: number) => {
    const out = new ImageData(W, H);
    for (let p = 0; p < img.data.length; p += 4) {
      const ink = 1 - (img.data[p] + img.data[p + 1] + img.data[p + 2]) / (3 * 250);
      out.data[p] = rgb[0];
      out.data[p + 1] = rgb[1];
      out.data[p + 2] = rgb[2];
      out.data[p + 3] = Math.max(0, ink) * 255 * alpha;
    }
    return out;
  };
  const tmp = document.createElement('canvas');
  tmp.width = W;
  tmp.height = H;
  const render = () => {
    ctx.putImageData(frames[cur], 0, 0);
    if (onion && cur > 0 && !playTimer) {
      // the previous drawing as a blue ghost underneath your pencil
      tmp.getContext('2d')!.putImageData(tint(frames[cur - 1], [61, 99, 221], 0.35), 0, 0);
      ctx.drawImage(tmp, 0, 0);
    }
  };
  const select = (i: number) => {
    cur = (i + FRAMES) % FRAMES;
    render();
    counter.textContent = `FRAME ${pad(cur + 1, 2)} / ${pad(FRAMES, 2)}`;
    strip.querySelectorAll('button').forEach((b, k) => (k === cur ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
  };

  // ---------- drawing ----------
  // Strokes go into the frame's own image data, never onto the onion skin.
  const work = document.createElement('canvas');
  work.width = W;
  work.height = H;
  const wctx = work.getContext('2d')!;
  let drawing = false, lx = 0, ly = 0;
  const pos = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  };
  canvas.addEventListener('pointerdown', (e) => {
    stop();
    drawing = true;
    [lx, ly] = pos(e);
    wctx.putImageData(frames[cur], 0, 0);
    canvas.setPointerCapture(e.pointerId);
    stroke(e);
  });
  const stroke = (e: PointerEvent) => {
    if (!drawing) return;
    const [x, y] = pos(e);
    wctx.lineCap = 'round';
    wctx.lineJoin = 'round';
    wctx.strokeStyle = erasing ? PAPER : color;
    wctx.lineWidth = (erasing ? size * 4 : size) * (e.pressure && e.pointerType === 'pen' ? 0.4 + e.pressure : 1);
    wctx.beginPath();
    wctx.moveTo(lx, ly);
    wctx.lineTo(x + 0.01, y);
    wctx.stroke();
    lx = x;
    ly = y;
    frames[cur] = wctx.getImageData(0, 0, W, H);
    render();
  };
  canvas.addEventListener('pointermove', stroke);
  const end = () => {
    if (!drawing) return;
    drawing = false;
    refreshThumb(cur);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  // ---------- tools ----------
  root.querySelectorAll<HTMLButtonElement>('[data-toy-color]').forEach((b) =>
    b.addEventListener('click', () => {
      color = b.dataset.toyColor!;
      erasing = false;
      root.querySelectorAll('[data-toy-color], [data-toy-eraser]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }),
  );
  root.querySelector('[data-toy-eraser]')!.addEventListener('click', (e) => {
    erasing = true;
    root.querySelectorAll('[data-toy-color], [data-toy-eraser]').forEach((x) => x.setAttribute('aria-pressed', String(x === e.currentTarget)));
  });
  root.querySelector<HTMLInputElement>('[data-toy-size]')!.addEventListener('input', (e) => (size = Number((e.target as HTMLInputElement).value)));
  root.querySelector('[data-toy-clear]')!.addEventListener('click', () => {
    frames[cur] = blank();
    refreshThumb(cur);
    render();
  });
  root.querySelector('[data-toy-copy]')!.addEventListener('click', () => {
    if (cur === 0) return;
    frames[cur] = new ImageData(new Uint8ClampedArray(frames[cur - 1].data), W, H);
    refreshThumb(cur);
    render();
    status.textContent = `Copied frame ${cur} onto frame ${cur + 1}.`;
  });
  root.querySelector('[data-toy-prev]')!.addEventListener('click', () => select(cur - 1));
  root.querySelector('[data-toy-next]')!.addEventListener('click', () => select(cur + 1));
  onionBtn.addEventListener('click', () => {
    onion = !onion;
    onionBtn.setAttribute('aria-pressed', String(onion));
    render();
  });

  function stop() {
    if (!playTimer) return;
    clearInterval(playTimer);
    playTimer = 0;
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.textContent = 'Play';
    render();
  }
  playBtn.addEventListener('click', () => {
    if (playTimer) return stop();
    playBtn.setAttribute('aria-pressed', 'true');
    playBtn.textContent = 'Stop';
    playTimer = window.setInterval(() => select(cur + 1), 1000 / 12 * 2); // on twos
  });

  root.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).matches('input')) return;
    if (e.key === ',') select(cur - 1);
    if (e.key === '.') select(cur + 1);
  });

  // ---------- export ----------
  root.querySelector('[data-toy-export]')!.addEventListener('click', () => {
    stop();
    const all = new Uint8ClampedArray(W * H * 4 * FRAMES);
    frames.forEach((f, i) => all.set(f.data, i * W * H * 4));
    const palette = quantize(all, 32);
    const gif = GIFEncoder();
    for (const f of frames) gif.writeFrame(applyPalette(f.data, palette), W, H, { palette, delay: Math.round((1000 / 12) * 2) });
    gif.finish();
    const url = URL.createObjectURL(new Blob([gif.bytes() as Uint8Array<ArrayBuffer>], { type: 'image/gif' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-fbf-flipbook.gif';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    status.textContent = 'Your GIF is downloading.';
  });

  frames.forEach((_, i) => refreshThumb(i));
  select(0);
}
