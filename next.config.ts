import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.annihil.us',
      },
    ],
  },
};

export default nextConfig;
