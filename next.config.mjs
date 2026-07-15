/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  ...(isProd
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
]

const nextConfig = {
  // Match sitemap.xml (no trailing slashes) — avoids /page vs /page/ duplicate content.
  trailingSlash: false,
  async headers() {
    const indexFollow = {
      key: 'X-Robots-Tag',
      value: 'index, follow, max-image-preview:large, max-snippet:-1',
    }
    const noindex = { key: 'X-Robots-Tag', value: 'noindex, nofollow' }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Public pages — explicit allow for crawlers / AI agents (never noindex)
      { source: '/', headers: [indexFollow] },
      { source: '/blog', headers: [indexFollow] },
      { source: '/blog/:path*', headers: [indexFollow] },
      { source: '/download', headers: [indexFollow] },
      { source: '/terms', headers: [indexFollow] },
      { source: '/privacy', headers: [indexFollow] },
      { source: '/subscription-policy', headers: [indexFollow] },
      { source: '/health-disclaimer', headers: [indexFollow] },
      // Session-gated surfaces — keep out of SERP / agent indexes
      { source: '/dashboard', headers: [noindex] },
      { source: '/dashboard/:path*', headers: [noindex] },
      { source: '/auth', headers: [noindex] },
      { source: '/auth/:path*', headers: [noindex] },
    ]
  },
}

export default nextConfig
