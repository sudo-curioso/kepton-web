import type { Metadata } from 'next'
import { SITE_ORIGIN } from '@/lib/seo/json-ld'

/** Shared social preview — forest island asset (better large-card crop than logo) */
export const OG_IMAGE = {
  url: '/assets/images/forest/forest_small_medium_winter.png',
  width: 1200,
  height: 630,
  alt: 'Kepton — grow your focus forest session by session',
} as const

export const SITE_NAME = 'Kepton'
export const SITE_TITLE = 'Kepton — Gamified ADHD Productivity App & Focus Planner'
export const SITE_DESCRIPTION =
  'Kepton is a gamified ADHD productivity app and visual focus planner that helps adults overcome time blindness, executive dysfunction, and focus challenges through tree-growing game mechanics and spatial layouts.'

export const SITE_KEYWORDS = [
  'ADHD productivity app',
  'ADHD focus planner',
  'gamified productivity',
  'focus timer ADHD',
  'executive dysfunction tools',
  'time blindness app',
  'ADHD task manager',
  'visual planner',
  'forest focus app',
  'Kepton',
] as const

/** Root metadata — keyword-rich titles, Open Graph, and Twitter Cards */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_NAME, url: SITE_ORIGIN }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'productivity',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/assets/brand/kepton-icon.svg', type: 'image/svg+xml' },
      { url: '/assets/brand/kepton-logo.png', type: 'image/png' },
    ],
    apple: '/assets/brand/kepton-logo.png',
  },
  manifest: undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description:
      'Focus tools built for ADHD brains — plant trees as you focus, plan visually, and beat time blindness.',
    images: {
      url: OG_IMAGE.url,
      alt: OG_IMAGE.alt,
    },
  },
  alternates: {
    canonical: SITE_ORIGIN,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'theme-color': '#0a0a0a',
  },
}
