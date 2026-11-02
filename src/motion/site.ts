// Runs on every page: smooth scrolling, cursor, magnetic buttons, the easter egg.
// Page-specific motion (flipbook, reel, grid, morph…) lives in each component's own script.
// Lenis and GSAP only load for mouse users who haven't asked for reduced motion,
// so phones never download them.
import { initCursor } from './cursor';
import { finePointer, ready, reducedMotion } from './lifecycle';
import { initPencilTest } from './pencil-test';

ready(() => {
  initPencilTest();
  if (!finePointer() || reducedMotion()) return;
  initCursor();
  import('lenis').then(({ default: Lenis }) => {
    (window as unknown as { fbfLenis?: unknown }).fbfLenis = new Lenis({ autoRaf: true, lerp: 0.14, anchors: true });
  });
  import('./magnetic').then((m) => m.initMagnetic());
});
