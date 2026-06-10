/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { domains: ['sre-edu-os-uploads.s3.ap-south-1.amazonaws.com', 'ui-avatars.com'] },
  async rewrites() {
    return [{ source: '/api/proxy/:path*', destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*` }];
  },
};
module.exports = nextConfig;
