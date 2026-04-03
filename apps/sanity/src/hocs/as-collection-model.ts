import { defineType, defineField } from 'sanity';
import type { FieldDefinition, FieldGroupDefinition, PreviewConfig } from 'sanity';

type TProps = {
  name: string;
  title: string;
  icon?: React.ComponentType;
  fields?: FieldDefinition[];
  groups?: FieldGroupDefinition[];
  preview?: PreviewConfig;
};

const asCollectionModel = (props: TProps) => {
  const { name, title, icon, fields, groups, preview } = props;

  const configGroup: FieldGroupDefinition = { name: 'config', title: 'Config' };

  const configFields: FieldDefinition[] = [
    defineField({
      name: 'language',
      type: 'string',
      group: 'config',
      title: 'Language',
      readOnly: true,
      description:
        'Read-only. Set the language using the "Translations" button in the top-right corner. If disabled, some required fields are still incomplete.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'string',
      group: 'config',
      title: 'Slug',
      description:
        'URL-friendly identifier (e.g. yourwebsite.com/slug). Keep it short, lowercase, and use hyphens instead of spaces.',
      validation: (rule) => rule.required().max(60).error(),
    }),
    defineField({
      name: 'sequence_number',
      type: 'number',
      group: 'config',
      title: 'Sequence number',
      description: 'Controls the display order. Lower numbers appear first.',
    }),
  ];

  return defineType({
    type: 'document',
    name,
    title,
    icon,
    groups: [configGroup, ...(groups ?? [])],
    fields: [...configFields, ...(fields ?? [])],
    preview,
  });
};

export default asCollectionModel;
