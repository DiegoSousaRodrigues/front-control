import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'j4bj5jtuqu9cucfs.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
