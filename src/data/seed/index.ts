// Seed content: everything the old fbf.studio said, cleaned up, and nothing it didn't.
// It renders the site until Sanity is connected, and `npm run seed:export` turns it into
// a Sanity import file so staff start from the same content.
// Gaps (results, bios, newer work) are listed in docs/open-questions.md, not filled in here.
import { seedImg } from '../../lib/media';
import type { Client, Project, Service, Settings, TeamMember, TimelineEntry } from '../../lib/types';
import rawProjects from './projects.json';

type RawProject = {
  slug: string;
  title: string;
  clientLabel: string;
  clients: string[];
  services: Project['services'];
  format?: string;
  description: string;
  credits: Project['credits'];
  youtubeId?: string;
  cover: string;
  gallery: string[];
};

const clientSeed: { id: string; name: string; logo?: string; onWall?: boolean }[] = [
  { id: 'beza', name: 'Beza International Ministries', logo: '2021/07/01.-Beza-International-Ministries.png' },
  { id: 'wfp', name: 'World Food Programme', logo: '2021/07/02.-WFP.png' },
  { id: 'un-women', name: 'UN Women', logo: '2021/07/03.-UN-Women.png' },
  { id: 'ifrc', name: 'IFRC', logo: '2021/07/04.-IFRC.png' },
  { id: 'flawless', name: 'Flawless Events', logo: '2021/07/05.-Flawless-Events.png' },
  { id: 'mindset', name: 'Mindset Consult', logo: '2021/07/06.-Mindset-Consult.png' },
  { id: 'tana-forum', name: 'Tana Forum (AAU IPSS)', logo: '2021/07/07.-Tana-Forum-1.png' },
  { id: 'ahif', name: 'Africa Hotel Investment Forum', logo: '2021/07/08.-AHIF.png' },
  { id: 'schmoo', name: 'The Schmoo Show', logo: '2021/07/09.-Schmoo-1.png' },
  { id: 'tym', name: 'The Youth Mag', logo: '2021/07/10.-tym-1.png' },
  { id: 'tsi-mirrors', name: 'Tsi Mirrors', logo: '2021/07/11.-Tsi-Mirrors.png' },
  { id: 'african-union', name: 'African Union', logo: '2021/07/13-Au.png' },
  { id: 'africa-24', name: 'Africa 24', logo: '2021/07/15-Africa-24-Logo.jpg' },
  { id: 'dstv', name: 'DStv', logo: '2021/07/16-DStv-Logo.png' },
  { id: 'redeemedia', name: 'RedeeMedia', logo: '2021/07/17-O6RGwCPa-1.png' },
  // Logo 18 ("tom") is unidentified, so it stays off the wall until the studio names it.
  { id: 'logo-18', name: 'Unidentified client (logo 18)', logo: '2021/07/18-tom.png', onWall: false },
  { id: 'golden-oil', name: 'Golden Oil Ministries' },
  { id: 'endalkachew-hawaz', name: 'Endalkachew Hawaz' },
  { id: 'gebeya', name: 'Gebeya Media Productions' },
  { id: 'bench-events', name: 'Bench Events' },
  { id: 'balinjeraye', name: 'Balinjeraye (The Neighbor-Love Movement)' },
  { id: 'bluemoon', name: 'Bluemoon Ethiopia' },
];

// Hand-written alt text for the stills used most; the rest describe their place in the sequence.
const altText: Record<string, string> = {
  '2021/07/01-23.jpg': 'Animated classroom scene from Marriage Laws in Africa',
  '2021/07/01-4.jpg': 'Illustrated desk with a laptop and paperwork, from the WFP Smart-face explainer',
  '2021/07/01-16.jpg': 'A migrant family walking, with the caption "272 million people"',
};

const featured = new Set([
  'marriage-laws-in-africa',
  'smartface',
  'ifrc',
  'kibir-bearyam-official-lyric-video',
  'ahif-2019',
  'balenjeraye',
]);

const clientName = new Map(clientSeed.map((c) => [c.id, c.name]));

export const projects: Project[] = (rawProjects as RawProject[]).map((p) => ({
  slug: p.slug,
  title: p.title,
  clientLabel: p.clientLabel,
  clients: p.clients.map((id) => ({ id, name: clientName.get(id) ?? id })),
  services: p.services,
  format: p.format,
  year: Number(p.title.match(/\b(20\d\d)\b/)?.[1]) || undefined,
  description: p.description,
  credits: p.credits,
  youtubeId: p.youtubeId,
  cover: seedImg(p.cover, altText[p.cover] ?? `Still from ${p.title}`),
  gallery: p.gallery.map((g, i) => seedImg(g, altText[g] ?? `${p.title}, frame ${i + 1} of ${p.gallery.length}`)),
  featured: featured.has(p.slug),
}));

export const clients: Client[] = clientSeed.map((c) => ({
  id: c.id,
  name: c.name,
  logo: c.logo ? seedImg(c.logo, `${c.name} logo`) : undefined,
  onWall: Boolean(c.logo) && c.onWall !== false,
  projects: projects.filter((p) => p.clients.some((x) => x.id === c.id)).map(({ slug, title }) => ({ slug, title })),
}));

const teamSeed: [string, string, string, string?][] = [
  ['Ammanuel A. Wake', 'Creative Director & Founder', '2021/08/Ammanuel-Wake-Wide.jpg', 'Amman'],
  ['Mikiyas Girmachew', 'Technical Director', '2021/07/Mikiyas-Girmachew-Technical-Director-1.jpeg', 'Mike'],
  ['Yafet Yemane', 'General Manager', '2021/07/Yafet-Yemane-General-Manager-1.jpg'],
  ['Fitsum Admasu', 'Art Director', '2021/07/Fitsum.jpg'],
  ['Naol Getnet', 'Lead Animator & Designer', '2021/07/Naol-Getnet-Lead-Animator-1.jpeg'],
  ['Mosisa Yayo', 'Sound Director', '2021/07/Mosisa-Yayo-Sound-Director-1.jpg', 'Mosi'],
  ['Amen Demissie', 'Editor', '2021/07/Amen-Demissie-Editor-1.jpg'],
  ['Kidus Deribe', '3D Animator', '2021/07/Kidus-Derebe-Intern-3D-Animator-1.jpg'],
  ['Bethlehem A. Wake', 'Social Media Manager', '2021/07/Bethlehem-A.-Wake-Social-Media-Manager-1.jpeg', 'Betty'],
  ['Jodahi B. Petros', 'Social Media Manager', '2021/07/Jodahi-B.-Petros-Social-Media-Manager-1.jpg'],
  ['Yenkuel Bekele', 'Production Designer', '2021/07/Yenkuel-Bekele-Production-Designer-1.jpg', 'Yenku'],
];

export const team: TeamMember[] = teamSeed.map(([name, role, photo, nickname]) => ({
  name,
  role,
  nickname,
  photo: seedImg(photo, `Portrait of ${name}`),
}));

export const services: Service[] = [
  {
    id: 'animation',
    title: 'Animation',
    summary: 'Every idea is better when it moves. Animation is how we breathe life into yours.',
    body: 'Explainers for the UN and the Red Cross, lyric videos with hand-made type, a stop-motion trailer, an animated series. We draw it, design it and move it in-house, from the first storyboard to the final render.',
    formats: ['Explainers', 'Infographic animation', 'Character animation', 'Lyric videos', 'Title sequences', 'Animated series', 'Stop-motion'],
    icon: seedImg('2021/07/Animation-Icon.png', ''),
  },
  {
    id: 'production',
    title: 'Content Production',
    summary: 'Whatever the format, content is king. We make original work for our clients and for ourselves.',
    body: 'Camera crews, editing, sound and motion graphics under one roof: event highlights, music videos, a short film shot on an iPhone, and a TV show that aired for three months.',
    formats: ['Event highlights', 'Music videos', 'Short films', 'TV shows', 'Motion graphics'],
    icon: seedImg('2021/07/Content-Production-Icon.png', ''),
  },
  {
    id: 'live',
    title: 'Live Streaming',
    summary: 'Reach your audience anywhere in the world. We stream your event so it looks as good live as it does in the edit.',
    body: 'Our technical team has run more than fifty physical and virtual events, from investment forums to startup showcases, with multi-camera coverage.',
    formats: ['Multi-camera streams', 'Physical and virtual events', 'Event highlights'],
    icon: seedImg('2021/07/Live-Streaming-Icon.png', ''),
  },
];

// Only dates the public record supports. The studio extends this from the CMS.
export const timeline: TimelineEntry[] = [
  {
    date: '2019',
    title: 'Africa Hotel Investment Forum',
    body: 'Camera crew and highlights film for AHIF 2019.',
    project: { slug: 'ahif-2019', title: 'AHIF 2019 – Highlights Video' },
    image: projects.find((p) => p.slug === 'ahif-2019')!.cover,
  },
  {
    date: '2019',
    title: 'Tana Forum',
    body: 'Highlights film for the 2019 Tana Forum on security in Africa.',
    project: { slug: 'tana-forum-2019', title: 'Tana Forum 2019 – Highlights Video' },
    image: projects.find((p) => p.slug === 'tana-forum-2019')!.cover,
  },
  {
    date: '2021',
    title: 'fbf.studio goes online',
    body: 'Twenty-one projects, published in one go.',
  },
];

export const settings: Settings = {
  heroTitle: 'We make ideas *move*, frame by frame.',
  heroLede:
    'Animation, content production and live streaming in Addis Ababa, from the first rough sketch to the final render.',
  intro:
    'Frame by Frame is a creative studio in Addis Ababa. We tell visual stories, from the first idea to the final frame, and we do every one of them with love.',
  process: {
    intro:
      "Telling a story well isn't easy. Worry not, we'll guide you through every step. You leave with something ready to share.",
    stages: [
      { id: 'concept', title: 'Concept', body: 'We find the story first: the message, the audience, the one idea worth drawing.' },
      { id: 'design', title: 'Design', body: 'Then the look: script, storyboard, characters, colour and type, signed off before anything moves.' },
      { id: 'execution', title: 'Execution', body: 'Finally it moves. Animation, footage, sound and edit, delivered ready for every screen.' },
    ],
    projectSlug: 'marriage-laws-in-africa',
  },
  servicesIntro:
    'We help organisations and businesses reach their goals in different ways. We work hard to understand what is needed, then make a plan and deliver it, with special attention to every frame.',
  workIntro: 'Animations, infographics, explainers, ads, music videos, films: all made with love and special attention.',
  about: {
    history: [
      'Frame by Frame is a collection of creatives with a shared vision and drive. Before FBF, our team worked together on many different occasions, and that shared taste and creative energy led to the founding of the studio.',
      'Led by our founder Amman, we set out to give clients highly original solutions from concept to delivery. We take joy in working together to make meaningful stories.',
    ],
    mission: 'Consistently exceed expectations, and tell stories that inspire.',
  },
  contact: {
    email: 'hello@fbf.studio',
    hours: 'Mon–Fri, 9:00–18:30',
    address: 'Bole Atlas, Ghana Road, in front of Axum Building, 4th floor, Addis Ababa, Ethiopia',
    mapUrl: 'https://www.openstreetmap.org/search?query=Ghana%20Road%2C%20Bole%2C%20Addis%20Ababa',
  },
  socials: [
    { label: 'YouTube', url: 'https://www.youtube.com/channel/UCUSZ0mcuSpyWL8AQ2wptZaQ' },
    { label: 'Instagram', url: 'https://www.instagram.com/fbfstudios_/' },
    { label: 'Facebook', url: 'https://www.facebook.com/fbfstudios' },
    { label: 'X', url: 'https://twitter.com/fbfstudios_' },
  ],
  reel: { chapters: [] },
  youtubeChannelId: 'UCUSZ0mcuSpyWL8AQ2wptZaQ',
  liveBadge: true,
  brief: {
    budgets: ['Under $5k', '$5k – $15k', '$15k – $40k', '$40k +', 'Not sure yet'],
    timelines: ['Under a month', '1 – 2 months', '3 months or more', 'Flexible'],
    successMessage: "Thanks! Your brief is with the team. We'll be in touch soon.",
  },
};
