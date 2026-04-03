import { defineType, defineField } from 'sanity';
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

const asLandingLayoutPageModel = (props: TProps) => {
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
      name: 'heading',
      type: 'string',
      title: 'Heading',
      description: 'Main on-page title that introduces the content of the page.',
    }),
    defineField({
      name: 'introduction',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Introduction',
      description: 'Short paragraph below the heading that sets the tone for the page.',
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

export default asLandingLayoutPageModel;
