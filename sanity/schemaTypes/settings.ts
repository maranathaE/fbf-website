import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home', default: true },
    { name: 'pages', title: 'Pages' },
    { name: 'reel', title: 'Showreel' },
    { name: 'contact', title: 'Contact & socials' },
    { name: 'brief', title: 'Brief form options' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      type: 'string',
      group: 'home',
      description: 'Wrap the highlighted word in asterisks, e.g. We make ideas *move*, frame by frame.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroLede', title: 'Hero text', type: 'text', rows: 2, group: 'home' }),
    defineField({ name: 'intro', title: 'Studio intro', type: 'text', rows: 3, group: 'home' }),
    defineField({ name: 'processIntro', title: 'Process intro', type: 'text', rows: 2, group: 'home' }),
    defineField({
      name: 'processStages',
      title: 'Process stages',
      type: 'array',
      group: 'home',
      validation: (r) => r.length(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stage',
          fields: [
            defineField({
              name: 'stageId',
              type: 'string',
              options: { list: ['concept', 'design', 'execution'] },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'body', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'processProject',
      title: 'Process example project',
      type: 'reference',
      to: [{ type: 'project' }],
      group: 'home',
      description: 'Its cover image is drawn as a sketch, then flat colour, then the final frame.',
    }),
    defineField({ name: 'servicesIntro', type: 'text', rows: 3, group: 'pages' }),
    defineField({ name: 'workIntro', type: 'text', rows: 2, group: 'pages' }),
    defineField({ name: 'aboutHistory', title: 'About: our history', type: 'array', of: [{ type: 'text' }], group: 'pages' }),
    defineField({ name: 'mission', type: 'string', group: 'pages' }),
    defineField({
      name: 'reelYoutubeId',
      title: 'Showreel YouTube ID',
      type: 'string',
      group: 'reel',
      description: 'Leave empty to play the featured projects one after another instead.',
    }),
    defineField({
      name: 'reelChapters',
      title: 'Chapters',
      type: 'array',
      group: 'reel',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({ name: 'start', title: 'Starts at (m:ss)', type: 'string', validation: (r) => r.required().regex(/^\d+:\d\d$/) }),
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'project', type: 'reference', to: [{ type: 'project' }] }),
          ],
          preview: { select: { title: 'label', subtitle: 'start' } },
        }),
      ],
    }),
    defineField({
      name: 'contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'email', type: 'string', validation: (r) => r.required().email() }),
        defineField({ name: 'phone', type: 'string' }),
        defineField({ name: 'hours', type: 'string' }),
        defineField({ name: 'address', type: 'text', rows: 2 }),
        defineField({ name: 'mapUrl', title: 'Map link', type: 'url' }),
      ],
    }),
    defineField({
      name: 'socials',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'url', type: 'url' })],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'youtubeChannelId',
      title: 'YouTube channel ID',
      type: 'string',
      group: 'contact',
      description: 'Used by the "live now" badge. Starts with UC.',
    }),
    defineField({ name: 'liveBadge', title: 'Show the "live now" badge', type: 'boolean', group: 'contact', initialValue: true }),
    defineField({ name: 'briefBudgets', title: 'Budget options', type: 'array', of: [{ type: 'string' }], group: 'brief' }),
    defineField({ name: 'briefTimelines', title: 'Timeline options', type: 'array', of: [{ type: 'string' }], group: 'brief' }),
    defineField({ name: 'briefSuccessMessage', title: 'Thank-you message', type: 'text', rows: 2, group: 'brief' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

/**
 * Where briefs go. Stored under a private document ID (secrets.briefSettings),
 * so it is never readable from the public API, only by the site's server and logged-in staff.
 */
export const briefSettings = defineType({
  name: 'briefSettings',
  title: 'Brief inbox',
  type: 'document',
  fields: [
    defineField({
      name: 'recipients',
      title: 'Send briefs to',
      type: 'array',
      of: [{ type: 'string', validation: (r) => r.email() }],
      description: 'Every address here gets an email when someone sends a brief.',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'storeCopy',
      title: 'Also keep a copy here in the CMS',
      type: 'boolean',
      description: 'Saved under "Briefs received", so nothing is lost if an email goes astray.',
      initialValue: true,
    }),
    defineField({ name: 'subjectPrefix', title: 'Email subject prefix', type: 'string', initialValue: 'New brief' }),
  ],
  preview: { prepare: () => ({ title: 'Brief inbox' }) },
});
