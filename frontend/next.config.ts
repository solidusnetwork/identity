import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  org: 'solidusnetwork',
  project: 'identity',
  silent: true,
  disableLogger: true,
  sourcemaps: { disable: true },
})
