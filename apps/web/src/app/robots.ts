import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
  const base = process.env.NEXT_SITEMAP_BASE_DOMAIN_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
};

export default robots;
