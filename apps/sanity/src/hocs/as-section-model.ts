import { defineType } from 'sanity';
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
    fields,
    preview,
  });
};

export default asSectionModel;
