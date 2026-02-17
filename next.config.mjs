/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.vercel.app", pathname: "/**" },
    ],
  },
};

export default nextConfig;
