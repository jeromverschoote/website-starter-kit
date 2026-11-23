import * as icons from '@phosphor-icons/react';
import type { Icon as TPhosphorIcon, IconWeight } from '@phosphor-icons/react';

import { toComponentName } from '@repo/ui/icon-names';

/** The weights a Phosphor icon comes in (31 Oct 2026; Font Awesome Pro before). */
export const ICON_WEIGHTS: { label: string; value: IconWeight }[] = [
  { label: 'Thin', value: 'thin' },
  { label: 'Light', value: 'light' },
  { label: 'Regular', value: 'regular' },
  { label: 'Bold', value: 'bold' },
  { label: 'Fill', value: 'fill' },
  { label: 'Duotone', value: 'duotone' },
];

/** What a new icon starts with: the line weight the site draws in. */
export const DEFAULT_WEIGHT: IconWeight = 'bold';

export const toIconWeight = (type?: string): IconWeight =>
  ICON_WEIGHTS.find((weight) => weight.value === type)?.value ?? DEFAULT_WEIGHT;

type TProps = {
  /** A Phosphor name in kebab case, such as `caret-down`. */
  accessor?: string;
  type?: string;
  size?: number;
};

// The same icon as the site draws (packages/ui/src/components/icon), for the
// picker in the studio.
const Icon = (props: TProps) => {
  const { accessor, type, size = 18 } = props;

  const Component = accessor
    ? (icons as unknown as Record<string, TPhosphorIcon | undefined>)[
        toComponentName(accessor)
      ]
    : undefined;

  return (
    <span style={{ display: 'inline-flex', width: size, height: size }}>
      {Component && <Component size={size} weight={toIconWeight(type)} />}
    </span>
  );
};

export default Icon;
