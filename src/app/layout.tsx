import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_ORIGIN } from '@/lib/seo/json-ld'
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'Kepton — Gamified ADHD Productivity & Focus Planner',
    template: '%s | Kepton',
  },
  description:
    'A gamified ADHD productivity app and visual planner that helps overcome focus challenges, time blindness, and executive dysfunction through spatial layouts and game mechanics.',
  applicationName: 'Kepton',
  icons: {
    icon: [
      { url: '/assets/brand/kepton-icon.svg', type: 'image/svg+xml' },
      { url: '/assets/brand/kepton-logo.png', type: 'image/png' },
    ],
    apple: '/assets/brand/kepton-logo.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_ORIGIN,
    siteName: 'Kepton',
    title: 'Kepton — Gamified ADHD Productivity & Focus Planner',
    description:
      'Focus tools built for ADHD brains — plant trees as you focus, plan visually, and beat time blindness.',
    images: [{ url: '/assets/brand/kepton-logo.png', alt: 'Kepton' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kepton — Gamified ADHD Productivity & Focus Planner',
    description:
      'Focus tools built for ADHD brains — plant trees as you focus, plan visually, and beat time blindness.',
    images: ['/assets/brand/kepton-logo.png'],
  },
  alternates: {
    canonical: SITE_ORIGIN,
  },
}

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
      <body className={`${inter.className} h-full overflow-x-clip`}>
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
