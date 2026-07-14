/**
 * Kepton JSON-LD knowledge graph — Schema.org @graph for rich results.
 * Keep entities interconnected via stable @id anchors. Server-only serialization.
 */

export const SITE_ORIGIN = 'https://kepton.app' as const

const WEBSITE_ID = `${SITE_ORIGIN}/#website`
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
const APPLICATION_ID = `${SITE_ORIGIN}/#application`
const LOGO_URL = `${SITE_ORIGIN}/assets/brand/kepton-logo.png`

const PRODUCT_DESCRIPTION =
  'A gamified ADHD productivity application and visual planner designed to overcome focus challenges, time blindness, and executive dysfunction through interactive spatial layouts and game mechanics.'

/**
 * Unified Schema.org @graph — Website ↔ Organization ↔ SoftwareApplication.
 * SameAs social URLs are brand-footprint placeholders; replace when profiles go live.
 */
export const keptonJsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'Kepton',
      url: SITE_ORIGIN,
      description: PRODUCT_DESCRIPTION,
      publisher: { '@id': ORGANIZATION_ID },
      about: { '@id': APPLICATION_ID },
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_ORIGIN}/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Kepton',
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
        width: 512,
        height: 512,
      },
      image: LOGO_URL,
      email: 'support@kepton.app',
      description: PRODUCT_DESCRIPTION,
      knowsAbout: [
        'ADHD productivity',
        'Focus tools',
        'Executive dysfunction',
        'Time blindness',
        'Gamified planners',
      ],
      sameAs: [
        'https://www.linkedin.com/company/kepton',
        'https://x.com/keptonapp',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': APPLICATION_ID,
      name: 'Kepton',
      url: SITE_ORIGIN,
      applicationCategory: 'ProductivityApplication',
      applicationSubCategory: 'Health & Focus Utilities',
      operatingSystem: 'iOS, Android, Web',
      description: PRODUCT_DESCRIPTION,
      image: LOGO_URL,
      publisher: { '@id': ORGANIZATION_ID },
      author: { '@id': ORGANIZATION_ID },
      offers: {
        '@type': 'Offer',
        name: 'Kepton Free (Seedling)',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        category: 'Free',
      },
      featureList: [
        'Gamified focus timer with tree growth',
        'Visual forest and spatial task planning',
        'ADHD-friendly micro-steps and reminders',
        'Offline-first productivity for executive dysfunction',
      ],
    },
  ],
} as const

/** Serialize for <script type="application/ld+json"> — escapes `<` to avoid HTML breakout. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
