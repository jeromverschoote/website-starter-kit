import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';
import { DocumentTextIcon } from '@sanity/icons';

export default asSettingsModel({
  name: 'documents-settings',

  fields: [
    defineField({
      name: 'label',
      type: 'string',

      title: 'Label',
      description:
        'A concise, user-friendly name or title for a downloadable document. It clearly identifies the document’s contents, helping visitors quickly understand its relevance and purpose.',
      placeholder: 'Cookie Policy',

      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      type: 'file',

      title: 'File',
      description:
        'The actual file provided for download. It contains the content described by the document label and can include guides, reports, checklists, or other resources relevant to your content.',

      options: {
        accept: 'application/pdf',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'label',
    },
    prepare: ({ title }: { title: string }) => ({
      title,
      media: DocumentTextIcon,
    }),
  },
});
