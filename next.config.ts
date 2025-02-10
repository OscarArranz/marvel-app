import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.annihil.us',
      },
    ],
  },

  // Development settings
  experimental: {
    turbo: {
      minify: false,
    },
  },
};

export default nextConfig;
