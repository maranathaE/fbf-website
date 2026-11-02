// Work grid: hover-to-play and service filters.
// Hover (or keyboard focus) plays the project's muted loop when it has one; otherwise it flips
// through the project's own stills at 12 fps on a canvas, with a frame counter.
// Filters reflow the grid with GSAP Flip, stepped so the move reads as drawings, not a tween.
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { FPS } from './flipbook';
import { each, finePointer, pad, reducedMotion } from './lifecycle';

gsap.registerPlugin(Flip);

function hoverPlay(card: HTMLAnchorElement) {
  const video = card.querySelector<HTMLVideoElement>('[data-loop]');
  const canvas = card.querySelector<HTMLCanvasElement>('[data-flick]')!;
  const fc = card.querySelector<HTMLElement>('[data-fc]')!;
  const srcs: string[] = card.dataset.frames ? JSON.parse(card.dataset.frames) : [];
  let images: HTMLImageElement[] | null = null;
  let timer = 0, i = 0, active = false;

  const drawCover = (img: HTMLImageElement) => {
    const ctx = canvas.getContext('2d')!;
    const { clientWidth: w, clientHeight: h } = canvas;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  const start = () => {
    if (active) return;
    active = true;
    card.classList.add('is-playing');
    if (video) {
      video.play().catch(() => {});
      return;
    }
    if (srcs.length < 2) return;
    images ??= srcs.map((src) => Object.assign(new Image(), { src, decoding: 'async' }));
    const step = () => {
      const img = images![i % images!.length];
      if (img.complete && img.naturalWidth) {
        drawCover(img);
        fc.textContent = `FRAME ${pad((i % images!.length) + 1, 2)} / ${pad(images!.length, 2)}`;
        i++;
      }
    };
    step();
    // Stills are held for three drawings each (4 per second) so they can be read.
    timer = window.setInterval(step, (1000 / FPS) * 3);
  };
  const stop = () => {
    active = false;
    card.classList.remove('is-playing');
    clearInterval(timer);
    video?.pause();
  };

  card.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && start());
  card.addEventListener('pointerleave', stop);
  card.addEventListener('focus', start);
  card.addEventListener('blur', stop);
}

function filters(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-grid]')!;
  const items = [...list.querySelectorAll<HTMLElement>('[data-services]')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  if (!buttons.length) return;

  const apply = (value: string, animate: boolean) => {
    const state = Flip.getState(items);
    let shown = 0;
    for (const item of items) {
      const match = value === 'all' || item.dataset.services!.split(' ').includes(value);
      item.hidden = !match;
      if (match) shown++;
    }
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.filter === value));
    if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}`;
    if (animate && !reducedMotion()) {
      Flip.from(state, {
        duration: 0.42,
        ease: 'steps(5)',
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.33, ease: 'steps(4)' }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.25, ease: 'steps(3)' }),
      });
    }
  };

  for (const b of buttons) {
    b.addEventListener('click', () => {
      const value = b.dataset.filter!;
      apply(value, true);
      const url = new URL(location.href);
      value === 'all' ? url.searchParams.delete('service') : url.searchParams.set('service', value);
      history.replaceState(null, '', url);
    });
  }
  const initial = new URLSearchParams(location.search).get('service');
  if (initial && buttons.some((b) => b.dataset.filter === initial)) apply(initial, false);
}

export function initWorkGrid() {
  each('[data-work]', (root) => {
    filters(root);
    if (finePointer() && !reducedMotion()) each<HTMLAnchorElement>('[data-card]', hoverPlay, root);
    else if (!reducedMotion()) {
      // Touch: loops (when a project has one) play while the card is mostly on screen.
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const v = e.target.querySelector<HTMLVideoElement>('[data-loop]');
          if (!v) continue;
          e.target.classList.toggle('is-playing', e.isIntersecting);
          e.isIntersecting ? v.play().catch(() => {}) : v.pause();
        }
      }, { threshold: 0.6 });
      each('[data-card]', (c) => io.observe(c), root);
    }
  });
}
