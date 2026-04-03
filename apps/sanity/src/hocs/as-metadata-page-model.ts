import { defineType, defineField } from 'sanity';
import type { FieldDefinition, FieldGroupDefinition, PreviewConfig } from 'sanity';

type TProps = {
  name: string;
  title?: string;
  description?: string;
  fields?: FieldDefinition[];
  groups?: FieldGroupDefinition[];
  preview?: PreviewConfig;
};

const asMetadataPageModel = (props: TProps) => {
  const { name, title, description, fields, groups, preview } = props;

  const defaultFields: FieldDefinition[] = [
    ...(name !== 'meta-settings'
      ? [
          defineField({
            name: 'language',
            type: 'string',
            title: 'Language',
            readOnly: true,
            description:
              'Read-only. Set the language using the "Translations" button in the top-right corner.',
            validation: (rule) => rule.required(),
          }),
        ]
      : []),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Appears in search engine results and browser tabs.',
      validation: (rule) => [rule.required().error(), rule.min(40).max(60).warning()],
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Brief summary shown beneath the title in search results.',
      validation: (rule) => [rule.required().error(), rule.min(140).max(160).warning()],
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      description: 'Classifies this page into a topic or section.',
      validation: (rule) => rule.required().error(),
    }),
    defineField({
      name: 'keywords',
      type: 'text',
      title: 'Keywords',
      description: 'Comma-separated words or phrases relevant to this page.',
    }),
    defineField({
      name: 'opengraph',
      type: 'object',
      title: 'OpenGraph',
      description: 'Controls how this page appears when shared on social media.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          title: 'Type',
          description: "e.g. 'website', 'article'",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          type: 'text',
          title: 'Description',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ];

  return defineType({
    type: 'document',
    name,
    title,
    description,
    groups: [...(groups ?? [])],
    fields: [...(fields ?? []), ...defaultFields],
    preview,
  });
};

export default asMetadataPageModel;
