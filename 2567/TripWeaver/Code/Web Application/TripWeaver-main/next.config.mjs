import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['thumbs.dreamstime.com', 'media-cdn.tripadvisor.com', 'dynamic-media-cdn.tripadvisor.com', 'i.ibb.co'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    async redirects() {
      return [];
    },
  };

export default withNextIntl(nextConfig);

