// The shapes every page renders from. Content comes from Sanity when it is connected,
// otherwise from the seed in src/data/seed (see src/lib/content.ts).

export type ServiceId = 'animation' | 'production' | 'live';

export interface Img {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny blurred placeholder (data URI), when available. */
  lqip?: string;
}

export interface Credit {
  role: string;
  names: string;
}

export interface ClientRef {
  id: string;
  name: string;
}

export interface Project {
  slug: string;
  title: string;
  /** How the client is credited on this project, e.g. "Gebeya Media Productions (for IFRC)". */
  clientLabel: string;
  clients: ClientRef[];
  services: ServiceId[];
  format?: string;
  year?: number;
  description: string;
  /** Problem → approach → result. Optional: only shown when the studio has supplied them. */
  problem?: string;
  approach?: string;
  result?: string;
  credits: Credit[];
  youtubeId?: string;
  /** Short muted loop for hover-to-play (MP4/WebM URLs). */
  loop?: { mp4?: string; webm?: string };
  cover: Img;
  gallery: Img[];
  featured: boolean;
}

export interface Client {
  id: string;
  name: string;
  logo?: Img;
  /** Logos only show on the client wall when the studio has confirmed them. */
  onWall: boolean;
  projects: { slug: string; title: string }[];
}

export interface TeamMember {
  name: string;
  nickname?: string;
  role: string;
  photo?: Img;
  bio?: string;
}

export interface Service {
  id: ServiceId;
  title: string;
  summary: string;
  body: string;
  formats: string[];
  icon?: Img;
}

export interface TimelineEntry {
  date: string;
  title: string;
  body?: string;
  image?: Img;
  project?: { slug: string; title: string };
}

export interface ReelChapter {
  /** Seconds into the reel. */
  start: number;
  label: string;
  project?: { slug: string; title: string };
}

export interface Settings {
  /** Wrap the accent word in asterisks: "We make ideas *move*". */
  heroTitle: string;
  heroLede: string;
  intro: string;
  process: {
    intro: string;
    stages: { id: 'concept' | 'design' | 'execution'; title: string; body: string }[];
    projectSlug?: string;
  };
  servicesIntro: string;
  workIntro: string;
  about: { history: string[]; mission: string };
  contact: { email: string; phone?: string; hours: string; address: string; mapUrl: string };
  socials: { label: string; url: string }[];
  reel: { youtubeId?: string; chapters: ReelChapter[] };
  youtubeChannelId?: string;
  liveBadge: boolean;
  brief: {
    budgets: string[];
    timelines: string[];
    successMessage: string;
  };
}
