import type { ComponentType } from 'react';

/** Minimal shape every Sanity section object shares. */
export type TSection = {
  _key: string;
  _type: string;
  sectionId?: string;
};

/** A front-end component that renders one section. */
export type TSectionComponent = ComponentType<{
  section: TSection;
  locale?: string;
}>;

/**
 * Maps a Sanity section `_type` to the React component that renders it.
 * Register a component for each section here, e.g.:
 *
 *   import HeroSection from 'components/sections/hero-section';
 *   export const sectionComponents = { 'hero-section': HeroSection };
 *
 * `DynamicSections` skips any `_type` that has no registered component.
 */
export const sectionComponents: Record<string, TSectionComponent> = {};
