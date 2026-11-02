// Onion-skin viewer for a project's frames: step, scrub or play through the stills on a
// lightbox, with the previous frame ghosted in blue and the next in magenta, the way an
// animator checks spacing between drawings.
import { pad, reducedMotion } from './lifecycle';

export function initOnion(root: HTMLElement) {
  const frames = [...root.querySelectorAll<HTMLElement>('[data-onion-frame]')];
  const thumbs = [...root.querySelectorAll<HTMLButtonElement>('[data-onion-thumb]')];
  const range = root.querySelector<HTMLInputElement>('[data-onion-range]')!;
  const counter = root.querySelector<HTMLElement>('[data-onion-counter]')!;
  const caption = root.querySelector<HTMLElement>('[data-onion-caption]')!;
  const skinBtn = root.querySelector<HTMLButtonElement>('[data-onion-skins]')!;
  const playBtn = root.querySelector<HTMLButtonElement>('[data-onion-play]')!;
  const n = frames.length;
  let cur = 0, timer = 0;

  const show = (i: number) => {
    cur = (i + n) % n;
    frames.forEach((f, k) => {
      f.dataset.state = k === cur ? 'current' : k === (cur - 1 + n) % n ? 'prev' : k === (cur + 1) % n ? 'next' : '';
    });
    thumbs.forEach((t, k) => (k === cur ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
    range.value = String(cur + 1);
    range.setAttribute('aria-valuetext', `Frame ${cur + 1} of ${n}`);
    counter.textContent = `FRAME ${pad(cur + 1, 2)} / ${pad(n, 2)}`;
    caption.textContent = frames[cur].querySelector('img')?.alt ?? '';
    // decode neighbours ahead of time so stepping never shows a blank
    for (const k of [cur + 1, cur + 2]) frames[k % n]?.querySelector('img')?.setAttribute('loading', 'eager');
  };

  const stop = () => {
    clearInterval(timer);
    timer = 0;
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.querySelector('[data-label]')!.textContent = 'Play';
  };
  const play = () => {
    // each still held for six drawings at 12 fps: two frames a second
    timer = window.setInterval(() => show(cur + 1), 500);
    playBtn.setAttribute('aria-pressed', 'true');
    playBtn.querySelector('[data-label]')!.textContent = 'Pause';
  };

  root.querySelector('[data-onion-prev]')!.addEventListener('click', () => (stop(), show(cur - 1)));
  root.querySelector('[data-onion-next]')!.addEventListener('click', () => (stop(), show(cur + 1)));
  range.addEventListener('input', () => (stop(), show(Number(range.value) - 1)));
  thumbs.forEach((t, k) => t.addEventListener('click', () => (stop(), show(k))));
  playBtn.addEventListener('click', () => (timer ? stop() : play()));
  if (reducedMotion()) playBtn.hidden = true;
  skinBtn.addEventListener('click', () => {
    const on = skinBtn.getAttribute('aria-pressed') !== 'true';
    skinBtn.setAttribute('aria-pressed', String(on));
    root.classList.toggle('skins-off', !on);
  });
  root.querySelector('[data-onion-stage]')!.addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[(e as KeyboardEvent).key];
    if (d) {
      e.preventDefault();
      stop();
      show(cur + d);
    }
  });
  show(0);
}
