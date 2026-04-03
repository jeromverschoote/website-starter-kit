import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';
import IconSelectInput from '../../components/icon-select-input';
import UrlInput from '../../components/url-input';
import { ThumbsUpIcon } from '@sanity/icons';

export default asSettingsModel({
  name: 'socials-settings',

  fields: [
    defineField({
      name: 'button',
      type: 'object',

      title: 'Button',

      fields: [
        {
          name: 'link',
          type: 'object',

          title: 'Link',
          description:
            'A URL that directs visitors to your organization’s profiles on social media platforms, allowing users to easily connect, follow, or engage further with your content.',

          fields: [
            {
              name: 'url',
              type: 'string',
            },
            {
              name: 'isExternal',
              type: 'boolean',
            },
          ],

          components: {
            input: UrlInput as any,
          },
        },
        { name: 'label', type: 'string', title: 'Label' },
        {
          name: 'icon',
          type: 'object',

          title: 'Icon',
          description:
            'An icon that visually represents the corresponding social media platform or link. It helps users quickly recognize and access your social profiles, encouraging community growth and engagement.',

          fields: [
            {
              name: 'type',
              type: 'string',
            },
            {
              name: 'accessor',
              type: 'string',
            },
          ],

          components: {
            input: IconSelectInput as any,
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'button.icon.accessor',
    },
    prepare: ({ title }: { title: string }) => ({
      title: title ? `${title[0].toUpperCase()}${title.slice(1)}` : '[Empty]',
      media: ThumbsUpIcon,
    }),
  },
});
