/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack(config, { dev: isDev, isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });

    config.module.rules.push({
      test: /\.svg$/i,
      loader: 'next-image-loader',
      issuer: { not: /\.(css|scss|sass)$/ },
      dependency: { not: ['url'] },
      resourceQuery: { not: [/svgr/] }, // Ignore this rule if the path ends with *.svg?svgr
      options: { isServer, isDev, basePath: '', assetPrefix: '' },
    });

    return config;
  },
};

export default nextConfig;
