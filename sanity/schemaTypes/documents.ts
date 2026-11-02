import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, serviceOptions } from './fields';

export const client = defineType({
  name: 'client',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    imageWithAlt('logo', 'Logo', { description: 'SVG or a PNG with a transparent background works best.' }),
    defineField({
      name: 'onWall',
      title: 'Show on the client wall',
      type: 'boolean',
      description: 'Only switch on once we have permission to show the logo.',
      initialValue: true,
    }),
    defineField({ name: 'order', type: 'number', hidden: true }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
});

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'nickname', type: 'string' }),
    defineField({ name: 'role', type: 'string', validation: (r) => r.required() }),
    imageWithAlt('photo', 'Photo'),
    defineField({ name: 'bio', type: 'text', rows: 4 }),
    defineField({ name: 'current', title: 'Currently at the studio', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers come first.' }),
  ],
  orderings: [{ title: 'Manual order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});

export const service = defineType({
  name: 'service',
  type: 'document',
  fields: [
    defineField({
      name: 'serviceId',
      title: 'Service',
      type: 'string',
      options: { list: serviceOptions },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'summary', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 4 }),
    defineField({ name: 'formats', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    imageWithAlt('icon', 'Illustration'),
    defineField({ name: 'order', type: 'number' }),
  ],
  preview: { select: { title: 'title', subtitle: 'summary', media: 'icon' } },
});

export const timelineEntry = defineType({
  name: 'timelineEntry',
  title: 'Timeline entry',
  type: 'document',
  description: 'Behind-the-scenes moments shown on the About page.',
  fields: [
    defineField({ name: 'date', type: 'string', description: 'A year, or a month and year: "2019", "Mar 2024".', validation: (r) => r.required() }),
    defineField({ name: 'sortDate', title: 'Sort date', type: 'date', description: 'Used for ordering only.' }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 3 }),
    imageWithAlt('image', 'Image'),
    defineField({ name: 'project', type: 'reference', to: [{ type: 'project' }] }),
  ],
  orderings: [{ title: 'Date', name: 'date', by: [{ field: 'sortDate', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
});

export const briefSubmission = defineType({
  name: 'briefSubmission',
  title: 'Brief',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'receivedAt', type: 'datetime' }),
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'organisation', type: 'string' }),
    defineField({ name: 'services', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'budget', type: 'string' }),
    defineField({ name: 'timeline', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'emailed', title: 'Email sent', type: 'boolean' }),
  ],
  orderings: [{ title: 'Newest first', name: 'received', by: [{ field: 'receivedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'organisation', date: 'receivedAt' },
    prepare: ({ title, subtitle, date }) => ({
      title: title || 'Brief',
      subtitle: [subtitle, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '),
    }),
  },
});
