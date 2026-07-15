import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import JsonLd from '@/components/seo/JsonLd'
import { rootMetadata } from '@/lib/seo/site-metadata'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = rootMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full overflow-x-clip`}>
      {/* No synchronous JS scripts in <head> — fonts via next/font (non-blocking). */}
      <body className={`${inter.className} h-full overflow-x-clip`}>
        {/* JSON-LD: application/ld+json data blocks (not classic JS) — safe for SEO parsers */}
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
