import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  convertDateToHHmm,
  handleConvertToLocale,
  handleFormatDate,
  handleGenerateInitialsFromName,
  slugify,
  sortByDate,
  toClassName,
} from './format';

describe('toClassName', () => {
  it('joins truthy class names and filters falsy ones', () => {
    expect(toClassName('foo', false, undefined, 'bar')).toBe('foo bar');
  });

  it('returns an empty string when everything is falsy', () => {
    expect(toClassName(false, undefined)).toBe('');
  });
});

describe('handleGenerateInitialsFromName', () => {
  it('returns the first character of a name', () => {
    expect(handleGenerateInitialsFromName('Jerom')).toBe('J');
  });

  it('returns the input unchanged when empty', () => {
    expect(handleGenerateInitialsFromName('')).toBe('');
  });
});

describe('handleFormatDate', () => {
  const dict = { enum: { date: { month: { '5': 'June' } } } };

  it('formats a date using the supplied month dictionary', () => {
    expect(handleFormatDate('2024-06-15T12:00:00', dict)).toBe('15 June 2024');
  });

  it('renders undefined when the month is missing from the dictionary', () => {
    expect(handleFormatDate('2024-06-15T12:00:00', {})).toBe('15 undefined 2024');
  });
});

describe('handleConvertToLocale', () => {
  it.each([
    ['nl', 'nl-BE'],
    ['fr', 'fr-BE'],
    ['en', 'en'],
  ])('maps %s to %s', (input, expected) => {
    expect(handleConvertToLocale(input)).toBe(expected);
  });

  it('passes unknown languages through unchanged', () => {
    expect(handleConvertToLocale('de')).toBe('de');
  });
});

describe('convertDateToHHmm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('formats hours and minutes with zero padding', () => {
    expect(convertDateToHHmm(new Date(2024, 0, 1, 9, 5))).toBe('09:05');
  });

  it('returns an empty string and logs for an invalid date', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(convertDateToHHmm(new Date('not-a-date'))).toBe('');
    expect(spy).toHaveBeenCalled();
  });
});

describe('sortByDate', () => {
  const items = [
    { date: '2024-03-01' },
    { date: '2024-01-01' },
    { date: new Date('2024-02-01') },
  ];

  it('sorts ascending by default', () => {
    expect(sortByDate(items).map((i) => i.date)).toEqual([
      '2024-01-01',
      new Date('2024-02-01'),
      '2024-03-01',
    ]);
  });

  it('sorts descending when requested', () => {
    expect(sortByDate(items, 'desc')[0]!.date).toBe('2024-03-01');
  });

  it('does not mutate the input array', () => {
    const input = [{ date: '2024-02-01' }, { date: '2024-01-01' }];
    sortByDate(input);
    expect(input[0]!.date).toBe('2024-02-01');
  });
});

describe('slugify', () => {
  it('lowercases, strips punctuation and collapses whitespace/dashes', () => {
    expect(slugify('Hello,  World!!')).toBe('hello-world');
    expect(slugify('Foo --- Bar')).toBe('foo-bar');
  });
});
