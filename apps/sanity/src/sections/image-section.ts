import { defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';

import asSectionModel from '../hocs/as-section-model';

export default asSectionModel({
  name: 'image-section',
  title: 'Image',
  description: 'A full-width or contained image with an optional caption.',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional text displayed below the image.',
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description: 'Describes the image for screen readers and search engines.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      media: 'image',
    },
    prepare({ title, media }) {
      return { title: title ?? 'Image', media };
    },
  },
});
