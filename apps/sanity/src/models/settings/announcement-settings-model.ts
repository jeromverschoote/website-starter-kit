import { defineField } from 'sanity';
import { PinIcon } from '@sanity/icons';

import asSettingsModel from '../../hocs/as-settings-model';
import IconSelectInput from '../../components/icon-select-input';
import UrlInput from '../../components/url-input';

export default asSettingsModel({
  name: 'announcement-settings',

  fields: [
    defineField({
      name: 'content',
      type: 'text',
      title: 'Content',
      description:
        'The message displayed in the announcement banner. Keep it short and clear.',
      placeholder: 'New collection just dropped — shop now before it sells out!',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      type: 'object',
      title: 'Icon',
      description: 'Optional icon displayed alongside the announcement message.',
      fields: [
        { name: 'type', type: 'string' },
        { name: 'accessor', type: 'string' },
      ],
      components: {
        input: IconSelectInput,
      },
    }),
    defineField({
      name: 'link',
      type: 'object',
      title: 'Link',
      description: 'Optional link to more details or a related page.',
      fields: [
        { name: 'url', type: 'string', title: 'URL' },
        { name: 'isExternal', type: 'boolean' },
      ],
      components: {
        input: UrlInput,
      },
    }),
    defineField({
      name: 'visibility',
      type: 'boolean',
      title: 'Show on website',
      description: 'Enable to display this announcement banner sitewide.',
    }),
  ],

  preview: {
    select: {
      title: 'content',
    },
    prepare: ({ title }: { title: string }) => ({
      title,
      media: PinIcon,
    }),
  },
});
