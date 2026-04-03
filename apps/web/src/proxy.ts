import { NextResponse, type NextRequest } from 'next/server';

import { match as matchLocale } from '@formatjs/intl-localematcher';

import Negotiator from 'negotiator';

import i18n from 'config/i18n';

const getLocale = (request: NextRequest): string | undefined => {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = [...i18n.locales];

  let locale = '';

  try {
    locale = matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    console.error(JSON.stringify(error));
    locale = i18n.defaultLocale;
  }

  return locale;
};

export const proxy = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  const locale = getLocale(request);

  const basePathsToIgnore = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/opengraph-image.png',
    '/opengraph-image.jpg',
    '/opengraph-image.alt.txt',
    '/twitter-image.png',
    '/twitter-image.jpg',
    '/twitter-image.alt.txt',
    '/manifest.json',
    '/site.webmanifest',
    '/shortcut-icon.png',

    // Next.js default assets
    '/file.svg',
    '/globe.svg',
    '/next.svg',
    '/vercel.svg',
    '/window.svg',
  ];

  const customPathsToIgnore = [
    '/images/logo-white.svg',
    //
  ];

  const redirects = [
    // Reroute dead links
    { from: '/homepage', to: '/' },
  ];

  if ([...basePathsToIgnore, ...customPathsToIgnore].includes(pathname)) return;

  // Check if any redirects are needed to be performed
  const pathnameNeedsNoRedirects = redirects.every(
    (redirect) => redirect.from !== pathname,
  );

  if (!pathnameNeedsNoRedirects) {
    const redirect = redirects.find((redirect) => redirect.from === pathname);

    if (redirect) {
      return NextResponse.redirect(
        new URL(`/${locale}${redirect.to}`, request.url),
      );
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `/${locale}`,
  );

  // // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return;
};

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};
