import { Viewport } from 'next';
import './globals.css';

export const generateMetadata = async () => {
  const author = { name: process.env.AUTHOR_NAME, url: process.env.AUTHOR_URL };

  return {
    metadataBase: new URL(process.env.NEXT_SITEMAP_BASE_DOMAIN_URL ?? 'http://localhost:3000'),

    title: { template: '%s | Starter', default: 'Starter' },

    authors: [author],
    creator: author.name,
    publisher: author.name,

    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',

    appleWebApp: {
      title: 'Starter',
      statusBarStyle: 'black-translucent',
    },
  };
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export { default } from 'layouts/root';
