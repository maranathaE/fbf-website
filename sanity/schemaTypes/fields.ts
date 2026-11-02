import { defineField } from 'sanity';

/** An image that always carries alt text. */
export const imageWithAlt = (name: string, title: string, options: { required?: boolean; description?: string; group?: string } = {}) =>
  defineField({
    name,
    title,
    type: 'image',
    description: options.description,
    group: options.group,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe what is in the image for people using screen readers. Leave empty only for pure decoration.',
      }),
    ],
    validation: options.required ? (rule) => rule.required() : undefined,
  });

export const serviceOptions = [
  { title: 'Animation', value: 'animation' },
  { title: 'Content production', value: 'production' },
  { title: 'Live streaming', value: 'live' },
];
