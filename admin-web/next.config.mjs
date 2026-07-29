/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'west-chemist-clinic-website.onrender.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
