import { DocumentTextIcon } from '@sanity/icons';
import { defineField } from 'sanity';

import asCollectionModelWithMetadata from '../../hocs/as-collection-model-with-metadata';

export default asCollectionModelWithMetadata({
  name: 'post-collection',
  title: 'Post',
  icon: DocumentTextIcon,

  groups: [{ name: 'content', title: 'Content' }],

  fields: [
    defineField({
      name: 'image',
      type: 'image',
      group: 'content',
      title: 'Image',
      description: 'Cover image or thumbnail for this post.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      group: 'content',
      title: 'Summary',
      description: 'Short description shown in listing views.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
      title: 'Content',
      description: 'Main body of the post. Supports rich text formatting.',
      validation: (rule) => rule.required(),
    }),
  ],
});
