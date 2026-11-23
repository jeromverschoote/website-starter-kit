// The icon names the site and the studio share (31 Oct 2026; Font Awesome Pro
// before). No imports, so the studio and the content scripts can read it
// without pulling in the Icon component.

/**
 * The Font Awesome names this template drew before Phosphor (31 Oct 2026),
 * with their Phosphor name where it differs. A name that is the same in both
 * (`check`, `cookie`, `arrow-up-right`, `coffee`, `star`) is not listed: the
 * Icon falls through to the name it was given.
 *
 * The site renders an old name until `migrate-icons` has run on a dataset;
 * the migration and the studio's picker read this same list.
 */
export const FONT_AWESOME_NAMES: Record<string, string> = {
  'chevron-down': 'caret-down',
  'chevron-left': 'caret-left',
  'chevron-right': 'caret-right',
  'chevron-up': 'caret-up',
  xmark: 'x',
  facebook: 'facebook-logo',
  instagram: 'instagram-logo',
  linkedin: 'linkedin-logo',
};

/** `caret-down` → `CaretDown`, the name of its Phosphor component. */
export const toComponentName = (name: string) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
