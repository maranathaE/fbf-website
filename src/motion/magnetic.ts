// Buttons and links marked [data-magnetic] lean toward the pointer, then spring back
// with a little overshoot, like a drawing settling into its key pose.
import { gsap } from 'gsap';
import { each, finePointer, reducedMotion } from './lifecycle';

export function initMagnetic(root: ParentNode = document) {
  if (!finePointer() || reducedMotion()) return;
  each('[data-magnetic]', (el) => {
    if (el.dataset.magneticReady) return;
    el.dataset.magneticReady = '1';
    const strength = Number(el.dataset.magnetic) || 0.35;
    const toX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      toX((e.clientX - (r.left + r.width / 2)) * strength);
      toY((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    });
  }, root);
}
