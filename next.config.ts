import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source:      '/:arId(AR-\\d{4}-.+)',
          destination: '/verify/:arId',
        },
      ],
      afterFiles: [
        {
          source:      '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
