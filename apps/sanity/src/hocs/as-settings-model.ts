import { defineField, defineType } from 'sanity';
import type { FieldDefinition, FieldGroupDefinition, PreviewConfig } from 'sanity';

type TProps = {
  name: string;
  title?: string;
  description?: string;
  localized?: boolean;
  fields?: FieldDefinition[];
  groups?: FieldGroupDefinition[];
  preview?: PreviewConfig;
  initialValue?: Record<string, unknown>;
};

const asSettingsModel = (props: TProps) => {
  const { name, title, description, localized, fields, groups, preview, initialValue } = props;

  const languageField: FieldDefinition[] = localized
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
    : [];

  return defineType({
    type: 'document',
    name,
    title,
    description,
    groups: [...(groups ?? [])],
    fields: [...languageField, ...(fields ?? [])],
    preview,
    initialValue,
  });
};

export default asSettingsModel;
