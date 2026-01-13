import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                // Optional but recommended: allow all paths under this hostname
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
