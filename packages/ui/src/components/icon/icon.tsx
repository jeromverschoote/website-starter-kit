// Every Phosphor icon is imported, about 1,500, because editors pick an icon
// by name in Sanity and this component has to be able to draw whichever one
// they picked (31 Oct 2026; Font Awesome Pro before, which imported whole
// style packs for the same reason).
//
// Unlike the sibling projects this template is copied from, the Icon is not
// `server-only` here: this package's own primitives are client components
// that draw icons (select, link) and so is the cookie banner. A fork that
// cares about the client bundle should render the Icon on the server and pass
// it into the client component as a node, or draw that one glyph inline, and
// then add `import 'server-only';` above.
import { createElement } from 'react';

import type { Icon as TPhosphorIcon, IconWeight } from '@phosphor-icons/react';
import * as icons from '@phosphor-icons/react/ssr';

import { FONT_AWESOME_NAMES, toComponentName } from './icon-names';

import { toClassName } from '../../helpers/format';

type TProps = {
  /** A Phosphor name in kebab case, such as `caret-down`. */
  accessor?: string;
  /** A Phosphor weight; anything else (an old Font Awesome style) is bold. */
  type?: string;
  className?: string;
  size?: string;
};

const WEIGHTS = new Set<string>([
  'thin',
  'light',
  'regular',
  'bold',
  'fill',
  'duotone',
]);

const toIcon = (accessor: string) => {
  const name = FONT_AWESOME_NAMES[accessor] ?? accessor;
  return (icons as unknown as Record<string, TPhosphorIcon | undefined>)[
    toComponentName(name)
  ];
};

const Icon = (props: TProps) => {
  const {
    accessor = 'question',
    type = 'bold',
    className = 'text-lg',
    size = '16px',
  } = props;

  const Component = toIcon(accessor);
  const weight = (WEIGHTS.has(type) ? type : 'bold') as IconWeight;

  // A span, not a div: the Icon sits inside buttons and spans, where a div is
  // not allowed. `flex` keeps the box the div had.
  return (
    <span
      className={toClassName(
        'w-[14px] sm:w-[16px] flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* `1em`, not `100%`: Font Awesome sized its glyph by the font size, so
          the call sites say `text-xs` and `text-lg` and expect that to carry. */}
      {Component &&
        createElement(Component, { weight, size: '1em', 'aria-hidden': true })}
    </span>
  );
};

export default Icon;
