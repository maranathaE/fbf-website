// Runs on every page: smooth scrolling, cursor, magnetic buttons, the easter egg.
// Page-specific motion (flipbook, reel, grid, morph…) lives in each component's own script.
import Lenis from 'lenis';
import { initCursor } from './cursor';
import { finePointer, ready, reducedMotion } from './lifecycle';
import { initMagnetic } from './magnetic';
import { initPencilTest } from './pencil-test';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

ready(() => {
  // Wheel smoothing only for mice; touch and keyboard scrolling stay native.
  if (finePointer() && !reducedMotion()) {
    window.lenis = new Lenis({ autoRaf: true, lerp: 0.14, anchors: true });
  }
  initCursor();
  initMagnetic();
  initPencilTest();
});
