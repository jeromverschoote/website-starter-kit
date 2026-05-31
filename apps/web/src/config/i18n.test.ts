import { describe, expect, it } from 'vitest';

import i18n, { getDictionary, getOptions } from './i18n';

describe('getOptions', () => {
  it('defaults the language to the default locale', () => {
    expect(getOptions()).toMatchObject({
      lng: i18n.defaultLocale,
      fallbackLng: i18n.defaultLocale,
      supportedLngs: i18n.locales,
      fallbackNS: 'translations',
    });
  });

  it('uses the provided language', () => {
    expect(getOptions('fr').lng).toBe('fr');
  });
});

describe('getDictionary', () => {
  it('loads the dictionary for a supported locale', async () => {
    const dictionary = await getDictionary('en');
    expect(dictionary).toBeTypeOf('object');
    expect(dictionary).not.toBeNull();
  });

  it('throws for an unsupported locale', async () => {
    await expect(getDictionary('xx')).rejects.toThrow(
      'Dictionary not found for locale "xx"',
    );
  });
});
