import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  productionBrowserSourceMaps: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  transpilePackages: ['@repo/ui'],

  // experimental: {
  //   viewTransition: true,
  // },

  htmlLimitedBots: /.*/,
};

module.exports = nextConfig;
