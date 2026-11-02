// Shared helpers for the motion modules: run once the DOM is ready, respect reduced motion,
// and find elements by data attribute.

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export function ready(fn: () => void) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
}

export function each<T extends HTMLElement = HTMLElement>(selector: string, fn: (el: T) => void, root: ParentNode = document) {
  root.querySelectorAll<T>(selector).forEach(fn);
}

/** Runs fn the first time el comes near the viewport; used to defer heavy work below the fold. */
export function whenNear(el: Element, fn: () => void, rootMargin = '300px') {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      fn();
    }
  }, { rootMargin });
  io.observe(el);
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const pad = (n: number, len = 3) => String(n).padStart(len, '0');
