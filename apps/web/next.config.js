/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/types'],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
