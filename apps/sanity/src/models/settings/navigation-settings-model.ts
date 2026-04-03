import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';
import UrlInput from '../../components/url-input';

export default asSettingsModel({
  name: 'navigation-settings',
  title: 'Navigation',
  localized: true,

  fields: [
    defineField({
      name: 'items',
      type: 'array',
      title: 'Navigation items',
      description: 'Links shown in the header navigation. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'navigationItem',
          title: 'Item',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'Text displayed for this navigation link.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                { name: 'url', type: 'string' },
                { name: 'isExternal', type: 'boolean' },
              ],
              components: {
                input: UrlInput as any,
              },
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'link.url' },
          },
        },
      ],
    }),
  ],
});
