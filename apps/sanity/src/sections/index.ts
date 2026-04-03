import type { ObjectDefinition } from 'sanity';
import type { ComponentType } from 'react';

import heroSection from './hero-section';
import richTextSection from './rich-text-section';
import imageSection from './image-section';

export type SectionEntry = {
  model: ObjectDefinition;
  title: string;
  icon?: ComponentType;
};

/** All section object definitions — passed to deriveAllModels so Sanity registers the types */
export const allSectionModels: ObjectDefinition[] = [
  heroSection,
  richTextSection,
  imageSection,
];

/** Registry entries for the sections — used to add metadata (title, icon) alongside the model */
export const sectionEntries: SectionEntry[] = [
  { model: heroSection, title: 'Hero', icon: heroSection.icon as any },
  { model: richTextSection, title: 'Rich text', icon: richTextSection.icon },
  { model: imageSection, title: 'Image', icon: imageSection.icon },
  // Add new sections here — nothing else to touch
];
