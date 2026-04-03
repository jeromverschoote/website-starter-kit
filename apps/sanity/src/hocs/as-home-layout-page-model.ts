import { defineField, defineType } from 'sanity';
import type { FieldDefinition, FieldGroupDefinition, ObjectDefinition, PreviewConfig } from 'sanity';

type TProps = {
  name: string;
  title?: string;
  description?: string;
  sections?: ObjectDefinition[];
  fields?: FieldDefinition[];
  groups?: FieldGroupDefinition[];
  preview?: PreviewConfig;
};

const asHomeLayoutPageModel = (props: TProps) => {
  const { name, title, description, sections, fields, groups, preview } = props;

  const defaultFields: FieldDefinition[] = [
    defineField({
      name: 'language',
      type: 'string',
      title: 'Language',
      readOnly: true,
      description:
        'Read-only. Set the language using the "Translations" button in the top-right corner.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSection',
      type: 'object',
      title: 'Hero section',
      description:
        'The large prominent area at the top of the homepage. Sets the first impression and guides users toward key actions.',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          description: 'Main headline that draws attention.',
        }),
        defineField({
          name: 'description',
          type: 'text',
          title: 'Description',
          description: 'Short supporting paragraph or tagline below the headline.',
        }),
      ],
    }),
  ];

  const sectionsField: FieldDefinition[] = sections?.length
    ? [
        defineField({
          name: 'sections',
          type: 'array',
          title: 'Sections',
          description: 'Add and reorder sections to build the page layout.',
          of: sections.map((s) => ({ type: s.name })),
        }),
      ]
    : [];

  return defineType({
    type: 'document',
    name,
    title,
    description,
    groups: [...(groups ?? [])],
    fields: [...defaultFields, ...sectionsField, ...(fields ?? [])],
    preview,
  });
};

export default asHomeLayoutPageModel;
