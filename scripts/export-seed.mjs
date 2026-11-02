// Writes content/seed.ndjson: the seed content as Sanity documents, with images attached
// from content/raw/. Import it once into a fresh dataset:
//   npx sanity dataset import content/seed.ndjson production
// (see docs/cms.md). Document IDs are stable, so re-importing with --replace updates in place.
import { build } from 'esbuild';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const RAW = path.join(root, 'content/raw');

// The seed is TypeScript; bundle it to a temporary module and import that.
const out = path.join(root, 'node_modules/.cache/fbf-seed.mjs');
await build({ entryPoints: [path.join(root, 'src/data/seed/index.ts')], bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error' });
const seed = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
const manifest = (await import(pathToFileURL(path.join(root, 'src/data/media-manifest.json')).href, { with: { type: 'json' } })).default;

// '/media/2021/07/05-960.webp' → the original in content/raw
const original = (src) => {
  const base = src.replace(/^\/media\//, '').replace(/-\d+\.webp$/, '');
  const key = Object.keys(manifest).find((k) => k.replace(/\.(jpe?g|png)$/i, '') === base);
  if (!key) throw new Error(`no original for ${src}`);
  return pathToFileURL(path.join(RAW, key)).href;
};
const image = (img, alt = img?.alt) => img && { _type: 'image', _sanityAsset: `image@${original(img.src)}`, ...(alt ? { alt } : {}) };
const key = (i) => `k${i}`;
const ref = (id, i) => ({ _type: 'reference', _ref: id, _key: key(i) });

const docs = [];
seed.clients.forEach((c, i) =>
  docs.push({ _id: `client-${c.id}`, _type: 'client', name: c.name, logo: image(c.logo), onWall: c.onWall, order: i }),
);
seed.projects.forEach((p, i) =>
  docs.push({
    _id: `project-${p.slug}`,
    _type: 'project',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    clients: p.clients.map((c, k) => ref(`client-${c.id}`, k)),
    clientLabel: p.clientLabel,
    services: p.services,
    format: p.format,
    year: p.year,
    featured: p.featured,
    order: i,
    description: p.description,
    youtubeId: p.youtubeId,
    cover: image(p.cover),
    gallery: p.gallery.map((g, k) => ({ ...image(g), _key: key(k) })),
    credits: p.credits.map((c, k) => ({ _type: 'credit', _key: key(k), ...c })),
  }),
);
seed.team.forEach((m, i) =>
  docs.push({ _id: `team-${i + 1}`, _type: 'teamMember', name: m.name, nickname: m.nickname, role: m.role, photo: image(m.photo), current: true, order: i }),
);
seed.services.forEach((s, i) =>
  docs.push({ _id: `service-${s.id}`, _type: 'service', serviceId: s.id, title: s.title, summary: s.summary, body: s.body, formats: s.formats, icon: image(s.icon, ''), order: i }),
);
seed.timeline.forEach((t, i) =>
  docs.push({
    _id: `timeline-${i + 1}`,
    _type: 'timelineEntry',
    date: t.date,
    sortDate: `${t.date}-01-01`,
    title: t.title,
    body: t.body,
    image: image(t.image, ''),
    project: t.project && { _type: 'reference', _ref: `project-${t.project.slug}` },
  }),
);
const s = seed.settings;
docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  heroTitle: s.heroTitle,
  heroLede: s.heroLede,
  intro: s.intro,
  processIntro: s.process.intro,
  processStages: s.process.stages.map((st, k) => ({ _type: 'stage', _key: key(k), stageId: st.id, title: st.title, body: st.body })),
  processProject: { _type: 'reference', _ref: `project-${s.process.projectSlug}` },
  servicesIntro: s.servicesIntro,
  workIntro: s.workIntro,
  aboutHistory: s.about.history,
  mission: s.about.mission,
  contact: s.contact,
  socials: s.socials.map((x, k) => ({ _type: 'social', _key: key(k), ...x })),
  youtubeChannelId: s.youtubeChannelId,
  liveBadge: s.liveBadge,
  briefBudgets: s.brief.budgets,
  briefTimelines: s.brief.timelines,
  briefSuccessMessage: s.brief.successMessage,
});
docs.push({ _id: 'secrets.briefSettings', _type: 'briefSettings', recipients: [s.contact.email], storeCopy: true, subjectPrefix: 'New brief' });

const clean = (o) => JSON.parse(JSON.stringify(o)); // drops undefined fields
await writeFile(path.join(root, 'content/seed.ndjson'), docs.map((d) => JSON.stringify(clean(d))).join('\n') + '\n');
console.log(`content/seed.ndjson: ${docs.length} documents`);
