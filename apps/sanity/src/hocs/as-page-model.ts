import { defineType, defineField } from 'sanity';
import type { FieldDefinition, FieldGroupDefinition } from 'sanity';

type TProps = {
  name: string;
  title: string;
  fields: FieldDefinition[];
  groups: FieldGroupDefinition[];
  options?: {
    isDynamicZoneEnabled?: boolean;
  };
};

const asPageModel = (props: TProps) => {
  const { name, title, fields, groups, options } = props;

  const defaultGroups: FieldGroupDefinition[] = [
    { name: 'meta', title: 'Metadata' },
    { name: 'structure', title: 'Dynamic zone' },
    { name: 'settings', title: 'Settings' },
  ];

  const metaFields: FieldDefinition[] = [
    defineField({
      group: 'meta',
      name: 'meta_title',
      type: 'string',
      title: 'Title',
      description: 'Appears in search engine results and browser tabs.',
      validation: (rule) => rule.required().min(40).max(60).warning(),
    }),
    defineField({
      group: 'meta',
      name: 'meta_description',
      type: 'text',
      title: 'Description',
      description: 'Brief summary shown beneath the title in search results.',
      validation: (rule) => rule.required().min(140).max(160).warning(),
    }),
    defineField({
      group: 'meta',
      name: 'meta_keywords',
      type: 'text',
      title: 'Keywords',
      description: 'Comma-separated words or phrases relevant to this page.',
    }),
  ];

  const dynamicZoneFields: FieldDefinition[] = [
    defineField({
      group: 'structure',
      name: 'structure_components',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Components',
    }),
  ];

  const settingsFields: FieldDefinition[] = [
    defineField({
      group: 'settings',
      name: 'settings_visibility',
      type: 'boolean',
      options: { layout: 'checkbox' },
      title: 'Page is shown on website',
    }),
  ];

  return defineType({
    type: 'document',
    name,
    title,
    groups: [defaultGroups[0], ...groups, defaultGroups[1], defaultGroups[2]],
    fields: [
      ...metaFields,
      ...(options?.isDynamicZoneEnabled ? dynamicZoneFields : []),
      ...settingsFields,
      ...fields,
    ],
  });
};

export default asPageModel;
