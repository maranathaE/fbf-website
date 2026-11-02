// Showreel with chapter markers.
// Reel mode: one YouTube video, chapters are timestamps set in the CMS.
// Playlist mode (no reel uploaded yet): each chapter is a featured project's own film,
// played back to back.
// The YouTube player only loads after the first click, so the page stays light.

type Chapter = { start: number; label: string; videoId: string; slug?: string };
type Config = { mode: 'reel' | 'playlist'; chapters: Chapter[] };

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;
function loadApi() {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.append(s);
  });
  return apiPromise;
}

const tc = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function initReel(root: HTMLElement) {
  const config: Config = JSON.parse(root.querySelector('[data-reel-config]')!.textContent!);
  const { chapters, mode } = config;
  const screen = root.querySelector<HTMLElement>('[data-reel-screen]')!;
  const mount = root.querySelector<HTMLElement>('[data-reel-mount]')!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-chapter]')];
  const fills = [...root.querySelectorAll<HTMLElement>('[data-fill]')];
  const time = root.querySelector<HTMLElement>('[data-reel-time]')!;
  const now = root.querySelector<HTMLElement>('[data-reel-now]')!;
  let player: any = null, current = -1, poll = 0;

  const mark = (i: number) => {
    if (i === current) return;
    current = i;
    buttons.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    now.textContent = `Chapter ${i + 1} of ${chapters.length}: ${chapters[i].label}`;
  };

  const progress = () => {
    if (!player?.getCurrentTime) return;
    const t = player.getCurrentTime() || 0;
    const d = player.getDuration() || 1;
    if (mode === 'reel') {
      const i = chapters.reduce((acc, c, k) => (t >= c.start ? k : acc), 0);
      mark(i);
      fills.forEach((f, k) => {
        const start = chapters[k].start, end = chapters[k + 1]?.start ?? d;
        f.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - start) / (end - start)))})`;
      });
    } else {
      fills.forEach((f, k) => (f.style.transform = `scaleX(${k < current ? 1 : k === current ? t / d : 0})`));
    }
    time.textContent = `${tc(t)} / ${tc(d)}`;
  };

  const go = async (i: number) => {
    const c = chapters[i];
    mark(i);
    if (!player) {
      screen.classList.add('is-loading');
      const YT = await loadApi();
      await new Promise<void>((ready) => {
        player = new YT.Player(mount, {
          host: 'https://www.youtube-nocookie.com',
          videoId: c.videoId,
          playerVars: { autoplay: 1, start: Math.floor(c.start), rel: 0, modestbranding: 1, playsinline: 1, cc_load_policy: 0 },
          events: {
            onReady: () => ready(),
            onStateChange: (e: any) => {
              // playlist mode: when a film ends, roll on to the next chapter
              if (e.data === YT.PlayerState.ENDED && mode === 'playlist' && current < chapters.length - 1) go(current + 1);
            },
          },
        });
      });
      screen.classList.remove('is-loading');
      screen.classList.add('is-live');
      poll = window.setInterval(progress, 250);
      player.getIframe().focus();
      return;
    }
    if (mode === 'reel') {
      player.seekTo(c.start, true);
      player.playVideo();
    } else {
      player.loadVideoById({ videoId: c.videoId, startSeconds: 0 });
    }
  };

  root.querySelector('[data-reel-play]')!.addEventListener('click', () => go(Math.max(0, current)));
  buttons.forEach((b, i) => b.addEventListener('click', () => go(i)));
  mark(0);

  // "Play reel" links elsewhere on the page start it too.
  document.querySelectorAll<HTMLAnchorElement>('a[href="#reel"]').forEach((a) =>
    a.addEventListener('click', () => setTimeout(() => !player && go(0), 450)),
  );
  return () => clearInterval(poll);
}
