import { defineField, defineType } from 'sanity';
import type { ComponentType } from 'react';
import type { FieldDefinition, FieldGroupDefinition, PreviewConfig } from 'sanity';

type TProps = {
  name: string;
  title?: string;
  description?: string;
  icon?: ComponentType;
  fields: FieldDefinition[];
  groups?: FieldGroupDefinition[];
  preview?: PreviewConfig;
};

/**
 * Optional anchor id, added to every section. Lets editors deep-link to a
 * section via a URL hash (e.g. #about-us); the front-end renderer wraps the
 * section in an element carrying this id.
 */
const sectionIdField: FieldDefinition = defineField({
  name: 'sectionId',
  type: 'string',
  title: 'Section ID',
  description:
    'Optional anchor ID for this section (e.g. "about-us"). Used to deep-link to it via a URL hash (#about-us).',
  validation: (rule) =>
    rule
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: 'slug', invert: false })
      .warning('Use lowercase letters, numbers and hyphens only (e.g. "about-us").'),
});

/**
 * HOC for creating page section object types.
 * Sections are Sanity `object` types (not documents) — they only exist
 * within the `sections` array field on a page layout document.
 */
const asSectionModel = (props: TProps) => {
  const { name, title, description, icon, fields, groups, preview } = props;

  return defineType({
    type: 'object',
    name,
    title,
    description,
    icon,
    groups: [...(groups ?? [])],
    fields: [sectionIdField, ...fields],
    preview,
  });
};

export default asSectionModel;
