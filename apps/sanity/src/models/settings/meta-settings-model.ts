import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';

export default asSettingsModel({
  name: 'meta-settings',
  title: 'Meta & SEO',

  fields: [
    defineField({
      name: 'siteTitle',
      type: 'string',
      title: 'Site title',
      description:
        'Default title used when no page-level title is set. Shown in browser tabs and search results.',
      placeholder: 'My Brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleTemplate',
      type: 'string',
      title: 'Title template',
      description:
        'Template for page titles. Use %s as a placeholder for the page title, e.g. "%s | My Brand".',
      placeholder: '%s | My Brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Default description',
      description:
        'Fallback meta description used when a page has no description set. Shown in search engine results.',
      validation: (rule) => [rule.required().error(), rule.min(140).max(160).warning()],
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Default OG image',
      description:
        'Fallback image shown when content is shared on social media and no page-level OG image is set.',
      options: { hotspot: true },
    }),
  ],
});
