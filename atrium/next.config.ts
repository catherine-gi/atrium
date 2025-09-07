import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images :{
    remotePatterns: [
      {
        hostname:'pub-3a1aa1eeaa9f4db895d403db293e4ccf.r2.dev',
        protocol: 'https',
        port: '',
        pathname: "/**"
      }

    ]
  }
  /* config options here */
};

export default nextConfig;
