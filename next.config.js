const withTM = require('next-transpile-modules')(['antd', '@ant-design/icons', 'rc-util', 'rc-select', 'rc-menu', 'rc-pagination', 'rc-picker', 'rc-input']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  output: 'standalone',
  env: {
    API_SERVER_HOST: process.env.API_SERVER_HOST,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.com',
      },
      {
        protocol: 'https',
        hostname: '**.vn',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'example.vn',
      },
      {
        protocol: 'https',
        hostname: 'example.org', // Thêm hostname ví dụ .org
      },
    ],
  },
});

module.exports = nextConfig;
