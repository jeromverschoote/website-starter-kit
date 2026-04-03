import { Viewport } from 'next';

export const generateMetadata = async () => {
  return {
    title: 'Home',
    description: 'Welcome to the website.',
  };
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export { default } from 'views/home/landing';
