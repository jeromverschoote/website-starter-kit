import { MetadataRoute } from 'next';

import i18n from 'config/i18n';

const sitemap = (): MetadataRoute.Sitemap => {
  const base = process.env.NEXT_SITEMAP_BASE_DOMAIN_URL;

  const languages = i18n.locales;

  // Add your page slugs here
  const pages: string[] = ['about', 'contact'];

  const handleGenerateSitemap = (): MetadataRoute.Sitemap => {
    const result: MetadataRoute.Sitemap = [];

    result.push({
      url: `${base}`,
      priority: 1,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    });

    languages.forEach((lang) => {
      result.push({
        url: `${base}/${lang}`,
        priority: 0.9,
        lastModified: new Date(),
        changeFrequency: 'yearly',
      });

      pages.forEach((page) => {
        result.push({
          url: `${base}/${lang}/${page}`,
          priority: 0.8,
          lastModified: new Date(),
          changeFrequency: 'yearly',
        });
      });
    });

    return result;
  };

  return handleGenerateSitemap();
};

export default sitemap;
