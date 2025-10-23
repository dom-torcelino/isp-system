import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.extensions = Array.from(new Set([
      '.ts', '.tsx', '.js', '.jsx', '.json',
      ...(config.resolve.extensions || []),
    ]));
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd(), './src'),
    };
    return config;
  },
};

export default nextConfig;
