import { icons } from '@phosphor-icons/core';
import { SearchIcon } from '@sanity/icons';
import {
  Autocomplete,
  Card,
  Flex,
  Label,
  Select,
  Stack,
  Text,
} from '@sanity/ui';
import { ObjectInputProps, set, unset } from 'sanity';

import { FONT_AWESOME_NAMES } from '@repo/ui/icon-names';

import Icon, { DEFAULT_WEIGHT, ICON_WEIGHTS, toIconWeight } from '../icon';

type TProps = ObjectInputProps<{
  type?: string;
  accessor?: string;
}>;

type TOption = { value: string; search: string };

// Every Phosphor icon (31 Oct 2026; Font Awesome Pro before), about 1,500,
// searchable by name, tag and category. The list ships with the studio, so
// the picker needs no request — Font Awesome's picker fetched its metadata
// from GitHub on every mount.
const OPTIONS: TOption[] = icons.map((icon) => ({
  value: icon.name,
  search: [icon.name, ...icon.tags, ...icon.categories].join(' ').toLowerCase(),
}));

const NAMES = new Set(OPTIONS.map((option) => option.value));

const toMatch = (query: string, option: TOption) =>
  query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => option.search.includes(word));

/**
 * The icon picker: a search over every icon with a preview, and the weight
 * (thin to fill). Stored as `{ type: weight, accessor: name }`, the shape the
 * site reads.
 */
const IconSelectInput = (props: TProps) => {
  const { value, onChange } = props;

  const isUnknown = Boolean(value?.accessor && !NAMES.has(value.accessor));
  // An old Font Awesome name carries a Font Awesome style ("regular"), not a
  // chosen weight: a new pick starts in the site's default weight.
  const weight = isUnknown ? DEFAULT_WEIGHT : toIconWeight(value?.type);
  // What the migration turns an old Font Awesome name into.
  const successor = isUnknown
    ? FONT_AWESOME_NAMES[value?.accessor ?? '']
    : undefined;

  // Opening the list makes the chosen name the query (Sanity UI's
  // Autocomplete), which would show that one icon, or none for an old name:
  // the list opens whole, and typing filters it.
  const toVisible = (query: string, option: TOption) =>
    query === value?.accessor || toMatch(query, option);

  const handleIcon = (accessor: string) =>
    onChange(accessor ? set({ type: weight, accessor }) : unset());

  const handleWeight = (event: React.ChangeEvent<HTMLSelectElement>) =>
    onChange(set({ ...value, type: event.currentTarget.value }));

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Label>Icon</Label>
        <Autocomplete
          id="icon-select-input"
          icon={SearchIcon}
          placeholder="Search in English: house, tree, leaf, hammer, …"
          options={OPTIONS}
          value={value?.accessor ?? ''}
          filterOption={toVisible}
          onChange={handleIcon}
          openButton
          renderValue={(name) => name}
          renderOption={(option: TOption) => (
            <Card as="button" padding={2}>
              <Flex align="center" gap={3}>
                <Icon accessor={option.value} type={weight} />
                <Text size={1}>{option.value}</Text>
              </Flex>
            </Card>
          )}
        />
      </Stack>

      <Stack space={3}>
        <Label>Weight</Label>
        <Select value={weight} onChange={handleWeight}>
          {ICON_WEIGHTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Stack>

      {value?.accessor && !isUnknown && (
        <Card padding={3} radius={2} border>
          <Flex align="center" gap={3}>
            <Icon accessor={value.accessor} type={weight} size={32} />
            <Text size={1} muted>
              {value.accessor}
            </Text>
          </Flex>
        </Card>
      )}

      {isUnknown && (
        <Card padding={3} radius={2} tone="caution" border>
          {successor ? (
            <Flex align="center" gap={3}>
              <Icon accessor={successor} type={DEFAULT_WEIGHT} size={32} />
              <Text size={1}>
                “{value?.accessor}” is an old Font Awesome name. The site shows
                “{successor}” for it; pick it above to keep it, or choose
                another.
              </Text>
            </Flex>
          ) : (
            <Text size={1}>
              “{value?.accessor}” is not an icon in the list. Pick one above.
            </Text>
          )}
        </Card>
      )}
    </Stack>
  );
};

export default IconSelectInput;
