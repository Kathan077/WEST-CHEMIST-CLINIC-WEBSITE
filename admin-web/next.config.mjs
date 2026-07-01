/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
