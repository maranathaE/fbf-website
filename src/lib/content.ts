// One place pages get content from. With Sanity connected, everything comes from the CMS;
// fields staff leave empty fall back to the seed, so a half-filled CMS never breaks a page.
import * as seed from '../data/seed';
import { IMAGE, sanity, sanityImg, type SanityImage } from './sanity';
import type { Client, Project, ReelChapter, Service, Settings, TeamMember, TimelineEntry } from './types';

const memo = new Map<string, Promise<unknown>>();
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!memo.has(key)) memo.set(key, load());
  return memo.get(key) as Promise<T>;
}

const nonEmpty = <T>(list: T[] | null | undefined): list is T[] => Array.isArray(list) && list.length > 0;

// ---------- projects ----------

type RawProject = Omit<Project, 'cover' | 'gallery' | 'loop' | 'clients'> & {
  clients?: { id: string; name: string }[];
  cover?: SanityImage;
  gallery?: SanityImage[];
  loopMp4?: string;
  loopWebm?: string;
};

const PROJECT = `{
  "slug": slug.current, title, clientLabel, "clients": clients[]->{"id": _id, name}, services, format, year,
  description, problem, approach, result, credits[]{role, names}, youtubeId,
  "loopMp4": loopMp4.asset->url, "loopWebm": loopWebm.asset->url,
  cover${IMAGE}, gallery[]${IMAGE}, "featured": coalesce(featured, false)
}`;

export function getProjects(): Promise<Project[]> {
  return cached('projects', async () => {
    if (!sanity) return seed.projects;
    const raw = await sanity.fetch<RawProject[]>(
      `*[_type == "project" && defined(slug.current)] | order(coalesce(order, 9999) asc, _createdAt desc) ${PROJECT}`,
    );
    return raw.map((p) => ({
      ...p,
      clients: p.clients ?? [],
      clientLabel: p.clientLabel || (p.clients ?? []).map((c) => c.name).join(', '),
      services: p.services ?? [],
      credits: p.credits ?? [],
      loop: p.loopMp4 || p.loopWebm ? { mp4: p.loopMp4, webm: p.loopWebm } : undefined,
      cover: sanityImg(p.cover, `Still from ${p.title}`)!,
      gallery: (p.gallery ?? [])
        .map((g, i, all) => sanityImg(g, `${p.title}, frame ${i + 1} of ${all.length}`))
        .filter((g) => g !== undefined),
    })).filter((p) => p.cover);
  });
}

export async function getProject(slug: string) {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i < 0) return undefined;
  return { project: all[i], prev: all[(i - 1 + all.length) % all.length], next: all[(i + 1) % all.length] };
}

// ---------- clients, team, services, timeline ----------

export function getClients(): Promise<Client[]> {
  return cached('clients', async () => {
    if (!sanity) return seed.clients;
    const raw = await sanity.fetch<(Omit<Client, 'logo'> & { logo?: SanityImage })[]>(
      `*[_type == "client"] | order(coalesce(order, 9999) asc, name asc){
        "id": _id, name, "onWall": coalesce(onWall, true) && defined(logo.asset), logo${IMAGE},
        "projects": *[_type == "project" && references(^._id)]{"slug": slug.current, title}
      }`,
    );
    return raw.map((c) => ({ ...c, logo: sanityImg(c.logo, `${c.name} logo`) }));
  });
}

export function getTeam(): Promise<TeamMember[]> {
  return cached('team', async () => {
    if (!sanity) return seed.team;
    const raw = await sanity.fetch<(Omit<TeamMember, 'photo'> & { photo?: SanityImage })[]>(
      `*[_type == "teamMember" && coalesce(current, true)] | order(coalesce(order, 9999) asc, name asc){name, nickname, role, bio, photo${IMAGE}}`,
    );
    return nonEmpty(raw) ? raw.map((m) => ({ ...m, photo: sanityImg(m.photo, `Portrait of ${m.name}`) })) : seed.team;
  });
}

export function getServices(): Promise<Service[]> {
  return cached('services', async () => {
    if (!sanity) return seed.services;
    const raw = await sanity.fetch<(Omit<Service, 'icon' | 'id'> & { id: Service['id']; icon?: SanityImage })[]>(
      `*[_type == "service"] | order(coalesce(order, 9999) asc){"id": serviceId, title, summary, body, "formats": coalesce(formats, []), icon${IMAGE}}`,
    );
    return nonEmpty(raw) ? raw.map((s) => ({ ...s, icon: sanityImg(s.icon, '') })) : seed.services;
  });
}

export function getTimeline(): Promise<TimelineEntry[]> {
  return cached('timeline', async () => {
    if (!sanity) return seed.timeline;
    const raw = await sanity.fetch<(Omit<TimelineEntry, 'image'> & { image?: SanityImage })[]>(
      `*[_type == "timelineEntry"] | order(sortDate asc, date asc){date, title, body, image${IMAGE}, "project": project->{"slug": slug.current, title}}`,
    );
    return raw.map((t) => ({ ...t, image: sanityImg(t.image, '') }));
  });
}

// ---------- settings ----------

const toSeconds = (mss: string) => {
  const [m, s] = mss.split(':').map(Number);
  return m * 60 + s;
};

export function getSettings(): Promise<Settings> {
  return cached('settings', async () => {
    const d = seed.settings;
    if (!sanity) return d;
    const s = await sanity.fetch<Record<string, any> | null>(
      `*[_id == "siteSettings"][0]{
        ..., "processProjectSlug": processProject->slug.current,
        reelChapters[]{start, label, "project": project->{"slug": slug.current, title}}
      }`,
    );
    if (!s) return d;
    const chapters: ReelChapter[] = (s.reelChapters ?? []).map((c: any) => ({ ...c, start: toSeconds(c.start) }));
    return {
      heroTitle: s.heroTitle || d.heroTitle,
      heroLede: s.heroLede || d.heroLede,
      intro: s.intro || d.intro,
      process: {
        intro: s.processIntro || d.process.intro,
        stages: nonEmpty(s.processStages)
          ? s.processStages.map((st: any) => ({ id: st.stageId, title: st.title, body: st.body }))
          : d.process.stages,
        projectSlug: s.processProjectSlug || d.process.projectSlug,
      },
      servicesIntro: s.servicesIntro || d.servicesIntro,
      workIntro: s.workIntro || d.workIntro,
      about: {
        history: nonEmpty(s.aboutHistory) ? s.aboutHistory : d.about.history,
        mission: s.mission || d.about.mission,
      },
      contact: { ...d.contact, ...Object.fromEntries(Object.entries(s.contact ?? {}).filter(([, v]) => v)) },
      socials: nonEmpty(s.socials) ? s.socials : d.socials,
      reel: { youtubeId: s.reelYoutubeId || undefined, chapters },
      youtubeChannelId: s.youtubeChannelId || d.youtubeChannelId,
      liveBadge: s.liveBadge ?? d.liveBadge,
      brief: {
        budgets: nonEmpty(s.briefBudgets) ? s.briefBudgets : d.brief.budgets,
        timelines: nonEmpty(s.briefTimelines) ? s.briefTimelines : d.brief.timelines,
        successMessage: s.briefSuccessMessage || d.brief.successMessage,
      },
    } satisfies Settings;
  });
}
