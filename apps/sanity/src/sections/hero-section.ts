import { defineField } from 'sanity';
import { StarIcon } from '@sanity/icons';

import asSectionModel from '../hocs/as-section-model';

export default asSectionModel({
  name: 'hero-section',
  title: 'Hero',
  description:
    'A large prominent area at the top of the page with a headline and call-to-action.',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      description: 'Main headline displayed in the hero.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      type: 'text',
      title: 'Subheading',
      description: 'Short supporting text below the headline.',
      rows: 3,
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      title: 'CTA label',
      description: 'Text for the primary call-to-action button.',
    }),
    defineField({
      name: 'ctaUrl',
      type: 'url',
      title: 'CTA URL',
      description: 'Destination when the CTA button is clicked.',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return { title: title ?? 'Hero', subtitle: 'Hero' };
    },
  },
});
