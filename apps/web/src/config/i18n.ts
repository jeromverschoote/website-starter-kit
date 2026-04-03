const i18n = {
  defaultLocale: 'en',
  locales: ['en'],
} as const;

// export type TLocale = (typeof i18n)['locales'][number];
export type TLocale = string;

type TDictionary = typeof import('../dictionaries/en.json');

const dictionaries: Record<TLocale, () => Promise<TDictionary>> =
  Object.fromEntries(
    i18n.locales.map((locale) => [
      locale,
      () =>
        import(`../dictionaries/${locale}.json`).then(
          (module) => module.default as TDictionary,
        ),
    ]),
  ) as Record<TLocale, () => Promise<TDictionary>>;

export type { TDictionary };

export const getOptions = (lng = i18n.defaultLocale as string) => {
  return {
    supportedLngs: i18n.locales,
    fallbackLng: i18n.defaultLocale,
    lng,
    fallbackNS: 'translations',
  };
};

export const getDictionary = async (locale: TLocale): Promise<TDictionary> => {
  const loader = dictionaries[locale];
  if (!loader) {
    throw new Error(`Dictionary not found for locale "${locale}"`);
  }
  return loader();
};

export default i18n;
