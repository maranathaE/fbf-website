// A pencil ring that trails the pointer, stepping at 24 fps like a drawing on ones.
// The system cursor stays visible: the ring is decoration, never the only signal.
// Hovering [data-cursor="Label"] grows the ring and shows the label (e.g. "Play", "View").
import { finePointer, reducedMotion } from './lifecycle';

export function initCursor() {
  const el = document.querySelector<HTMLElement>('[data-cursor]');
  const label = el?.querySelector<HTMLElement>('[data-cursor-label]');
  if (!el || !label || !finePointer() || reducedMotion()) return;

  let x = -100, y = -100, cx = x, cy = y, last = 0, visible = false;
  document.documentElement.classList.add('has-cursor');

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!visible) {
      visible = true;
      cx = x;
      cy = y;
      el.classList.add('is-on');
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => {
    visible = false;
    el.classList.remove('is-on');
  });

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as Element).closest<HTMLElement>('[data-cursor], a, button, [role="slider"]');
    const text = target?.dataset.cursor ?? '';
    el.classList.toggle('is-hover', Boolean(target));
    el.classList.toggle('has-label', Boolean(text));
    label.textContent = text;
  });

  const frame = (t: number) => {
    if (t - last >= 1000 / 24) {
      last = t;
      cx += (x - cx) * 0.55;
      cy += (y - cy) * 0.55;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
