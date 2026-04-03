import i18n from 'config/i18n';

export const generateStaticParams = async () => {
  return i18n.locales.map((lang) => ({ lang }));
};

export { default } from 'layouts/shell';
