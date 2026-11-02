// Easter egg: the Konami code, or 12 clicks on the bouncing ball, switches the site into a
// "pencil test", the rough graphite pass animators shoot before anything is inked.
// Escape (or doing it again) inks it back.

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const CLICKS = 12;

export function initPencilTest() {
  const root = document.documentElement;
  const toast = document.querySelector<HTMLElement>('[data-pencil-toast]');
  let hideTimer = 0;

  const say = (msg: string) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => toast.classList.remove('is-on'), 3200);
  };
  const set = (on: boolean) => {
    root.classList.toggle('pencil-test', on);
    try {
      sessionStorage.setItem('fbf-pencil-test', on ? '1' : '');
    } catch {}
    say(on ? 'Pencil test: roughs only. Press Esc to ink it.' : 'Inked. Back to final colour.');
  };

  try {
    if (sessionStorage.getItem('fbf-pencil-test')) root.classList.add('pencil-test');
  } catch {}

  let k = 0;
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('pencil-test')) return set(false);
    k = e.key.toLowerCase() === KONAMI[k].toLowerCase() ? k + 1 : e.key === KONAMI[0] ? 1 : 0;
    if (k === KONAMI.length) {
      k = 0;
      set(!root.classList.contains('pencil-test'));
    }
  });

  let clicks = 0, resetAt = 0;
  document.addEventListener('click', (e) => {
    const ball = (e.target as Element).closest('.logo');
    if (!ball) return;
    // On the home page the logo link has nowhere to go, so it counts instead.
    if (location.pathname === '/') e.preventDefault();
    const now = Date.now();
    clicks = now < resetAt ? clicks + 1 : 1;
    resetAt = now + 4000;
    if (clicks >= 4 && clicks < CLICKS) say(`${CLICKS - clicks}…`);
    if (clicks === CLICKS) {
      clicks = 0;
      set(!root.classList.contains('pencil-test'));
    }
  });
}
