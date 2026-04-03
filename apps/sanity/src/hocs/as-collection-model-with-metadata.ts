import { defineField } from 'sanity';
import type { FieldDefinition, FieldGroupDefinition, PreviewConfig } from 'sanity';

import asCollectionModel from './as-collection-model';

type TProps = {
  name: string;
  title: string;
  icon?: React.ComponentType;
  fields?: FieldDefinition[];
  groups?: FieldGroupDefinition[];
  preview?: PreviewConfig;
};

const asCollectionModelWithMetadata = (props: TProps) => {
  const { name, title, icon, fields, groups, preview } = props;

  const metaGroup: FieldGroupDefinition = { name: 'meta', title: 'Metadata' };

  const metaFields: FieldDefinition[] = [
    defineField({
      name: 'meta',
      type: 'object',
      group: 'meta',
      title: 'Metadata',
      description:
        'How your content appears in search engines, social media previews, and external platforms.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'category',
          type: 'string',
          title: 'Category',
          description: 'Classifies the content into a topic or section.',
          validation: (rule) => rule.required(),
        }),
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
          name: 'keywords',
          type: 'text',
          title: 'Keywords',
          description: 'Comma-separated words or phrases relevant to this content.',
        }),
      ],
    }),

    defineField({
      name: 'meta_opengraph',
      type: 'object',
      group: 'meta',
      title: 'OpenGraph',
      description: 'Controls how this content appears when shared on social media.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          title: 'Type',
          description: 'Content type for social platforms.',
          options: {
            list: [
              { title: 'Website', value: 'website' },
              { title: 'Article', value: 'article' },
              { title: 'Profile', value: 'profile' },
              { title: 'Video', value: 'video.other' },
              { title: 'Music', value: 'music.other' },
            ],
            layout: 'radio',
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          description: 'Title shown in social media previews.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          type: 'text',
          title: 'Description',
          description: 'Summary shown in social media previews.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          description: 'Image shown when shared on social media.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ];

  // Compose the base model, then inject the meta group and fields
  const base = asCollectionModel({
    name,
    title,
    icon,
    fields: [...(fields ?? []), ...metaFields],
    groups: [...(groups ?? []), metaGroup],
    preview,
  });

  return base;
};

export default asCollectionModelWithMetadata;
