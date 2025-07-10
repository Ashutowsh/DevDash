import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    ignoreDuringBuilds: true
  },

  typescript: {
    ignoreBuildErrors: true
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Force bundling of Prisma client
      config.externals = config.externals || [];
      config.externals.push('bufferutil', 'utf-8-validate'); // optional, silences ws warnings
    }

    return config;
  },

  output: 'standalone'
};



export default nextConfig;
