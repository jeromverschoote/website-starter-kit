import { defineField } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';

import asSectionModel from '../hocs/as-section-model';

export default asSectionModel({
  name: 'rich-text-section',
  title: 'Rich text',
  description: 'A block of formatted text content.',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Content',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      const firstBlock = Array.isArray(content) ? content[0] : null;
      const text = firstBlock?.children?.map((c: { text?: string }) => c.text).join('') ?? '';
      return { title: 'Rich text', subtitle: text };
    },
  },
});
